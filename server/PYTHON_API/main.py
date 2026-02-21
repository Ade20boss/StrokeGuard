import os
import json
import logging
import statistics
import time
from typing import Optional, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, BackgroundTasks, HTTPException, Path
from pydantic import BaseModel, field_validator
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

import aiosqlite
from google import genai
from google.genai import types, errors
from twilio.rest import Client

# --- INITIALIZATION ---
load_dotenv()
genai_client = genai.Client()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)




# Modern FastAPI lifespan event to handle async DB initialization
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title="StrokeGuard API Gateway", version="2.2.0", lifespan=lifespan)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATABASE ENGINE (Now fully Asynchronous) ---
async def init_db():
    async with aiosqlite.connect("strokeguard.db") as db:
        await db.execute("CREATE TABLE IF NOT EXISTS patients (id TEXT PRIMARY KEY, state TEXT)")
        await db.execute("CREATE TABLE IF NOT EXISTS profiles (id TEXT PRIMARY KEY, profile_data TEXT)")
        await db.commit()

async def get_db_row(table: str, entry_id: str) -> dict:
    col = "state" if table == "patients" else "profile_data"
    async with aiosqlite.connect("strokeguard.db") as db:
        async with db.execute(f"SELECT {col} FROM {table} WHERE id=?", (str(entry_id),)) as cursor:
            row = await cursor.fetchone()
            return json.loads(row[0]) if row else {}

async def save_db_row(table: str, entry_id: str, data: dict):
    col = "state" if table == "patients" else "profile_data"
    async with aiosqlite.connect("strokeguard.db") as db:
        await db.execute(f"INSERT OR REPLACE INTO {table} (id, {col}) VALUES (?, ?)", (str(entry_id), json.dumps(data)))
        await db.commit()

# --- CONSTANTS ---
MIN_BPM_READINGS = 30
CONSECUTIVE_GREEN_RESET_THRESHOLD = 3
PATIENT_ID_PATTERN = r"^[a-zA-Z0-9_-]{1,64}$"

# --- DATA MODELS ---
class ProfilePayload(BaseModel):
    patient_id: str
    name: str
    age: int
    history: str
    recent_activity: str
    emergency_contact: str

    @field_validator("patient_id")
    @classmethod
    def validate_patient_id(cls, v: str) -> str:
        import re
        if not re.match(PATIENT_ID_PATTERN, v):
            raise ValueError("patient_id must be 1-64 alphanumeric characters, hyphens, or underscores.")
        return v

    @field_validator("emergency_contact")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if not v.startswith("+") or not v[1:].isdigit():
            raise ValueError("emergency_contact must be in E.164 format, e.g. +2347069547832")
        return v

class VitalsPayload(BaseModel):
    patient_id: str
    mode: Optional[str] = "PASSIVE"
    pulse_rate_history: List[float]
    prv_score: float
    aha_lifestyle_score: int
    is_exercising: bool
    systolic: Optional[int] = 120
    diastolic: Optional[int] = 80
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    @field_validator("patient_id")
    @classmethod
    def validate_patient_id(cls, v: str) -> str:
        import re
        if not re.match(PATIENT_ID_PATTERN, v):
            raise ValueError("patient_id must be 1-64 alphanumeric characters, hyphens, or underscores.")
        return v

    @field_validator("pulse_rate_history")
    @classmethod
    def validate_bpm_history(cls, v: List[float]) -> List[float]:
        if len(v) < MIN_BPM_READINGS:
            raise ValueError(f"Need at least {MIN_BPM_READINGS} BPM readings. Got {len(v)}.")
        return v

# --- TRIAGE & AI LOGIC ---
def calculate_sdnn(bpm_history: List[float]) -> float:
    """
    Derive SDNN (ms) from a list of BPM values.
    Note: For clinical accuracy, deriving RR intervals directly from raw PPG/ECG 
    timing is superior to converting from averaged BPM. This acts as a reliable 
    approximation for quick scans.
    """
    if len(bpm_history) < 2:
        raise ValueError("Need at least 2 BPM readings to calculate SDNN.")
    rr_intervals = [60000.0 / bpm for bpm in bpm_history]
    return statistics.stdev(rr_intervals)

def calculate_composite_risk(aha: int, sys: int, dia: int, hrv_val: float, exercising: bool) -> str:
    if sys >= 180 or dia >= 120:
        return "RED"
    if exercising:
        return "GREEN"
    if hrv_val < 20.0:
        hrv_stat = "RED"
    elif hrv_val < 40.0:
        hrv_stat = "YELLOW"
    else:
        hrv_stat = "GREEN"
    
    if hrv_stat == "RED":
        return "RED"
    if hrv_stat == "YELLOW":
        return "RED" if (sys >= 140 or dia >= 90 or aha < 50) else "YELLOW"
    return "YELLOW" if (sys >= 130 or dia > 80 or aha < 50) else "GREEN"

async def generate_ai_coach(patient_id: str, sys: int, dia: int, hrv: float, aha: int) -> str:
    profile = await get_db_row("profiles", patient_id)
    if not profile:
        profile = {"name": "Patient", "age": "Unknown", "history": "None", "recent_activity": "Unknown"}

    system_instr = (
        "You are StrokeGuard AI. Analyze vitals vs history. Warm, calming tone. "
        "No diagnosis. No markdown. Detailed and comprehensive actionable next steps."
    )

    try:
        response = await genai_client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=(
                f"Patient: {profile.get('name')}, {profile.get('age')}. "
                f"History: {profile.get('history')}. "
                f"Vitals: BP {sys}/{dia}, PRV {hrv}ms, AHA Score {aha}. "
                f"Current Context: {profile.get('recent_activity')}. "
                "Task: Provide immediate triage advice for this Yellow state."
            ),
            config=types.GenerateContentConfig(system_instruction=system_instr),
        )
        return response.text.strip()
    
    # Catch specific Gemini API errors vs General exceptions
    except errors.APIError as api_err:
        logger.error("Gemini API Error for patient %s: %s", patient_id, api_err)
    except Exception as e:
        logger.error("Unexpected error in AI coach for patient %s: %s", patient_id, e)
    
    # Fallback response
    name = profile.get("name", "Patient")
    return (
        f"{name}, your vitals are slightly elevated. "
        "Please sit down, breathe slowly and deeply, and avoid strenuous activity."
    )

async def send_emergency_sms(patient_id: str, sys: int, dia: int, hrv: float, lat: Optional[float], lng: Optional[float], emergency_contact: str):
    """Fires emergency protocol via Twilio and handles failures gracefully."""
    try:
        twilio_client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))
        loc = f"https://www.google.com/maps?q={lat},{lng}" if lat and lng else "GPS Disabled"
        msg = (
            f"STROKEGUARD ALERT: Patient {patient_id}\n"
            f"Vitals: BP {sys}/{dia} | PRV {hrv}ms\n"
            f"Location: {loc}\n"
            "Please dispatch help immediately."
        )
        # Twilio's default Python client is synchronous. In a high-throughput system, 
        # this blocking call can be offloaded to a thread pool, but it is acceptable here.
        twilio_client.messages.create(
            body=msg,
            from_=os.getenv("TWILIO_PHONE_NUMBER"),
            to=emergency_contact,
        )
        logger.info("Emergency SMS sent for patient %s to %s", patient_id, emergency_contact)
    except Exception as e:
        logger.error("Twilio SMS FAILED for patient %s (contact: %s): %s", patient_id, emergency_contact, e)
        # Safely await the DB updates inside the async background task
        latest_state = await get_db_row("patients", patient_id)
        latest_state["alert_failure"] = str(e)
        await save_db_row("patients", patient_id, latest_state)

# --- API ENDPOINTS ---

@app.get("/")
async def root():
    return {
        "app": "StrokeGuard API Gateway",
        "status": "online",
        "version": "2.2.0"
    }
    
    
@app.post("/api/v1/patient/profile")
async def update_profile(payload: ProfilePayload):
    await save_db_row("profiles", payload.patient_id, payload.model_dump())
    return {"status": "success", "message": "Profile updated"}

@app.post("/api/v1/vitals/sync")
async def sync_vitals(payload: VitalsPayload, background_tasks: BackgroundTasks):
    profile = await get_db_row("profiles", payload.patient_id)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail=f"No profile found for patient {payload.patient_id}. Register the patient first.",
        )

    try:
        sdnn = calculate_sdnn(payload.pulse_rate_history)
    except ValueError as e:
        logger.error("SDNN calculation failed unexpectedly for %s: %s", payload.patient_id, e)
        sdnn = payload.prv_score

    if abs(sdnn - payload.prv_score) > 10:
        logger.warning("SDNN mismatch for patient %s: backend=%.1f ms, client=%.1f ms", payload.patient_id, sdnn, payload.prv_score)

    final_status = calculate_composite_risk(
        payload.aha_lifestyle_score,
        payload.systolic,
        payload.diastolic,
        sdnn,
        payload.is_exercising,
    )

    prev = await get_db_row("patients", payload.patient_id)
    sms_sent = prev.get("sms_sent", False)
    ai_advice = prev.get("ai_advice", "")
    ai_last_gen_time = prev.get("ai_last_gen_time", 0)
    consecutive_green = prev.get("consecutive_green", 0)

    current_time = time.time()

    if final_status == "YELLOW":
        if current_time - ai_last_gen_time > 300:
            ai_advice = await generate_ai_coach(
                payload.patient_id, payload.systolic, payload.diastolic, sdnn, payload.aha_lifestyle_score
            )
            ai_last_gen_time = current_time
            logger.info("Generated new AI advice for %s", payload.patient_id)
        else:
            logger.info("Skipped AI generation for %s (on cooldown)", payload.patient_id)
        consecutive_green = 0


    if final_status == "RED":
        ai_advice = "CRITICAL ALERT: Severe vital escalation detected. Emergency contacts have been notified. Please seek immediate medical assistance."
        if not sms_sent:
            background_tasks.add_task(
                send_emergency_sms,
                payload.patient_id,
                payload.systolic,
                payload.diastolic,
                sdnn,
                payload.latitude,
                payload.longitude,
                profile["emergency_contact"],
            )
            sms_sent = True
        consecutive_green = 0

    if final_status == "GREEN":
        consecutive_green += 1
        if consecutive_green >= CONSECUTIVE_GREEN_RESET_THRESHOLD:
            sms_sent = False
            ai_advice = ""
            ai_last_gen_time = 0
            logger.info("Patient %s reached %d consecutive GREEN readings — episode reset.", payload.patient_id, consecutive_green)
    
    new_state = {
        "status": final_status,
        "hrv": sdnn,
        "hrv_client": payload.prv_score,
        "bp": f"{payload.systolic}/{payload.diastolic}",
        "sms_sent": sms_sent,
        "ai_advice": ai_advice,
        "ai_last_gen_time": ai_last_gen_time,
        "is_exercising": payload.is_exercising,
        "current_mode": payload.mode,
        "consecutive_green": consecutive_green,
        "alert_failure": prev.get("alert_failure") if final_status == "RED" else None,
    }
    
    await save_db_row("patients", payload.patient_id, new_state)

    logger.info(
        "SYNC [%s]: ID:%s | BP:%s/%s | HRV(backend)=%.1f HRV(client)=%.1f | Status:%s",
        payload.mode, payload.patient_id, payload.systolic, payload.diastolic, sdnn, payload.prv_score, final_status
    )
    return {"status": final_status, "ai_coach": ai_advice}

@app.get("/api/v1/patient/{patient_id}/status")
async def get_status(patient_id: str = Path(..., pattern=PATIENT_ID_PATTERN, description="Patient identifier")):
    state = await get_db_row("patients", patient_id)
    if not state:
        return {"status": "GREEN", "ui_action": "PASSIVE_MONITORING"}

    ui_action = "PASSIVE_MONITORING"
    if state.get("is_exercising"):
        ui_action = "EXERCISE_MODE_ACTIVE"
    elif state.get("status") == "YELLOW":
        ui_action = "SHOW_AI_ADVICE_MODAL"
    elif state.get("status") == "RED":
        ui_action = "TRIGGER_FAST_CHECK_EMERGENCY"

    return {**state, "ui_action": ui_action}

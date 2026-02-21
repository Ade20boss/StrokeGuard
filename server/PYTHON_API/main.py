import os
import json
import logging
import sqlite3
import statistics
from typing import Optional, List

from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel, field_validator
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

import google.generativeai as genai
from twilio.rest import Client

# --- INITIALIZATION ---
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="StrokeGuard API Gateway", version="2.1.0")

# FIX: allow_origins=["*"] is incompatible with allow_credentials=True per the CORS spec.
# Using explicit origins list. Set ALLOWED_ORIGINS in your .env for production.
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:8000")
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- DATABASE ENGINE ---
def init_db():
    with sqlite3.connect("strokeguard.db") as conn:
        conn.execute(
            "CREATE TABLE IF NOT EXISTS patients (id TEXT PRIMARY KEY, state TEXT)"
        )
        conn.execute(
            "CREATE TABLE IF NOT EXISTS profiles (id TEXT PRIMARY KEY, profile_data TEXT)"
        )


init_db()


def get_db_row(table: str, entry_id: str) -> dict:
    col = "state" if table == "patients" else "profile_data"
    # NOTE: `col` and `table` are derived from internal constants only, not user input,
    # so f-string interpolation here is safe from SQL injection.
    with sqlite3.connect("strokeguard.db") as conn:
        cursor = conn.execute(
            f"SELECT {col} FROM {table} WHERE id=?", (str(entry_id),)
        )
        row = cursor.fetchone()
        return json.loads(row[0]) if row else {}


def save_db_row(table: str, entry_id: str, data: dict):
    col = "state" if table == "patients" else "profile_data"
    with sqlite3.connect("strokeguard.db") as conn:
        conn.execute(
            f"INSERT OR REPLACE INTO {table} (id, {col}) VALUES (?, ?)",
            (str(entry_id), json.dumps(data)),
        )


def log_alert_failure(patient_id: str, reason: str):
    """Persist SMS/alert failures to DB so the frontend can surface a warning."""
    state = get_db_row("patients", patient_id)
    state["alert_failure"] = reason
    save_db_row("patients", patient_id, state)


# Minimum BPM readings required for a statistically meaningful SDNN calculation.
# Clinically, 5 minutes (~300+ readings) is the gold standard, but for mobile
# quick scans 30 readings captures several breathing cycles and is a practical floor.
# Requests with fewer readings are rejected with a 422 rather than falling back silently.
MIN_BPM_READINGS = 30

# --- DATA MODELS ---
class ProfilePayload(BaseModel):
    patient_id: str
    name: str
    age: int
    history: str
    recent_activity: str
    # FIX: Emergency contact is now per-patient, not hardcoded in the codebase.
    emergency_contact: str  # E.164 format, e.g. "+2347069547832"

    @field_validator("emergency_contact")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if not v.startswith("+") or not v[1:].isdigit():
            raise ValueError("emergency_contact must be in E.164 format, e.g. +2347069547832")
        return v


class VitalsPayload(BaseModel):
    patient_id: str
    mode: Optional[str] = "PASSIVE"  # PASSIVE, QUICK_SCAN, DEEP_SCAN
    pulse_rate_history: List[float]  # BPM values from React
    prv_score: float                 # Calculated SDNN from React (cross-check + fallback)
    aha_lifestyle_score: int
    is_exercising: bool
    systolic: Optional[int] = 120
    diastolic: Optional[int] = 80
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    @field_validator("pulse_rate_history")
    @classmethod
    def validate_bpm_history(cls, v: List[float]) -> List[float]:
        if len(v) < MIN_BPM_READINGS:
            raise ValueError(
                f"pulse_rate_history must contain at least {MIN_BPM_READINGS} BPM readings "
                f"for a meaningful SDNN calculation. Got {len(v)}."
            )
        return v


# --- TRIAGE & AI LOGIC ---
def calculate_sdnn(bpm_history: List[float]) -> float:
    """
    Derive SDNN (ms) from a list of BPM values.
    SDNN = standard deviation of RR intervals, where RR (ms) = 60000 / BPM.
    Uses sample stdev (N-1), consistent with clinical HRV guidelines.
    Requires at least 2 readings; raises ValueError otherwise.
    """
    if len(bpm_history) < 2:
        raise ValueError("Need at least 2 BPM readings to calculate SDNN.")
    rr_intervals = [60000.0 / bpm for bpm in bpm_history]
    return statistics.stdev(rr_intervals)


def calculate_composite_risk(
    aha: int, sys: int, dia: int, hrv_val: float, exercising: bool
) -> str:
    """
    Triage matrix mapping PRV/SDNN and BP to clinical risk.

    FIX: Removed blanket GREEN override for exercise. Hypertensive crisis
    thresholds (>=180 systolic or >=120 diastolic) are evaluated first
    regardless of exercise state, since a hypertensive emergency during
    exercise is still an emergency. Only moderate elevation is suppressed
    during exercise to avoid false positives from exertion-driven HRV dip.
    """
    # Hypertensive crisis — always RED, even during exercise.
    if sys >= 180 or dia >= 120:
        return "RED"

    # If exercising, elevated-but-not-crisis readings are expected; skip further checks.
    if exercising:
        return "GREEN"

    # HRV/PRV Thresholding (resting state only)
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

    # hrv_stat == "GREEN"
    return "YELLOW" if (sys >= 130 or dia > 80 or aha < 50) else "GREEN"


def generate_ai_coach(
    patient_id: str, sys: int, dia: int, hrv: float, aha: int
) -> str:
    """AI Clinical Reasoning via Gemini 1.5 Pro."""
    profile = get_db_row("profiles", patient_id)
    if not profile:
        profile = {"name": "Patient", "age": "Unknown", "history": "None", "recent_activity": "Unknown"}

    system_instr = (
        "You are StrokeGuard AI. Analyze vitals vs history. Warm, calming tone. "
        "No diagnosis. No markdown. Detailed and comprehensive actionable next steps."
    )
    try:
        model = genai.GenerativeModel("gemini-1.5-pro", system_instruction=system_instr)
        prompt = (
            f"Patient: {profile.get('name')}, {profile.get('age')}. "
            f"History: {profile.get('history')}. "
            f"Vitals: BP {sys}/{dia}, PRV {hrv}ms, AHA Score {aha}. "
            f"Current Context: {profile.get('recent_activity')}. "
            "Task: Provide immediate triage advice for this Yellow state."
        )
        return model.generate_content(prompt).text.strip()
    except Exception as e:
        # FIX: Log the actual exception instead of silently swallowing it.
        logger.error("Gemini AI coach failed for patient %s: %s", patient_id, e)
        name = profile.get("name", "Patient")
        return (
            f"{name}, your vitals are slightly elevated. "
            "Please sit down, breathe slowly and deeply, and avoid strenuous activity."
        )


def send_emergency_sms(
    patient_id: str,
    sys: int,
    dia: int,
    hrv: float,
    lat: Optional[float],
    lng: Optional[float],
    emergency_contact: str,
):
    """
    Fires emergency protocol via Twilio.

    FIX: emergency_contact is now passed in from the patient profile rather
    than being hardcoded, so each patient's alerts reach the right person.
    FIX: Failures are logged durably to DB (not just printed) so the frontend
    can surface a "alert failed" warning to the user.
    """
    try:
        client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))
        loc = f"https://www.google.com/maps?q={lat},{lng}" if lat and lng else "GPS Disabled"
        msg = (
            f"STROKEGUARD ALERT: Patient {patient_id}\n"
            f"Vitals: BP {sys}/{dia} | PRV {hrv}ms\n"
            f"Location: {loc}\n"
            "Please dispatch help immediately."
        )
        client.messages.create(
            body=msg,
            from_=os.getenv("TWILIO_PHONE_NUMBER"),
            to=emergency_contact,
        )
        logger.info("Emergency SMS sent for patient %s to %s", patient_id, emergency_contact)
    except Exception as e:
        # FIX: Log to both logger and DB so the failure is visible in monitoring
        # and surfaced to the frontend via the /status endpoint.
        logger.error(
            "Twilio SMS FAILED for patient %s (contact: %s): %s",
            patient_id,
            emergency_contact,
            e,
        )
        log_alert_failure(patient_id, str(e))


# --- API ENDPOINTS ---
@app.post("/api/v1/patient/profile")
async def update_profile(payload: ProfilePayload):
    # FIX: Use .model_dump() — .dict() is deprecated in Pydantic v2.
    save_db_row("profiles", payload.patient_id, payload.model_dump())
    return {"status": "success", "message": "Profile updated"}


@app.post("/api/v1/vitals/sync")
async def sync_vitals(payload: VitalsPayload, background_tasks: BackgroundTasks):
    # Fetch profile to get emergency contact — fail fast if profile is missing.
    profile = get_db_row("profiles", payload.patient_id)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail=f"No profile found for patient {payload.patient_id}. Register the patient first.",
        )

    # 1. Calculate SDNN server-side from raw BPM history (authoritative value).
    # The validator above guarantees >= MIN_BPM_READINGS, so ValueError should not
    # occur in practice — the fallback is a last-resort safety net only.
    try:
        sdnn = calculate_sdnn(payload.pulse_rate_history)
    except ValueError as e:
        logger.error(
            "SDNN calculation failed despite validator for patient %s (%s) "
            "— falling back to client prv_score %.1f",
            payload.patient_id, e, payload.prv_score,
        )
        sdnn = payload.prv_score

    if abs(sdnn - payload.prv_score) > 10:
        logger.warning(
            "SDNN mismatch for patient %s: backend=%.1f ms, client=%.1f ms — possible React bug",
            payload.patient_id, sdnn, payload.prv_score,
        )

    # 2. Triage Logic (uses backend-derived SDNN, not client value)
    final_status = calculate_composite_risk(
        payload.aha_lifestyle_score,
        payload.systolic,
        payload.diastolic,
        sdnn,
        payload.is_exercising,
    )

    # 2. Load previous state
    prev = get_db_row("patients", payload.patient_id)
    sms_sent = prev.get("sms_sent", False)
    ai_advice = prev.get("ai_advice", "")

    # 3. Mode-specific triggers

    # FIX: AI coach regenerates on every YELLOW sync, not just on first transition.
    # This ensures advice stays fresh if vitals change while remaining in YELLOW.
    if final_status == "YELLOW":
        ai_advice = generate_ai_coach(
            payload.patient_id,
            payload.systolic,
            payload.diastolic,
            sdnn,
            payload.aha_lifestyle_score,
        )

    # SMS: only for RED, only once per RED episode (reset when GREEN)
    if final_status == "RED" and not sms_sent:
        background_tasks.add_task(
            send_emergency_sms,
            payload.patient_id,
            payload.systolic,
            payload.diastolic,
            sdnn,
            payload.latitude,
            payload.longitude,
            profile["emergency_contact"],  # FIX: per-patient contact from profile
        )
        sms_sent = True

    if final_status == "GREEN":
        sms_sent = False
        ai_advice = ""

    # 4. Persistence
    new_state = {
        "status": final_status,
        "hrv": sdnn,                        # backend-calculated SDNN (authoritative)
        "hrv_client": payload.prv_score,    # client-sent value, kept for debugging
        "bp": f"{payload.systolic}/{payload.diastolic}",
        "sms_sent": sms_sent,
        "ai_advice": ai_advice,
        "is_exercising": payload.is_exercising,
        "current_mode": payload.mode,
        # Clear any previous alert failure on a successful sync cycle
        "alert_failure": prev.get("alert_failure") if final_status == "RED" else None,
    }
    save_db_row("patients", payload.patient_id, new_state)

    logger.info(
        "SYNC [%s]: ID:%s | BP:%s/%s | HRV(backend)=%.1f HRV(client)=%.1f | Status:%s",
        payload.mode,
        payload.patient_id,
        payload.systolic,
        payload.diastolic,
        sdnn,
        payload.prv_score,
        final_status,
    )
    return {"status": final_status, "ai_coach": ai_advice}


@app.get("/api/v1/patient/{patient_id}/status")
async def get_status(patient_id: str):
    state = get_db_row("patients", patient_id)
    if not state:
        return {"status": "GREEN", "ui_action": "PASSIVE_MONITORING"}

    ui_action = "PASSIVE_MONITORING"
    if state.get("is_exercising"):
        ui_action = "EXERCISE_MODE_ACTIVE"
    elif state.get("status") == "YELLOW":
        ui_action = "SHOW_AI_ADVICE_MODAL"
    elif state.get("status") == "RED":
        ui_action = "TRIGGER_FAST_CHECK_EMERGENCY"

    # Surface alert failures to the frontend so the UI can warn the user
    # that the emergency SMS may not have been delivered.
    return {**state, "ui_action": ui_action}

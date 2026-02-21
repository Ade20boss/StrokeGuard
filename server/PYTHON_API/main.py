import os
import json
import logging
import sqlite3
import statistics
import time
from typing import Optional, List

from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel, field_validator
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# IMPORTANT: ensure only google-genai is installed, NOT google-generativeai
# Run: pip uninstall google-generativeai google-genai -y && pip install google-genai
from google import genai
from google.genai import types
from twilio.rest import Client as TwilioClient  # FIX: aliased to avoid name collision with genai_client

# --- INITIALIZATION ---
load_dotenv()

# FIX: renamed from `client` to `genai_client` so it is never shadowed by the
# TwilioClient local variable inside send_emergency_sms. Previously both were
# named `client` — whichever was assigned last would win unpredictably.
genai_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="StrokeGuard API Gateway", version="2.2.0")

# Set ALLOWED_ORIGINS in .env as comma-separated list for production.
# e.g. ALLOWED_ORIGINS=https://strokeguard.app,https://www.strokeguard.app
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:8000")
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- DATABASE ---
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


# Minimum readings required for a statistically meaningful SDNN calculation.
MIN_BPM_READINGS = 30

# Rolling window for BPM smoothing before SDNN.
# Raw instantaneous BPM values (60000 / single_rr_interval) swing wildly
# between beats (+/- 30–50 bpm), inflating SDNN to 170+ ms.
# A 5-sample rolling mean brings SDNN into the realistic clinical range (20–100ms).
BPM_SMOOTH_WINDOW = 5


# --- DATA MODELS ---
class ProfilePayload(BaseModel):
    patient_id: str
    name: str
    age: int
    history: str
    recent_activity: str
    emergency_contact: str  # E.164 format e.g. "+2347069547832"

    @field_validator("emergency_contact")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if not v.startswith("+") or not v[1:].isdigit():
            raise ValueError(
                "emergency_contact must be E.164 format, e.g. +2347069547832"
            )
        return v


class VitalsPayload(BaseModel):
    patient_id: str
    mode: Optional[str] = "PASSIVE"
    pulse_rate_history: List[float]   # Raw BPM values from React
    prv_score: float                  # Client-computed SDNN (used as cross-check / fallback)
    aha_lifestyle_score: int
    is_exercising: bool
    final_risk_score: Optional[float] = None
    systolic: Optional[int] = 120
    diastolic: Optional[int] = 80
    latitude: Optional[float] = None
    longitude: Optional[float] = None


    @field_validator("pulse_rate_history")
    @classmethod
    def validate_bpm_history(cls, v: List[float]) -> List[float]:
        if len(v) < MIN_BPM_READINGS:
            raise ValueError(
                f"pulse_rate_history must contain at least {MIN_BPM_READINGS} readings. "
                f"Got {len(v)}."
            )
        # Reject NaN / Inf values that WebcamPPG might emit on a bad frame
        if not all(isinstance(x, (int, float)) and -1e9 < x < 1e9 for x in v):
            raise ValueError(
                "pulse_rate_history contains invalid (NaN/Inf) values."
            )
        return v


# --- SIGNAL PROCESSING ---
def smooth_bpm_history(bpm_history: List[float], window: int = BPM_SMOOTH_WINDOW) -> List[float]:
    """
    Apply a rolling mean to raw BPM values before computing SDNN.

    FIX for inflated HRV (174ms bug): raw instantaneous BPM values computed
    as 60000 / single_rr_interval swing wildly between beats. A single short
    RR interval of 380ms = 158 bpm; the next at 480ms = 125 bpm. That 33 bpm
    swing creates massive RR interval variance which pushes SDNN far above
    realistic resting values. Smoothing with a rolling mean preserves genuine
    HRV trends while eliminating single-beat noise.
    """
    if len(bpm_history) <= window:
        return bpm_history
    smoothed = []
    for i in range(len(bpm_history)):
        start = max(0, i - window + 1)
        smoothed.append(sum(bpm_history[start: i + 1]) / (i - start + 1))
    return smoothed


def calculate_sdnn(bpm_history: List[float]) -> float:
    """
    Derive SDNN (ms) from BPM values.
    RR interval (ms) = 60000 / BPM.
    Uses sample stdev (N-1), consistent with clinical HRV guidelines.
    Operates on smoothed BPM history to prevent artificially inflated SDNN.
    """
    if len(bpm_history) < 2:
        raise ValueError("Need at least 2 BPM readings to calculate SDNN.")

    smoothed = smooth_bpm_history(bpm_history)
    rr_intervals = [60000.0 / bpm for bpm in smoothed if bpm > 0]

    if len(rr_intervals) < 2:
        raise ValueError("Insufficient valid BPM readings after filtering zeros.")

    return statistics.stdev(rr_intervals)


# --- TRIAGE LOGIC ---
def calculate_composite_risk(
    aha: int, sys: int, dia: int, hrv_val: float, exercising: bool
) -> str:
    """
    Triage matrix mapping PRV/SDNN and BP to a clinical risk level.

    Hypertensive crisis thresholds (>=180 systolic or >=120 diastolic) are
    evaluated first regardless of exercise state — a hypertensive emergency
    during exercise is still an emergency. Only moderate elevation is
    suppressed during exercise to avoid false positives from exertion-driven
    HRV dip.
    """
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

    # hrv_stat == GREEN
    return "YELLOW" if (sys >= 130 or dia > 80 or aha < 50) else "GREEN"


# --- AI COACH ---
async def generate_ai_coach(
    patient_id: str,
    sys: int,
    dia: int,
    hrv: float,
    aha: int,
    adv_score: Optional[float] = None,
) -> str:
    """
    AI clinical reasoning via Gemini 1.5 Pro using the google-genai SDK.

    FIX: The original code called genai.GenerativeModel() which is the OLD
    google-generativeai SDK. The correct new google-genai SDK call is:
        genai_client.aio.models.generate_content(model=..., contents=..., config=...)

    FIX: Uses module-level genai_client instead of `client` which was being
    shadowed by TwilioClient inside send_emergency_sms.
    """
    profile = get_db_row("profiles", patient_id)
    if not profile:
        profile = {
            "name": "Patient",
            "age": "Unknown",
            "history": "None",
            "recent_activity": "Unknown",
        }

    system_instr = (
        "You are StrokeGuard AI, a clinical decision support assistant. "
        "Analyze the patient's vitals in the context of their medical history. "
        "Use a warm, calming tone. Never give a diagnosis. No markdown formatting. "
        "Give detailed, practical, actionable next steps the patient can follow right now."
    )

    prompt = (
        f"Patient: {profile.get('name')}, age {profile.get('age')}. "
        f"Medical history: {profile.get('history')}. "
        f"Current vitals: BP {sys}/{dia} mmHg, PRV/SDNN {hrv:.1f}ms, AHA Score {aha}/60. "
        f"Advanced cardiovascular risk: "
        f"{f'{adv_score:.1f}/100' if adv_score is not None else 'N/A'}. "
        f"Recent activity: {profile.get('recent_activity')}. "
        "Task: Provide clear, immediate triage advice for this patient's current state."
    )

    try:
        response = await genai_client.aio.models.generate_content(
            model="gemini-1.5-pro",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instr,
            ),
        )
        return response.text.strip()

    except Exception as e:
        logger.error("Gemini AI coach failed for patient %s: %s", patient_id, e)
        name = profile.get("name", "Patient")
        return (
            f"{name}, your vitals are slightly elevated. "
            "Please sit down, breathe slowly and deeply, and avoid strenuous activity. "
            "If symptoms worsen or you feel chest pain, call emergency services immediately."
        )


# --- EMERGENCY SMS ---
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
    Fires emergency SMS via Twilio.

    FIX: Uses TwilioClient (aliased import) so it never collides with
    genai_client at module scope.

    FIX: Alert failures are logged durably to the DB so the frontend can
    surface a "SMS may not have been delivered" warning to the patient.
    """
    try:
        twilio = TwilioClient(
            os.getenv("TWILIO_ACCOUNT_SID"),
            os.getenv("TWILIO_AUTH_TOKEN"),
        )
        loc = (
            f"https://www.google.com/maps?q={lat},{lng}"
            if lat and lng
            else "GPS unavailable"
        )
        msg = (
            f"STROKEGUARD ALERT: Patient {patient_id}\n"
            f"Vitals: BP {sys}/{dia} mmHg | PRV {hrv:.1f}ms\n"
            f"Location: {loc}\n"
            "Please check on this patient immediately."
        )
        twilio.messages.create(
            body=msg,
            from_=os.getenv("TWILIO_PHONE_NUMBER"),
            to=emergency_contact,
        )
        logger.info(
            "Emergency SMS sent for patient %s to %s", patient_id, emergency_contact
        )
    except Exception as e:
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
    save_db_row("profiles", payload.patient_id, payload.model_dump())
    return {"status": "success", "message": "Profile updated"}


@app.post("/api/v1/vitals/sync")
async def sync_vitals(payload: VitalsPayload, background_tasks: BackgroundTasks):
    # Fetch profile — create minimal stub if missing so sync can proceed
    profile = get_db_row("profiles", payload.patient_id)
    if not profile:
        logger.warning(
            "No profile found for patient %s — creating stub. "
            "Call /api/v1/patient/profile to persist full details.",
            payload.patient_id,
        )
        profile = {
            "patient_id": payload.patient_id,
            "name": "Patient",
            "age": 30,
            "history": "Unknown",
            "recent_activity": "Unknown",
            "emergency_contact": "+10000000000",
        }
        save_db_row("profiles", payload.patient_id, profile)

    # 1. Calculate SDNN server-side on smoothed BPM history
    try:
        sdnn = calculate_sdnn(payload.pulse_rate_history)
    except ValueError as e:
        logger.error(
            "SDNN calculation failed for patient %s (%s) — "
            "falling back to client prv_score %.1f",
            payload.patient_id,
            e,
            payload.prv_score,
        )
        sdnn = payload.prv_score

    if abs(sdnn - payload.prv_score) > 10:
        logger.warning(
            "SDNN mismatch for patient %s: backend=%.1f ms, client=%.1f ms — "
            "possible smoothing difference in React",
            payload.patient_id,
            sdnn,
            payload.prv_score,
        )

    # 2. Triage
    final_status = calculate_composite_risk(
        payload.aha_lifestyle_score,
        payload.systolic,
        payload.diastolic,
        sdnn,
        payload.is_exercising,
    )

    # 3. Load previous state
    prev = get_db_row("patients", payload.patient_id)
    sms_sent = prev.get("sms_sent", False)
    ai_advice = prev.get("ai_advice", "")
    ai_last_gen_time = prev.get("ai_last_gen_time", 0)
    current_time = time.time()

    if payload.final_risk_score is not None:
        logger.info(
            "Advanced risk for patient %s: Score=%.1f/100, Triage=%s",
            payload.patient_id,
            payload.final_risk_score,
            final_status,
        )

    # 4. AI advice on YELLOW with 5-minute cooldown
    if final_status == "YELLOW":
        if current_time - ai_last_gen_time > 300:
            ai_advice = await generate_ai_coach(
                payload.patient_id,
                payload.systolic,
                payload.diastolic,
                sdnn,
                payload.aha_lifestyle_score,
                payload.final_risk_score,
            )
            ai_last_gen_time = current_time
            logger.info("Generated new AI advice for %s", payload.patient_id)
        else:
            logger.info(
                "Skipped AI generation for %s (%.0fs cooldown remaining)",
                payload.patient_id,
                300 - (current_time - ai_last_gen_time),
            )

    # 5. Emergency SMS on RED — once per RED episode
    if final_status == "RED" and not sms_sent:
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

    # Reset when patient returns to GREEN
    if final_status == "GREEN":
        sms_sent = False
        ai_advice = ""
        ai_last_gen_time = 0  # Reset so next YELLOW triggers AI immediately

    # 6. Persist new state
    new_state = {
        "status": final_status,
        "risk_score": payload.final_risk_score,
        "hrv": sdnn,
        "hrv_client": payload.prv_score,
        "bp": f"{payload.systolic}/{payload.diastolic}",
        "sms_sent": sms_sent,
        "ai_advice": ai_advice,
        "ai_last_gen_time": ai_last_gen_time,
        "is_exercising": payload.is_exercising,
        "current_mode": payload.mode,
        # Only carry forward alert_failure during a RED episode
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

    # Surface alert_failure so the frontend can warn the patient that
    # the emergency SMS may not have been delivered.
    return {**state, "ui_action": ui_action}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.1", port=8000, reload=True)
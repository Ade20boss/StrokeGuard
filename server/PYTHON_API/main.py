import subprocess
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Initialize the application
app = FastAPI(title="StrokeGuard API Gateway")

# Allow the React PWA to talk to this API without cross-origin blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database for the live demo
patients_state = {}

# --- DATA MODELS ---

class VitalsPayload(BaseModel):
    patient_id: int
    bpm_history: list[float]  # The 50 heartbeats 
    aha_lifestyle_score: int  # 1-100 score from the frontend questionnaire
    is_exercising: bool       # True if phone accelerometer detects running

# --- CORE LOGIC FUNCTIONS ---

def run_c_engine(patient_id: int, bpm_history: list[float]) -> dict:
    """
    Executes the compiled C binary to run the ultra-fast SDNN math.
    """
    bpm_string = ",".join(map(str, bpm_history))
    
    try:
        # Boot the C program: ./engine 1042 "72.5,73.1..."
        result = subprocess.run(
            ["./engine", str(patient_id), bpm_string],
            capture_output=True,
            text=True,
            check=True
        )
        return json.loads(result.stdout.strip())
    except Exception as e:
        print(f"C Engine Execution Failed: {e}")
        return {"status": "GREEN", "hrv": 0.0} # Default to safe if C crashes

def calculate_composite_risk(aha_score: int, c_engine_status: str, is_exercising: bool) -> str:
    """
    Combines Static Risk (BMI), Dynamic Risk (HRV), and Context (Activity).
    """
    # THE CONTEXT GATE: If they are working out, a low HRV is normal. Suppress the alarm.
    if is_exercising:
        return "GREEN" 
        
    # THE C-ENGINE OVERRIDE: If the math says they are critical, they are critical.
    if c_engine_status == "RED":
        return "RED"
        
    if c_engine_status == "YELLOW":
        # If HRV is stressed, and BMI/Lifestyle is poor (<50), escalate to critical
        if aha_score < 50:
            return "RED"
        return "YELLOW"
        
    if c_engine_status == "GREEN" and aha_score < 50:
        # Poor lifestyle baseline means they are always in a warning state
        return "YELLOW"
        
    return "GREEN"

# --- API ENDPOINTS ---

@app.post("/api/v1/vitals/sync")
async def sync_vitals(payload: VitalsPayload):
    """
    Frontend hits this endpoint with new data (live or simulated).
    """
    # 1. Get the dynamic risk from the C Engine
    engine_decision = run_c_engine(payload.patient_id, payload.bpm_history)
    raw_status = engine_decision.get("status", "GREEN")
    
    # 2. Mix in the AHA score and Exercise Context
    final_status = calculate_composite_risk(payload.aha_lifestyle_score, raw_status, payload.is_exercising)
    
    # 3. Update the global state
    patients_state[payload.patient_id] = {
        "status": final_status,
        "hrv": engine_decision.get("hrv", 0.0),
        "is_exercising": payload.is_exercising
    }
    
    print(f"PROCESSED: Patient {payload.patient_id} | AHA: {payload.aha_lifestyle_score} | Active: {payload.is_exercising} | Final Status: {final_status}")
    
    return {"status": "success", "message": "Composite vitals processed"}

@app.get("/api/v1/patient/{patient_id}/status")
async def get_patient_status(patient_id: int):
    """
    Frontend continuously polls this endpoint to update the UI colors.
    """
    if patient_id not in patients_state:
        return {"patient_id": patient_id, "status": "GREEN", "hrv_ms": 0.0, "ui_action": "PASSIVE_MONITORING"}
    
    state = patients_state[patient_id]
    response = {"patient_id": patient_id, "status": state["status"], "hrv_ms": state["hrv"]}
    
    # Explicit UI commands for Habeeb and Usaamah
    if state["is_exercising"]:
        response["ui_action"] = "USER_IS_ACTIVE_MONITORING_PAUSED"
    elif state["status"] == "YELLOW":
        response["ui_action"] = "TRIGGER_BREATHING_EXERCISE_AND_BP_CHECK"
    elif state["status"] == "RED":
        response["ui_action"] = "TRIGGER_FAST_CHECK_AND_SMS"
    else:
        response["ui_action"] = "PASSIVE_MONITORING"
        
    return response

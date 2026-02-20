from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title = "StrokeGuard API Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

#In memory database
patients_state = {}

class VitalsPayload(BaseModel):
    patient_id: int
    bpm_history: list[float]
    
class AlertPayload(BaseModel):
    patient_id: int
    risk_level: int
    sdnn_hrv: float
    
@app.post("/api/v1/vitals/sync")
async def sync_vitals(payload: VitalsPayload):
    if payload.patient_id not in patients_state:
        patients_state[payload.patient_id] = {"status": "GREEN", "hrv": 0.0}
        
    #TODO: Later to add UDP socket
    print(f"Received {len(payload.bpm_history)} heartbeats for Patient {payload.patient_id}")
    return {"status": "success", "message": "Vitals received"}

@app.post("/api/v1/internal/alert")
async def receive_c_alert(alert: AlertPayload):
    #C engine will hit this endpoint when it finds an anomaly
    status_map = {0: "GREEN", 1: "YELLOW", 2: "RED"}
    new_status = status_map.get(alert.risk_level, "UNKNOWN")

    # Update the in-memory state
    patients_state[alert.patient_id] = {
        "status": new_status,
        "hrv": alert.sdnn_hrv
    }
    print(f"🔥 BACKEND ALERT: Patient {alert.patient_id} shifted to {new_status}!")
    return {"status": "State updated"}

@app.get("/api/v1/patient/{patient_id}/status")
async def get_patient 


    


        
    
    

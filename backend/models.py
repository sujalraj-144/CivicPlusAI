from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class GeoLocation(BaseModel):
    latitude: float
    longitude: float
    address: Optional[str] = "Detected GPS Location"
    ward_number: Optional[str] = "Ward 12 - Central"

class DetectionResult(BaseModel):
    detected_type: str
    confidence: float
    initial_severity: int
    bounding_box: Optional[List[float]] = None
    department: str

class PredictionResult(BaseModel):
    severity_in_24_hours: int
    severity_in_3_days: int
    severity_in_7_days: int
    priority: str
    rainfall_forecast_mm: float
    traffic_density: str
    risk_summary: str
    recommended_action: str
    sla_hours: int

class IssueCreate(BaseModel):
    user_name: Optional[str] = "Citizen"
    user_phone: Optional[str] = None
    user_email: Optional[str] = None
    type: str
    department: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    ward_number: Optional[str] = "Ward 12"
    severity: int
    image_url: str
    description: Optional[str] = None

class ActionRecord(BaseModel):
    recommended_action: str
    assigned_team: Optional[str] = None
    assigned_official: Optional[str] = None
    work_order_id: Optional[str] = None
    resolved_time: Optional[datetime] = None
    resolution_proof_url: Optional[str] = None

class IssueResponse(BaseModel):
    id: str
    srn: str
    type: str
    department: str
    latitude: float
    longitude: float
    address: str
    ward_number: str
    severity: int
    status: str
    upvotes: int
    image_url: str
    created_at: datetime
    sla_deadline: Optional[datetime] = None
    prediction: Optional[PredictionResult] = None
    action: Optional[ActionRecord] = None

class TriageActionRequest(BaseModel):
    assigned_team: str
    assigned_official: str
    notes: Optional[str] = None

class ResolutionRequest(BaseModel):
    resolution_notes: str
    resolution_proof_url: Optional[str] = None

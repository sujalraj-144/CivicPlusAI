from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional, List
from database import db
from ml.yolo_detector import detector
from ml.risk_predictor import predictor
from models import TriageActionRequest, ResolutionRequest

router = APIRouter(prefix="", tags=["Issues"])

@router.get("/issues")
def list_issues(
    status: Optional[str] = Query(None, description="Filter by status (Submitted, Assigned, In Progress, Resolved)"),
    department: Optional[str] = Query(None, description="Filter by municipal department"),
    ward: Optional[str] = Query(None, description="Filter by ward")
):
    """
    [GET] /issues
    List of all civic problems for the city official ICCC dashboard.
    Supports filtering by status, department, and ward.
    """
    return db.get_all(status=status, department=department, ward=ward)

@router.post("/issues")
async def create_new_issue(
    image_url: str = Body(..., embed=True),
    latitude: float = Body(12.9716, embed=True),
    longitude: float = Body(77.5946, embed=True),
    address: Optional[str] = Body("Indiranagar, Bangalore", embed=True),
    ward_number: Optional[str] = Body("Ward 12 - Indiranagar", embed=True),
    description_hint: Optional[str] = Body(None, embed=True),
    citizen_name: Optional[str] = Body("Citizen", embed=True),
    citizen_phone: Optional[str] = Body(None, embed=True)
):
    """
    Complete end-to-end pipeline:
    Receives image & GPS -> Runs YOLO detection -> Runs 7-day Risk & SLA prediction -> Generates SRN.
    """
    # 1. AI Detection
    detection = detector.analyze_image(image_url, hint_text=description_hint or "")
    detected_type = detection["detected_type"]
    department = detection["department"]
    initial_severity = detection["initial_severity"]

    # 2. Risk & Weather Prediction
    prediction = await predictor.predict_risk(
        initial_severity=initial_severity,
        issue_type=detected_type,
        lat=latitude,
        lon=longitude
    )

    # 3. Save into Database with generated SRN
    issue_data = {
        "type": detected_type,
        "department": department,
        "latitude": latitude,
        "longitude": longitude,
        "address": address or "GPS Detected Location",
        "ward_number": ward_number or "Ward 12 - Central",
        "severity": initial_severity,
        "image_url": image_url,
        "prediction": prediction
    }

    created = db.add_issue(issue_data)
    return {
        "status": "success",
        "message": f"Service Request {created['srn']} created successfully.",
        "issue": created
    }

@router.get("/issues/{identifier}")
def get_issue_by_srn_or_id(identifier: str):
    """
    [GET] /issues/{identifier}
    Tracks a grievance by either its unique UUID or human-readable SRN (e.g., CIVIC-W12-2026-8419).
    """
    issue = db.get_by_srn(identifier) or db.get_by_id(identifier)
    if not issue:
        raise HTTPException(status_code=404, detail="Service Request Number not found.")
    return issue

@router.post("/issues/{issue_id}/assign")
def assign_work_order(issue_id: str, payload: TriageActionRequest):
    """
    City official dispatches a field repair team or junior engineer.
    """
    updated = db.assign_issue(
        issue_id=issue_id,
        team=payload.assigned_team,
        official=payload.assigned_official,
        notes=payload.notes
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Issue not found.")
    return {"status": "success", "message": "Work order dispatched.", "issue": updated}

@router.post("/issues/{issue_id}/resolve")
def resolve_issue(issue_id: str, payload: ResolutionRequest):
    """
    Field team marks work completed with proof-of-work notes and image.
    """
    updated = db.resolve_issue(
        issue_id=issue_id,
        resolution_notes=payload.resolution_notes,
        proof_url=payload.resolution_proof_url
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Issue not found.")
    return {"status": "success", "message": "Grievance resolved.", "issue": updated}

@router.post("/issues/{issue_id}/upvote")
def upvote_issue(issue_id: str):
    """
    Citizen de-duplication: Upvote an existing nearby issue instead of filing a duplicate report.
    """
    updated = db.upvote_issue(issue_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Issue not found.")
    return {"status": "success", "message": "Upvoted.", "upvotes": updated["upvotes"]}

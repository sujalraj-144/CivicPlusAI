from fastapi import APIRouter, Query

router = APIRouter(prefix="", tags=["Priority & Action"])

@router.get("/priority")
def calculate_priority_and_action(
    severity: int = Query(..., ge=0, le=100, description="Severity score (0-100)"),
    issue_type: str = Query("Pothole", description="Issue type")
):
    """
    [GET] /priority
    Priority score determines response and action:
      - HIGH 80+   : Immediate repair & SLA 24h
      - MEDIUM 40-79: Schedule inspection & SLA 48h
      - LOW 0-39   : Monitor and review
    """
    if severity >= 80:
        priority = "HIGH"
        sla_hours = 24
        recommended_action = "Immediate emergency repair & dispatch rapid response unit within 24 hours."
    elif severity >= 40:
        priority = "MEDIUM"
        sla_hours = 48
        recommended_action = "Schedule field inspection, notify ward junior engineer, and issue work order within 48 hours."
    else:
        priority = "LOW"
        sla_hours = 120
        recommended_action = "Routine monitor and review. Queue for scheduled weekly ward maintenance."

    return {
        "status": "success",
        "severity": severity,
        "priority": priority,
        "sla_hours": sla_hours,
        "recommended_action": recommended_action
    }

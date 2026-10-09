from fastapi import APIRouter, Query, Body
from typing import Optional
from ml.risk_predictor import predictor

router = APIRouter(prefix="", tags=["Risk Prediction"])

@router.get("/predict")
async def get_future_severity_prediction(
    severity: int = Query(67, ge=0, le=100, description="Initial severity score"),
    issue_type: str = Query("Pothole", description="Detected issue type"),
    lat: float = Query(12.9716, description="Latitude"),
    lon: float = Query(77.5946, description="Longitude"),
    traffic: Optional[str] = Query(None, description="Traffic density")
):
    """
    [GET] /predict
    Forecasts future severity in 24 hours, 3 days, and 7 days.
    Enriches with live weather (Open-Meteo) and traffic conditions.
    """
    prediction = await predictor.predict_risk(
        initial_severity=severity,
        issue_type=issue_type,
        lat=lat,
        lon=lon,
        traffic_override=traffic
    )
    return {
        "status": "success",
        "inputs": {
            "initial_severity": severity,
            "type": issue_type,
            "latitude": lat,
            "longitude": lon
        },
        "forecast": prediction
    }

@router.post("/predict")
async def post_future_severity_prediction(
    severity: int = Body(..., embed=True),
    issue_type: str = Body("Pothole", embed=True),
    lat: float = Body(12.9716, embed=True),
    lon: float = Body(77.5946, embed=True),
    traffic: Optional[str] = Body(None, embed=True)
):
    prediction = await predictor.predict_risk(
        initial_severity=severity,
        issue_type=issue_type,
        lat=lat,
        lon=lon,
        traffic_override=traffic
    )
    return {
        "status": "success",
        "forecast": prediction
    }

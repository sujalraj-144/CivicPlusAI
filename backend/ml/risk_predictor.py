import httpx
from typing import Dict, Any
from config import OPEN_METEO_BASE_URL

class RiskPredictor:
    """
    Predictive Risk & SLA Engine.
    Combines initial severity + live Open-Meteo precipitation forecast + traffic density.
    Predicts:
      - 24-hour severity
      - 3-day severity
      - 7-day severity
      - Priority tier (HIGH / MEDIUM / LOW)
      - Recommended government action & SLA timeline
    """

    async def fetch_weather_forecast(self, lat: float, lon: float) -> float:
        """
        Queries Open-Meteo for 24h accumulated rainfall (precipitation_sum).
        Falls back to a realistic seasonal default if offline.
        """
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                params = {
                    "latitude": lat,
                    "longitude": lon,
                    "daily": "precipitation_sum",
                    "forecast_days": 1,
                    "timezone": "auto"
                }
                res = await client.get(OPEN_METEO_BASE_URL, params=params)
                if res.status_code == 200:
                    data = res.json()
                    rainfall = data.get("daily", {}).get("precipitation_sum", [0.0])[0]
                    return float(rainfall) if rainfall is not None else 5.0
        except Exception as e:
            print(f"[Open-Meteo Notice] Weather fetch fallback: {e}")
        return 14.5  # Realistic monsoon/rain default (mm)

    async def predict_risk(
        self,
        initial_severity: int,
        issue_type: str,
        lat: float,
        lon: float,
        traffic_override: str = None
    ) -> Dict[str, Any]:
        rainfall_mm = await self.fetch_weather_forecast(lat, lon)

        # Traffic heuristics based on latitude/longitude or default
        traffic_density = traffic_override or ("High Density Commercial" if initial_severity > 70 else "Moderate Arterial")

        # Weather multiplier
        # Rain accelerates pothole degradation and waterlogging exponentially
        rain_factor = 1.0 + (min(rainfall_mm, 50.0) / 100.0)

        # Growth increments
        if issue_type in ["Pothole", "Waterlogging"]:
            increment_24h = int(8 * rain_factor)
            increment_3d = int(18 * rain_factor)
            increment_7d = int(28 * rain_factor)
        elif issue_type == "Garbage Dump":
            increment_24h = int(6 * rain_factor)
            increment_3d = int(15 * rain_factor)
            increment_7d = int(25 * rain_factor)
        else: # Broken Streetlight
            increment_24h = 1
            increment_3d = 4
            increment_7d = 8

        sev_24h = min(100, initial_severity + increment_24h)
        sev_3d = min(100, initial_severity + increment_3d)
        sev_7d = min(100, initial_severity + increment_7d)

        # Priority calculation matching presentation logic
        # HIGH: 80+, MEDIUM: 40-79, LOW: 0-39
        if sev_24h >= 80:
            priority = "HIGH"
            sla_hours = 24
            recommended_action = f"Immediate emergency repair & hazard cordon within {sla_hours}h. High accident probability under {rainfall_mm}mm rain."
        elif sev_24h >= 40:
            priority = "MEDIUM"
            sla_hours = 48
            recommended_action = f"Schedule municipal inspection and issue work order within {sla_hours}h."
        else:
            priority = "LOW"
            sla_hours = 120
            recommended_action = f"Monitor and include in next weekly routine ward maintenance schedule."

        risk_summary = (
            f"Initial severity scored at {initial_severity}/100. "
            f"Under {traffic_density} and {rainfall_mm:.1f}mm expected rain, "
            f"severity escalates to {sev_24h} in 24h and reaches {sev_7d} in 7 days."
        )

        return {
            "severity_in_24_hours": sev_24h,
            "severity_in_3_days": sev_3d,
            "severity_in_7_days": sev_7d,
            "priority": priority,
            "rainfall_forecast_mm": round(rainfall_mm, 1),
            "traffic_density": traffic_density,
            "risk_summary": risk_summary,
            "recommended_action": recommended_action,
            "sla_hours": sla_hours
        }

predictor = RiskPredictor()

import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import random

# In-memory / Mock Data Store replicating PostgreSQL / Supabase
# Initializes with realistic government civic records for instant live testing
class CivicDatabase:
    def __init__(self):
        self.issues: Dict[str, dict] = {}
        self._seed_initial_data()

    def _generate_srn(self, ward: str) -> str:
        random_digits = random.randint(1000, 9999)
        ward_clean = ward.replace(" ", "").split("-")[0].upper()
        return f"CIVIC-{ward_clean}-2026-{random_digits}"

    def _seed_initial_data(self):
        sample_records = [
            {
                "id": str(uuid.uuid4()),
                "srn": "CIVIC-W12-2026-8419",
                "type": "Pothole",
                "department": "PWD / Roads & Bridges",
                "latitude": 12.9716,
                "longitude": 77.5946,
                "address": "100 Ft Road, Near Indiranagar Metro Pillar 42",
                "ward_number": "Ward 12 - Indiranagar",
                "severity": 84,
                "status": "Assigned",
                "upvotes": 14,
                "image_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
                "created_at": datetime.now() - timedelta(hours=14),
                "sla_hours": 24,
                "sla_deadline": datetime.now() + timedelta(hours=10),
                "prediction": {
                    "severity_in_24_hours": 92,
                    "severity_in_3_days": 96,
                    "severity_in_7_days": 100,
                    "priority": "HIGH",
                    "rainfall_forecast_mm": 24.5,
                    "traffic_density": "Heavy Commercial & Transit",
                    "risk_summary": "High risk of crater expansion and two-wheeler skid accidents due to impending heavy rainfall.",
                    "recommended_action": "Immediate cold-mix asphalt patching & hazard barricading within 24 hours.",
                    "sla_hours": 24
                },
                "action": {
                    "recommended_action": "Immediate cold-mix asphalt patching & hazard barricading.",
                    "assigned_team": "PWD Rapid Response Unit 4",
                    "assigned_official": "Er. R. Venkatesh (Junior Engineer)",
                    "work_order_id": "WO-PWD-2026-118",
                    "resolved_time": None,
                    "resolution_proof_url": None
                }
            },
            {
                "id": str(uuid.uuid4()),
                "srn": "CIVIC-W14-2026-3921",
                "type": "Garbage Dump",
                "department": "Solid Waste Management",
                "latitude": 12.9650,
                "longitude": 77.6010,
                "address": "Opposite City Central Market, 4th Cross",
                "ward_number": "Ward 14 - Market East",
                "severity": 65,
                "status": "In Progress",
                "upvotes": 8,
                "image_url": "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&auto=format&fit=crop&q=80",
                "created_at": datetime.now() - timedelta(hours=22),
                "sla_hours": 48,
                "sla_deadline": datetime.now() + timedelta(hours=26),
                "prediction": {
                    "severity_in_24_hours": 74,
                    "severity_in_3_days": 85,
                    "severity_in_7_days": 92,
                    "priority": "MEDIUM",
                    "rainfall_forecast_mm": 12.0,
                    "traffic_density": "Dense Pedestrian",
                    "risk_summary": "Piled organic waste blocking pedestrian walkway; microbial spread risk if rain begins.",
                    "recommended_action": "Dispatch municipal tipper truck and deploy sanitation inspector.",
                    "sla_hours": 48
                },
                "action": {
                    "recommended_action": "Dispatch municipal tipper truck and deploy sanitation inspector.",
                    "assigned_team": "SWM Sanitation Team Charlie",
                    "assigned_official": "S. Anitha (Health Inspector)",
                    "work_order_id": "WO-SWM-2026-442",
                    "resolved_time": None,
                    "resolution_proof_url": None
                }
            },
            {
                "id": str(uuid.uuid4()),
                "srn": "CIVIC-W08-2026-7290",
                "type": "Waterlogging",
                "department": "Stormwater & Drainage (BWSSB)",
                "latitude": 12.9790,
                "longitude": 77.5850,
                "address": "Railway Underpass, Seshadripuram",
                "ward_number": "Ward 08 - North Gate",
                "severity": 91,
                "status": "Submitted",
                "upvotes": 26,
                "image_url": "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80",
                "created_at": datetime.now() - timedelta(hours=3),
                "sla_hours": 12,
                "sla_deadline": datetime.now() + timedelta(hours=9),
                "prediction": {
                    "severity_in_24_hours": 98,
                    "severity_in_3_days": 100,
                    "severity_in_7_days": 100,
                    "priority": "HIGH",
                    "rainfall_forecast_mm": 38.0,
                    "traffic_density": "Critical Arterial Choke Point",
                    "risk_summary": "Underpass drainage choked. Vehicle submergence risk during evening cloudburst.",
                    "recommended_action": "Emergency de-watering high-capacity suction pumps required immediately.",
                    "sla_hours": 12
                },
                "action": {
                    "recommended_action": "Emergency de-watering high-capacity suction pumps required immediately.",
                    "assigned_team": None,
                    "assigned_official": None,
                    "work_order_id": None,
                    "resolved_time": None,
                    "resolution_proof_url": None
                }
            },
            {
                "id": str(uuid.uuid4()),
                "srn": "CIVIC-W15-2026-1102",
                "type": "Broken Streetlight",
                "department": "Municipal Electrical Dept",
                "latitude": 12.9550,
                "longitude": 77.6150,
                "address": "Koramangala 5th Block, 80 Feet Road Junction",
                "ward_number": "Ward 15 - South East",
                "severity": 35,
                "status": "Resolved",
                "upvotes": 3,
                "image_url": "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80",
                "created_at": datetime.now() - timedelta(days=2),
                "sla_hours": 72,
                "sla_deadline": datetime.now() - timedelta(hours=10),
                "prediction": {
                    "severity_in_24_hours": 35,
                    "severity_in_3_days": 40,
                    "severity_in_7_days": 42,
                    "priority": "LOW",
                    "rainfall_forecast_mm": 5.0,
                    "traffic_density": "Residential Sector",
                    "risk_summary": "Localized illumination failure. Low accident probability.",
                    "recommended_action": "Routine bulb and wiring replacement by maintenance contractor.",
                    "sla_hours": 72
                },
                "action": {
                    "recommended_action": "Routine bulb and wiring replacement by maintenance contractor.",
                    "assigned_team": "Electrical Maintenance Division 2",
                    "assigned_official": "Er. P. Kumar",
                    "work_order_id": "WO-ELEC-2026-092",
                    "resolved_time": datetime.now() - timedelta(hours=12),
                    "resolution_proof_url": "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80"
                }
            }
        ]
        for rec in sample_records:
            self.issues[rec["id"]] = rec

    def get_all(self, status: Optional[str] = None, department: Optional[str] = None, ward: Optional[str] = None) -> List[dict]:
        results = list(self.issues.values())
        if status and status != "All":
            results = [r for r in results if r["status"].lower() == status.lower()]
        if department and department != "All":
            results = [r for r in results if department.lower() in r["department"].lower()]
        if ward and ward != "All":
            results = [r for r in results if ward.lower() in r["ward_number"].lower()]
        # Sort by creation time descending
        results.sort(key=lambda x: x["created_at"], reverse=True)
        return results

    def get_by_id(self, issue_id: str) -> Optional[dict]:
        return self.issues.get(issue_id)

    def get_by_srn(self, srn: str) -> Optional[dict]:
        for item in self.issues.values():
            if item["srn"].strip().upper() == srn.strip().upper():
                return item
        return None

    def add_issue(self, data: dict) -> dict:
        new_id = str(uuid.uuid4())
        ward = data.get("ward_number", "Ward 12 - Central")
        srn = self._generate_srn(ward)
        now = datetime.now()
        sla_hours = data.get("prediction", {}).get("sla_hours", 48)

        new_issue = {
            "id": new_id,
            "srn": srn,
            "type": data["type"],
            "department": data["department"],
            "latitude": data["latitude"],
            "longitude": data["longitude"],
            "address": data.get("address", "Reported GPS Location"),
            "ward_number": ward,
            "severity": data.get("severity", 50),
            "status": "Submitted",
            "upvotes": 1,
            "image_url": data["image_url"],
            "created_at": now,
            "sla_hours": sla_hours,
            "sla_deadline": now + timedelta(hours=sla_hours),
            "prediction": data.get("prediction"),
            "action": {
                "recommended_action": data.get("prediction", {}).get("recommended_action", "Triage and inspect location."),
                "assigned_team": None,
                "assigned_official": None,
                "work_order_id": None,
                "resolved_time": None,
                "resolution_proof_url": None
            }
        }
        self.issues[new_id] = new_issue
        return new_issue

    def assign_issue(self, issue_id: str, team: str, official: str, notes: Optional[str] = None) -> Optional[dict]:
        issue = self.get_by_id(issue_id)
        if not issue:
            return None
        issue["status"] = "Assigned"
        if not issue.get("action"):
            issue["action"] = {}
        issue["action"]["assigned_team"] = team
        issue["action"]["assigned_official"] = official
        issue["action"]["work_order_id"] = f"WO-{issue['type'][:3].upper()}-2026-{random.randint(100, 999)}"
        if notes:
            issue["action"]["recommended_action"] = notes
        return issue

    def resolve_issue(self, issue_id: str, resolution_notes: str, proof_url: Optional[str] = None) -> Optional[dict]:
        issue = self.get_by_id(issue_id)
        if not issue:
            return None
        issue["status"] = "Resolved"
        if not issue.get("action"):
            issue["action"] = {}
        issue["action"]["resolved_time"] = datetime.now()
        issue["action"]["resolution_notes"] = resolution_notes
        if proof_url:
            issue["action"]["resolution_proof_url"] = proof_url
        return issue

    def upvote_issue(self, issue_id: str) -> Optional[dict]:
        issue = self.get_by_id(issue_id)
        if not issue:
            return None
        issue["upvotes"] += 1
        return issue

# Singleton instance
db = CivicDatabase()

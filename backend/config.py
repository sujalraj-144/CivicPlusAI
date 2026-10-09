import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# CORS configuration
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

# Open-Meteo Weather API
OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast"

# Ward & Department Mapping
DEPARTMENT_MAPPING = {
    "Pothole": "PWD / Roads & Bridges",
    "Road Damage": "PWD / Roads & Bridges",
    "Garbage Dump": "Solid Waste Management",
    "Overflowing Bin": "Solid Waste Management",
    "Waterlogging": "Stormwater & Drainage (BWSSB)",
    "Open Manhole": "Sanitation & Sewerage",
    "Broken Streetlight": "Municipal Electrical Dept",
    "Hanging Wire": "Municipal Electrical Dept"
}

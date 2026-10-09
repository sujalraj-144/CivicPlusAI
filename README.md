# 🏛️ CivicPulse AI — Smart Cities Grievance & Predictive Maintenance Platform

> **Predict problems. Prevent disruption.**  
> Built by **Team Knox Drift** (Shyam, Balaji, Sujal, Akhil) for smart city municipal administration.

CivicPulse AI turns citizen reports into immediate action and proactive maintenance using computer vision and environmental predictive modeling.

---

## 🚀 Key Highlights & Government Workflows

1. **Official Citizen Portal (`/`):**
   - 1-Click photo capture with automated GPS reverse-geocoding.
   - Real-time **YOLO Computer Vision Detection** with confidence scoring and initial severity (0–100).
   - Instant generation of an official **Service Request Number (SRN)** (e.g., `CIVIC-W12-2026-8419`).
   - Anti-duplication civic upvoting ("Me Too / Impacted").

2. **Digital Twin Lite & 7-Day Risk Forecast:**
   - Enriched with live weather forecasts from **Open-Meteo** and traffic density models.
   - Forecasts infrastructural decay across **24 Hours**, **3 Days**, and **7 Days**.
   - Quantifies preventive repair savings before road failures cause accidents.

3. **Municipal Integrated Command & Control Center (ICCC):**
   - Live Leaflet GIS map with color-coded severity & SLA pins.
   - Automated SLA countdown timers (24h, 48h, 72h).
   - 1-click **Work Order Dispatch** to Ward Junior Engineers and Field Units.
   - Proof-of-work closure verification.

---

## 📂 Architecture & Directory Structure

```text
CivicPlusAI/
├── backend/
│   ├── main.py              # FastAPI application with CORS and route mounts
│   ├── config.py            # Environment, file paths, and Open-Meteo settings
│   ├── database.py          # Municipal data engine with initial mock records
│   ├── models.py            # Pydantic schemas and response contracts
│   ├── requirements.txt     # Python backend dependencies
│   ├── routers/
│   │   ├── upload.py        # [POST] /upload (receive photo & GPS)
│   │   ├── analyze.py       # [POST] /analyze (YOLO computer vision inference)
│   │   ├── predict.py       # [GET/POST] /predict (24h/3d/7d risk forecast)
│   │   ├── priority.py      # [GET] /priority (SLA score & action recommendation)
│   │   └── issues.py        # [GET/POST] /issues (CRUD, triage, tracking, upvotes)
│   └── ml/
│       ├── yolo_detector.py # YOLO vision classifier & bounding box heuristics
│       └── risk_predictor.py# Open-Meteo weather + traffic degradation model
├── frontend/
│   ├── index.html           # Leaflet GIS map script & Inter/Gov fonts
│   ├── package.json         # React 18, Vite, Lucide Icons, Tailwind
│   ├── tailwind.config.js   # Official municipal styling & color palette
│   ├── vite.config.js       # Vite dev server with proxy to backend :8000
│   └── src/
│       ├── api.js           # API client with offline demo fallbacks
│       ├── App.jsx          # Master application layout
│       └── components/
│           ├── GovHeader.jsx       # National emblem, helpline 1913, tab switcher
│           ├── CitizenReport.jsx   # Photo upload, live YOLO preview, SRN issue
│           ├── IssueTracker.jsx    # SRN grievance lookup & timeline tracker
│           ├── CityMap.jsx         # Leaflet OpenStreetMap interactive triage map
│           ├── RiskForecast.jsx    # Digital Twin Lite 24h/3d/7d forecast cards
│           └── IcccDashboard.jsx   # Municipal ICCC control room & work orders
├── database/
│   └── schema.sql           # PostgreSQL / Supabase schema blueprint
├── start_backend.bat        # Windows 1-click backend runner
└── start_frontend.bat       # Windows 1-click frontend runner
```

---

## 🛠️ How to Run Locally

### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
- API Docs: **http://localhost:8000/docs**
- Health Check: **http://localhost:8000**

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Web Application: **http://localhost:5173**

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/upload` | Receives photo file and GPS coordinates |
| `POST` | `/analyze` | Runs YOLO vision model; returns type, confidence, and initial severity |
| `GET` | `/predict` | Predicts future severity in 24h, 3d, 7d with Open-Meteo rainfall |
| `GET` | `/priority` | Calculates priority tier (HIGH/MED/LOW) and target SLA |
| `GET` | `/issues` | Lists all civic issues for the ICCC dashboard (with filters) |
| `POST` | `/issues` | End-to-end pipeline: analyzes photo, predicts risk, saves to DB |
| `GET` | `/issues/{srn}` | Tracks an issue by its Service Request Number |
| `POST` | `/issues/{id}/assign` | Dispatches work order to Junior Engineer |
| `POST` | `/issues/{id}/resolve`| Records proof of work and marks ticket closed |
| `POST` | `/issues/{id}/upvote` | Citizen de-duplication upvote |

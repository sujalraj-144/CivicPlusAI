# 🏛️ CivicPulse AI — Smart Cities Grievance & Predictive Maintenance Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-CivicPulse_AI-brightgreen?style=for-the-badge&logo=github)](https://sujalraj-144.github.io/CivicPlusAI/)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Active-blue?style=for-the-badge&logo=github-pages)](https://sujalraj-144.github.io/CivicPlusAI/)

> **Predict problems. Prevent disruption.**  
> Built by **Team Knox Drift** (Shyam, Balaji, Sujal, Akhil) for smart city municipal administration.

🌐 **Live Worldwide Web Application:** [https://sujalraj-144.github.io/CivicPlusAI/](https://sujalraj-144.github.io/CivicPlusAI/)

CivicPulse AI turns citizen reports into immediate municipal action and proactive infrastructure maintenance using computer vision, automated GPS mapping, and meteorological predictive risk modeling.

---

## 🚀 Key Highlights & Government Workflows

1. **Official Citizen Portal (`/`):**
   - 1-Click photo capture with interactive **GPS Pin-Drop Mini Map**.
   - Real-time **YOLO Computer Vision Detection** with confidence scoring and initial severity (0–100).
   - Generates official **Municipal Grievance Acknowledgement Slip** (Proof of Complaint) with legal verification stamp.
   - Anti-duplication civic upvoting ("Me Too / Impacted").

2. **Digital Twin Lite & 7-Day Risk Forecast:**
   - Enriched with live weather forecasts from **Open-Meteo** and traffic density models.
   - Forecasts infrastructural decay across **24 Hours**, **3 Days**, and **7 Days**.
   - **Taxpayer ROI Calculator (in INR ₹):** Quantifies civic budget savings before road failures cause accidents.

3. **Municipal Integrated Command & Control Center (ICCC):**
   - Live Leaflet GIS map with color-coded severity & SLA pins.
   - Automated SLA countdown timers (24h, 48h, 72h).
   - 1-click **Work Order Dispatch** to Ward Junior Engineers and Field Units.
   - Proof-of-work "Before & After" resolution comparison.

4. **Ward Performance Scorecard & Monsoon Radar:**
   - Inter-ward SLA accountability leaderboard.
   - Live precipitation risk radar for low-lying waterlogged underpasses.

---

## 🌐 Public Live Access
- **Production URL:** [https://sujalraj-144.github.io/CivicPlusAI/](https://sujalraj-144.github.io/CivicPlusAI/)
- Accessible globally on desktop, tablets, and mobile devices with zero local setup required.

---

## 🛠️ Running Locally (Optional)

Double click `open_website.bat` to launch immediately, or run:
```bash
start index.html
```

For the FastAPI backend:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

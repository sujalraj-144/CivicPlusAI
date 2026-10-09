@echo off
echo =======================================================
echo Starting CivicPulse AI - FastAPI Backend Server
echo =======================================================
cd /d "%~dp0backend"
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
pause

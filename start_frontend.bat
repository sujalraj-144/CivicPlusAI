@echo off
echo =======================================================
echo Starting CivicPulse AI - React + Tailwind Frontend
echo =======================================================
cd /d "%~dp0frontend"
call npm install
call npm run dev
pause

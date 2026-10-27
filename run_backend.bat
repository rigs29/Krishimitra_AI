@echo off
title KrishiMitra AI - Backend Server
cd /d "%~dp0backend"
set PYTHONUTF8=1
set PYTHONPATH=%~dp0backend
echo ===================================================
echo Starting KrishiMitra AI FastAPI Backend on http://localhost:8000
echo Documentation: http://localhost:8000/docs
echo ===================================================
call "%~dp0backend\.venv\Scripts\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause


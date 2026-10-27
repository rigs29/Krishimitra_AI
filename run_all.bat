@echo off
title KrishiMitra AI - Launcher
echo ===================================================
echo Launching KrishiMitra AI (Backend + Frontend)...
echo ===================================================
start "KrishiMitra Backend" cmd /k "%~dp0run_backend.bat"
timeout /t 3 /nobreak >nul
start "KrishiMitra Frontend" cmd /k "%~dp0run_frontend.bat"
echo.
echo ===================================================
echo KrishiMitra AI services launched:
echo  - Backend API:    http://localhost:8000
echo  - API Docs:       http://localhost:8000/docs
echo  - Frontend Web:   http://localhost:5173
echo ===================================================
timeout /t 5


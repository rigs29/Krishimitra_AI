$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$ScriptDir\backend"
$env:PYTHONUTF8 = 1
$env:PYTHONPATH = "$ScriptDir\backend"
Write-Host "===================================================" -ForegroundColor Green
Write-Host "Starting KrishiMitra AI FastAPI Backend on http://localhost:8000" -ForegroundColor Cyan
Write-Host "Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Green
& "$ScriptDir\backend\.venv\Scripts\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload


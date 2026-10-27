$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$ScriptDir\frontend"
Write-Host "===================================================" -ForegroundColor Green
Write-Host "Starting KrishiMitra AI Frontend on http://localhost:5173" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Green
npm run dev


Set-Location -Path $PSScriptRoot

Write-Host "==============================================" -ForegroundColor Green
Write-Host " SoilMate Backend - Virtual Environment Runner" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

if (-not (Test-Path ".venv\Scripts\python.exe")) {
    Write-Host "[1/3] Creating virtual environment (.venv)..." -ForegroundColor Cyan
    try {
        python -m venv .venv
    } catch {
        py -m venv .venv
    }

    if (-not (Test-Path ".venv\Scripts\python.exe")) {
        Write-Host "[ERROR] Could not create .venv. Please ensure Python is in your PATH." -ForegroundColor Red
        Exit 1
    }

    Write-Host "[2/3] Installing dependencies from requirements.txt..." -ForegroundColor Cyan
    & .\.venv\Scripts\python.exe -m pip install --upgrade pip
    & .\.venv\Scripts\pip.exe install -r requirements.txt
} else {
    Write-Host "(.venv already exists)" -ForegroundColor Gray
}

Write-Host "[3/3] Starting SoilMate FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
& .\.venv\Scripts\python.exe run.py


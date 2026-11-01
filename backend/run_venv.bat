@echo off
cd /d "%~dp0"
echo ==============================================
echo  SoilMate Backend - Virtual Environment Runner
echo ==============================================

if not exist ".venv\Scripts\python.exe" (
    echo [1/3] Creating virtual environment (.venv)...
    python -m venv .venv
    if errorlevel 1 (
        echo Trying with 'py' launcher...
        py -m venv .venv
    )
    if not exist ".venv\Scripts\python.exe" (
        echo [ERROR] Could not create virtual environment. Please check Python installation.
        pause
        exit /b 1
    )
    echo [2/3] Installing dependencies from requirements.txt...
    call .venv\Scripts\activate.bat
    python -m pip install --upgrade pip
    pip install -r requirements.txt
) else (
    echo (.venv already exists)
    call .venv\Scripts\activate.bat
)

echo [3/3] Starting SoilMate FastAPI Backend...
python run.py
pause


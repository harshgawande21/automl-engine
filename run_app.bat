@echo off
echo ==========================================
echo      AutoInsight Setup & Run Script
echo ==========================================

echo.
echo [1/4] Checking environment...
python --version
if %ERRORLEVEL% NEQ 0 (
    echo Error: Python is not installed or not in PATH.
    pause
    exit /b
)
call npm --version
if %ERRORLEVEL% NEQ 0 (
    echo Error: npm is not installed or not in PATH.
    pause
    exit /b
)

echo.
echo [2/4] Installing Backend Dependencies...
python -m pip install -r backend\requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo Error installing backend dependencies.
    pause
    exit /b
)

echo.
echo [3/4] Installing Frontend Dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing frontend dependencies.
    pause
    exit /b
)
cd ..

echo.
echo [4/4] Starting Services...
echo Starting Backend Server on http://localhost:8000...
start "AutoInsight Backend" cmd /k "uvicorn main:app --reload"

echo Starting Frontend Server on http://localhost:5173...
start "AutoInsight Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Application is starting...
echo Backend: Docs at http://localhost:8000/docs
echo Frontend: App at http://localhost:5173
echo.
echo Press any key to close this launcher (servers will keep running).
pause

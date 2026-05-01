@echo off
echo ==========================================
echo      AutoInsight ML Engine Setup
echo ==========================================

echo [1/4] Installing Backend Dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Backend installation failed.
    pause
    exit /b %errorlevel%
)

echo [2/4] Starting Backend Server in background...
start /b cmd /c "cd /d %~dp0backend && python -m uvicorn app.main:app --reload --port 8000"

echo [3/4] Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend installation failed.
    pause
    exit /b %errorlevel%
)

echo [4/4] Starting Frontend Server...
echo ==========================================
echo      Application Started Successfully!
echo ==========================================
echo Backend running at: http://localhost:8000 (in background)
echo Frontend running at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the frontend server.
npm run dev


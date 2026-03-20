@echo off
echo ==========================================
echo      AutoInsight ML Engine DEBUG RUN
echo ==========================================

echo [1/6] Checking Python...
python --version
if %errorlevel% neq 0 (
    echo [ERROR] Python not found! Please install Python 3.10+
    pause
    exit /b
)

echo [2/6] Checking Node.js...
call npm --version
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! Please install Node.js (LTS version)
    pause
    exit /b
)

echo [3/6] Installing Backend Dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Backend install failed. Check logs above.
    pause
    exit /b
)

echo [4/6] Starting Backend Server...
start "ML Engine Backend" cmd /k "python -m uvicorn app.main:app --reload --port 8000"

echo [5/6] Installing Frontend Dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend install failed. Check logs above.
    pause
    exit /b
)

echo [6/6] Starting Frontend Server...
start "ML Engine Frontend" cmd /k "npm run dev"

echo.
echo ==========================================
echo      Launch Attempt Complete
echo ==========================================
echo Please keep the new windows open.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
pause

@echo off
echo ==== DIAGNOSTICS ==== > diag_output.txt 2>&1
python --version >> diag_output.txt 2>&1
echo ---- >> diag_output.txt 2>&1
pip --version >> diag_output.txt 2>&1
echo ---- >> diag_output.txt 2>&1
echo Installing dependencies... >> diag_output.txt 2>&1
pip install fastapi uvicorn pandas numpy scikit-learn python-multipart pydantic xgboost joblib openpyxl >> diag_output.txt 2>&1
echo ---- >> diag_output.txt 2>&1
echo Running import test... >> diag_output.txt 2>&1
python test_imports.py >> diag_output.txt 2>&1
echo ==== DONE ==== >> diag_output.txt 2>&1

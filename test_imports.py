"""Quick test to verify all imports work before starting the server."""
import sys
print(f"Python: {sys.version}")

try:
    import fastapi
    print(f"[OK] fastapi {fastapi.__version__}")
except ImportError as e:
    print(f"[FAIL] fastapi: {e}")

try:
    import uvicorn
    print(f"[OK] uvicorn")
except ImportError as e:
    print(f"[FAIL] uvicorn: {e}")

try:
    import pandas
    print(f"[OK] pandas {pandas.__version__}")
except ImportError as e:
    print(f"[FAIL] pandas: {e}")

try:
    import sklearn
    print(f"[OK] scikit-learn {sklearn.__version__}")
except ImportError as e:
    print(f"[FAIL] scikit-learn: {e}")

try:
    import xgboost
    print(f"[OK] xgboost {xgboost.__version__}")
except ImportError as e:
    print(f"[FAIL] xgboost: {e}")

try:
    import joblib
    print(f"[OK] joblib")
except ImportError as e:
    print(f"[FAIL] joblib: {e}")

try:
    from backend.routers import data, train, predict
    print("[OK] backend.routers imports")
except ImportError as e:
    print(f"[FAIL] backend.routers: {e}")

try:
    from preprocessing.cleaning import clean_data
    from preprocessing.encoding import encode_features
    print("[OK] preprocessing imports")
except ImportError as e:
    print(f"[FAIL] preprocessing: {e}")

try:
    from models.classification.logistic_regression import LogisticRegressionModel
    print("[OK] models imports")
except ImportError as e:
    print(f"[FAIL] models: {e}")

print("\n--- All checks done ---")
print("If everything is [OK], run: python -m uvicorn main:app --reload")
print("Then open: http://localhost:8000/docs")

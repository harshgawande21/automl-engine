import os
import json
import joblib
from datetime import datetime
from app.core.config import SAVED_MODELS_DIR


def list_registered_models() -> list:
    """List all model files saved to disk."""
    if not os.path.exists(SAVED_MODELS_DIR):
        return []
    return [
        {
            "filename": f,
            "size_mb": round(os.path.getsize(os.path.join(SAVED_MODELS_DIR, f)) / (1024 * 1024), 2),
            "modified": datetime.fromtimestamp(os.path.getmtime(os.path.join(SAVED_MODELS_DIR, f))).isoformat(),
        }
        for f in os.listdir(SAVED_MODELS_DIR)
        if f.endswith(".joblib")
    ]


def load_registered_model(filename: str):
    """Load a registered model from the saved_models directory."""
    path = os.path.join(SAVED_MODELS_DIR, filename)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found: {filename}")
    return joblib.load(path)


def delete_registered_model(filename: str) -> bool:
    path = os.path.join(SAVED_MODELS_DIR, filename)
    if os.path.exists(path):
        os.remove(path)
        return True
    return False

import os
import joblib
from app.core.config import SAVED_MODELS_DIR


def load_model(filename: str):
    """Load a trained model from disk."""
    model_path = os.path.join(SAVED_MODELS_DIR, filename)
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found: {filename}")
    return joblib.load(model_path)

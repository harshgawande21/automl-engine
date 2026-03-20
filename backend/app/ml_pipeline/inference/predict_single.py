import pandas as pd
from app.ml_pipeline.inference.load_model import load_model


def predict_single(model_filename: str, features: dict) -> dict:
    """Make a single prediction given a model file and feature dictionary."""
    model = load_model(model_filename)
    df = pd.DataFrame([features])
    prediction = model.predict(df)

    result = {"prediction": prediction.tolist()}

    if hasattr(model, "predict_proba"):
        try:
            proba = model.predict_proba(df)
            result["probabilities"] = proba.tolist()[0]
            result["confidence"] = round(float(proba.max()), 4)
        except Exception:
            pass

    return result

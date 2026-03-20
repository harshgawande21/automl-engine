import pandas as pd
from app.ml_pipeline.inference.load_model import load_model


def predict_batch(model_filename: str, df: pd.DataFrame) -> dict:
    """Make batch predictions on a DataFrame."""
    model = load_model(model_filename)
    predictions = model.predict(df)

    results = [
        {"row_index": i, "prediction": pred.item() if hasattr(pred, "item") else pred}
        for i, pred in enumerate(predictions)
    ]

    return {
        "total": len(results),
        "predictions": results,
    }

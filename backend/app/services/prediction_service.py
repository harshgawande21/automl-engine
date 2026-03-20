import pandas as pd
from sqlalchemy.orm import Session
from app.services.model_service import load_model_object
from app.utils.file_handler import load_dataframe
from app.utils.helpers import generate_id, Timer
from app.database import crud


def predict_single(db: Session, model_id: str, features: dict, user_id: str = None) -> dict:
    model, record = load_model_object(model_id, db)

    with Timer() as t:
        df = pd.DataFrame([features])
        prediction = model.predict(df)
        result = prediction.tolist()

    # Confidence (if classifier with predict_proba)
    confidence = None
    if hasattr(model, "predict_proba"):
        try:
            proba = model.predict_proba(df)
            confidence = round(float(proba.max()), 4)
        except Exception:
            pass

    pred = crud.create_prediction(
        db,
        model_id=model_id,
        input_data=features,
        result={"prediction": result},
        confidence=confidence,
        prediction_type="single",
        latency_ms=t.elapsed_ms,
        created_by=user_id,
    )

    return {
        "id": pred.id,
        "prediction": result[0] if len(result) == 1 else result,
        "confidence": confidence,
        "latency_ms": t.elapsed_ms,
    }


def predict_batch(db: Session, model_id: str, filename: str, user_id: str = None) -> dict:
    model, record = load_model_object(model_id, db)

    with Timer() as t:
        df = load_dataframe(filename)
        predictions = model.predict(df)

    results = []
    for i, pred in enumerate(predictions):
        results.append({"row": i, "prediction": pred.item() if hasattr(pred, "item") else pred})

    crud.create_prediction(
        db,
        model_id=model_id,
        input_data={"filename": filename, "count": len(df)},
        result={"predictions": results},
        prediction_type="batch",
        latency_ms=t.elapsed_ms,
        created_by=user_id,
    )

    return {
        "count": len(results),
        "predictions": results[:20],
        "latency_ms": t.elapsed_ms,
    }


def get_prediction_history(db: Session, model_id: str = None) -> list:
    preds = crud.get_predictions(db, model_id=model_id)
    return [
        {
            "id": p.id, "model_id": p.model_id, "result": p.result,
            "confidence": p.confidence, "type": p.prediction_type,
            "latency_ms": p.latency_ms, "created_at": str(p.created_at),
        }
        for p in preds
    ]

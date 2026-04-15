import os
import joblib
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.core.config import SAVED_MODELS_DIR
from app.database import crud


def get_all_models(db: Session) -> list:
    return [
        {
            "id": m.id, "name": m.name, "model_type": m.model_type,
            "task_type": m.task_type, "metrics": m.metrics, "status": m.status,
            "training_duration": m.training_duration,
            "created_at": m.created_at.isoformat() if m.created_at else None,
        }
        for m in crud.get_trained_models(db)
    ]


def get_model_detail(db: Session, model_id: str) -> dict:
    m = crud.get_trained_model_by_id(db, model_id)
    if not m:
        raise HTTPException(404, "Model not found")
    return {
        "id": m.id, "name": m.name, "model_type": m.model_type,
        "task_type": m.task_type, "filename": m.filename,
        "metrics": m.metrics, "hyperparameters": m.hyperparameters,
        "status": m.status, "training_duration": m.training_duration,
    }


def delete_model(db: Session, model_id: str) -> dict:
    m = crud.get_trained_model_by_id(db, model_id)
    if not m:
        raise HTTPException(404, "Model not found")
    model_path = os.path.join(SAVED_MODELS_DIR, m.filename)
    if os.path.exists(model_path):
        os.remove(model_path)
    db.delete(m)
    db.commit()
    return {"message": "Model deleted"}


def load_model_object(model_id: str, db: Session):
    """Load the actual sklearn/xgboost model object from disk."""
    m = crud.get_trained_model_by_id(db, model_id)
    if not m:
        raise HTTPException(404, "Model not found")
    model_path = os.path.join(SAVED_MODELS_DIR, m.filename)
    if not os.path.exists(model_path):
        raise HTTPException(404, "Model file not found on disk")
    bundle = joblib.load(model_path)
    # Support both old format (raw model) and new bundle format
    if isinstance(bundle, dict) and "model" in bundle:
        return bundle["model"], m, bundle.get("encoders", {}), bundle.get("feature_cols", [])
    return bundle, m, {}, []

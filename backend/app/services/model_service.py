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
    return joblib.load(model_path), m

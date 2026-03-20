import pandas as pd
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.services.model_service import load_model_object
from app.utils.file_handler import load_dataframe
from app.explainability.shap_engine import compute_shap_values
from app.explainability.lime_engine import compute_lime_explanation
from app.explainability.feature_importance import get_feature_importance


def explain_shap(db: Session, model_id: str, features: dict = None, num_samples: int = 100) -> dict:
    model, record = load_model_object(model_id, db)

    if features:
        X = pd.DataFrame([features])
    else:
        X = None

    return compute_shap_values(model, X, num_samples=num_samples)


def explain_lime(db: Session, model_id: str, features: dict, dataset_filename: str = None) -> dict:
    model, record = load_model_object(model_id, db)
    instance = pd.DataFrame([features])

    training_data = None
    if dataset_filename:
        training_data = load_dataframe(dataset_filename)
        if record.target_column and record.target_column in training_data.columns:
            training_data = training_data.drop(columns=[record.target_column])

    return compute_lime_explanation(model, instance, training_data)


def explain_feature_importance(db: Session, model_id: str) -> dict:
    model, record = load_model_object(model_id, db)
    return get_feature_importance(model)

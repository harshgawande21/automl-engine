import os
import joblib
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.core.config import SAVED_MODELS_DIR, DEFAULT_TEST_SIZE, DEFAULT_RANDOM_STATE
from app.core.constants import CLASSIFICATION_MODELS, REGRESSION_MODELS, CLUSTERING_MODELS
from app.utils.file_handler import load_dataframe
from app.utils.helpers import generate_id, Timer
from app.database import crud
from app.ml_pipeline.preprocessing.clean_data import clean_data
from app.ml_pipeline.preprocessing.encoding import encode_features
from app.ml_pipeline.training.train_model import get_model_instance
from app.ml_pipeline.training.hyperparameter_tuning import tune_hyperparameters
from app.ml_pipeline.training.cross_validation import cross_validate_model


def train_model(db: Session, filename: str, target_column: str, model_type: str,
                task_type: str = "classification", test_size: float = DEFAULT_TEST_SIZE,
                n_clusters: int = 3, hyperparameters: dict = None, user_id: str = None) -> dict:
    df = load_dataframe(filename)
    df = clean_data(df)
    df = encode_features(df)

    is_clustering = model_type in CLUSTERING_MODELS

    with Timer() as t:
        model_wrapper = get_model_instance(model_type, n_clusters=n_clusters, params=hyperparameters)

        if is_clustering:
            X = df.drop(columns=[target_column], errors="ignore") if target_column else df.select_dtypes(include=["number"])
            results = model_wrapper.train(X)
            actual_task = "clustering"
        else:
            if not target_column:
                raise HTTPException(400, "Target column required for supervised learning")
            if target_column not in df.columns:
                raise HTTPException(400, f"Target column '{target_column}' not found")
            results = model_wrapper.train(df, target_column, test_size=test_size)
            actual_task = "classification" if model_type in CLASSIFICATION_MODELS else "regression"

    # Save model
    model_filename = f"{filename}_{model_type}_{generate_id()}.joblib"
    os.makedirs(SAVED_MODELS_DIR, exist_ok=True)
    joblib.dump(model_wrapper.model, os.path.join(SAVED_MODELS_DIR, model_filename))

    # Persist to DB
    record = crud.create_trained_model(
        db,
        name=f"{model_type} on {filename}",
        model_type=model_type,
        task_type=actual_task,
        filename=model_filename,
        target_column=target_column,
        metrics=results,
        hyperparameters=hyperparameters,
        training_duration=t.elapsed,
        created_by=user_id,
    )

    return {
        "id": record.id,
        "model_type": model_type,
        "task_type": actual_task,
        "results": results,
        "model_path": model_filename,
        "training_duration": t.elapsed,
    }


def tune_model(db: Session, filename: str, target_column: str, model_type: str,
               param_grid: dict, search_strategy: str = "grid", cv_folds: int = 5) -> dict:
    df = load_dataframe(filename)
    df = clean_data(df)
    df = encode_features(df)

    return tune_hyperparameters(df, target_column, model_type, param_grid, search_strategy, cv_folds)


def evaluate_with_cv(filename: str, target_column: str, model_type: str, cv_folds: int = 5) -> dict:
    df = load_dataframe(filename)
    df = clean_data(df)
    df = encode_features(df)

    return cross_validate_model(df, target_column, model_type, cv_folds)

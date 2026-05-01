"""
Smart Training Service — handles any dataset automatically.
No ML knowledge required from the user.
"""
import os
import joblib
import numpy as np
import pandas as pd
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.core.config import SAVED_MODELS_DIR, DEFAULT_TEST_SIZE, DEFAULT_RANDOM_STATE
from app.utils.file_handler import load_dataframe
from app.utils.helpers import generate_id, Timer
from app.database import crud
from app.ml_pipeline.preprocessing.clean_data import clean_data


def _smart_encode(df: pd.DataFrame, target_col: str = None) -> pd.DataFrame:
    """Encode all columns intelligently — label encode categoricals."""
    from sklearn.preprocessing import LabelEncoder
    df = df.copy()
    for col in df.columns:
        if col == target_col:
            continue
        if df[col].dtype == object or str(df[col].dtype) == 'category':
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
    return df


def _detect_task(df: pd.DataFrame):
    """
    Auto-detect the best task type and target column.
    Returns: (task_type, target_column, model_type, explanation)
    """
    # Find the best target column — last column or one with few unique values
    candidates = []
    for col in df.columns:
        n_unique = df[col].nunique()
        n_rows = len(df)
        if n_unique < 2:
            continue
        if n_unique <= 20 and df[col].dtype == object:
            candidates.append((col, 'classification', n_unique))
        elif n_unique <= 10 and n_unique / n_rows < 0.05:
            candidates.append((col, 'classification', n_unique))
        elif df[col].dtype in [np.float64, np.float32, np.int64, np.int32]:
            if n_unique > 20:
                candidates.append((col, 'regression', n_unique))

    if candidates:
        # Prefer classification targets
        clf_candidates = [c for c in candidates if c[1] == 'classification']
        if clf_candidates:
            target = clf_candidates[-1][0]  # last classification column
            n_unique = clf_candidates[-1][2]
            model = 'random_forest'
            explanation = f"I detected '{target}' as your target column with {n_unique} categories. I'll train a Random Forest classifier."
            return 'classification', target, model, explanation
        else:
            target = candidates[-1][0]
            model = 'random_forest'
            explanation = f"I detected '{target}' as your target column (continuous values). I'll train a Random Forest regressor."
            return 'regression', target, model, explanation

    # No good target found — use clustering
    explanation = "No clear target column found. I'll group your data into natural clusters automatically."
    return 'clustering', None, 'kmeans', explanation


def smart_train(db: Session, filename: str, user_id: str = None,
                target_column: str = None, model_type: str = None,
                task_type: str = None, features: list = None) -> dict:
    """
    Train a model on any dataset with zero ML knowledge required.
    Auto-detects task type, target column, and algorithm.
    """
    if not filename:
        raise HTTPException(400, "No dataset provided. Please upload a file first.")

    # Load and clean
    df = load_dataframe(filename)
    if df is None or df.empty:
        raise HTTPException(400, "Could not load the dataset. Please re-upload.")

    original_cols = df.columns.tolist()
    df = clean_data(df)

    # Auto-detect if not provided (Detect from FULL dataset before filtering features)
    auto_detected = False
    if not task_type or not target_column:
        task_type, target_column, model_type, explanation = _detect_task(df)
        auto_detected = True
    else:
        explanation = f"Training {model_type} for {task_type}."

    if features:
        cols_to_keep = list(features)
        if target_column and target_column not in cols_to_keep:
            cols_to_keep.append(target_column)
        cols_to_keep = [col for col in cols_to_keep if col in df.columns]
        # Prevent completely empty feature sets if user didn't select enough valid columns
        if len(cols_to_keep) > 1 or task_type == 'clustering':
            df = df[cols_to_keep]

    # Encode
    df_encoded = _smart_encode(df, target_col=target_column)

    # Ensure all columns are numeric
    for col in df_encoded.columns:
        if df_encoded[col].dtype == object:
            from sklearn.preprocessing import LabelEncoder
            df_encoded[col] = LabelEncoder().fit_transform(df_encoded[col].astype(str))

    is_clustering = task_type == 'clustering'

    with Timer() as t:
        if is_clustering:
            X = df_encoded.select_dtypes(include=[np.number])
            if X.empty:
                raise HTTPException(400, "No numeric data found for clustering.")

            # Auto-determine n_clusters
            n_clusters = min(5, max(2, len(df) // 100))

            from sklearn.cluster import KMeans
            from sklearn.metrics import silhouette_score
            model = KMeans(n_clusters=n_clusters, random_state=DEFAULT_RANDOM_STATE, n_init=10)
            labels = model.fit_predict(X)
            sil = float(silhouette_score(X, labels)) if len(set(labels)) > 1 else 0.0

            results = {
                "n_clusters": n_clusters,
                "silhouette_score": round(sil, 4),
                "inertia": round(float(model.inertia_), 2),
                "labels": labels.tolist(),
                "cluster_sizes": {str(i): int((labels == i).sum()) for i in range(n_clusters)},
            }
            feature_cols = X.columns.tolist()
            actual_task = "clustering"

        else:
            if target_column not in df_encoded.columns:
                raise HTTPException(400, f"Target column '{target_column}' not found after processing.")

            X = df_encoded.drop(columns=[target_column])
            y = df_encoded[target_column]

            # Ensure X is numeric
            X = X.select_dtypes(include=[np.number])
            if X.empty:
                raise HTTPException(400, "No numeric feature columns found for training.")

            from sklearn.model_selection import train_test_split
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=DEFAULT_TEST_SIZE, random_state=DEFAULT_RANDOM_STATE
            )

            # Choose best model
            if task_type == 'classification':
                from sklearn.ensemble import RandomForestClassifier
                model = RandomForestClassifier(n_estimators=100, random_state=DEFAULT_RANDOM_STATE, n_jobs=-1)
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)

                from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
                acc = float(accuracy_score(y_test, y_pred))
                results = {
                    "accuracy": round(acc, 4),
                    "precision": round(float(precision_score(y_test, y_pred, average='weighted', zero_division=0)), 4),
                    "recall": round(float(recall_score(y_test, y_pred, average='weighted', zero_division=0)), 4),
                    "f1_score": round(float(f1_score(y_test, y_pred, average='weighted', zero_division=0)), 4),
                    "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
                    "feature_importances": {
                        col: round(float(imp), 4)
                        for col, imp in zip(X.columns, model.feature_importances_)
                    },
                    "sample_size": len(df),
                    "train_size": len(X_train),
                    "test_size": len(X_test),
                }
                actual_task = "classification"
                model_type = "random_forest"

            else:  # regression
                from sklearn.ensemble import RandomForestRegressor
                model = RandomForestRegressor(n_estimators=100, random_state=DEFAULT_RANDOM_STATE, n_jobs=-1)
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)

                from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
                results = {
                    "r2_score": round(float(r2_score(y_test, y_pred)), 4),
                    "mse": round(float(mean_squared_error(y_test, y_pred)), 4),
                    "mae": round(float(mean_absolute_error(y_test, y_pred)), 4),
                    "rmse": round(float(np.sqrt(mean_squared_error(y_test, y_pred))), 4),
                    "feature_importances": {
                        col: round(float(imp), 4)
                        for col, imp in zip(X.columns, model.feature_importances_)
                    },
                    "sample_size": len(df),
                    "train_size": len(X_train),
                    "test_size": len(X_test),
                }
                actual_task = "regression"
                model_type = "random_forest"

            feature_cols = X.columns.tolist()

    # Save model + encoders together
    model_filename = f"{filename}_{model_type}_{generate_id()}.joblib"
    os.makedirs(SAVED_MODELS_DIR, exist_ok=True)

    # Build column encoders for text columns (needed at prediction time)
    col_encoders = {}
    original_df = load_dataframe(filename)
    original_df = clean_data(original_df)
    for col in original_df.columns:
        if original_df[col].dtype == object or str(original_df[col].dtype) == 'category':
            from sklearn.preprocessing import LabelEncoder
            le = LabelEncoder()
            le.fit(original_df[col].astype(str))
            col_encoders[col] = le  # includes target column encoder

    # Save model bundle: model + encoders (including target)
    bundle = {"model": model, "encoders": col_encoders, "feature_cols": feature_cols}
    joblib.dump(bundle, os.path.join(SAVED_MODELS_DIR, model_filename))

    record = crud.create_trained_model(
        db,
        name=f"Auto-trained on {filename}",
        model_type=model_type,
        task_type=actual_task,
        filename=model_filename,
        target_column=target_column or "",
        metrics=results,
        hyperparameters={
            "feature_columns": feature_cols,
            "auto_detected": auto_detected,
            "explanation": explanation,
        },
        training_duration=t.elapsed,
        created_by=user_id,
    )

    return {
        "id": record.id,
        "model_type": model_type,
        "task_type": actual_task,
        "target_column": target_column,
        "results": results,
        "training_duration": round(t.elapsed, 2),
        "explanation": explanation,
        "auto_detected": auto_detected,
        "feature_columns": feature_cols,
    }

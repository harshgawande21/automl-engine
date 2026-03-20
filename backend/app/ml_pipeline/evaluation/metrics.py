import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    classification_report, confusion_matrix as sk_confusion_matrix,
    mean_squared_error, mean_absolute_error, r2_score,
)


def evaluate_classification(y_true, y_pred, model=None, X=None) -> dict:
    result = {
        "accuracy": round(float(accuracy_score(y_true, y_pred)), 4),
        "precision": round(float(precision_score(y_true, y_pred, average="weighted", zero_division=0)), 4),
        "recall": round(float(recall_score(y_true, y_pred, average="weighted", zero_division=0)), 4),
        "f1_score": round(float(f1_score(y_true, y_pred, average="weighted", zero_division=0)), 4),
        "classification_report": classification_report(y_true, y_pred, output_dict=True, zero_division=0),
        "confusion_matrix": sk_confusion_matrix(y_true, y_pred).tolist(),
    }

    # Feature importances if available
    if model is not None and hasattr(model, "feature_importances_") and X is not None:
        result["feature_importances"] = dict(zip(
            X.columns.tolist() if hasattr(X, "columns") else [f"f{i}" for i in range(X.shape[1])],
            [round(float(v), 4) for v in model.feature_importances_]
        ))

    return result


def evaluate_regression(y_true, y_pred) -> dict:
    return {
        "mse": round(float(mean_squared_error(y_true, y_pred)), 4),
        "rmse": round(float(np.sqrt(mean_squared_error(y_true, y_pred))), 4),
        "mae": round(float(mean_absolute_error(y_true, y_pred)), 4),
        "r2_score": round(float(r2_score(y_true, y_pred)), 4),
    }

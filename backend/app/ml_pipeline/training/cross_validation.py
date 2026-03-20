import pandas as pd
import numpy as np
from sklearn.model_selection import cross_val_score
from app.ml_pipeline.training.train_model import get_model_instance


def cross_validate_model(df: pd.DataFrame, target_column: str, model_type: str, cv_folds: int = 5) -> dict:
    """Perform k-fold cross-validation and return summary statistics."""
    X = df.drop(columns=[target_column])
    y = df[target_column]

    wrapper = get_model_instance(model_type)

    scores = cross_val_score(wrapper.model, X, y, cv=cv_folds, scoring="accuracy", n_jobs=-1)

    return {
        "model_type": model_type,
        "cv_folds": cv_folds,
        "scores": [round(float(s), 4) for s in scores],
        "mean_score": round(float(np.mean(scores)), 4),
        "std_score": round(float(np.std(scores)), 4),
        "min_score": round(float(np.min(scores)), 4),
        "max_score": round(float(np.max(scores)), 4),
    }

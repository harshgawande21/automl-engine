import numpy as np
import pandas as pd


def compute_shap_values(model, X_sample: pd.DataFrame = None, num_samples: int = 100) -> dict:
    """Compute SHAP values for model explainability."""
    try:
        import shap

        if X_sample is None:
            return {"message": "Provide input features (X_sample) for SHAP analysis"}

        if hasattr(model, "predict_proba"):
            explainer = shap.Explainer(model.predict_proba, X_sample[:num_samples])
        else:
            explainer = shap.Explainer(model, X_sample[:num_samples])

        shap_values = explainer(X_sample[:num_samples])

        feature_names = X_sample.columns.tolist() if hasattr(X_sample, "columns") else [f"f{i}" for i in range(X_sample.shape[1])]

        mean_abs = np.abs(shap_values.values).mean(axis=0)
        if mean_abs.ndim > 1:
            mean_abs = mean_abs.mean(axis=1)

        importance = {name: round(float(val), 4) for name, val in zip(feature_names, mean_abs)}

        return {
            "feature_importance": importance,
            "method": "shap",
            "num_samples": len(X_sample[:num_samples]),
        }

    except ImportError:
        return _fallback_importance(model, X_sample)
    except Exception as e:
        return {"error": str(e), "fallback": _fallback_importance(model, X_sample)}


def _fallback_importance(model, X_sample):
    """Fallback when SHAP isn't installed."""
    if hasattr(model, "feature_importances_"):
        names = X_sample.columns.tolist() if X_sample is not None and hasattr(X_sample, "columns") else [f"f{i}" for i in range(len(model.feature_importances_))]
        return {
            "feature_importance": {n: round(float(v), 4) for n, v in zip(names, model.feature_importances_)},
            "method": "builtin_feature_importances",
        }
    return {"message": "SHAP library not installed and model has no feature_importances_"}

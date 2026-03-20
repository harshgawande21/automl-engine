import numpy as np


def get_feature_importance(model) -> dict:
    """Extract feature importance from a trained model."""
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
        return {
            "importances": [round(float(v), 4) for v in importances],
            "method": "feature_importances_",
        }

    if hasattr(model, "coef_"):
        coefs = np.abs(model.coef_)
        if coefs.ndim > 1:
            coefs = coefs.mean(axis=0)
        return {
            "importances": [round(float(v), 4) for v in coefs],
            "method": "coefficient_magnitude",
        }

    return {"message": "Model does not support feature importance extraction", "method": None}

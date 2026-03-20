import numpy as np
from sklearn.metrics import roc_curve, auc, roc_auc_score


def compute_roc_auc(y_true, y_score, multi_class: str = "ovr") -> dict:
    """Compute ROC curve and AUC score."""
    try:
        if len(set(y_true)) == 2:
            fpr, tpr, thresholds = roc_curve(y_true, y_score)
            auc_score = auc(fpr, tpr)
            return {
                "fpr": [round(float(v), 4) for v in fpr],
                "tpr": [round(float(v), 4) for v in tpr],
                "auc": round(float(auc_score), 4),
            }
        else:
            auc_score = roc_auc_score(y_true, y_score, multi_class=multi_class, average="weighted")
            return {"auc": round(float(auc_score), 4), "multi_class": True}
    except Exception as e:
        return {"error": str(e), "auc": None}

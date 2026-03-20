import numpy as np
from sklearn.metrics import confusion_matrix as sk_confusion_matrix


def compute_confusion_matrix(y_true, y_pred, labels=None) -> dict:
    """Compute confusion matrix with normalized version."""
    cm = sk_confusion_matrix(y_true, y_pred, labels=labels)
    cm_normalized = cm.astype(float) / cm.sum(axis=1, keepdims=True)
    cm_normalized = np.nan_to_num(cm_normalized)

    return {
        "matrix": cm.tolist(),
        "normalized_matrix": [[round(float(v), 4) for v in row] for row in cm_normalized],
        "labels": labels if labels else sorted(list(set(y_true) | set(y_pred))),
    }

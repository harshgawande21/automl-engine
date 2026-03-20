import pandas as pd
import numpy as np

def calculate_feature_importance(model, feature_names):
    """
    Extracts feature importance from tree-based models (Random Forest, XGBoost)
    or coefficients from linear models.
    """
    importance_dict = {}
    
    # Tree-based models
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
        importance_dict = dict(zip(feature_names, importances))
        
    # Linear models
    elif hasattr(model, "coef_"):
        importances = np.abs(model.coef_)
        if importances.ndim > 1:
            importances = importances[0] # Take first class for binary/multiclass
        importance_dict = dict(zip(feature_names, importances))
        
    # Sort by importance
    sorted_importance = dict(sorted(importance_dict.items(), key=lambda item: item[1], reverse=True))
    
    return sorted_importance

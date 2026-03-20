from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import os

router = APIRouter(
    prefix="/recommend",
    tags=["recommend"],
)

UPLOAD_DIR = "uploads"

class RecommendRequest(BaseModel):
    filename: str
    target_column: str = ""

@router.post("/")
def recommend_models(request: RecommendRequest):
    """Analyze dataset and recommend suitable ML models and visualizations."""
    file_path = os.path.join(UPLOAD_DIR, request.filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        df = pd.read_csv(file_path) if file_path.endswith('.csv') else pd.read_excel(file_path)

        n_rows, n_cols = df.shape
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()
        has_nulls = df.isnull().any().any()

        recommendations = {
            "models": [],
            "visualizations": [],
            "preprocessing_tips": [],
            "dataset_summary": {
                "rows": n_rows,
                "columns": n_cols,
                "numeric_columns": len(numeric_cols),
                "categorical_columns": len(categorical_cols),
                "has_missing_values": bool(has_nulls)
            }
        }

        # Preprocessing tips
        if has_nulls:
            recommendations["preprocessing_tips"].append({
                "tip": "Missing values detected",
                "detail": "The system will automatically handle missing values during training.",
                "icon": "alert"
            })
        if len(categorical_cols) > 0:
            recommendations["preprocessing_tips"].append({
                "tip": f"{len(categorical_cols)} categorical columns found",
                "detail": "Automatic label encoding will be applied.",
                "icon": "info"
            })

        if request.target_column and request.target_column in df.columns:
            target = df[request.target_column]
            n_unique = target.nunique()

            if n_unique <= 10 or not pd.api.types.is_numeric_dtype(target):
                # Classification task
                recommendations["task_type"] = "classification"
                recommendations["models"] = [
                    {"name": "Random Forest", "value": "random_forest", "confidence": 95,
                     "reason": "Best for tabular data with mixed features. Handles non-linear relationships well."},
                    {"name": "XGBoost", "value": "xgboost", "confidence": 92,
                     "reason": "High performance on structured data. Great for competition-level accuracy."},
                    {"name": "Logistic Regression", "value": "logistic_regression", "confidence": 78,
                     "reason": "Good baseline model. Fast training and interpretable results."},
                    {"name": "SVM", "value": "svm", "confidence": 72,
                     "reason": "Effective for high-dimensional data with clear margin of separation."},
                    {"name": "Naive Bayes", "value": "naive_bayes", "confidence": 65,
                     "reason": "Fast and simple. Works well when features are independent."},
                ]
                recommendations["visualizations"] = [
                    {"type": "confusion_matrix", "reason": "See how well the model classifies each category"},
                    {"type": "feature_importance", "reason": "Understand which features drive predictions"},
                    {"type": "histogram", "reason": "View distribution of the target variable"},
                    {"type": "correlation", "reason": "Find relationships between numeric features"},
                ]
            else:
                # Regression task
                recommendations["task_type"] = "regression"
                recommendations["models"] = [
                    {"name": "XGBoost Regression", "value": "xgboost_regression", "confidence": 93,
                     "reason": "Best overall for regression with complex patterns."},
                    {"name": "Ridge Regression", "value": "ridge_regression", "confidence": 82,
                     "reason": "Good for multicollinear data. Regularization prevents overfitting."},
                    {"name": "Linear Regression", "value": "linear_regression", "confidence": 75,
                     "reason": "Simple baseline. Interpretable coefficients."},
                    {"name": "Lasso Regression", "value": "lasso_regression", "confidence": 70,
                     "reason": "Built-in feature selection. Good when many features are irrelevant."},
                ]
                recommendations["visualizations"] = [
                    {"type": "correlation", "reason": "Identify which features are most correlated with the target"},
                    {"type": "histogram", "reason": "Check if the target variable is normally distributed"},
                    {"type": "feature_importance", "reason": "See which features have the most impact"},
                ]
        else:
            # No target → suggest clustering
            recommendations["task_type"] = "clustering"
            recommendations["models"] = [
                {"name": "K-Means", "value": "kmeans", "confidence": 90,
                 "reason": "Most popular clustering method. Fast and scalable."},
                {"name": "DBSCAN", "value": "dbscan", "confidence": 75,
                 "reason": "Finds clusters of arbitrary shape. No need to specify number of clusters."},
                {"name": "Hierarchical", "value": "hierarchical", "confidence": 70,
                 "reason": "Produces a dendrogram for visual interpretation of cluster hierarchy."},
            ]
            recommendations["visualizations"] = [
                {"type": "histogram", "reason": "Explore distribution of features before clustering"},
                {"type": "correlation", "reason": "Understand feature relationships"},
            ]

        return recommendations

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

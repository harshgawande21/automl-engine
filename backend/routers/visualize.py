from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import os

router = APIRouter(
    prefix="/visualize",
    tags=["visualize"],
)

UPLOAD_DIR = "uploads"

class VisualizeRequest(BaseModel):
    filename: str
    column: str = ""

@router.post("/histogram")
def get_histogram(request: VisualizeRequest):
    file_path = os.path.join(UPLOAD_DIR, request.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        df = pd.read_csv(file_path) if file_path.endswith('.csv') else pd.read_excel(file_path)

        if request.column and request.column in df.columns:
            col = df[request.column].dropna()
            if pd.api.types.is_numeric_dtype(col):
                counts, bin_edges = np.histogram(col, bins=15)
                return {
                    "column": request.column,
                    "data": [
                        {"bin": f"{bin_edges[i]:.2f}-{bin_edges[i+1]:.2f}", "count": int(counts[i])}
                        for i in range(len(counts))
                    ]
                }
            else:
                value_counts = col.value_counts().head(20)
                return {
                    "column": request.column,
                    "data": [{"bin": str(k), "count": int(v)} for k, v in value_counts.items()]
                }

        # Default: return histograms for all numeric columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()[:6]
        result = {}
        for c in numeric_cols:
            counts, bin_edges = np.histogram(df[c].dropna(), bins=10)
            result[c] = [
                {"bin": f"{bin_edges[i]:.1f}", "count": int(counts[i])}
                for i in range(len(counts))
            ]
        return {"columns": numeric_cols, "histograms": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/correlation")
def get_correlation(request: VisualizeRequest):
    file_path = os.path.join(UPLOAD_DIR, request.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        df = pd.read_csv(file_path) if file_path.endswith('.csv') else pd.read_excel(file_path)
        numeric_df = df.select_dtypes(include=[np.number])

        if numeric_df.shape[1] < 2:
            return {"error": "Need at least 2 numeric columns for correlation"}

        corr = numeric_df.corr().round(3)
        columns = corr.columns.tolist()

        # Format as array of {x, y, value} for heatmap
        heatmap_data = []
        for i, row_name in enumerate(columns):
            for j, col_name in enumerate(columns):
                heatmap_data.append({
                    "x": col_name,
                    "y": row_name,
                    "value": float(corr.iloc[i, j])
                })

        return {
            "columns": columns,
            "correlation_matrix": corr.to_dict(),
            "heatmap_data": heatmap_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/feature-importance")
def get_feature_importance(request: VisualizeRequest):
    """Get feature importance from a saved model."""
    model_path = os.path.join("saved_models", request.filename)
    if not os.path.exists(model_path):
        raise HTTPException(status_code=404, detail="Model file not found")

    try:
        import joblib
        model = joblib.load(model_path)

        importance_data = []

        if hasattr(model, "feature_importances_"):
            importances = model.feature_importances_
            features = [f"Feature {i}" for i in range(len(importances))]
            importance_data = [
                {"feature": f, "importance": round(float(imp), 4)}
                for f, imp in sorted(zip(features, importances), key=lambda x: x[1], reverse=True)
            ]
        elif hasattr(model, "coef_"):
            coefs = np.abs(model.coef_)
            if coefs.ndim > 1:
                coefs = coefs[0]
            features = [f"Feature {i}" for i in range(len(coefs))]
            importance_data = [
                {"feature": f, "importance": round(float(c), 4)}
                for f, c in sorted(zip(features, coefs), key=lambda x: x[1], reverse=True)
            ]

        return {"feature_importance": importance_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

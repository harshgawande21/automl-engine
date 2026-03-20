from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import pandas as pd
import os

router = APIRouter(
    prefix="/compare",
    tags=["compare"],
)

UPLOAD_DIR = "uploads"

class CompareRequest(BaseModel):
    filename: str
    target_column: str
    model_types: List[str]

@router.post("/")
def compare_models(request: CompareRequest):
    """Train multiple models on the same dataset and return side-by-side comparison."""
    file_path = os.path.join(UPLOAD_DIR, request.filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        from preprocessing.cleaning import clean_data
        from preprocessing.encoding import encode_features
        from backend.routers.train import MODEL_MAP, CLUSTERING_MAP

        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        df = clean_data(df)
        df = encode_features(df)

        comparison_results = []

        for model_type in request.model_types:
            try:
                if model_type in CLUSTERING_MAP:
                    X = df.drop(columns=[request.target_column], errors='ignore')
                    X = X.select_dtypes(include=['number'])
                    model_wrapper = CLUSTERING_MAP[model_type](3)
                    results = model_wrapper.train(X)
                    category = "clustering"
                elif model_type in MODEL_MAP:
                    model_wrapper = MODEL_MAP[model_type]()
                    results = model_wrapper.train(df, request.target_column)
                    category = "classification" if model_type in [
                        'logistic_regression', 'svm', 'random_forest', 'xgboost', 'naive_bayes'
                    ] else "regression"
                else:
                    continue

                comparison_results.append({
                    "model_type": model_type,
                    "category": category,
                    "results": results,
                    "status": "success"
                })
            except Exception as model_error:
                comparison_results.append({
                    "model_type": model_type,
                    "status": "failed",
                    "error": str(model_error)
                })

        return {"comparison": comparison_results, "total_models": len(comparison_results)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

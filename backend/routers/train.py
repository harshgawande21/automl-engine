from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import os
import joblib
from preprocessing.cleaning import clean_data
from preprocessing.encoding import encode_features
from models.classification.logistic_regression import LogisticRegressionModel
from models.classification.svm import SVMClassifier
from models.classification.random_forest import RandomForestClassifierModel
from models.classification.xgboost_classifier import XGBoostClassifierModel
from models.classification.naive_bayes import NaiveBayesClassifierModel
from models.regression.linear_regression import LinearRegressionModel
from models.regression.ridge_regression import RidgeRegressionModel
from models.regression.lasso_regression import LassoRegressionModel
from models.regression.xgboost_regression import XGBoostRegressionModel
from models.clustering.kmeans import KMeansClusteringModel
from models.clustering.dbscan import DBSCANClusteringModel
from models.clustering.hierarchical import HierarchicalClusteringModel

router = APIRouter(
    prefix="/train",
    tags=["train"],
)

class TrainRequest(BaseModel):
    filename: str
    target_column: str = ""
    model_type: str
    n_clusters: int = 3

UPLOAD_DIR = "uploads"

MODEL_MAP = {
    # Classification
    'logistic_regression': lambda: LogisticRegressionModel(),
    'svm': lambda: SVMClassifier(),
    'random_forest': lambda: RandomForestClassifierModel(),
    'xgboost': lambda: XGBoostClassifierModel(),
    'naive_bayes': lambda: NaiveBayesClassifierModel(),
    # Regression
    'linear_regression': lambda: LinearRegressionModel(),
    'ridge_regression': lambda: RidgeRegressionModel(),
    'lasso_regression': lambda: LassoRegressionModel(),
    'xgboost_regression': lambda: XGBoostRegressionModel(),
}

CLUSTERING_MAP = {
    'kmeans': lambda n: KMeansClusteringModel(n_clusters=n),
    'dbscan': lambda n: DBSCANClusteringModel(),
    'hierarchical': lambda n: HierarchicalClusteringModel(n_clusters=n),
}

CLASSIFICATION_MODELS = ['logistic_regression', 'svm', 'random_forest', 'xgboost', 'naive_bayes']
REGRESSION_MODELS = ['linear_regression', 'ridge_regression', 'lasso_regression', 'xgboost_regression']

@router.post("/")
def train_model(request: TrainRequest):
    file_path = os.path.join(UPLOAD_DIR, request.filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found. Please upload a file first.")

    try:
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        df = clean_data(df)
        df = encode_features(df)

        is_clustering = request.model_type in CLUSTERING_MAP

        if is_clustering:
            if request.target_column:
                X = df.drop(columns=[request.target_column], errors='ignore')
            else:
                X = df.select_dtypes(include=['number'])

            model_wrapper = CLUSTERING_MAP[request.model_type](request.n_clusters)
            results = model_wrapper.train(X)
            model = model_wrapper.model

            models_dir = "saved_models"
            os.makedirs(models_dir, exist_ok=True)
            model_filename = f"{request.filename}_{request.model_type}.joblib"
            joblib.dump(model, os.path.join(models_dir, model_filename))

            model_category = "clustering"
        else:
            if not request.target_column:
                raise HTTPException(status_code=400, detail="Target column is required for supervised models.")

            if request.target_column not in df.columns:
                raise HTTPException(status_code=400, detail=f"Target column '{request.target_column}' not found")

            if request.model_type not in MODEL_MAP:
                raise HTTPException(status_code=400, detail=f"Unsupported model type: {request.model_type}")

            model_wrapper = MODEL_MAP[request.model_type]()
            results = model_wrapper.train(df, request.target_column)
            model = model_wrapper.model

            models_dir = "saved_models"
            os.makedirs(models_dir, exist_ok=True)
            model_filename = f"{request.filename}_{request.model_type}.joblib"
            joblib.dump(model, os.path.join(models_dir, model_filename))

            if request.model_type in CLASSIFICATION_MODELS:
                model_category = "classification"
            else:
                model_category = "regression"

        return {
            "status": "success",
            "model_type": request.model_type,
            "model_category": model_category,
            "results": results,
            "model_path": model_filename
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

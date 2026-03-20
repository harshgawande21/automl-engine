from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import os
import joblib

router = APIRouter(
    prefix="/predict",
    tags=["predict"],
)

class PredictRequest(BaseModel):
    model_filename: str
    features: dict

MODELS_DIR = "saved_models"

@router.post("/")
def predict_model(request: PredictRequest):
    model_path = os.path.join(MODELS_DIR, request.model_filename)
    
    if not os.path.exists(model_path):
        raise HTTPException(status_code=404, detail="Model not found")
        
    try:
        model = joblib.load(model_path)
        
        # Convert features dict to DataFrame
        df = pd.DataFrame([request.features])
        
        # Make prediction
        prediction = model.predict(df)
        
        return {"prediction": prediction.tolist()}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

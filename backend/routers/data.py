from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import pandas as pd
import numpy as np
from pathlib import Path

router = APIRouter(
    prefix="/data",
    tags=["data"],
)

UPLOAD_DIR = "uploads"
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        if file.filename.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(file_path)
        else:
            return {"filename": file.filename, "status": "Uploaded but format not previewed"}

        return {
            "filename": file.filename,
            "status": "success",
            "columns": df.columns.tolist(),
            "shape": list(df.shape),
            "preview": df.head(10).to_dict(orient="records"),
            "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/preview")
def preview_data(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        # Basic statistics
        stats = {}
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        for col in numeric_cols:
            stats[col] = {
                "mean": round(float(df[col].mean()), 4),
                "std": round(float(df[col].std()), 4),
                "min": round(float(df[col].min()), 4),
                "max": round(float(df[col].max()), 4),
                "median": round(float(df[col].median()), 4)
            }

        null_counts = df.isnull().sum().to_dict()
        null_counts = {k: int(v) for k, v in null_counts.items()}

        return {
            "filename": filename,
            "shape": list(df.shape),
            "columns": df.columns.tolist(),
            "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
            "null_counts": null_counts,
            "numeric_columns": numeric_cols,
            "categorical_columns": df.select_dtypes(exclude=[np.number]).columns.tolist(),
            "statistics": stats,
            "preview": df.head(10).fillna("").to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

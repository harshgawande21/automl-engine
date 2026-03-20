import numpy as np
from sqlalchemy.orm import Session
from fastapi import UploadFile
from app.utils.file_handler import save_upload, load_dataframe, delete_file, list_files
from app.database import crud
from app.core.config import UPLOAD_DIR


async def upload_dataset(db: Session, file: UploadFile, user_id: str = None) -> dict:
    file_path = await save_upload(file)

    df = load_dataframe(file.filename)
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    ds = crud.create_dataset(
        db,
        filename=file.filename,
        original_name=file.filename,
        size_mb=round(len(df.to_csv(index=False).encode()) / (1024 * 1024), 2),
        rows=len(df),
        columns=len(df.columns),
        dtypes={col: str(dtype) for col, dtype in df.dtypes.items()},
        uploaded_by=user_id,
    )

    return {
        "id": ds.id,
        "filename": ds.filename,
        "shape": [ds.rows, ds.columns],
        "columns": df.columns.tolist(),
        "dtypes": ds.dtypes,
        "preview": df.head(10).fillna("").to_dict(orient="records"),
    }


def preview_dataset(filename: str) -> dict:
    df = load_dataframe(filename)
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    stats = {}
    for col in numeric_cols:
        stats[col] = {
            "mean": round(float(df[col].mean()), 4),
            "std": round(float(df[col].std()), 4),
            "min": round(float(df[col].min()), 4),
            "max": round(float(df[col].max()), 4),
            "median": round(float(df[col].median()), 4),
        }

    return {
        "filename": filename,
        "shape": list(df.shape),
        "columns": df.columns.tolist(),
        "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
        "null_counts": {k: int(v) for k, v in df.isnull().sum().to_dict().items()},
        "numeric_columns": numeric_cols,
        "categorical_columns": df.select_dtypes(exclude=[np.number]).columns.tolist(),
        "statistics": stats,
        "preview": df.head(10).fillna("").to_dict(orient="records"),
    }


def get_all_datasets(db: Session) -> list:
    return [
        {"id": d.id, "filename": d.filename, "size_mb": d.size_mb, "rows": d.rows, "columns": d.columns, "status": d.status}
        for d in crud.get_datasets(db)
    ]


def remove_dataset(db: Session, dataset_id: str) -> dict:
    ds = crud.get_dataset_by_id(db, dataset_id)
    if ds:
        delete_file(ds.filename)
        crud.delete_dataset(db, dataset_id)
    return {"message": "Dataset deleted"}

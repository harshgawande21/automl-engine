import os
import shutil
import pandas as pd
from pathlib import Path
from fastapi import UploadFile, HTTPException
from app.core.config import UPLOAD_DIR, MAX_UPLOAD_SIZE_MB
from app.utils.validators import validate_file_extension


async def save_upload(file: UploadFile) -> str:
    """Save an uploaded file to the datasets directory. Returns the file path."""
    validate_file_extension(file.filename)

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(500, f"Failed to save file: {e}")

    # Size check
    size_mb = os.path.getsize(file_path) / (1024 * 1024)
    if size_mb > MAX_UPLOAD_SIZE_MB:
        os.remove(file_path)
        raise HTTPException(400, f"File exceeds max size of {MAX_UPLOAD_SIZE_MB} MB")

    return file_path


def load_dataframe(filename: str) -> pd.DataFrame:
    """Load a file from datasets/ into a DataFrame."""
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(404, f"File '{filename}' not found")

    ext = Path(filename).suffix.lower()
    if ext == ".csv":
        return pd.read_csv(file_path)
    elif ext in (".xls", ".xlsx"):
        return pd.read_excel(file_path)
    elif ext == ".json":
        return pd.read_json(file_path)
    elif ext == ".parquet":
        return pd.read_parquet(file_path)
    else:
        raise HTTPException(400, f"Unsupported extension: {ext}")


def delete_file(filename: str) -> None:
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)


def list_files(directory: str = UPLOAD_DIR) -> list:
    if not os.path.exists(directory):
        return []
    return [
        {
            "name": f,
            "size_mb": round(os.path.getsize(os.path.join(directory, f)) / (1024 * 1024), 2),
            "extension": Path(f).suffix,
        }
        for f in os.listdir(directory)
        if os.path.isfile(os.path.join(directory, f))
    ]

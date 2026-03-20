from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import json
import os
from datetime import datetime

router = APIRouter(
    prefix="/history",
    tags=["history"],
)

HISTORY_FILE = "analysis_history.json"

class HistoryEntry(BaseModel):
    filename: str
    model_type: str
    model_category: str
    target_column: str = ""
    accuracy: Optional[float] = None
    mse: Optional[float] = None
    r2: Optional[float] = None
    silhouette: Optional[float] = None

def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    return []

def save_history(history):
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)

@router.get("/")
def get_history():
    return {"history": load_history()}

@router.post("/")
def add_history(entry: HistoryEntry):
    history = load_history()
    record = {
        "id": len(history) + 1,
        "timestamp": datetime.now().isoformat(),
        "filename": entry.filename,
        "model_type": entry.model_type,
        "model_category": entry.model_category,
        "target_column": entry.target_column,
    }

    if entry.accuracy is not None:
        record["accuracy"] = round(entry.accuracy, 4)
    if entry.mse is not None:
        record["mse"] = round(entry.mse, 4)
    if entry.r2 is not None:
        record["r2"] = round(entry.r2, 4)
    if entry.silhouette is not None:
        record["silhouette"] = round(entry.silhouette, 4)

    history.append(record)
    save_history(history)
    return {"status": "saved", "record": record}

@router.delete("/")
def clear_history():
    save_history([])
    return {"status": "cleared"}

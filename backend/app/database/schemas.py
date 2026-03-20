from pydantic import BaseModel, EmailStr
from typing import Optional, Any, Dict, List
from datetime import datetime


# ── Auth ─────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    is_active: bool

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None


# ── Data ─────────────────────────────────────────────
class DatasetResponse(BaseModel):
    id: str
    filename: str
    size_mb: Optional[float]
    rows: Optional[int]
    columns: Optional[int]
    status: str
    created_at: Optional[datetime]

class PreprocessRequest(BaseModel):
    filename: str
    missing_strategy: str = "mean"
    encoding_strategy: str = "onehot"
    scaling_strategy: str = "standard"
    outlier_strategy: str = "none"


# ── Model ────────────────────────────────────────────
class TrainRequest(BaseModel):
    filename: str
    target_column: str = ""
    model_type: str
    task_type: str = "classification"
    test_size: float = 0.2
    n_clusters: int = 3
    hyperparameters: Optional[Dict[str, Any]] = None

class ModelResponse(BaseModel):
    id: str
    name: Optional[str]
    model_type: str
    task_type: Optional[str]
    metrics: Optional[Dict[str, Any]]
    status: str
    created_at: Optional[datetime]

class HyperparamRequest(BaseModel):
    filename: str
    target_column: str
    model_type: str
    param_grid: Dict[str, List[Any]]
    search_strategy: str = "grid"
    cv_folds: int = 5


# ── Prediction ───────────────────────────────────────
class PredictRequest(BaseModel):
    model_id: str
    features: Dict[str, Any]

class PredictBatchRequest(BaseModel):
    model_id: str
    filename: str

class PredictionResponse(BaseModel):
    id: str
    prediction: Any
    confidence: Optional[float]
    latency_ms: Optional[float]


# ── Monitoring ───────────────────────────────────────
class DriftRequest(BaseModel):
    model_id: str
    reference_filename: str
    current_filename: str

class HealthResponse(BaseModel):
    api: Dict[str, Any]
    cpu: Dict[str, Any]
    memory: Dict[str, Any]
    storage: Dict[str, Any]


# ── Explainability ───────────────────────────────────
class ExplainRequest(BaseModel):
    model_id: str
    features: Optional[Dict[str, Any]] = None
    method: str = "shap"
    num_samples: int = 100

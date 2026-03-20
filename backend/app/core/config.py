import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# ── Paths ────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # backend/
UPLOAD_DIR = os.getenv("UPLOAD_DIR", str(BASE_DIR / "datasets"))
SAVED_MODELS_DIR = os.getenv("SAVED_MODELS_DIR", str(BASE_DIR / "saved_models"))
LOGS_DIR = os.getenv("LOGS_DIR", str(BASE_DIR / "logs"))

# Ensure dirs exist
for d in (UPLOAD_DIR, SAVED_MODELS_DIR, LOGS_DIR):
    Path(d).mkdir(parents=True, exist_ok=True)

# ── App ──────────────────────────────────────────────
APP_NAME = os.getenv("APP_NAME", "AutoInsight")
APP_VERSION = os.getenv("APP_VERSION", "2.0.0")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

# ── Auth / JWT ───────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production-please")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# ── Database ─────────────────────────────────────────
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./autoinsight.db")

# ── CORS ─────────────────────────────────────────────
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
).split(",")

# ── ML Defaults ──────────────────────────────────────
DEFAULT_TEST_SIZE = float(os.getenv("DEFAULT_TEST_SIZE", "0.2"))
DEFAULT_RANDOM_STATE = int(os.getenv("DEFAULT_RANDOM_STATE", "42"))
MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "100"))

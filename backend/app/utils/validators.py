from pathlib import Path
from fastapi import HTTPException
from app.core.constants import ALLOWED_EXTENSIONS


def validate_file_extension(filename: str) -> None:
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )


def validate_target_column(df, target_column: str) -> None:
    if target_column not in df.columns:
        raise HTTPException(400, f"Target column '{target_column}' not found. Available: {list(df.columns)}")


def validate_model_type(model_type: str, valid_types: list) -> None:
    if model_type not in valid_types:
        raise HTTPException(400, f"Invalid model type '{model_type}'. Available: {valid_types}")


def validate_non_empty_dataframe(df) -> None:
    if df.empty:
        raise HTTPException(400, "Dataset is empty after loading.")


def validate_password_strength(password: str) -> None:
    if len(password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters.")
    if not any(c.isupper() for c in password):
        raise HTTPException(400, "Password must contain at least one uppercase letter.")
    if not any(c.isdigit() for c in password):
        raise HTTPException(400, "Password must contain at least one digit.")


def validate_email(email: str) -> None:
    import re
    pattern = r"^[\w\.\+\-]+@[\w\-]+\.[a-zA-Z]{2,}$"
    if not re.match(pattern, email):
        raise HTTPException(400, "Invalid email format.")

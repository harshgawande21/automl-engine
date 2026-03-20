from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.core.security import hash_password, verify_password, create_access_token
from app.database import crud
from app.utils.helpers import generate_id
from app.utils.validators import validate_email, validate_password_strength


def register_user(db: Session, name: str, email: str, password: str) -> dict:
    validate_email(email)
    validate_password_strength(password)

    existing = crud.get_user_by_email(db, email)
    if existing:
        raise HTTPException(400, "Email already registered")

    user = crud.create_user(
        db,
        id=generate_id(),
        name=name,
        email=email,
        hashed_password=hash_password(password),
    )
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}


def authenticate_user(db: Session, email: str, password: str) -> dict:
    user = crud.get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    if not user.is_active:
        raise HTTPException(403, "Account is deactivated")

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}}


def get_profile(db: Session, user_id: str) -> dict:
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role, "is_active": user.is_active}


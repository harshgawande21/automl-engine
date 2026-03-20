from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.database import crud
from app.core.security import hash_password


def get_user(db: Session, user_id: str) -> dict:
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role, "is_active": user.is_active}


def update_profile(db: Session, user_id: str, name: str = None, email: str = None) -> dict:
    user = crud.update_user(db, user_id, name=name, email=email)
    if not user:
        raise HTTPException(404, "User not found")
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}


def change_password(db: Session, user_id: str, old_password: str, new_password: str) -> dict:
    from app.core.security import verify_password
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    if not verify_password(old_password, user.hashed_password):
        raise HTTPException(400, "Current password is incorrect")
    crud.update_user(db, user_id, hashed_password=hash_password(new_password))
    return {"message": "Password updated successfully"}

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.schemas import RegisterRequest, LoginRequest
from app.services.auth_service import register_user, authenticate_user, get_profile
from app.core.security import get_current_user
from app.utils.response_builder import success_response

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    result = register_user(db, req.name, req.email, req.password)
    return success_response(result, "Registration successful")


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    result = authenticate_user(db, req.email, req.password)
    return result


@router.get("/profile")
def profile(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = get_profile(db, user["id"])
    return success_response(result)


@router.post("/logout")
def logout():
    return success_response(message="Logged out successfully")

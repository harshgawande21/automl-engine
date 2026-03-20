from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.schemas import UserUpdate
from app.services.user_service import get_user, update_profile, change_password
from app.core.security import get_current_user
from app.utils.response_builder import success_response

router = APIRouter(prefix="/api/users", tags=["users"])


class PasswordChange(BaseModel):
    old_password: str
    new_password: str


@router.get("/me")
def get_me(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return success_response(get_user(db, user["id"]))


@router.put("/me")
def update_me(req: UserUpdate, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = update_profile(db, user["id"], name=req.name, email=req.email)
    return success_response(result, "Profile updated")


@router.put("/me/password")
def change_my_password(req: PasswordChange, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = change_password(db, user["id"], req.old_password, req.new_password)
    return success_response(result)

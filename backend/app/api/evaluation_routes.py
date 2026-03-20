from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services.analytics_service import get_analytics_dashboard, get_model_comparison
from app.core.security import get_current_user
from app.utils.response_builder import success_response

router = APIRouter(prefix="/api/evaluation", tags=["evaluation"])


@router.get("/dashboard")
def analytics_dashboard(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = get_analytics_dashboard(db)
    return success_response(result)


@router.get("/compare")
def compare_models(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = get_model_comparison(db)
    return success_response(result)

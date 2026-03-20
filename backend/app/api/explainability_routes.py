from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.schemas import ExplainRequest
from app.services.explainability_service import explain_shap, explain_lime, explain_feature_importance
from app.core.security import get_current_user
from app.utils.response_builder import success_response

router = APIRouter(prefix="/api/explainability", tags=["explainability"])


@router.post("/shap")
def shap(req: ExplainRequest, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = explain_shap(db, req.model_id, features=req.features, num_samples=req.num_samples)
    return success_response(result)


@router.post("/lime")
def lime(req: ExplainRequest, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = explain_lime(db, req.model_id, features=req.features or {})
    return success_response(result)


@router.get("/feature-importance/{model_id}")
def feature_importance(model_id: str, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = explain_feature_importance(db, model_id)
    return success_response(result)

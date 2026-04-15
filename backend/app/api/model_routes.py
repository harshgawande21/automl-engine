from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.schemas import TrainRequest, HyperparamRequest
from app.services.training_service import train_model, tune_model, evaluate_with_cv
from app.services.smart_training_service import smart_train
from app.services.model_service import get_all_models, get_model_detail, delete_model
from app.core.security import get_current_user
from app.utils.response_builder import success_response

router = APIRouter(prefix="/api/models", tags=["models"])


@router.post("/smart-train")
def smart_train_endpoint(
    filename: str,
    target_column: str = None,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """One-click smart training — auto-detects everything."""
    result = smart_train(db, filename=filename, user_id=user["id"], target_column=target_column)
    return success_response(result, "Model trained successfully")


@router.post("/train")
def train(req: TrainRequest, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = train_model(
        db, req.filename, req.target_column, req.model_type,
        task_type=req.task_type, test_size=req.test_size,
        n_clusters=req.n_clusters, hyperparameters=req.hyperparameters,
        user_id=user["id"],
    )
    return success_response(result, "Model trained successfully")


@router.post("/tune")
def tune(req: HyperparamRequest, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = tune_model(db, req.filename, req.target_column, req.model_type, req.param_grid, req.search_strategy, req.cv_folds)
    return success_response(result, "Tuning complete")


@router.post("/cross-validate")
def cross_validate(req: TrainRequest, user: dict = Depends(get_current_user)):
    result = evaluate_with_cv(req.filename, req.target_column, req.model_type)
    return success_response(result)


@router.get("/")
def list_models(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return success_response(get_all_models(db))


@router.get("/{model_id}")
def model_detail(model_id: str, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return success_response(get_model_detail(db, model_id))


@router.delete("/{model_id}")
def remove_model(model_id: str, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return success_response(delete_model(db, model_id))

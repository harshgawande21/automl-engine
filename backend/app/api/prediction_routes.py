from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.schemas import PredictRequest
from app.services.prediction_service import predict_single, predict_batch, get_prediction_history
from app.core.security import get_current_user
from app.utils.response_builder import success_response

router = APIRouter(prefix="/api/predictions", tags=["predictions"])


@router.post("/single")
def single(req: PredictRequest, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = predict_single(db, req.model_id, req.features, user_id=user["id"])
    return success_response(result)


@router.post("/batch")
def batch(model_id: str, file: UploadFile = File(...), user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    from app.utils.file_handler import save_upload
    import asyncio
    # Save file first
    loop = asyncio.get_event_loop()
    loop.run_until_complete(save_upload(file))
    result = predict_batch(db, model_id, file.filename, user_id=user["id"])
    return success_response(result)


@router.get("/history")
def history(model_id: str = None, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = get_prediction_history(db, model_id=model_id)
    return success_response(result)

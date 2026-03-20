from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.schemas import PreprocessRequest
from app.services.data_service import upload_dataset, preview_dataset, get_all_datasets, remove_dataset
from app.services.preprocessing_service import preprocess_dataset
from app.core.security import get_current_user
from app.utils.response_builder import success_response

router = APIRouter(prefix="/api/data", tags=["data"])


@router.post("/upload")
async def upload(file: UploadFile = File(...), user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = await upload_dataset(db, file, user_id=user["id"])
    return success_response(result, "File uploaded successfully")


@router.post("/preview")
def preview(filename: str, user: dict = Depends(get_current_user)):
    result = preview_dataset(filename)
    return success_response(result)


@router.get("/list")
def list_datasets(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = get_all_datasets(db)
    return success_response(result)


@router.delete("/{dataset_id}")
def delete_dataset(dataset_id: str, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = remove_dataset(db, dataset_id)
    return success_response(result)


@router.post("/process")
def process(req: PreprocessRequest, user: dict = Depends(get_current_user)):
    result = preprocess_dataset(
        req.filename,
        missing=req.missing_strategy,
        encoding=req.encoding_strategy,
        scaling=req.scaling_strategy,
        outlier=req.outlier_strategy,
    )
    return success_response(result, "Data processed successfully")

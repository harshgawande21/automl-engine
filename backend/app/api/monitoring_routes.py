from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.schemas import DriftRequest
from app.services.monitoring_service import get_system_health, check_drift, get_monitoring_dashboard
from app.core.security import get_current_user
from app.utils.response_builder import success_response

router = APIRouter(prefix="/api/monitoring", tags=["monitoring"])


@router.get("/health")
def health():
    return success_response(get_system_health())


@router.post("/drift")
def drift(req: DriftRequest, user: dict = Depends(get_current_user)):
    result = check_drift(req.reference_filename, req.current_filename)
    return success_response(result)


@router.get("/dashboard")
def dashboard(model_id: str = None, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    result = get_monitoring_dashboard(db, model_id)
    return success_response(result)


@router.get("/latency")
def latency(model_id: str = None, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    from app.monitoring.latency_tracking import get_latency_stats
    result = get_latency_stats(db, model_id)
    return success_response(result)


@router.get("/errors")
def errors(model_id: str = None, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    from app.database import crud
    logs = crud.get_monitoring_logs(db, model_id=model_id, limit=50)
    error_logs = [{"id": l.id, "type": l.metric_type, "value": l.value, "level": l.alert_level} for l in logs if l.alert_level in ("error", "critical")]
    return success_response(error_logs)

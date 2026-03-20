from sqlalchemy.orm import Session
from typing import Optional, List
from app.database.models import User, Dataset, TrainedModel, Prediction, MonitoringLog, ActivityLog
from app.utils.helpers import generate_id


# ── User CRUD ────────────────────────────────────────
def create_user(db: Session, id: str, name: str, email: str, hashed_password: str, role: str = "user") -> User:
    user = User(id=id, name=name, email=email, hashed_password=hashed_password, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def update_user(db: Session, user_id: str, **kwargs) -> Optional[User]:
    user = get_user_by_id(db, user_id)
    if user:
        for k, v in kwargs.items():
            if v is not None:
                setattr(user, k, v)
        db.commit()
        db.refresh(user)
    return user


# ── Dataset CRUD ─────────────────────────────────────
def create_dataset(db: Session, **kwargs) -> Dataset:
    ds = Dataset(id=generate_id(), **kwargs)
    db.add(ds)
    db.commit()
    db.refresh(ds)
    return ds


def get_datasets(db: Session, skip: int = 0, limit: int = 50) -> List[Dataset]:
    return db.query(Dataset).order_by(Dataset.created_at.desc()).offset(skip).limit(limit).all()


def get_dataset_by_id(db: Session, dataset_id: str) -> Optional[Dataset]:
    return db.query(Dataset).filter(Dataset.id == dataset_id).first()


def delete_dataset(db: Session, dataset_id: str) -> bool:
    ds = get_dataset_by_id(db, dataset_id)
    if ds:
        db.delete(ds)
        db.commit()
        return True
    return False


# ── TrainedModel CRUD ────────────────────────────────
def create_trained_model(db: Session, **kwargs) -> TrainedModel:
    model = TrainedModel(id=generate_id(), **kwargs)
    db.add(model)
    db.commit()
    db.refresh(model)
    return model


def get_trained_models(db: Session, skip: int = 0, limit: int = 50) -> List[TrainedModel]:
    return db.query(TrainedModel).order_by(TrainedModel.created_at.desc()).offset(skip).limit(limit).all()


def get_trained_model_by_id(db: Session, model_id: str) -> Optional[TrainedModel]:
    return db.query(TrainedModel).filter(TrainedModel.id == model_id).first()


# ── Prediction CRUD ──────────────────────────────────
def create_prediction(db: Session, **kwargs) -> Prediction:
    pred = Prediction(id=generate_id(), **kwargs)
    db.add(pred)
    db.commit()
    db.refresh(pred)
    return pred


def get_predictions(db: Session, model_id: Optional[str] = None, skip: int = 0, limit: int = 50) -> List[Prediction]:
    q = db.query(Prediction)
    if model_id:
        q = q.filter(Prediction.model_id == model_id)
    return q.order_by(Prediction.created_at.desc()).offset(skip).limit(limit).all()


# ── Monitoring CRUD ──────────────────────────────────
def create_monitoring_log(db: Session, **kwargs) -> MonitoringLog:
    log = MonitoringLog(id=generate_id(), **kwargs)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def get_monitoring_logs(db: Session, model_id: Optional[str] = None, limit: int = 100) -> List[MonitoringLog]:
    q = db.query(MonitoringLog)
    if model_id:
        q = q.filter(MonitoringLog.model_id == model_id)
    return q.order_by(MonitoringLog.created_at.desc()).limit(limit).all()


# ── Activity Log ─────────────────────────────────────
def log_activity(db: Session, user_id: str, action: str, resource: str = "", details: str = ""):
    entry = ActivityLog(id=generate_id(), user_id=user_id, action=action, resource=resource, details=details)
    db.add(entry)
    db.commit()

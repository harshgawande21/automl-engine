from sqlalchemy import Column, String, Integer, Float, DateTime, Text, Boolean, JSON
from datetime import datetime
from app.database.db import Base


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(String, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    original_name = Column(String)
    size_mb = Column(Float)
    rows = Column(Integer)
    columns = Column(Integer)
    dtypes = Column(JSON)
    uploaded_by = Column(String)
    status = Column(String, default="ready")
    created_at = Column(DateTime, default=datetime.utcnow)


class TrainedModel(Base):
    __tablename__ = "trained_models"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    model_type = Column(String, nullable=False)
    task_type = Column(String)
    filename = Column(String, nullable=False)
    dataset_id = Column(String)
    target_column = Column(String)
    metrics = Column(JSON)
    hyperparameters = Column(JSON)
    status = Column(String, default="completed")
    training_duration = Column(Float)
    created_by = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(String, primary_key=True, index=True)
    model_id = Column(String, nullable=False)
    input_data = Column(JSON)
    result = Column(JSON)
    confidence = Column(Float)
    prediction_type = Column(String, default="single")  # single | batch
    latency_ms = Column(Float)
    created_by = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class MonitoringLog(Base):
    __tablename__ = "monitoring_logs"
    id = Column(String, primary_key=True, index=True)
    model_id = Column(String)
    metric_type = Column(String)  # drift | latency | error
    value = Column(JSON)
    alert_level = Column(String, default="info")
    created_at = Column(DateTime, default=datetime.utcnow)


class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String)
    action = Column(String)
    resource = Column(String)
    details = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

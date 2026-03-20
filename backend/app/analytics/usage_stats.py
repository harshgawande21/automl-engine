from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.models import Prediction, TrainedModel, ActivityLog


def compute_usage_stats(db: Session) -> dict:
    """Compute usage statistics."""
    predictions_per_model = (
        db.query(Prediction.model_id, func.count(Prediction.id).label("count"))
        .group_by(Prediction.model_id)
        .all()
    )

    model_usage = {mid: count for mid, count in predictions_per_model}

    most_used = max(model_usage, key=model_usage.get) if model_usage else None

    return {
        "predictions_per_model": model_usage,
        "most_used_model": most_used,
        "total_api_calls": db.query(Prediction).count(),
    }

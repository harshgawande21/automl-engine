from sqlalchemy.orm import Session
from app.database.models import Prediction


def compute_prediction_insights(db: Session) -> dict:
    """Analyze recent predictions for patterns and anomalies."""
    recent = db.query(Prediction).order_by(Prediction.created_at.desc()).limit(100).all()

    if not recent:
        return {"total_recent": 0, "avg_latency_ms": 0, "batch_count": 0, "single_count": 0}

    latencies = [p.latency_ms for p in recent if p.latency_ms]
    batch_count = sum(1 for p in recent if p.prediction_type == "batch")
    single_count = sum(1 for p in recent if p.prediction_type == "single")

    return {
        "total_recent": len(recent),
        "avg_latency_ms": round(sum(latencies) / len(latencies), 2) if latencies else 0,
        "batch_count": batch_count,
        "single_count": single_count,
        "high_confidence_count": sum(1 for p in recent if p.confidence and p.confidence > 0.9),
    }

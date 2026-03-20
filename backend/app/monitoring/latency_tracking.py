from sqlalchemy.orm import Session
from app.database.models import Prediction


def get_latency_stats(db: Session, model_id: str = None) -> dict:
    """Compute latency statistics from prediction records."""
    query = db.query(Prediction)
    if model_id:
        query = query.filter(Prediction.model_id == model_id)

    predictions = query.all()
    latencies = [p.latency_ms for p in predictions if p.latency_ms is not None]

    if not latencies:
        return {"count": 0, "avg_ms": 0, "p50_ms": 0, "p95_ms": 0, "p99_ms": 0, "max_ms": 0}

    latencies.sort()
    n = len(latencies)

    return {
        "count": n,
        "avg_ms": round(sum(latencies) / n, 2),
        "min_ms": round(min(latencies), 2),
        "p50_ms": round(latencies[int(n * 0.5)], 2),
        "p95_ms": round(latencies[int(n * 0.95)], 2),
        "p99_ms": round(latencies[min(int(n * 0.99), n - 1)], 2),
        "max_ms": round(max(latencies), 2),
    }

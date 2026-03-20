from sqlalchemy.orm import Session
from app.database.models import TrainedModel, Prediction


def get_performance_summary(db: Session, model_id: str = None) -> dict:
    """Aggregate performance metrics across trained models."""
    query = db.query(TrainedModel)
    if model_id:
        query = query.filter(TrainedModel.id == model_id)

    models = query.all()
    if not models:
        return {"total_models": 0, "avg_training_time": 0}

    durations = [m.training_duration for m in models if m.training_duration]
    accuracies = []
    for m in models:
        if m.metrics and isinstance(m.metrics, dict):
            if "accuracy" in m.metrics:
                accuracies.append(m.metrics["accuracy"])

    return {
        "total_models": len(models),
        "avg_training_time": round(sum(durations) / len(durations), 2) if durations else 0,
        "avg_accuracy": round(sum(accuracies) / len(accuracies), 4) if accuracies else None,
        "best_accuracy": round(max(accuracies), 4) if accuracies else None,
    }

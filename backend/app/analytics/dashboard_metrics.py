from sqlalchemy.orm import Session
from app.database.models import TrainedModel, Prediction, Dataset


def compute_dashboard_metrics(db: Session) -> dict:
    """Compute high-level KPI metrics for the analytics dashboard."""
    total_models = db.query(TrainedModel).count()
    total_predictions = db.query(Prediction).count()
    total_datasets = db.query(Dataset).count()

    # Average accuracy across all classification models
    models = db.query(TrainedModel).filter(TrainedModel.task_type == "classification").all()
    accuracies = [m.metrics.get("accuracy", 0) for m in models if m.metrics]
    avg_accuracy = round(sum(accuracies) / len(accuracies), 4) if accuracies else 0

    return {
        "total_models": total_models,
        "total_predictions": total_predictions,
        "total_datasets": total_datasets,
        "avg_accuracy": avg_accuracy,
    }

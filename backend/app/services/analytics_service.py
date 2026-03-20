from sqlalchemy.orm import Session
from app.analytics.dashboard_metrics import compute_dashboard_metrics
from app.analytics.usage_stats import compute_usage_stats
from app.analytics.prediction_insights import compute_prediction_insights


def get_analytics_dashboard(db: Session) -> dict:
    metrics = compute_dashboard_metrics(db)
    usage = compute_usage_stats(db)
    insights = compute_prediction_insights(db)

    return {
        "metrics": metrics,
        "usage": usage,
        "insights": insights,
    }


def get_model_comparison(db: Session) -> list:
    from app.database import crud
    models = crud.get_trained_models(db)
    return [
        {
            "id": m.id,
            "name": m.name,
            "model_type": m.model_type,
            "task_type": m.task_type,
            "metrics": m.metrics,
            "training_duration": m.training_duration,
        }
        for m in models
    ]

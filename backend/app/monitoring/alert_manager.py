from app.core.logging import logger
from app.database import crud


class AlertManager:
    """Manages alerts and notifications for model monitoring."""

    LEVELS = ("info", "warning", "error", "critical")

    def __init__(self):
        self.alerts = []

    def create_alert(self, db, model_id: str, metric_type: str, value: dict, level: str = "warning"):
        if level not in self.LEVELS:
            level = "info"

        crud.create_monitoring_log(
            db,
            model_id=model_id,
            metric_type=metric_type,
            value=value,
            alert_level=level,
        )

        alert = {"model_id": model_id, "type": metric_type, "level": level, "value": value}
        self.alerts.append(alert)
        logger.warning(f"Alert [{level}] model={model_id}: {metric_type} — {value}")
        return alert

    def get_active_alerts(self, db, model_id: str = None, limit: int = 20) -> list:
        logs = crud.get_monitoring_logs(db, model_id=model_id, limit=limit)
        return [
            {"id": l.id, "model_id": l.model_id, "type": l.metric_type, "level": l.alert_level, "value": l.value}
            for l in logs
            if l.alert_level in ("warning", "error", "critical")
        ]


alert_manager = AlertManager()

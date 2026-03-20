import psutil
from sqlalchemy.orm import Session
from app.utils.file_handler import load_dataframe
from app.monitoring.drift_detection import detect_drift
from app.monitoring.latency_tracking import get_latency_stats
from app.monitoring.performance_tracking import get_performance_summary
from app.database import crud


def get_system_health() -> dict:
    cpu = psutil.cpu_percent(interval=0.5)
    mem = psutil.virtual_memory()
    disk = psutil.disk_usage("/")

    def status(pct): return "critical" if pct > 90 else "warning" if pct > 70 else "healthy"

    return {
        "api": {"status": "healthy", "usage": cpu},
        "cpu": {"status": status(cpu), "usage": round(cpu, 1)},
        "memory": {"status": status(mem.percent), "usage": round(mem.percent, 1)},
        "storage": {"status": status(disk.percent), "usage": round(disk.percent, 1)},
    }


def check_drift(reference_file: str, current_file: str) -> dict:
    ref_df = load_dataframe(reference_file)
    cur_df = load_dataframe(current_file)
    report = detect_drift(ref_df, cur_df)

    drifted = sum(1 for v in report.values() if v.get("drift_detected"))
    overall = "critical" if drifted > len(report) / 2 else "warning" if drifted > 0 else "healthy"

    return {"status": overall, "features": report, "drifted_count": drifted, "total_features": len(report)}


def get_monitoring_dashboard(db: Session, model_id: str = None) -> dict:
    health = get_system_health()
    latency = get_latency_stats(db, model_id)
    performance = get_performance_summary(db, model_id)
    logs = crud.get_monitoring_logs(db, model_id=model_id, limit=20)

    return {
        "health": health,
        "latency": latency,
        "performance": performance,
        "recent_logs": [{"id": l.id, "type": l.metric_type, "value": l.value, "level": l.alert_level} for l in logs],
    }

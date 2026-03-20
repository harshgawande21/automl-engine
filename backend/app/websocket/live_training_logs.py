import asyncio
from app.websocket.socket_manager import manager


async def emit_training_log(model_id: str, epoch: int, total_epochs: int,
                            loss: float = None, metrics: dict = None):
    """Send a live training log update to subscribed WebSocket clients."""
    progress = round((epoch / total_epochs) * 100, 1) if total_epochs > 0 else 0

    message = {
        "type": "training_log",
        "model_id": model_id,
        "epoch": epoch,
        "total_epochs": total_epochs,
        "progress": progress,
        "loss": loss,
        "metrics": metrics or {},
    }

    await manager.broadcast(message, channel="training")


async def emit_training_complete(model_id: str, results: dict):
    """Notify clients that training is complete."""
    await manager.broadcast({
        "type": "training_complete",
        "model_id": model_id,
        "results": results,
    }, channel="training")


async def emit_alert(alert: dict):
    """Broadcast a monitoring alert."""
    await manager.broadcast({
        "type": "alert",
        **alert,
    }, channel="monitoring")

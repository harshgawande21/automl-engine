from typing import Dict, Callable, Any
from app.core.logging import logger


class WebSocketService:
    """Manages active WebSocket connections and message broadcasting."""

    def __init__(self):
        self._connections: Dict[str, Any] = {}
        self._subscribers: Dict[str, list] = {}

    async def connect(self, client_id: str, websocket):
        self._connections[client_id] = websocket
        logger.info(f"WebSocket client connected: {client_id}")

    def disconnect(self, client_id: str):
        self._connections.pop(client_id, None)
        logger.info(f"WebSocket client disconnected: {client_id}")

    async def send_to_client(self, client_id: str, message: dict):
        ws = self._connections.get(client_id)
        if ws:
            await ws.send_json(message)

    async def broadcast(self, message: dict, channel: str = "general"):
        for client_id, ws in self._connections.items():
            try:
                await ws.send_json({"channel": channel, **message})
            except Exception:
                self.disconnect(client_id)

    async def send_training_update(self, model_id: str, progress: float, status: str, details: dict = None):
        await self.broadcast({
            "type": "training_update",
            "model_id": model_id,
            "progress": progress,
            "status": status,
            "details": details or {},
        }, channel="training")


ws_service = WebSocketService()

from typing import Dict, Set
from fastapi import WebSocket


class ConnectionManager:
    """Manages WebSocket connections per channel."""

    def __init__(self):
        self._active: Dict[str, WebSocket] = {}
        self._channels: Dict[str, Set[str]] = {}

    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        self._active[client_id] = websocket

    def disconnect(self, client_id: str):
        self._active.pop(client_id, None)
        for channel in self._channels.values():
            channel.discard(client_id)

    def subscribe(self, client_id: str, channel: str):
        self._channels.setdefault(channel, set()).add(client_id)

    async def send_personal(self, client_id: str, message: dict):
        ws = self._active.get(client_id)
        if ws:
            await ws.send_json(message)

    async def broadcast(self, message: dict, channel: str = None):
        if channel and channel in self._channels:
            targets = self._channels[channel]
        else:
            targets = self._active.keys()

        for client_id in list(targets):
            ws = self._active.get(client_id)
            if ws:
                try:
                    await ws.send_json(message)
                except Exception:
                    self.disconnect(client_id)


manager = ConnectionManager()

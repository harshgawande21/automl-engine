from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websocket_service import ws_service
from app.utils.helpers import generate_id

router = APIRouter(tags=["websocket"])


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    client_id = generate_id()
    await ws_service.connect(client_id, websocket)

    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type", "echo")

            if msg_type == "subscribe":
                await ws_service.send_to_client(client_id, {"type": "subscribed", "channel": data.get("channel")})
            elif msg_type == "ping":
                await ws_service.send_to_client(client_id, {"type": "pong"})
            else:
                await ws_service.send_to_client(client_id, {"type": "echo", "data": data})
    except WebSocketDisconnect:
        ws_service.disconnect(client_id)

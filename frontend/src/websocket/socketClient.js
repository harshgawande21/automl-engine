import environment from '../config/environment';

export function createSocketClient() {
    const ws = new WebSocket(environment.WS_URL);

    ws.onopen = () => {
        console.log('[WebSocket] Connected');
    };

    ws.onclose = (event) => {
        console.log('[WebSocket] Disconnected', event.code, event.reason);
    };

    ws.onerror = (error) => {
        console.error('[WebSocket] Error', error);
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('[WebSocket] Message received:', data.type);
        } catch (err) {
            console.error('[WebSocket] Failed to parse message', err);
        }
    };

    return ws;
}

export default createSocketClient;

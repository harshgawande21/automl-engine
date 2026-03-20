import { createContext, useCallback, useEffect, useState } from 'react';
import { createSocketClient } from '../websocket/socketClient';

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const ws = createSocketClient();

        ws.onopen = () => {
            setIsConnected(true);
            setSocket(ws);
        };

        ws.onclose = () => {
            setIsConnected(false);
            setSocket(null);
        };

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = useCallback(
        (type, payload) => {
            if (socket && isConnected) {
                socket.send(JSON.stringify({ type, payload }));
            }
        },
        [socket, isConnected]
    );

    return (
        <SocketContext.Provider value={{ socket, isConnected, sendMessage }}>
            {children}
        </SocketContext.Provider>
    );
}

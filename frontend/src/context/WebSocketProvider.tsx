import { ReactNode } from 'react';
import useWebSocket from "react-use-websocket"
import { WebSocketContext } from "./WebSocketContext"
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { ServerMessage } from '../types/messages';

const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const { username } = useContext(AuthContext);
    const { sendJsonMessage, lastJsonMessage } = useWebSocket<ServerMessage>('ws://localhost?id=' + username);

    return (
        <WebSocketContext.Provider value={{ sendJsonMessage, lastMessage: lastJsonMessage }}>
            {children}
        </WebSocketContext.Provider>
    )
}

export { WebSocketProvider };
export default WebSocketProvider;
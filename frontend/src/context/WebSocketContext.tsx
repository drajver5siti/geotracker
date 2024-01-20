import { createContext } from "react";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { ServerMessage } from "../types/messages";

type ContextType = {
    sendJsonMessage: SendJsonMessage,
    lastMessage: ServerMessage | null
}

export const WebSocketContext = createContext<ContextType>({} as ContextType)
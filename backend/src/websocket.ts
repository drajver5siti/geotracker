import ws, { WebSocketServer } from 'ws';
import { Server } from 'http';
import { ClientID, Message, ServerMessage } from "./types"

let socket;
let clients: Map<ClientID, ws> = new Map();

type Handler = (from: ClientID, message: Message) => void

export const establishWS = (server: Server, handler: Handler) => {
    socket = new WebSocketServer({ server });
    socket.on('connection', (ws, msg) => {

        const url = new URL(msg.url ?? "", `http://${msg.headers.host}`)
        const id = url.searchParams.get('id');

        if (id === null) {
            return;
        }

        clients.set(id, ws);
        ws.on('message', (data) => {
            try {
                const msg = JSON.parse(data.toString());
                return handler(id, msg);
            } catch(err) {
                console.log("Incoming message is not valid json", err);
            }
        })
        ws.on('close', () => clients.delete(id));
    })
}

export const sendTestMessage = () => {
    clients.forEach((ws) => ws.send(Buffer.from(JSON.stringify({"type": "test_msg"})), { binary: false }));
}

export const broadcastMessage = (message: ServerMessage) => {
    clients.forEach(x => x.send(Buffer.from(JSON.stringify(message)), { binary: false }));
}

export const sendMessage = (clientId: string, message: ServerMessage) => {
    clients.get(clientId)?.send(Buffer.from(JSON.stringify(message)), { binary: false })
}
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { establishConnection } from './rabbitmq';
import { establishWS } from './websocket';
import { ClientID, Message } from './types';
import { MessageHandler } from './handlers/MessageHandler';
import { LocationHandler } from './handlers/LocationHandler';
import { SubscriptionHandler } from './handlers/SubscriptionHandler';

dotenv.config();

const port = process.env.PORT || 80;

const app = express();

app.use(cors());

app.use(express.json())

app.use(express.urlencoded({
    extended: false
}))

// app.use(express.static(path.join(__dirname, '../frontend')));

const availableClients: ClientID[] = [];
const handler = new MessageHandler<Message, ClientID>();

const main = async () => {
    const server = app.listen(port, () => console.log(`Listening on port ${port}.`));

    const channel = await establishConnection();
    channel.prefetch(1);

    handler.addHandler(new LocationHandler(channel, availableClients));
    handler.addHandler(new SubscriptionHandler(channel))

    establishWS(
        server,
        (from, message) => handler.handle(from, message)
    )
}

main();
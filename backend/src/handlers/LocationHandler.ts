import { ClientID, Message } from "../types";
import { BaseHandler } from "./MessageHandler";
import type { LocationMessage } from "../types";
import ampq from 'amqplib'
import { assertStream, publishToStream } from "../rabbitmq";
import { broadcastMessage } from "../websocket";

export class LocationHandler implements BaseHandler<string, Message>
{
    private channel: ampq.Channel;
    private availableClients: ClientID[];

    public constructor(channel: ampq.Channel, availableClients: ClientID[])
    {
        this.channel = channel;
        this.availableClients = availableClients;
    }

    public supports(message: Message): boolean {
        return message.type === 'location';
    }

    public async handle(from: ClientID, message: Message): Promise<void> {
        await assertStream(this.channel, from);
        publishToStream(this.channel, from, message as LocationMessage);

        const oldClient = this.availableClients.find(x => x === from);
        if (oldClient === undefined) {
            this.availableClients.push(from);
        }

        const data = this.availableClients.map(x => ({ id: x }));

        broadcastMessage({ type: 'available_trucks', data });
    }
}
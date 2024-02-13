import ampq from 'amqplib';
import { buildQueueName } from "../rabbitmq";
import { ClientID, Message, TruckMessage } from "../types";
import { sendMessage } from "../websocket";
import { BaseHandler } from "./MessageHandler";

export class SubscriptionHandler implements BaseHandler<ClientID, Message>
{
    private channel: ampq.Channel;
    private queueToClient: Map<string, Set<string>>;

    public constructor(channel: ampq.Channel) {
        this.channel = channel;
        this.queueToClient = new Map();
    }

    public supports (message: Message): boolean {
        return message.type === 'subscribe' || message.type === 'unsubscribe';
    }

    public async handle(from: ClientID, message: Message): Promise<void> {
        if (message.type === 'subscribe') {
            const queueName = buildQueueName(message.target);

            if (this.queueToClient.has(queueName)) {
                this.queueToClient.get(queueName)?.add(from);
                return;
            }

            this.queueToClient.set(queueName, new Set([from]));
            this.channel.consume(
                queueName,
                (msg) => {
                    if (msg === null) return
                        const msgContent = JSON.parse(String(msg.content));
                        const packet: TruckMessage = {
                            type: 'truck',
                            data: {
                                id: message.target,
                                lat: msgContent.lat,
                                lng: msgContent.lng
                            }
                        }

                    this.queueToClient
                        .get(queueName)
                        ?.forEach(x => sendMessage(x, packet));

                    this.channel.ack(msg);
                },
            )
            return;
        }

        if (message.type === 'unsubscribe') {
            console.log("UnSUB", from);
            console.log(this.queueToClient);
            if (message.target === 'all') {
                this.queueToClient.forEach(q => {
                    q.delete(from);
                })

                // Also remove the queue
                this.queueToClient.delete(buildQueueName(from))
                console.log(this.queueToClient);
                return;
            }

            const queueName = buildQueueName(message.target);
            this.queueToClient.get(queueName)?.delete(from);
            return;
        }
    }
}
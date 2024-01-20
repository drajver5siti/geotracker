import { ClientID, Message, TruckMessage } from "../types";
import { sendMessage } from "../websocket";
import { BaseHandler } from "./MessageHandler";
import ampq from 'amqplib';

export class SubscriptionHandler implements BaseHandler<ClientID, Message>
{
    private channel: ampq.Channel;
    private queueToClient: Map<string, Set<string>>;

    private consumer: ampq.Replies.Consume | null = null;

    public constructor(channel: ampq.Channel) {
        this.channel = channel;
        this.queueToClient = new Map();
    }

    public supports (message: Message): boolean {
        return message.type === 'subscribe' || message.type === 'unsubscribe';
    }

    public async handle(from: ClientID, message: Message): Promise<void> {

        /**
         * If subscribe,
         * queueName = truck_{message.target}
         * add the from to queueToClient[queueName]
         * channel.Consume(send_to_everyone inside queueToClient[queueName])
         */

        if (message.type === 'subscribe') {
            const queueName = 'truck_' + message.target;

            if (this.queueToClient.has(queueName)) {
                this.queueToClient.get(queueName)?.add(from);
                return;
            }

            this.queueToClient.set(queueName, new Set([from]));
            this.channel.consume(
                queueName,
                (msg) => {
                    if (msg === null) return
                        console.log("Consume message", { queueName, cl: this.queueToClient });
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
                },
                {
                    fromOffset: 'last'
                }
            )
        }



        // if (message.type === 'subscribe') {
        //     const queueName = 'truck_' + message.target;
        //     if (this.queueToClient.has(queueName)) {
        //         this.queueToClient.get(queueName)?.add(message.target);
        //     } else {
        //         this.queueToClient.set(queueName, new Set([message.target]));
        //         // When first connecting, always get the last message from the queue
        //         // Because the truck may be standing still and won't emit a location immediatly
        //         sendMessage(from.id, )



        //         const consumer = await this.channel.consume(
        //             queueName,
        //             (msg) => {
        //                 if (msg === null) return
        //                 const msgContent = JSON.parse(String(msg.content));
        //                 const packet: TruckMessage = {
        //                     type: 'truck',
        //                     data: {
        //                         id: from.id,
        //                         lat: msgContent.lat,
        //                         lng: msgContent.lng
        //                     }
        //                 }

        //                 this.queueToClient
        //                     .get(queueName)
        //                     ?.forEach(x => sendMessage(x, packet))
                            
        //                 this.channel.ack(msg);
        //             }
        //         )
        //         this.consumer = consumer;
        //     }
        //     return;
        // }

        if (message.type === 'unsubscribe') {
            const queueName = 'truck_' + message.target;

            if (! this.queueToClient.has(queueName)) {
                return;
            }

            this.queueToClient.get(queueName)?.delete(message.target);

            if (this.queueToClient.get(queueName)?.size === 0) {
                this.queueToClient.delete(queueName);
                if (this.consumer) {
                    this.channel.cancel(this.consumer?.consumerTag);
                }
            }

            return;
        }
    }
}
import ampq from 'amqplib';
import { ClientID, LocationMessage } from './types';

const EXCHANGE = 'truck_locations';

export const buildQueueName = (id: string) => 'truck_' + id; 

const streamSubscribers = new Map<string, Set<string>>();

export const establishConnection = async () => {
    const connection = await ampq.connect({
        protocol: 'amqp',
        hostname: 'rabbitmq',
        port: 5672,
        heartbeat: 30
    });

    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE, 'direct', { durable: true });
    return channel;
} 

export const assertStream = async (channel: ampq.Channel, client: ClientID) => {
    const queue = await channel.assertQueue(
        buildQueueName(client),
        { 
            durable: true, 
            exclusive: false, 
            autoDelete: false, 
            arguments: { 'x-queue-type': 'stream' } 
        }
    )

    await channel.bindQueue(
        queue.queue,
        EXCHANGE,
        buildQueueName(client)
    )
}

export const publishToStream = (channel: ampq.Channel, to: ClientID, message: LocationMessage) => {
    return channel.publish(
        EXCHANGE, 
        buildQueueName(to), 
        Buffer.from(JSON.stringify(message.data)),
    )
}

// export const subscribeToStream = (channel: ampq.Channel, from: ClientID, to: ClientID) => {
//     return channel.consume(

//     )
// }

export const unsubscribeFromStream = (channel: ampq.Channel) => {
    
}
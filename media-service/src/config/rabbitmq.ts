import amqplib, { Channel, Connection } from 'amqplib';
import logger from '../utils/logger';
import { config } from '../config';

let connection: Connection | null = null;
let channel: Channel | null = null;

const EXCHANGE_NAME = config.rabbitmq.exchange_name;

async function connectRabbitMQ(): Promise<Channel | null> {
    try {
        connection = await amqplib.connect(process.env.RABBITMQ_URL as string);
        channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
        logger.info('Connected to RabbitMQ');
        return channel;
    } catch (error) {
        logger.error(`Error connecting to RabbitMQ: ${(error as Error).message}`);
        return null;
    }
}

async function publishEvent(routingKey: string, message: any): Promise<void> {
    if (!channel) {
        await connectRabbitMQ();
    }
    if (channel) {
        channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(message)));
        logger.info(`Published message to RabbitMQ: ${routingKey}`);
    } else {
        logger.error('Failed to publish message: No active RabbitMQ channel.');
    }
}

async function consumeEvent(routingKey: string, callback: (msg: any) => void): Promise<void> {
    try {
        if (!channel) {
            await connectRabbitMQ();
        }

        if (channel) {
            // Create a temporary, exclusive queue that will automatically be deleted when the connection is closed
            const queue = await channel.assertQueue('', { exclusive: true });
            
            await channel.bindQueue(queue.queue, EXCHANGE_NAME, routingKey);

            await channel.consume(queue.queue, (msg) => {
                if (msg) {
                    const messageContent = JSON.parse(msg.content.toString());
                    callback(messageContent);
                    channel?.ack(msg);
                }
            });

            logger.info(`Subscribed to event: ${routingKey}`);
        }
    } catch (error) {
        logger.error(`Error consuming message: ${(error as Error).message}`);
    }
}

export { connectRabbitMQ, publishEvent ,consumeEvent };

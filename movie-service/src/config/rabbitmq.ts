import amqplib, { Channel, Connection } from 'amqplib';
import logger from '../utils/logger';

let connection: Connection | null = null;
let channel: Channel | null = null;

const EXCHANGE_NAME = 'new_exchange_name';

async function connectRabbitMQ(): Promise<Channel | null> {
    try {
        connection = await amqplib.connect(process.env.RABBITMQ_URL as string);
        channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: false });
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

export { connectRabbitMQ, publishEvent };

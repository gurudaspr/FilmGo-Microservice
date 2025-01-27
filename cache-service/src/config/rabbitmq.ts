import amqp, { Channel, Connection } from 'amqplib';
import logger from '../utils/logger';
import { connectRedis } from './redis'
import { config } from '../config';

const CACHE_QUEUE = 'cache_operations';
const MOVIE_UPDATES_QUEUE = 'movie_updates';
const CACHE_TTL = 3600; // 1 hour

let channel: Channel | null = null;
let connection: Connection | null = null;

type CacheOperation = {
    action: 'GET' | 'SET' | 'DELETE';
    key: string;
    value?: any;
    requestId?: string;
  }
  
  type CacheResponse = {
    requestId: string;
    key: string;
    value: any;
    hit: boolean;
  }

export const handleCacheOperation = async (operation: CacheOperation): Promise<void> => {
  if (!channel) throw new Error('Channel not initialized');
  
  const redis = await connectRedis();
  const { action, key, value, requestId } = operation;

  try {
    switch (action) {
      case 'GET':
        const cachedValue = await redis.get(key);
        const response: CacheResponse = {
          requestId: requestId!,
          key,
          value: cachedValue ? JSON.parse(cachedValue) : null,
          hit: !!cachedValue
        };
        
        await channel.sendToQueue(
          MOVIE_UPDATES_QUEUE,
          Buffer.from(JSON.stringify(response))
        );
        break;

      case 'SET':
        await redis.set(key, JSON.stringify(value), 'EX', CACHE_TTL);
        logger.info(`Cache set for key: ${key}`);
        break;

      case 'DELETE':
        await redis.del(key);
        logger.info(`Cache invalidated for key: ${key}`);
        break;
    }
  } catch (error) {
    logger.error(`Error handling cache operation: ${action}`, error);
    throw error;
  }
};

export const setupCacheConsumer = async (ch: Channel): Promise<void> => {
  await ch.assertQueue(CACHE_QUEUE, { durable: true });
  await ch.assertQueue(MOVIE_UPDATES_QUEUE, { durable: true });

  ch.consume(CACHE_QUEUE, async (msg) => {
    if (!msg) return;

    try {
      const operation: CacheOperation = JSON.parse(msg.content.toString());
      await handleCacheOperation(operation);
      ch.ack(msg);
    } catch (error) {
      logger.error('Failed to process message:', error);
      ch.nack(msg, false, true);
    }
  });

  logger.info('Cache consumer setup complete');
};

export const connectCache = async (): Promise<void> => {
  try {
    if (!config.rabbitMQ) {
      throw new Error('RabbitMQ URL not configured');
    }

    connection = await amqp.connect(config.rabbitMQ);
    channel = await connection.createChannel();

    connection.on('error', (error) => {
      logger.error('RabbitMQ connection error:', error);
      reconnectCache();
    });

    connection.on('close', () => {
      logger.warn('RabbitMQ connection closed, attempting to reconnect...');
      reconnectCache();
    });

    await setupCacheConsumer(channel);
    logger.info('Cache service connected');
  } catch (error) {
    logger.error('Failed to connect cache service:', error);
    throw error;
  }
};

const reconnectCache = async (): Promise<void> => {
  try {
    await disconnectCache();
    await new Promise(resolve => setTimeout(resolve, 5000));
    await connectCache();
  } catch (error) {
    logger.error('Failed to reconnect cache service:', error);
    setTimeout(reconnectCache, 5000);
  }
};

export const disconnectCache = async (): Promise<void> => {
  try {
    if (channel) {
      await channel.close();
      channel = null;
    }
    if (connection) {
      await connection.close();
      connection = null;
    }
  } catch (error) {
    logger.error('Error disconnecting cache service:', error);
    throw error;
  }
};
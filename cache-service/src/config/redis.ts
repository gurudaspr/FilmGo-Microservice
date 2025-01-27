import Redis from 'ioredis';
import logger from '../utils/logger';
import { config } from '../config'

let redisClient: Redis | null = null;

export const connectRedis = async (): Promise<Redis> => {
    if (!redisClient) {
      if (!config.redis.url) {
        throw new Error('Redis URL not configured');
      }
  
      redisClient = new Redis(config.redis.url);
      
      redisClient.on('error', (error) => {
        logger.error('Redis error:', error);
      });
  
      redisClient.on('connect', () => {
        logger.info('Connected to Redis');
      });
    }
    return redisClient;
  };
  
  export const disconnectRedis = async (): Promise<void> => {
    if (redisClient) {
      await redisClient.quit();
      redisClient = null;
    }
  };
  
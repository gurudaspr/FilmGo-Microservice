import mongoose from 'mongoose';
import { config } from './index';
import logger from '../utils/logger';
import Redis from 'ioredis';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info('Connected to mongodb');
  } catch (error) {
    logger.error('Mongo connection error', error);
    process.exit(1);
  }
};

export const connectRedis = () => {
  return new Redis(config.redis.url);
};
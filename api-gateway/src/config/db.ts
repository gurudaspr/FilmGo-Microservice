
import { config } from './index';
import logger from '../utils/logger';



export const connectRedis = () => {
    const Redis = require('ioredis');
    logger.info('Connected to redis');
    return new Redis(config.redis.url);

};
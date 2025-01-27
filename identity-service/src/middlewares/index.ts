import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import logger from '../utils/logger';
import { config } from '../config';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${JSON.stringify(req.body)}`);
  next();
};

export const createRateLimiter = (redisClient: any) => {
  const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware',
    points: config.rateLimit.standard.points,
    duration: config.rateLimit.standard.duration,
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await rateLimiter.consume(req.ip as string);
      next();
    } catch (error) {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({ success: false, message: 'Too many requests' });
    }
  };
};

export const createSensitiveEndpointsLimiter = (redisClient: any) => {
  return rateLimit({
    windowMs: config.rateLimit.sensitive.windowMs,
    max: config.rateLimit.sensitive.max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({ success: false, message: 'Too many requests' });
    },
    store: new RedisStore({
      sendCommand: (...args: any[]) => redisClient.call(...args),
    }),
  });
};
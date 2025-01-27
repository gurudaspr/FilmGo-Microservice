import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { config } from '../config';



export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${JSON.stringify(req.body)}`);
    next();
  };
  

  export const rateLimiterOptions = (redisClient: any) => {
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
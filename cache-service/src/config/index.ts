import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5010,
  redis: {
    url: process.env.REDIS_URL as string,
  },
  rabbitMQ : process.env.RABBITMQ_URL as string,
  rateLimit: {
    standard: {
      points: 10,
      duration: 1,
    },
    sensitive: {
      windowMs: 15 * 60 * 1000,
      max: 50,
    },
  },
};

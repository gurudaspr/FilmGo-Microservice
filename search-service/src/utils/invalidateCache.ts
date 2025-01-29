import { Redis } from 'ioredis';
import { Request } from 'express';
import logger from './logger';

declare module 'express-serve-static-core' {
  interface Request {
    redisClient: Redis;
  }
}

async function invalidateSearchCache(req: Request, query: string): Promise<void> {
  try {
    if (!req.redisClient) {
      console.error("Redis client not found on request object.");
      return;
    }

    const searchCacheKey = `search:${query}`;
    await req.redisClient.del(searchCacheKey);
    console.log(`Cache invalidated for search query: ${searchCacheKey}`);

  } catch (error: any) {
    console.error(`Error invalidating search cache: ${error.message}`);
    logger.error(`Cache invalidation failed: ${error.message}`);
  }
}

export default invalidateSearchCache;

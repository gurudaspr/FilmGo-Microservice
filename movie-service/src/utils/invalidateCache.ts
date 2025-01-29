import { Redis } from "ioredis";
import { Request } from "express";
import logger from "./logger";

declare module 'express-serve-static-core' {
    interface Request {
      redisClient: Redis;
    }
  }


  async function invalidateMovieCache(req: Request, movieId: string): Promise<void> {
    try {
      if (!req.redisClient) {
        console.error("Redis client not found on request object.");
        return;
      }
  
      const movieCacheKey = `movie:${movieId}`;
      const allMoviesCacheKey = "movies";
  
      // ✅ Delete specific movie cache
      await req.redisClient.del(movieCacheKey);
  
      // ✅ Delete all movies cache
      await req.redisClient.del(allMoviesCacheKey);
  
      console.log(`Cache invalidated for movie: ${movieCacheKey} and all movies cache: ${allMoviesCacheKey}`);
    } catch (error: any) {
      console.error(`Error invalidating movie cache: ${error.message}`);
    }
  }
  
  export default invalidateMovieCache;
import { Request, Response } from "express";
import { Search } from "../models/search.model";
import logger from "../utils/logger";




export const getAllSearch = async (req: Request, res: Response): Promise<any> => {
    try {
      const { query } = req.query;
  
      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Query parameter is required',
        });
      }
  
      const cachedKey = `search:${query}`;
      const cachedSearch = await req.redisClient.get(cachedKey);
  
      if (cachedSearch) {
        logger.info('Search results fetched from cache');
        return res.status(200).json({ success: true, posts: JSON.parse(cachedSearch) });
      }
  
      const searchConditions: any = {
        $or: [
          { name: { $regex: `^${query}`, $options: 'i' } },
          { locationName: { $regex: `^${query}`, $options: 'i' } },
        ]
      };
  
      const results = await Search.find(searchConditions)
        .sort({ popularity: -1 })
        .limit(10);
  
      const totalSearch = await Search.countDocuments(searchConditions);
  
      const result = {
        data: results,
        total: totalSearch,
      };
  
      await req.redisClient.setex(cachedKey, 300, JSON.stringify(result));
  
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Error fetching search results: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching search results',
        error: error.message,
      });
    }
  };
  
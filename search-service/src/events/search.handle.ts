import Redis from "ioredis";
import { Search } from "../models/search.model";
import invalidateSearchCache from "../utils/invalidateCache";




export const handleSearchAdd = async (data: any, redisClient: Redis): Promise<void> => {
  console.log('Search add event handled:', data);
  try {
    const newSearch = new Search({
      type: data.type,
      name: data.name,
      popularity: data.popularity,
    });

    const savedSearch = await newSearch.save();
    await invalidateSearchCache({ redisClient } as any, savedSearch.name);
    console.log('Search saved and cache invalidated successfully');
  } catch (error: any) {
    console.error('Error saving search to database:', error.message);
  }
};
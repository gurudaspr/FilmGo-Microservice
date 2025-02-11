import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  redis: {
    url: process.env.REDIS_URL as string,
  },
  identityServiceUrl: process.env.IDENTITY_SERVICE_URL as string,
  movieServiceUrl : process.env.MOVIE_SERVICE_URL as string,
  adminServiceUrl : process.env.ADMIN_SERVICE_URL as string,
  searchServiceUrl : process.env.SEARCH_SERVICE_URL as string,
  mediaServiceUrl : process.env.MEDIA_SERVICE_URL as string,
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
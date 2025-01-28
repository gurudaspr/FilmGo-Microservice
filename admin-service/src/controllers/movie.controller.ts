import { Request, Response } from 'express';
import { publishEvent } from '../config/rabbitmq';
import logger from '../utils/logger';
import { movieAddValidation } from '../utils/validation';

export const addMovie = async (req: Request, res: Response): Promise<any> => {
    try {
        logger.info('Received add movie request');
      // Validate request body
      const { value,error } = movieAddValidation.validate(req.body);
        if (error) {
            logger.warn("Validation error", error.details[0].message);
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }
      logger.info('Validated movie data successfully');
  
      // Publish the validated data to the movie service
      await publishEvent('movie.add', value);
  
      return res.status(200).json({
        success: true,
        message: 'Movie data forwarded to the movie service successfully',
      });
    } catch (error) {
      logger.error('Error in addMovie controller:', error);
  
      return res.status(500).json({
        success: false,
        message: 'An error occurred while forwarding movie data',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
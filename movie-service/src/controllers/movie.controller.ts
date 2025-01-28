import { Request, Response } from 'express';
import { Movie } from '../models/movie.model';
import logger from '../utils/logger';

export const getAllMovies = async (req: Request, res: Response): Promise<any>  => {
  try {
    logger.info('Fetching movies');



    const cachedKey = 'movies';

    const cachedMovie = await req.redisClient.get(cachedKey);

    if (cachedMovie) {
      logger.info('Movie fetched from cache');
      return res.status(200).json({ success: true, posts: JSON.parse(cachedMovie) });
    }
    const movies = await Movie.find().sort({ createdAt: -1 });
    const totalMovies = await Movie.countDocuments();

    const result = {
      data: movies,
      total: totalMovies,
    }
    await req.redisClient.setex(cachedKey, 300, JSON.stringify(result));
    res.json(result);
  } catch (error: any) {
    logger.error(`Error fetching movies: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching movies',
      error: error.message,
    });
  }
};
export const addMovie = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      title,
      description,
      genres,
      languages,
      releaseDate,
      duration,
      cast,
      director,
      mediaId,
      trailerUrl,
    } = req.body;

    // Validate required fields with more specific error messages
    const requiredFields = {
      title,
      description,
      genres,
      languages,
      releaseDate,
      duration,
      director,
      trailerUrl
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    logger.info('Adding a new movie');

    const newMovie = new Movie({
      title,
      description,
      genres,
      languages,
      releaseDate: new Date(releaseDate), // Ensure proper date conversion
      duration,
      cast,
      director,
      mediaId,
      trailerUrl,
    });

    await newMovie.save();

    return res.status(201).json({
      success: true,
      message: 'Movie added successfully',
      data: newMovie,
    });
  } catch (error) {
    logger.error('Error adding movie:', error);

    // More specific error handling
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.message,
        });
      }

      if (error.name === 'MongoError' || error.name === 'MongoServerError') {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: error.message,
        });
      }
    }

    // Generic error case
    return res.status(500).json({
      success: false,
      message: 'An error occurred while adding the movie',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
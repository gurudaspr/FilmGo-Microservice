import { Redis } from "ioredis";
import { Movie } from "../models/movie.model";
import invalidateMovieCache from "../utils/invalidateCache";
import { publishEvent } from "../config/rabbitmq";

export const handleMovieAdd = async (data: any, redisClient: Redis): Promise<void> => {
  console.log('Movie add event handled:', data);
  try {
    const newMovie = new Movie({
      title: data.title,
      description: data.description,
      genres: data.genres,
      languages: data.languages,
      releaseDate: data.releaseDate,
      duration: data.duration,
      cast: data.cast,
      director: data.director,
      mediaId: data.mediaId || [],
      trailerUrl: data.trailerUrl,
    });

    const savedMovie = await newMovie.save();
    await invalidateMovieCache({ redisClient } as any, savedMovie._id.toString());

    const movieData = {
        type: 'movie',
        movieId: savedMovie._id.toString(),
        name: savedMovie.title,
        popularity: 0,
      };
  
    await publishEvent('movie.search.add', movieData);

    console.log('Movie saved and cache invalidated successfully');
  } catch (error: any) {
    console.error('Error saving movie to database:', error.message);
  }
};
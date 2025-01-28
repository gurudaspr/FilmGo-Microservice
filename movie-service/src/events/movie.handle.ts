import slugify from "slugify";
import { Movie } from "../models/movie.model";



export const handleMovieAdd = async (data: any) => {
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
            mediaId: data.mediaId,
            trailerUrl: data.trailerUrl
        });
        await newMovie.save();
    } catch (error: any) {
        console.error('Error saving movie to database:', error.message);
    }
};
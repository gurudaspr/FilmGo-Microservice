
import Joi from 'joi';

export const movieAddValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    genres: Joi.string().required(),
    languages: Joi.string().required(),
    releaseDate: Joi.date().required(),
    duration: Joi.number().required(),
    cast:Joi.string().required(),
    director: Joi.string().required(),
    mediaId: Joi.string().optional(),
    trailerUrl: Joi.string().uri().required(),
});

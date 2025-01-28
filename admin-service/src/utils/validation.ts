
import Joi from 'joi';

export const movieAddValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    genres: Joi.array().items(Joi.string()).required(),
    languages: Joi.array().items(Joi.string()).required(),
    releaseDate: Joi.date().required(),
    duration: Joi.number().required(),
    cast: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required(),
                role: Joi.string().required(),
            })
        )
        .optional(),
    director: Joi.string().required(),
    mediaId: Joi.string().optional(),
    trailerUrl: Joi.string().uri().required(),
});

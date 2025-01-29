// movies.router.ts
import { Router } from 'express';
import { getAllMovies,  } from '../controllers/movie.controller';

const router = Router();


router.get('/get-all-movies', getAllMovies);
// router.post('/add-movie', addMovie);


export default router;
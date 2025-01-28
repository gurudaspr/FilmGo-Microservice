import { Router } from 'express';
import { addMovie } from '../controllers/movie.controller';


const router = Router();

router.post('/add-movie',addMovie );
router.put('/update/:slug', );
router.delete('/delete/:slug', );




export default router;
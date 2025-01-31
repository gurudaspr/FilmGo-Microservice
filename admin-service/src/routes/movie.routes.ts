import { Router } from 'express';
import { addMovie } from '../controllers/movie.controller';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});


const router = Router();

router.post('/add-movie', upload.single('file'), addMovie );





export default router;
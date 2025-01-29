// movies.router.ts
import { Router } from 'express';
import { getAllSearch } from '../controllers/search.controller';


const router = Router();

router.get('/', getAllSearch);

export default router;
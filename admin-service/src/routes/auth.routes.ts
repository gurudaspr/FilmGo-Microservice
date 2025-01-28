import { Router } from 'express';


const router = Router();

router.use('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the admin auth service',
    });
});



export default router;
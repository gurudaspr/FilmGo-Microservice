import express from 'express';
import { loginWithApple, loginWithGoogle } from '../controllers/identity.controller';




const router = express.Router();

router.post('/login/google', loginWithGoogle);


router.post('/login/apple', loginWithApple);

// // Phone login
// router.post('/login/phone', loginWithPhone);

// // Firebase Email/Password signup (handled by Firebase itself)
// router.post('/signup/email', signupWithEmailPassword);

export default router;
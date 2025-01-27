import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import User from '../models/user.model';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Google Login
export const loginWithGoogle = async (req: Request, res: Response) => {
    const { idToken } = req.body
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const user = await admin.auth().getUser(decodedToken.uid);

        let existingUser = await User.findOne({ _id: user.uid });
        if (!existingUser) {
            existingUser = new User({
                _id: user.uid,
                googleId: user.providerData[0].uid,
                provider: 'google',
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await existingUser.save();
        }

        res.json({ message: 'Google login successful', user });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Google login failed', error });
    }
};

// Apple Login
export const loginWithApple = async (req: Request, res: Response) => {
    const { identityToken } = req.body;
    try {
        const decodedToken = await admin.auth().verifyIdToken(identityToken);
        const user = await admin.auth().getUser(decodedToken.uid);

        let existingUser = await User.findOne({ _id: user.uid });
        if (!existingUser) {
            existingUser = new User({
                _id: user.uid,
                appleId: decodedToken.uid,
                provider: 'apple',
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await existingUser.save();
        }

        res.json({ message: 'Apple login successful', user });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Apple login failed', error });
    }
};

// // Phone Login
// export const loginWithPhone = async (req: Request, res: Response) => {
//     const { phoneNumber, code } = req.body; 
//     try {
//         const verificationId = await admin.auth().signInWithPhoneNumber(phoneNumber, code);
        
//         res.json({ message: 'Phone login successful', verificationId });
//     } catch (error) {
//         console.error(error);
//         res.status(401).json({ message: 'Phone number login failed', error });
//     }
// };

// export const signupWithEmailPassword = async (req: Request, res: Response) => {
//     const { email, password } = req.body;

//     try {
//         const userCredential = await admin.auth().createUser({
//             email,
//             password,
//         });

//         const user = userCredential.user;
//         const newUser = new User({
//             _id: user.uid,
//             email: user.email,
//             provider: 'email',
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         });
//         await newUser.save();

//         const idToken = await user.getIdToken();

//         res.json({ message: 'Signup successful', idToken });
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({ message: 'Signup failed', error });
//     }
// };

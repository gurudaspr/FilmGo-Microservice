import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  mongodb: {
    uri: process.env.MONGODB_URI as string,
  },
  redis: {
    url: process.env.REDIS_URL as string,
  },
  rateLimit: {
    standard: {
      points: 10,
      duration: 1,
    },
    sensitive: {
      windowMs: 15 * 60 * 1000,
      max: 50,
    },
  },
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY as string,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN as string,
    projectId: process.env.FIREBASE_PROJECT_ID as string,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID as string,
    appId: process.env.FIREBASE_APP_ID as string,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID as string,
  },
};

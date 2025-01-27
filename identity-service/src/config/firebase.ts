import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';

import { getAuth } from 'firebase/auth';
import serviceAccount from './serviceAccountKey.json'
import {config} from  "."


const firebaseAdminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const firebaseClientApp = initializeApp({
    apiKey: config.firebase.apiKey,
    authDomain: config.firebase.authDomain,
    projectId: config.firebase.projectId,
    storageBucket: config.firebase.storageBucket,
    messagingSenderId: config.firebase.messagingSenderId,
    appId: config.firebase.appId,
    measurementId: config.firebase.measurementId,
  });

const adminAuth = admin.auth(firebaseAdminApp);
const clientAuth = getAuth(firebaseClientApp);

export { adminAuth, clientAuth };

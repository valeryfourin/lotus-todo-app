import { initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions} from 'firebase/functions';

const firebaseConfig = {
    apiKey: 'AIzaSyDFiUhSOddVVOqVoJALTomSkm_Xe1lr38c',
    authDomain: 'lotus-todo-app.firebaseapp.com',
    projectId: 'lotus-todo-app',
    storageBucket: 'lotus-todo-app.appspot.com',
    messagingSenderId: '681857241068',
    appId: '1:681857241068:web:7d9bef4dedff8adfc53ac9'
};

export const app = initializeApp(firebaseConfig);

export const authUser = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
  
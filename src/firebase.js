import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCgSg66c0c22IAhlTXa_gHvH-piT9J69mY",
    authDomain: "ai-blog-d8315.firebaseapp.com",
    projectId: "ai-blog-d8315",
    storageBucket: "ai-blog-d8315.firebasestorage.app",
    messagingSenderId: "267981849923",
    appId: "1:267981849923:web:3453735c100609c5261bf6"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

export { auth, db }
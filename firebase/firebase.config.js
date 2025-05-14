// src/firebase.config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD7ArOJlMCw8rOPueTS4Q6LwzAHUxkf2Nw",
    authDomain: "gestion-de-mayores.firebaseapp.com",
    projectId: "gestion-de-mayores",
    storageBucket: "gestion-de-mayores.firebasestorage.app",
    messagingSenderId: "392934286285",
    appId: "1:392934286285:web:e8ccd9ff9c4050c90b9a84",
    measurementId: "G-L70HEJPKF5"
  };
  
// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;

// Firestore rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

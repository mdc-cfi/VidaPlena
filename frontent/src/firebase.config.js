// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7ArOJlMCw8rOPueTS4Q6LwzAHUxkf2Nw",
  authDomain: "gestion-de-mayores.firebaseapp.com",
  projectId: "gestion-de-mayores",
  storageBucket: "gestion-de-mayores.firebasestorage.app",
  messagingSenderId: "392934286285",
  appId: "1:392934286285:web:e8ccd9ff9c4050c90b9a84",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;

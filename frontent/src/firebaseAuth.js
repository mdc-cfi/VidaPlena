import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import app, { db } from "./firebase.config";

const auth = getAuth(app);

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Usuario registrado:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Usuario autenticado:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    throw error;
  }
};

export const registerUserWithRole = async (email, password, profileData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user profile and role in Firestore using the client's name as the document ID
    const documentId = profileData.nombreCompleto.replace(/\s+/g, "_").toLowerCase();
    await setDoc(doc(db, "clientes", documentId), {
      email,
      role: "cliente",
      ...profileData,
    });

    console.log("Usuario registrado con rol de cliente y datos adicionales:", profileData);
    return user;
  } catch (error) {
    console.error("Error al registrar usuario con rol:", error.message);
    throw error;
  }
};
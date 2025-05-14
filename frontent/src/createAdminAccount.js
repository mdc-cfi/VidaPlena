import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import app, { db } from "./firebase.config.js";

const auth = getAuth();

const createAdminAccount = async () => {
  try {
    const email = "admin@admin.com";
    const password = "admin1";
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save admin profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email,
      role: "administrador",
    });

    console.log("Cuenta de administrador creada exitosamente.");
  } catch (error) {
    console.error("Error al crear la cuenta de administrador:", error.message);
  }
};

createAdminAccount();
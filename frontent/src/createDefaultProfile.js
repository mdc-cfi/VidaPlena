import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase.config.js";

const auth = getAuth();

const createDefaultProfile = async (email, password, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Crear un perfil predeterminado en la colección 'administradores'
    await setDoc(doc(db, "administradores", user.uid), {
      email,
      role: "administrador",
      nombreCompleto: "Usuario Predeterminado",
      sexo: "No especificado",
      fechaNacimiento: "No especificado",
      pais: "No especificado",
      numeroContacto: "No especificado",
      correoElectronico: email,
      medicoTratante: "No especificado",
      alergias: "No especificado",
      condicionesMedicas: "No especificado",
      medicamentos: [],
    });

    console.log("Perfil predeterminado creado exitosamente para el administrador.");
  } catch (error) {
    console.error("Error al crear el perfil predeterminado:", error.message);
  }
};

// Ejemplo de uso
createDefaultProfile("admin@admin.com", "admin1", "administrador");
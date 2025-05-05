import React, { useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth"; // Importar la función faltante

const db = getFirestore(); // Inicializar Firestore

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Iniciando sesión con:", email);
    console.log("Conectando a Firebase Authentication...");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener el rol del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        setError("No se encontró información del usuario. Por favor, contacte al administrador.");
        return;
      }

      const userData = userDoc.data();
      if (userData.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (error.code === "auth/user-not-found") {
        setError("Usuario no encontrado. Verifica tu correo electrónico.");
      } else if (error.code === "auth/wrong-password") {
        setError("Contraseña incorrecta. Inténtalo de nuevo.");
      } else {
        setError("Error al iniciar sesión. Inténtalo más tarde.");
      }
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "70px" }}>
      <div style={{ flex: 1, backgroundColor: "white", color: "black", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", textAlign: "left", maxWidth: "500px" }}>
        <h1 style={{ textAlign: "center" }}>Iniciar Sesión</h1>
        <p style={{ textAlign: "center" }}>Por favor, ingresa tus datos para acceder a tu cuenta.</p>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
            <div style={{ flex: 1, marginRight: "20px", textAlign: "right" }}>
              <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", height: "40px" }}>
                <label htmlFor="email" style={{ margin: 0 }}>Correo Electrónico:</label>
              </div>
              <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", height: "40px" }}>
                <label htmlFor="password" style={{ margin: 0 }}>Contraseña:</label>
              </div>
            </div>
            <div style={{ flex: 2, textAlign: "left" }}>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ display: "block", width: "100%", padding: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ display: "block", width: "100%", padding: "6px" }}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            style={{ padding: "10px 20px", cursor: "pointer", marginTop: "20px", alignSelf: "center", display: "block", marginLeft: "auto", marginRight: "auto" }}
          >
            Iniciar Sesión
          </button>
        </form>
        {error && <p style={{ textAlign: "center", marginTop: "20px", color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
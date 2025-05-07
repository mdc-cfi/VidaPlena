import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase.config"; // Usar la instancia inicializada de Firestore
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);
    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Crear un documento en Firestore para el usuario registrado
      await setDoc(doc(db, "clientes", user.uid), {
        name: name,
        email: email,
        role: "user", // Rol predeterminado
        verified: true, // Estado de verificación
      });

      setMessage("Registro exitoso. Redirigiendo para completar información adicional...");
      setTimeout(() => {
        navigate(`/add-client-info/${user.uid}`);
      }, 2000);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setMessage("El correo ya está registrado. Por favor, utiliza otro correo.");
      } else {
        setMessage("Error al registrar usuario: " + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "70px" }}>
      <div style={{ flex: 1, backgroundColor: "white", color: "black", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", textAlign: "left", maxWidth: "500px" }}>
        <h1 style={{ textAlign: "center" }}>Crear Cuenta</h1>
        <p style={{ textAlign: "center" }}>Por favor, completa los siguientes datos para registrarte en Vida Plena.</p>
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
            <div style={{ flex: 1, marginRight: "20px", textAlign: "right" }}>
              <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", height: "40px" }}>
                <label htmlFor="name" style={{ margin: 0 }}>Nombre:</label>
              </div>
              <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", height: "40px" }}>
                <label htmlFor="email" style={{ margin: 0 }}>Correo Electrónico:</label>
              </div>
              <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", height: "40px" }}>
                <label htmlFor="password" style={{ margin: 0 }}>Contraseña:</label>
              </div>
              <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", height: "40px" }}>
                <label htmlFor="confirmPassword" style={{ margin: 0, textAlign: "left" }}>Confirmar Contraseña:</label>
              </div>
            </div>
            <div style={{ flex: 2, textAlign: "left" }}>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ display: "block", width: "100%", padding: "6px" }}
                />
              </div>
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
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ display: "block", width: "100%", padding: "6px" }}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            style={{ padding: "10px 20px", cursor: "pointer", marginTop: "20px", alignSelf: "center", display: "block", marginLeft: "auto", marginRight: "auto" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrar"}
          </button>
        </form>
        {message && <p style={{ textAlign: "center", marginTop: "20px" }}>{message}</p>}
      </div>
    </div>
  );
};

export default RegisterPage;
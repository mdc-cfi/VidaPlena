import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bienvenido al Sistema de Gestión para Personas Mayores</h1>
      <p>Por favor, selecciona una opción para continuar.</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/login">
          <button style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", marginRight: "10px" }}>Iniciar Sesión</button>
        </Link>
        <Link to="/register">
          <button style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>Crear Cuenta</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Determinar el rol basado en el nombre ingresado
    const role = username.toLowerCase() === "frank" ? "cliente" : username.toLowerCase() === "deyvis" ? "admin" : null;

    if (!role) {
      alert("Usuario no reconocido. Por favor, ingresa un nombre válido.");
      return;
    }

    setUser({ name: username, role });

    // Redirigir según el rol
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/cliente");
    }
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleLogin}>
        <label>
          Nombre de usuario:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default Login;
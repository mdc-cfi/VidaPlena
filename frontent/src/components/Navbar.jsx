import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import logo from "../imagenes/logo.png";

// Componente de barra de navegación principal
function Navbar({ role }) {
  const auth = getAuth(); // Instancia de autenticación de Firebase
  const [user] = useAuthState(auth); // Hook para obtener el usuario autenticado
  const navigate = useNavigate(); // Hook para navegación

  // Efecto para depuración: muestra el rol cada vez que cambia
  useEffect(() => {
    console.log("Rol actualizado en Navbar:", role);
  }, [role]);

  console.log("Rol del usuario en Navbar:", role);

  // Función para cerrar sesión
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Sesión cerrada exitosamente");
        navigate("/"); // Redirigir a la página de inicio
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#495057', borderRadius: '10px', width: '90%', margin: '10px auto' }}>
      <div className="container">
        {/* Logo y nombre de la app, con ruta dinámica según el rol */}
        <Link className="navbar-brand text-white" to={role === "user" ? "/user-dashboard" : "/admin-dashboard"} style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="Logo Vida Plena" style={{ width: "50px", height: "50px", marginRight: "10px" }} />
          VidaPlena
        </Link>
        {/* Botón para menú colapsable en móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Botón de inicio dinámico según el rol */}
            <li className="nav-item">
              <Link className="nav-link text-white" to={role === "user" ? "/user-dashboard" : "/admin-dashboard"}>
                Inicio
              </Link>
            </li>
            {/* Opciones solo para admin */}
            {role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/clientes">
                    Clientes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/clientes/agregar">
                    Agregar Cliente
                  </Link>
                </li>
              </>
            )}
            {/* Opción solo para usuario */}
            {role === "user" && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/user-dashboard">
                  Mi Dashboard
                </Link>
              </li>
            )}
            {/* Opciones de usuario autenticado o no autenticado */}
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-white">{user.displayName || "Usuario"}</span>
                </li>
                <li className="nav-item">
                  <button className="nav-link text-white btn btn-link" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/register">
                    Crear Cuenta
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config"; // Asegúrate de que esta importación sea correcta
import logo from "../imagenes/logo.png";

function Navbar({ role }) {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Usuario");

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        console.log("Usuario autenticado en Navbar:", user);
        if (user.displayName) {
          console.log("Nombre del usuario desde displayName:", user.displayName);
          setUserName(user.displayName);
        } else {
          try {
            console.log("Intentando obtener el nombre del usuario desde Firestore para UID:", user.uid);
            const userDoc = await getDoc(doc(db, "usuarios", user.uid));
            if (userDoc.exists()) {
              console.log("Datos del usuario obtenidos desde Firestore:", userDoc.data());
              setUserName(userDoc.data().nombre || "Usuario");
            } else {
              console.warn("No se encontró el documento del usuario en Firestore.");
            }
          } catch (error) {
            console.error("Error al obtener el nombre del usuario desde Firestore:", error);
          }
        }
      } else {
        console.warn("No hay un usuario autenticado en Navbar.");
      }
    };

    fetchUserName();
  }, [user]);

  useEffect(() => {
    console.log("Rol actualizado en Navbar:", role);
  }, [role]);

  console.log("Rol del usuario en Navbar:", role);

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

  // Ajustar la lógica para determinar la ruta de "Inicio" según el rol del usuario.
  const inicioPath = role === "admin" ? "/admin-dashboard" : "/user-dashboard";

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#495057', borderRadius: '10px', width: '90%', margin: '10px auto' }}>
      <div className="container">
        <Link className="navbar-brand text-white" to="/admin-dashboard" style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="Logo Vida Plena" style={{ width: "50px", height: "50px", marginRight: "10px" }} />
          VidaPlena
        </Link>
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
            <li className="nav-item">
              <Link className="nav-link text-white" to={inicioPath}>
                Inicio
              </Link>
            </li>
            {role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/clientes/agregar">
                  Agregar Cliente
                </Link>
              </li>
            )}
            {role === "user" && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/user-dashboard">
                  Mi Dashboard
                </Link>
              </li>
            )}
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-white">{userName}</span>
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
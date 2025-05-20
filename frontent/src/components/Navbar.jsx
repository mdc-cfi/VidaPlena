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
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        if (user.displayName) {
          setUserName(user.displayName.split(' ')[0]);
          console.log("Rol del usuario en Navbar:", role === "user" ? "cliente" : role || "cliente");
        } else {
          try {
            let userDoc = await getDoc(doc(db, "usuarios", user.uid));
            if (userDoc.exists()) {
              const nombre = userDoc.data().nombre || user.email || "Usuario";
              setUserName(nombre.split(' ')[0]);
              console.log("Rol del usuario en Navbar:", userDoc.data().rol === "user" ? "cliente" : userDoc.data().rol || "cliente");
            } else {
              userDoc = await getDoc(doc(db, "clientes", user.uid));
              if (userDoc.exists()) {
                const nombre = userDoc.data().nombre || user.email || "Cliente";
                setUserName(nombre.split(' ')[0]);
                console.log("Rol del usuario en Navbar:", userDoc.data().rol === "user" ? "cliente" : userDoc.data().rol || "cliente");
              } else {
                userDoc = await getDoc(doc(db, "administradores", user.uid));
                if (userDoc.exists()) {
                  const nombre = userDoc.data().nombre;
                  setUserName((nombre ? nombre.split(' ')[0] : 'Admin'));
                  console.log("Rol del usuario en Navbar:", userDoc.data().rol || "admin");
                } else {
                  setUserName((user.email || "Usuario").split(' ')[0]);
                  console.log("Rol del usuario en Navbar:", "cliente");
                }
              }
            }
          } catch (error) {
            console.error("Error al obtener el nombre del usuario desde Firestore:", error);
          }
        }
      }
    };

    fetchUserName();
  }, [user, role]);

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
  let inicioPath = "/";
  if (role === "admin") inicioPath = "/admin-dashboard";
  else if (role === "cliente") inicioPath = "/user-dashboard";

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#495057', borderRadius: '10px', width: '90%', margin: '10px auto' }}>
      <div className="container">
        <Link className="navbar-brand text-white" to={role === "admin" ? "/admin-dashboard" : role === "cliente" ? "/user-dashboard" : "/"} style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="Logo Vida Plena" style={{ width: "50px", height: "50px", marginRight: "10px" }} />
          VidaPlena
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Menú normal para escritorio */}
        <div className="collapse navbar-collapse d-none d-lg-block" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {role && (
              <li className="nav-item">
                <Link className="nav-link text-white" to={inicioPath}>
                  Inicio
                </Link>
              </li>
            )}
            {role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/clientes/agregar">
                  Agregar Cliente
                </Link>
              </li>
            )}
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-white" style={{ cursor: 'pointer' }} onClick={() => navigate('/perfil')}>
                    {userName}
                  </span>
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
        {/* Menú móvil tipo panel flotante */}
        {showMobileMenu && (
          <div style={{ position: 'absolute', top: '70px', right: '5%', background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: '8px', minWidth: '220px', zIndex: 2000, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <ul className="list-unstyled m-0 p-3">
              <li>
                <Link className="nav-link" to={inicioPath} onClick={() => setShowMobileMenu(false)}>
                  Inicio
                </Link>
              </li>
              {role === "admin" && (
                <li>
                  <Link className="nav-link" to="/clientes/agregar" onClick={() => setShowMobileMenu(false)}>
                    Agregar Cliente
                  </Link>
                </li>
              )}
              {user ? (
                <>
                  <li>
                    <span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => { navigate('/perfil'); setShowMobileMenu(false); }}>
                      {userName}
                    </span>
                  </li>
                  <li>
                    <button className="nav-link btn btn-link w-100 text-start" onClick={() => { handleLogout(); setShowMobileMenu(false); }}>
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link className="nav-link" to="/login" onClick={() => setShowMobileMenu(false)}>
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-link" to="/register" onClick={() => setShowMobileMenu(false)}>
                      Crear Cuenta
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

function MiniPerfil({ user }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      let userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      if (!userDoc.exists()) userDoc = await getDoc(doc(db, 'clientes', user.uid));
      if (!userDoc.exists()) userDoc = await getDoc(doc(db, 'administradores', user.uid));
      setUserData(userDoc.exists() ? userDoc.data() : null);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (loading) return <div className="p-2">Cargando...</div>;
  if (!userData) return <div className="p-2">Sin datos</div>;
  return (
    <div className="p-2">
      <div><strong>Nombre:</strong> {userData.nombre || user.email}</div>
      <div><strong>Email:</strong> {userData.email || user.email}</div>
      <div><strong>Rol:</strong> {userData.rol || 'N/A'}</div>
      {userData.telefono && <div><strong>Teléfono:</strong> {userData.telefono}</div>}
      {userData.edad && <div><strong>Edad:</strong> {userData.edad}</div>}
      {userData.direccion && <div><strong>Dirección:</strong> {userData.direccion}</div>}
    </div>
  );
}

export default Navbar;
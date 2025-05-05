import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

function handleLogout() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      console.log("Sesión cerrada exitosamente");
      window.location.href = "/login"; // Redirigir al login
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
}

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#495057', borderRadius: '10px', width: '90%', margin: '10px auto' }}>
      <div className="container">
        <Link className="navbar-brand text-white" to="/admin-dashboard">
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
              <Link className="nav-link text-white" to="/admin-dashboard">
                Inicio
              </Link>
            </li>
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
            <li className="nav-item">
              <button className="nav-link text-white btn btn-link" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
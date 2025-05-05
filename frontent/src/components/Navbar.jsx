import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const isAdmin = user?.role === "admin";

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#495057', borderRadius: '10px', width: '90%', margin: '10px auto' }}>
      <div className="container">
        <Link className="navbar-brand text-white" to="/">
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
              <Link className="nav-link text-white" to="/">
                Inicio
              </Link>
            </li>
            {isAdmin ? (
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
            ) : (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/cliente/solicitar-cita">
                  Solicitar Cita
                </Link>
              </li>
            )}
            {user && (
              <li className="nav-item dropdown">
                <span
                  className="nav-link text-white dropdown-toggle"
                  role="button"
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <i className="fas fa-user"></i> {user.name}
                </span>
                {menuOpen && (
                  <ul className="dropdown-menu dropdown-menu-end" style={{ display: 'block' }}>
                    <li
                      className="dropdown-item"
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => navigate('/usuario/informacion')}
                    >
                      Ver Información
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={handleLogout}
                      >
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
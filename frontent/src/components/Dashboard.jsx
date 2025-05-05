import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">
        Bienvenido{user ? `, ${user.name}` : ''} a VidaPlena
      </h1>
      <div className="row">
        {user?.role === "admin" && (
          <div className="col-md-6 col-lg-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Seguimiento de Salud</h5>
                <p className="card-text">Consulta y gestiona la información de salud de los clientes.</p>
                <button className="btn btn-primary" onClick={() => navigate('/admin/seguimiento-clientes')}>
                  Ver más
                </button>
              </div>
            </div>
          </div>
        )}
        {user?.role === "admin" && (
          <div className="col-md-6 col-lg-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Agenda de Citas</h5>
                <p className="card-text">Consulta y organiza las citas médicas de los usuarios.</p>
                <button className="btn btn-secondary" onClick={() => navigate('/admin/citas')}>
                  Ver más
                </button>
              </div>
            </div>
          </div>
        )}
        {user?.role === "admin" && (
          <div className="col-md-6 col-lg-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Alertas de Emergencia</h5>
                <p className="card-text">Gestiona y responde a las alertas de emergencia enviadas por los usuarios.</p>
                <button className="btn btn-warning" onClick={() => navigate('/admin/emergencias')}>
                  Ver más
                </button>
              </div>
            </div>
          </div>
        )}
        {user?.role === "cliente" && (
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Recordatorios de Medicamentos</h5>
                <p className="card-text">Consulta y gestiona los recordatorios de medicamentos.</p>
                <button className="btn btn-primary">Ver más</button>
              </div>
            </div>
          </div>
        )}
        {user?.role === "cliente" && (
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Agenda de Citas</h5>
                <p className="card-text">Consulta todas las citas que has solicitado y su estado.</p>
                <button className="btn btn-primary" onClick={() => navigate('/cliente/solicitar-cita')}>
                  Ver más
                </button>
              </div>
            </div>
          </div>
        )}
        {user?.role === "cliente" && (
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Alertas de Emergencia</h5>
                <p className="card-text">Envía alertas de emergencia a tus contactos registrados.</p>
                <button className="btn btn-warning" onClick={() => navigate('/cliente/emergencia')}>
                  Ver más
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import React from 'react';
import { useNavigate } from 'react-router-dom';

// DASHBOARD: Vista principal para administradores.
// - Muestra accesos rápidos a gestión de clientes, medicamentos y agenda de citas.
// - Permite navegar fácilmente a las secciones clave del sistema.

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Bienvenido a VidaPlena</h1>
        <div className="row">
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Seguimiento de Salud</h5>
                <p className="card-text">Registra y visualiza los signos vitales y datos médicos importantes.</p>
                <button className="btn btn-primary" onClick={() => navigate('/clientes')}>Ver más</button>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Recordatorios de Medicamentos</h5>
                <p className="card-text">Consulta y gestiona los recordatorios de medicamentos.</p>
                <button className="btn btn-primary" onClick={() => navigate('/medicamentos')}>Ver más</button>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Agenda de Citas</h5>
                <p className="card-text">Organiza y visualiza las citas médicas programadas.</p>
                <button className="btn btn-primary" onClick={() => navigate('/agenda-citas')}>Ver más</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
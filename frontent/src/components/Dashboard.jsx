import React from 'react';
import { useNavigate } from 'react-router-dom';

// Componente principal del dashboard de administrador
export default function Dashboard() {
  const navigate = useNavigate(); // Hook para navegación programática

  return (
    <div>
      {/* Contenedor principal del dashboard */}
      <div className="container mt-5">
        {/* Título de bienvenida */}
        <h1 className="text-center mb-4">Bienvenido a VidaPlena</h1>
        <div className="row">
          {/* Tarjeta de Seguimiento de Salud */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Seguimiento de Salud</h5>
                <p className="card-text">Registra y visualiza los signos vitales y datos médicos importantes.</p>
                {/* Botón para ir a la lista de clientes */}
                <button className="btn btn-primary" onClick={() => navigate('/clientes')}>Ver más</button>
              </div>
            </div>
          </div>
          {/* Tarjeta de Recordatorios de Medicamentos */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Recordatorios de Medicamentos</h5>
                <p className="card-text">Consulta y gestiona los recordatorios de medicamentos.</p>
                {/* Botón para ir a la lista de medicamentos */}
                <button className="btn btn-primary" onClick={() => navigate('/medicamentos')}>Ver más</button>
              </div>
            </div>
          </div>
          {/* Tarjeta de Agenda de Citas */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Agenda de Citas</h5>
                <p className="card-text">Organiza y visualiza las citas médicas programadas.</p>
                {/* Botón para futuras funcionalidades */}
                <button className="btn btn-primary">Ver más</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
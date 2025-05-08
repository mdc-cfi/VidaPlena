import React from 'react';
import Navbar from "./Navbar";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Bienvenido a VidaPlena</h1>
        <div className="row">
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Seguimiento de Salud</h5>
                <p className="card-text">Registra y visualiza los signos vitales y datos médicos importantes.</p>
                <button className="btn btn-primary">Ver más</button>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Recordatorios de Medicamentos</h5>
                <p className="card-text">Consulta y gestiona los recordatorios de medicamentos.</p>
                <button className="btn btn-primary">Ver más</button>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Agenda de Citas</h5>
                <p className="card-text">Organiza y visualiza las citas médicas programadas.</p>
                <button className="btn btn-primary">Ver más</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
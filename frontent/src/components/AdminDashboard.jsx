import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Panel de Administración</h1>
      <div className="d-flex flex-column align-items-center">
        <button
          className="btn btn-primary mb-3"
          onClick={() => navigate("/admin/clientes")}
        >
          Gestionar Clientes
        </button>
        <button
          className="btn btn-secondary mb-3"
          onClick={() => navigate("/admin/citas")}
        >
          Ver Agenda de Citas
        </button>
        <button
          className="btn btn-warning mb-3"
          onClick={() => navigate("/admin/emergencias")}
        >
          Alertas de Emergencia
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
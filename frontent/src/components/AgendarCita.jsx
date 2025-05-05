import React, { useState, useEffect } from "react";

function SolicitarCita() {
  const [formData, setFormData] = useState({
    nombre: "",
    fecha: "",
    hora: "",
    descripcion: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cita solicitada:", formData);
    alert("Cita solicitada con éxito");
    setFormData({ nombre: "", fecha: "", hora: "", descripcion: "" });
  };

  // Simulación de notificaciones de citas
  useEffect(() => {
    const interval = setInterval(() => {
      alert("Recordatorio: Tienes una cita médica programada próximamente.");
    }, 86400000); // Cada 24 horas

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Solicitar Cita</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre del Paciente
          </label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="fecha" className="form-label">
            Fecha
          </label>
          <input
            type="date"
            className="form-control"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="hora" className="form-label">
            Hora
          </label>
          <input
            type="time"
            className="form-control"
            id="hora"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">
            Descripción
          </label>
          <textarea
            className="form-control"
            id="descripcion"
            name="descripcion"
            rows="3"
            value={formData.descripcion}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Solicitar
        </button>
      </form>
    </div>
  );
}

export default SolicitarCita;
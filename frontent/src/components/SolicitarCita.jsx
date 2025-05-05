import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SolicitarCita() {
  const [formData, setFormData] = useState({
    nombre: "",
    fecha: "",
    hora: "",
    descripcion: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que todos los campos estén completos
    if (!formData.nombre || !formData.fecha || !formData.hora || !formData.descripcion) {
      alert("Por favor, completa todos los campos antes de enviar.");
      return;
    }

    const nuevaCita = { ...formData, estado: "Pendiente" };

    // Guardar la cita en localStorage
    try {
      const citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];
      citasGuardadas.push(nuevaCita);
      localStorage.setItem("citas", JSON.stringify(citasGuardadas));

      alert("Cita solicitada con éxito");
      setFormData({ nombre: "", fecha: "", hora: "", descripcion: "" });

      // Redirigir a Citas Pendientes
      navigate("/cliente/citas-pendientes");
    } catch (error) {
      console.error("Error al guardar la cita en localStorage:", error);
      alert("Ocurrió un error al guardar la cita. Por favor, inténtalo de nuevo.");
    }
  };

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
            required
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
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase.config";

const AgendaCitas = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    fecha: "",
    tipo: "",
    descripcion: "",
  });
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "citas"));
        const citasData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCitas(citasData);
      } catch (error) {
        console.error("Error al cargar las citas:", error);
      }
    };

    fetchCitas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Guardar la cita en Firebase
      const nuevaCita = { ...formData, fecha: new Date(formData.fecha).toISOString() };
      const docRef = await addDoc(collection(db, "citas"), nuevaCita);
      console.log("Cita guardada con ID:", docRef.id);

      // Actualizar la lista de citas en el estado
      setCitas((prev) => [...prev, { id: docRef.id, ...nuevaCita }]);

      alert("Cita agendada con éxito");
      setFormData({ nombre: "", apellidos: "", fecha: "", tipo: "", descripcion: "" });
    } catch (error) {
      console.error("Error al agendar la cita:", error);
      alert("Hubo un error al agendar la cita. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center">Agenda de Citas</h1>
        <p className="text-center">Organiza y visualiza las citas médicas programadas.</p>
        <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-control"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="apellidos" className="form-label">
              Apellidos
            </label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              className="form-control"
              value={formData.apellidos}
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
              id="fecha"
              name="fecha"
              className="form-control"
              value={formData.fecha}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tipo" className="form-label">
              Tipo de Cita
            </label>
            <input
              type="text"
              id="tipo"
              name="tipo"
              className="form-control"
              value={formData.tipo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              className="form-control"
              rows="3"
              value={formData.descripcion}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Agendar Cita
          </button>
        </form>

        <h2 className="text-center mt-5">Citas Programadas</h2>
        <ul className="list-group mt-3">
          {citas.map((cita) => (
            <li key={cita.id} className="list-group-item">
              <p><strong>Cliente:</strong> {cita.clienteNombre}</p>
              <p><strong>Fecha:</strong> {cita.fecha}</p>
              <p><strong>Hora:</strong> {cita.hora}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AgendaCitas;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase.config";

function RecetarMedicamento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicamento, setMedicamento] = useState("");
  const [dosis, setDosis] = useState("");
  const [frecuencia, setFrecuencia] = useState("");

  // Simulación de recordatorios de medicamentos
  useEffect(() => {
    const interval = setInterval(() => {
      alert("Recordatorio: Es hora de tomar tu medicamento.");
    }, 3600000); // Cada hora

    return () => clearInterval(interval);
  }, []);

  const handleRecetar = async (e) => {
    e.preventDefault();
    if (!medicamento || !dosis || !frecuencia) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const clienteRef = doc(db, "clientes", id);
      await updateDoc(clienteRef, {
        medicamentos: arrayUnion({ nombre: medicamento, dosis, frecuencia }),
      });
      alert("Medicamento recetado con éxito.");
      navigate(`/admin/cliente/${id}`);
    } catch (error) {
      console.error("Error al recetar medicamento:", error);
      alert("Hubo un error al recetar el medicamento.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Recetar Medicamento</h1>
      <form onSubmit={handleRecetar} className="text-center">
        <div className="form-group">
          <label htmlFor="medicamento">Nombre del Medicamento:</label>
          <input
            type="text"
            id="medicamento"
            className="form-control"
            value={medicamento}
            onChange={(e) => setMedicamento(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dosis">Dosis (mg):</label>
          <input
            type="text"
            id="dosis"
            className="form-control"
            value={dosis}
            onChange={(e) => setDosis(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="frecuencia">Frecuencia (cada cuántas horas):</label>
          <input
            type="text"
            id="frecuencia"
            className="form-control"
            value={frecuencia}
            onChange={(e) => setFrecuencia(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Recetar
        </button>
      </form>
    </div>
  );
}

export default RecetarMedicamento;
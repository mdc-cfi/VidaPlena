import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";

function CitasPendientes() {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "citas"));
        const citasFirestore = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCitas(citasFirestore);
      } catch (error) {
        console.error("Error al obtener citas desde Firestore:", error);
      }
    };

    fetchCitas();
  }, []);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta cita?")) {
      try {
        await deleteDoc(doc(db, "citas", id));
        setCitas((prev) => prev.filter((cita) => cita.id !== id));
      } catch (error) {
        console.error("Error al eliminar cita:", error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Citas Pendientes</h1>
      {citas.length === 0 ? (
        <p>No hay citas pendientes.</p>
      ) : (
        <ul className="list-group">
          {citas.map((cita) => (
            <li key={cita.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <p><strong>Paciente:</strong> {cita.nombre}</p>
                <p><strong>Fecha:</strong> {cita.fecha}</p>
                <p><strong>Hora:</strong> {cita.hora}</p>
              </div>
              <button className="btn btn-danger" onClick={() => handleEliminar(cita.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CitasPendientes;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";

function ClienteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const docRef = doc(db, "clientes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCliente({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No se encontró el cliente.");
        }
      } catch (error) {
        console.error("Error al obtener cliente desde Firestore:", error);
      }
    };

    fetchCliente();
  }, [id]);

  if (!cliente) {
    return <p className="text-center">Cargando información del cliente...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Información del Cliente</h1>
      <ul className="list-group" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', textTransform: 'uppercase' }}>
        <li className="list-group-item">
          <strong>Nombre:</strong> {cliente.nombre}
        </li>
        <li className="list-group-item">
          <strong>Edad:</strong> {cliente.edad}
        </li>
        <li className="list-group-item">
          <strong>Teléfono:</strong> {cliente.telefono}
        </li>
        <li className="list-group-item">
          <strong>Dirección:</strong> {cliente.direccion}
        </li>
        <li className="list-group-item">
          <strong>Contacto de Emergencia:</strong> {cliente.contactoEmergencia?.telefono || "No especificado"}
        </li>
        <li className="list-group-item">
          <strong>Enfermedades:</strong> {cliente.historialMedico?.condiciones?.join(", ") || "No especificado"}
        </li>
        <li className="list-group-item">
          <strong>Medicamentos Recetados:</strong>
          <ul>
            {cliente.medicamentos?.map((medicamento, index) => (
              <li key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <span><strong>{medicamento.nombre}</strong></span>
                <span>{medicamento.dosis} mg</span>
                <span style={{ marginLeft: 'auto' }}>{medicamento.frecuencia} horas</span>
                {editando && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={async () => {
                      const nuevosMedicamentos = cliente.medicamentos.filter((_, i) => i !== index);
                      setCliente({ ...cliente, medicamentos: nuevosMedicamentos });
                      try {
                        const clienteRef = doc(db, "clientes", id);
                        await updateDoc(clienteRef, { medicamentos: nuevosMedicamentos });
                        alert("Medicamento eliminado con éxito.");
                      } catch (error) {
                        console.error("Error al eliminar medicamento:", error);
                        alert("Hubo un error al eliminar el medicamento.");
                      }
                    }}
                  >
                    Eliminar
                  </button>
                )}
              </li>
            )) || <li>No hay medicamentos registrados.</li>}
          </ul>
          <button
            className="btn btn-primary mt-3"
            onClick={() => setEditando(!editando)}
          >
            {editando ? "Finalizar Edición" : "Editar Medicamentos"}
          </button>
        </li>
      </ul>
      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate(-1)}
      >
        Volver
      </button>
    </div>
  );
}

export default ClienteDetalle;
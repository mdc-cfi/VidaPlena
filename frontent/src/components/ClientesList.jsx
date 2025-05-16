import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCliente, setExpandedCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editableCliente, setEditableCliente] = useState({});

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clientes"));
        const clientesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setClientes(clientesData);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener los clientes:", err);
        setError("No se pudo cargar la información de los clientes.");
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este cliente?")) {
      try {
        await deleteDoc(doc(db, "clientes", id));
        setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedCliente(expandedCliente === id ? null : id);
  };

  const handleEditChange = (field, value) => {
    setEditableCliente((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardar = async (id) => {
    try {
      const clienteRef = doc(db, "clientes", id);
      await updateDoc(clienteRef, editableCliente);
      setClientes((prev) =>
        prev.map((cliente) =>
          cliente.id === id ? { ...cliente, ...editableCliente } : cliente
        )
      );
      alert("Información guardada correctamente.");
    } catch (error) {
      console.error("Error al guardar la información:", error);
      alert("Hubo un error al guardar la información.");
    }
  };

  if (loading) {
    return <p>Cargando información...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const filteredClientes = clientes.filter((cliente) => {
    const nombre = cliente.nombre || ""; // Asegurarse de que el nombre no sea undefined
    return nombre.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (filteredClientes.length === 0) {
    return <p>No hay clientes que coincidan con la búsqueda.</p>;
  }

  return (
    <section style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <header>
        <h1 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 32 }}>Lista de Clientes</h1>
      </header>
      <div style={{ marginBottom: 32 }}>
        <label htmlFor="search" style={{ display: "block", marginBottom: "5px", fontWeight: 600 }}>
          Buscar Cliente:
        </label>
        <input
          id="search"
          type="text"
          style={{
            width: "100%",
            borderRadius: "5px",
            margin: "10px 0",
            padding: "15px",
            border: "1px solid #90caf9",
            fontSize: "1.2rem",
            background: '#f5faff',
          }}
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          width: "100%",
          margin: 0,
        }}
      >
        {filteredClientes.map((cliente) => (
          <li
            key={cliente.id}
            style={{
              border: "1px solid #90caf9",
              borderRadius: "10px",
              padding: "18px 18px 0 18px",
              marginBottom: "24px",
              background: '#fff',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.07)'
            }}
          >
            <article>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ flex: 1, fontSize: 20, fontWeight: 600, color: '#0d47a1' }}>
                  <span><strong>Nombre:</strong> {cliente.nombre || "No especificado"}</span>
                  <span style={{ marginLeft: 24 }}><strong>Teléfono:</strong> {cliente.telefono || "No especificado"}</span>
                  <span style={{ marginLeft: 24 }}><strong>Correo:</strong> {cliente.correo || "No especificado"}</span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => toggleExpand(cliente.id)}
                    style={{
                      backgroundColor: expandedCliente === cliente.id ? "#1976d2" : "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      padding: "7px 16px",
                      fontWeight: "bold",
                      fontSize: 16
                    }}
                  >
                    {expandedCliente === cliente.id ? "Ocultar Información" : "Más Información"}
                  </button>
                </div>
              </div>
              {expandedCliente === cliente.id && (
                <section style={{
                  marginTop: "18px",
                  backgroundColor: "#e3f2fd",
                  padding: "32px 28px 28px 28px",
                  borderRadius: "14px",
                  color: "#222",
                  boxShadow: "0 4px 16px rgba(25,118,210,0.13)",
                  border: "2px solid #1976d2",
                  width: '100%',
                  minHeight: 320,
                  fontSize: 18
                }}>
                  <h3 style={{ color: '#1976d2', marginBottom: 28, textAlign: 'center', fontSize: 28, letterSpacing: 1 }}>Detalles del Cliente</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, marginBottom: 24 }}>
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <p style={{ fontWeight: 700, fontSize: 22, color: '#0d47a1', marginBottom: 10 }}>
                        <strong>Nombre:</strong>
                        <input
                          type="text"
                          value={editableCliente.nombre || cliente.nombre || ""}
                          onChange={(e) => handleEditChange("nombre", e.target.value)}
                          style={{ marginLeft: 10, padding: 5, fontSize: 16, borderRadius: 5, border: "1px solid #90caf9" }}
                        />
                      </p>
                      <p>
                        <strong>Edad:</strong>
                        <input
                          type="number"
                          value={editableCliente.edad || cliente.edad || ""}
                          onChange={(e) => handleEditChange("edad", e.target.value)}
                          style={{ marginLeft: 10, padding: 5, fontSize: 16, borderRadius: 5, border: "1px solid #90caf9" }}
                        />
                      </p>
                      <p>
                        <strong>Dirección:</strong>
                        <input
                          type="text"
                          value={editableCliente.direccion || cliente.direccion || ""}
                          onChange={(e) => handleEditChange("direccion", e.target.value)}
                          style={{ marginLeft: 10, padding: 5, fontSize: 16, borderRadius: 5, border: "1px solid #90caf9" }}
                        />
                      </p>
                      <p>
                        <strong>Teléfono:</strong>
                        <input
                          type="text"
                          value={editableCliente.telefono || cliente.telefono || ""}
                          onChange={(e) => handleEditChange("telefono", e.target.value)}
                          style={{ marginLeft: 10, padding: 5, fontSize: 16, borderRadius: 5, border: "1px solid #90caf9" }}
                        />
                      </p>
                      <p>
                        <strong>Correo Electrónico:</strong>
                        <input
                          type="email"
                          value={editableCliente.correo || cliente.correo || ""}
                          onChange={(e) => handleEditChange("correo", e.target.value)}
                          style={{ marginLeft: 10, padding: 5, fontSize: 16, borderRadius: 5, border: "1px solid #90caf9" }}
                        />
                      </p>
                    </div>
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <p style={{ marginBottom: 4 }}><strong>Contacto de Emergencia:</strong></p>
                      <ul style={{ marginLeft: 20, marginBottom: 12 }}>
                        <li>
                          <strong>Nombre:</strong>
                          <input
                            type="text"
                            value={editableCliente.contactoEmergencia?.nombre || cliente.contactoEmergencia?.nombre || ""}
                            onChange={(e) => handleEditChange("contactoEmergencia.nombre", e.target.value)}
                            style={{ marginLeft: 10, padding: 5, fontSize: 16, borderRadius: 5, border: "1px solid #90caf9" }}
                          />
                        </li>
                        <li>
                          <strong>Relación:</strong>
                          <input
                            type="text"
                            value={editableCliente.contactoEmergencia?.relacion || cliente.contactoEmergencia?.relacion || ""}
                            onChange={(e) => handleEditChange("contactoEmergencia.relacion", e.target.value)}
                            style={{ marginLeft: 10, padding: 5, fontSize: 16, borderRadius: 5, border: "1px solid #90caf9" }}
                          />
                        </li>
                        <li>
                          <strong>Teléfono:</strong>
                          <input
                            type="text"
                            value={editableCliente.contactoEmergencia?.telefono || cliente.contactoEmergencia?.telefono || ""}
                            onChange={(e) => handleEditChange("contactoEmergencia.telefono", e.target.value)}
                            style={{ marginLeft: 10, padding: 5, fontSize: 16, borderRadius: 5, border: "1px solid #90caf9" }}
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, marginBottom: 20, background: '#f5faff', borderRadius: 10, padding: 16 }}>
                    <h4 style={{ color: '#1976d2', marginBottom: 10, fontSize: 20 }}>Historial Médico</h4>
                    <ul style={{ marginLeft: 20 }}>
                      <li><strong>Condiciones:</strong> {
                        Array.isArray(cliente.historialMedico?.condiciones)
                          ? cliente.historialMedico.condiciones.join(", ")
                          : (cliente.historialMedico?.condiciones || "No especificado")
                      }</li>
                      <li><strong>Notas:</strong> {cliente.historialMedico?.notas || "No especificado"}</li>
                    </ul>
                  </div>
                  <div style={{ marginTop: 12, marginBottom: 20, background: '#f5faff', borderRadius: 10, padding: 16 }}>
                    <h4 style={{ color: '#1976d2', marginBottom: 10, fontSize: 20 }}>Recordatorios de Medicamentos</h4>
                    <ul style={{ marginLeft: 20 }}>
                      {(Array.isArray(cliente.recordatoriosMedicamentos) && cliente.recordatoriosMedicamentos.length > 0)
                        ? cliente.recordatoriosMedicamentos.map((med, idx) => (
                          <li key={idx} style={{ marginBottom: 4 }}>
                            <span style={{ display: 'inline-block', minWidth: 120 }}><strong>Nombre:</strong> {med.nombreMedicamento || "No especificado"}</span>
                            <span style={{ display: 'inline-block', minWidth: 90 }}><strong>Dosis:</strong> {med.dosis || "No especificado"}</span>
                            <span style={{ display: 'inline-block', minWidth: 120 }}><strong>Frecuencia:</strong> {med.frecuencia || "No especificado"}</span>
                          </li>
                        ))
                        : (<li>No especificado</li>)}
                    </ul>
                  </div>
                  <div style={{ marginTop: 12, background: '#f5faff', borderRadius: 10, padding: 16 }}>
                    <h4 style={{ color: '#1976d2', marginBottom: 10, fontSize: 20 }}>Agenda de Citas</h4>
                    <ul style={{ marginLeft: 20 }}>
                      {(Array.isArray(cliente.agendaCitas) && cliente.agendaCitas.length > 0)
                        ? cliente.agendaCitas.map((cita, idx) => (
                          <li key={idx} style={{ marginBottom: 4 }}>
                            <span style={{ display: 'inline-block', minWidth: 110 }}><strong>Fecha:</strong> {cita.fecha || "No especificado"}</span>
                            <span style={{ display: 'inline-block', minWidth: 90 }}><strong>Tipo:</strong> {cita.tipo || "No especificado"}</span>
                            <span style={{ display: 'inline-block', minWidth: 160 }}><strong>Descripción:</strong> {cita.descripcion || "No especificado"}</span>
                          </li>
                        ))
                        : (<li>No especificado</li>)}
                    </ul>
                  </div>
                  <button
                    onClick={() => handleGuardar(cliente.id)}
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      padding: "10px 20px",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginTop: 20,
                      marginRight: 10
                    }}
                  >
                    Guardar Información
                  </button>
                  <button
                    onClick={() => handleEliminar(cliente.id)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      padding: "10px 20px",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginTop: 20
                    }}
                  >
                    Eliminar Cliente
                  </button>
                </section>
              )}
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ClientesList;
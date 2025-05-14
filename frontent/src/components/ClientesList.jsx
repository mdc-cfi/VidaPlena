import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import Navbar from "./Navbar";

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCliente, setExpandedCliente] = useState(null);
  const [condicionesMedicas, setCondicionesMedicas] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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

  const toggleExpand = async (id) => {
    if (expandedCliente === id) {
      setExpandedCliente(null);
      return;
    }

    try {
      console.log(`Obteniendo datos para el cliente con ID: ${id}`);
      const clienteDoc = await getDoc(doc(db, "clientes", id));
      if (clienteDoc.exists()) {
        const clienteData = clienteDoc.data();
        console.log("Datos del cliente obtenidos:", clienteData);
        const condiciones = clienteData.historialMedico?.condiciones || [];
        console.log("Condiciones médicas del cliente:", condiciones);
        setCondicionesMedicas((prev) => ({ ...prev, [id]: condiciones }));
        setExpandedCliente(id);
      } else {
        console.warn(`No se encontró información para el cliente con ID: ${id}`);
        setCondicionesMedicas((prev) => ({ ...prev, [id]: [] }));
      }
    } catch (error) {
      console.error("Error al obtener las condiciones médicas del cliente:", error);
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
    <>
      <Navbar role="admin" />
      <section>
        <header>
          <h1>Lista de Clientes</h1>
        </header>
        <div>
          <label htmlFor="search" style={{ display: "block", marginBottom: "5px" }}>
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
              border: "1px solid #ccc",
              fontSize: "1.2rem",
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
            width: "90%",
            margin: "0 auto",
          }}
        >
          {filteredClientes.map((cliente) => (
            <li
              key={cliente.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <article>
                <header style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <div style={{ flex: 1 }}>
                    <span><strong>Nombre:</strong> {cliente.nombre}</span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Evitar cualquier comportamiento de redirección por defecto
                        toggleExpand(cliente.id);
                      }}
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        padding: "5px 10px",
                        fontWeight: "bold",
                      }}
                    >
                      {expandedCliente === cliente.id ? "Ocultar Información" : "Más Información"}
                    </button>
                    <button
                      onClick={() => handleEliminar(cliente.id)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        padding: "5px 10px",
                        fontWeight: "bold",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </header>
                {expandedCliente === cliente.id && (
                  <section style={{ marginTop: "10px" }}>
                    <p><strong>Email:</strong> {cliente.email}</p>
                    <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                    <h4>Condiciones Médicas:</h4>
                    {condicionesMedicas[cliente.id] && condicionesMedicas[cliente.id].length > 0 ? (
                      <ul>
                        {condicionesMedicas[cliente.id].map((condicion, index) => (
                          <li key={index}>{condicion}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No hay condiciones médicas registradas para este cliente.</p>
                    )}
                  </section>
                )}
              </article>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default ClientesList;

import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";

const ClientesList = () => {
  // Estado para almacenar la lista de clientes
  const [clientes, setClientes] = useState([]);
  // Estado para manejar el indicador de carga
  const [loading, setLoading] = useState(true);
  // Estado para manejar qué cliente está expandido
  const [expandedCliente, setExpandedCliente] = useState(null);
  // Estado para manejar el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Función para obtener los clientes desde Firestore
  const fetchClientes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      const clientesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(clientesArray); // Actualiza el estado con los clientes obtenidos
    } catch (error) {
      console.error("Error al obtener clientes:", error); // Manejo de errores
    } finally {
      setLoading(false); // Finaliza el indicador de carga
    }
  };

  // Hook para cargar los clientes al montar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  // Función para eliminar un cliente
  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este cliente?")) {
      try {
        await deleteDoc(doc(db, "clientes", id)); // Elimina el cliente de Firestore
        setClientes((prev) => prev.filter((cliente) => cliente.id !== id)); // Actualiza el estado
      } catch (error) {
        console.error("Error al eliminar cliente:", error); // Manejo de errores
      }
    }
  };

  // Función para alternar la expansión de información de un cliente
  const toggleExpand = (id) => {
    setExpandedCliente(expandedCliente === id ? null : id); // Alterna entre expandir y colapsar
  };

  // Muestra un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return <div><h2>Cargando clientes...</h2></div>;
  }

  // Filtra los clientes según el término de búsqueda
  const filteredClientes = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section>
      {/* Encabezado principal */}
      <header>
        <h1>Lista de Clientes</h1>
      </header>

      {/* Campo de búsqueda */}
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
          onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el término de búsqueda
        />
      </div>

      {/* Lista de clientes filtrados */}
      {filteredClientes.length === 0 ? (
        <p>No hay clientes que coincidan con la búsqueda.</p> // Mensaje si no hay resultados
      ) : (
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
              key={cliente.id} // Identificador único para cada cliente
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <article>
                {/* Encabezado del cliente */}
                <header style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <div style={{ flex: 1 }}>
                    <span><strong>Nombre:</strong> {cliente.nombre}</span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {/* Botón para expandir o colapsar información */}
                    <button
                      onClick={() => toggleExpand(cliente.id)}
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
                    {/* Botón para eliminar cliente */}
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

                {/* Información expandida del cliente */}
                {expandedCliente === cliente.id && (
                  <section style={{
                    marginTop: "10px",
                    backgroundColor: "#f8f9fa",
                    padding: "10px",
                    borderRadius: "5px",
                    color: "#000",
                  }}>
                    <h4>Apartados Importantes</h4>
                    <p><strong>Teléfono:</strong> {cliente.telefono || "No especificado"}</p>
                    <p><strong>Contacto de Emergencia:</strong> {cliente.contactoEmergencia?.telefono || "No especificado"}</p>
                    <p><strong>Condiciones Médicas:</strong> {cliente.historialMedico?.condiciones?.join(", ") || "No especificado"}</p>
                  </section>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ClientesList;

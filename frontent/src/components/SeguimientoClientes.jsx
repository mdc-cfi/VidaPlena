import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config"; // Asegúrate de importar correctamente la configuración de Firebase

function SeguimientoClientes() {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clientes"));
        const clientesFirestore = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setClientes(clientesFirestore);
      } catch (error) {
        console.error("Error al obtener clientes desde Firestore:", error);
      }
    };

    fetchClientes();
  }, []);

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
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

      {filteredClientes.length === 0 ? (
        <p>No hay clientes que coincidan con la búsqueda.</p>
      ) : (
        <ul className="list-group">
          {filteredClientes.map((cliente, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{
                transition: 'transform 0.2s, background-color 0.2s',
                cursor: 'pointer',
                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                fontSize: '16px',
                padding: '15px',
                borderRadius: '5px',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onClick={() => navigate(`/admin/cliente/${cliente.id}`)}
            >
              <span>{cliente.nombre}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SeguimientoClientes;
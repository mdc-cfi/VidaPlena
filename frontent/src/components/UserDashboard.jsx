import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config.js";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Componente principal del dashboard de usuario
const UserDashboard = () => {
  const [userData, setUserData] = useState(null); // Estado para los datos del usuario
  const [error, setError] = useState(null); // Estado para errores
  const auth = getAuth(); // Instancia de autenticación
  const user = auth.currentUser; // Usuario autenticado
  const navigate = useNavigate(); // Hook de navegación

  // Efecto para obtener los datos del usuario al montar el componente
  useEffect(() => {
    if (!user) {
      setError("ID de usuario no válido.");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "clientes", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setError("No se encontró información del usuario.");
        }
      } catch (error) {
        setError("Error al obtener la información del usuario: " + error.message);
      }
    };

    fetchUserData();
  }, [user]);

  if (error) {
    // Muestra mensaje de error si ocurre
    return <p>Error: {error}</p>;
  }

  if (!userData) {
    // Muestra mensaje de carga mientras se obtienen los datos
    return <p>Cargando información...</p>;
  }

  return (
    <div>
      {/* Contenedor principal del dashboard de usuario */}
      <div className="container mt-5">
        {/* Título de bienvenida personalizado */}
        <h1 className="text-center mb-4">Bienvenido, {userData.nombreCompleto}</h1>
        <div className="row">
          {/* Tarjeta de Condiciones Médicas */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Condiciones Médicas</h5>
                <p>En esta sección puedes consultar y gestionar las condiciones médicas registradas, proporcionando un historial detallado.</p>
                {userData.condicionesMedicas && userData.condicionesMedicas.length > 0 ? (
                  <ul>
                    {userData.condicionesMedicas.map((condicion, index) => (
                      <li key={index}>{condicion}</li>
                    ))}
                  </ul>
                ) : null}
                {/* Botón para ver más */}
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => navigate('/condiciones-medicas')}
                >
                  Ver más
                </button>
              </div>
            </div>
          </div>
          {/* Tarjeta de Medicamentos */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Medicamentos</h5>
                <p>En esta sección puedes gestionar y consultar los medicamentos asignados, incluyendo detalles como dosis y frecuencia.</p>
                {userData.medicamentos && userData.medicamentos.length > 0 ? (
                  <ul>
                    {userData.medicamentos.map((med, index) => (
                      <li key={index}>{med.nombre} - {med.dosis}</li>
                    ))}
                  </ul>
                ) : null}
                {/* Botón para ver más */}
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => navigate('/medicamentos')}
                >
                  Ver más
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
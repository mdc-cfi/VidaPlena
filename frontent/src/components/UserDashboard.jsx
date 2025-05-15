import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config.js";
import Navbar from "./Navbar";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

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
    return <p>Error: {error}</p>;
  }

  if (!userData) {
    return <p>Cargando información...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Bienvenido, {userData.nombreCompleto}</h1>
        <div className="row">
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
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => navigate('/condiciones-medicas')}
                >
                  Ver más
                </button>
              </div>
            </div>
          </div>
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
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => navigate('/medicamentos')}
                >
                  Ver más
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Agendar Citas</h5>
                <p>En esta sección puedes programar y gestionar tus citas médicas.</p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => navigate('/agenda-citas')}
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
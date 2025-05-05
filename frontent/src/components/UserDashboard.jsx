import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config.js";

const UserDashboard = ({ userId }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "clientes", userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.error("No se encontró información del usuario.");
        }
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) {
    return <p>Cargando información...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Bienvenido, {userData.nombreCompleto}</h1>
      <div className="row">
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Correo Electrónico</h5>
              <p>{userData.correoElectronico}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Condiciones Médicas</h5>
              <p>{userData.condicionesMedicas || "No especificado"}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Medicamentos</h5>
              {userData.medicamentos && userData.medicamentos.length > 0 ? (
                <ul>
                  {userData.medicamentos.map((med, index) => (
                    <li key={index}>{med.nombre} - {med.dosis}</li>
                  ))}
                </ul>
              ) : (
                <p>No hay medicamentos registrados.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
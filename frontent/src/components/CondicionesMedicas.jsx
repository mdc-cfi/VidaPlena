import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import Navbar from './Navbar';
import { getAuth } from 'firebase/auth';

const CondicionesMedicas = () => {
  const [condiciones, setCondiciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCondiciones = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          console.log("Intentando obtener condiciones médicas para UID:", user.uid);
          const docRef = doc(db, "condicionesMedicas", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const condicionesData = docSnap.data().condicionesMedicas;
            console.log("Condiciones médicas obtenidas:", condicionesData);
            setCondiciones(condicionesData);
          } else {
            console.warn("No se encontraron condiciones médicas para este usuario.");
          }
        } else {
          console.warn("No hay un usuario autenticado en CondicionesMedicas.");
        }
      } catch (err) {
        console.error("Error al obtener las condiciones médicas:", err);
        setError("No se pudo cargar la información de las condiciones médicas.");
      } finally {
        setLoading(false);
      }
    };

    fetchCondiciones();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <p>Cargando condiciones médicas...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <p>Error: {error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Condiciones Médicas</h1>
        <p className="text-center">Aquí puedes gestionar y consultar las condiciones médicas registradas.</p>
        {condiciones.length > 0 ? (
          <ul className="list-group">
            {condiciones.map((condicion, index) => (
              <li key={index} className="list-group-item">
                <strong>Condición:</strong> {condicion}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No hay condiciones médicas registradas para este cliente.</p>
        )}
      </div>
    </>
  );
};

export default CondicionesMedicas;
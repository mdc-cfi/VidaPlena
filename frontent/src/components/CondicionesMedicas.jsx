import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';

const CondicionesMedicas = () => {
  const [condiciones, setCondiciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setError('Usuario no válido.');
      return;
    }

    const fetchCondiciones = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'clientes', user.uid));
        if (userDoc.exists()) {
          setCondiciones(userDoc.data().condicionesMedicas || []);
        } else {
          setError('No se encontraron condiciones médicas para este usuario.');
        }
      } catch (err) {
        setError('Error al obtener las condiciones médicas: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCondiciones();
  }, [user]);

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Cargando condiciones médicas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
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
  );
};

export default CondicionesMedicas;
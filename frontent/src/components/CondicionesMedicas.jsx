import React, { useEffect, useState } from 'react';

import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';

const CondicionesMedicas = ({ role }) => {
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
        if (role === 'admin') {
          // ADMIN: obtener condiciones de todos los clientes
          const clientesSnapshot = await getDocs(collection(db, 'clientes'));
          let allCondiciones = [];
          clientesSnapshot.forEach(clienteDoc => {
            const data = clienteDoc.data();
            let condicionesArray = data.condicionesMedicas || [];
            if ((!condicionesArray || condicionesArray.length === 0) && data.condiciones) {
              condicionesArray = [data.condiciones];
            }
            condicionesArray.forEach(cond => {
              allCondiciones.push({
                condicion: cond,
                cliente: data.nombre || data.name || data.email || clienteDoc.id
              });
            });
          });
          setCondiciones(allCondiciones);
        } else {
          // CLIENTE: solo sus condiciones
          const userDoc = await getDoc(doc(db, 'clientes', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            let condicionesArray = data.condicionesMedicas || [];
            if ((!condicionesArray || condicionesArray.length === 0) && data.condiciones) {
              condicionesArray = [data.condiciones];
            }
            // Nuevo: buscar en historialMedico.condiciones si sigue vacío
            if ((!condicionesArray || condicionesArray.length === 0) && data.historialMedico && data.historialMedico.condiciones) {
              condicionesArray = [data.historialMedico.condiciones];
            }
            setCondiciones(condicionesArray.map(cond => ({ condicion: cond })));
          } else {
            setError('No se encontraron condiciones médicas para este usuario.');
          }
        }
      } catch (err) {
        setError('Error al obtener las condiciones médicas: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCondiciones();
  }, [user, role]);

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
          {condiciones.map((condicionObj, index) => (
            <li key={index} className="list-group-item">
              <strong>Condición:</strong> {typeof condicionObj === 'string' ? condicionObj : condicionObj.condicion}
              {condicionObj.cliente && (
                <><br /><em>Cliente:</em> {condicionObj.cliente}</>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No hay condiciones médicas registradas.</p>
      )}
    </div>
  );
};

export default CondicionesMedicas;
import React, { useEffect, useState } from 'react';

import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';

const CondicionesMedicas = ({ role }) => {
  const [condiciones, setCondiciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
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
                cliente: data.nombre || data.name || data.email || clienteDoc.id,
                clienteId: clienteDoc.id
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

  const handleDeleteCondicion = async (condicion, targetId) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la condición "${condicion}"?`)) {
      try {
        const userDocRef = doc(db, 'clientes', targetId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          let condicionesArray = userDocSnap.data().historialMedico?.condiciones || [];
          if (typeof condicionesArray === 'string') condicionesArray = [condicionesArray];
          condicionesArray = condicionesArray.filter(cond => cond !== condicion);
          await updateDoc(userDocRef, { 'historialMedico.condiciones': condicionesArray });
          setCondiciones(condiciones.filter(condObj => condObj.condicion !== condicion));
        }
      } catch (err) {
        setError('Error al eliminar la condición: ' + err.message);
      }
    }
  };

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
        <div className="row justify-content-center">
          {condiciones.map((condicionObj, index) => (
            <div key={index} className="card mb-3" style={{ maxWidth: 800, margin: '0 auto', background: '#fff', boxShadow: '0 2px 8px #0001' }}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <span style={{ flex: 1 }}>
                  <strong>Condición:</strong> {editIndex === index ? (
                    <input
                      type="text"
                      className="form-control d-inline-block w-auto ms-2"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      style={{ maxWidth: 300, display: 'inline-block' }}
                    />
                  ) : (
                    typeof condicionObj === 'string' ? condicionObj : condicionObj.condicion
                  )}
                  {condicionObj.cliente && (
                    <><br /><em>Cliente:</em> {condicionObj.cliente}</>
                  )}
                </span>
                {editIndex === index ? (
                  <>
                    <button className="btn btn-success btn-sm ms-2" onClick={async () => {
                      // Guardar edición
                      let targetId = condicionObj.clienteId || user.uid;
                      const userDocRef = doc(db, 'clientes', targetId);
                      const userDocSnap = await getDoc(userDocRef);
                      if (userDocSnap.exists()) {
                        let condicionesArray = userDocSnap.data().historialMedico?.condiciones || [];
                        if (typeof condicionesArray === 'string') condicionesArray = [condicionesArray];
                        condicionesArray[index] = editText;
                        await updateDoc(userDocRef, { 'historialMedico.condiciones': condicionesArray });
                        setEditIndex(null);
                        setEditText("");
                        window.location.reload();
                      }
                    }}>
                      Guardar
                    </button>
                    <button className="btn btn-secondary btn-sm ms-2" onClick={() => { setEditIndex(null); setEditText(""); }}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-warning btn-sm ms-2" onClick={() => { setEditIndex(index); setEditText(typeof condicionObj === 'string' ? condicionObj : condicionObj.condicion); }}>
                      Editar
                    </button>
                    <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDeleteCondicion(condicionObj.condicion, condicionObj.clienteId || user.uid)}>
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No hay condiciones médicas registradas.</p>
      )}
      <div className="mt-4 text-center">
        <input
          type="text"
          className="form-control d-inline-block w-auto"
          placeholder="Nueva condición médica"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          style={{ maxWidth: 300, display: 'inline-block' }}
        />
        <button className="btn btn-primary ms-2" onClick={async () => {
          if (!editText.trim()) return;
          let targetId = user.uid;
          if (role === 'admin' && condiciones.length > 0 && condiciones[0].clienteId) {
            // Si eres admin y hay condiciones, puedes elegir a qué cliente añadir (aquí solo añade al usuario actual)
            // Puedes mejorar esto con un select de clientes si lo necesitas
          }
          const userDocRef = doc(db, 'clientes', targetId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            let condicionesArray = userDocSnap.data().historialMedico?.condiciones || [];
            if (typeof condicionesArray === 'string') condicionesArray = [condicionesArray];
            condicionesArray.push(editText.trim());
            await updateDoc(userDocRef, { 'historialMedico.condiciones': condicionesArray });
            setEditText("");
            window.location.reload();
          }
        }}>
          Añadir Condición
        </button>
      </div>
    </div>
  );
};

export default CondicionesMedicas;
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          // Buscar en usuarios, clientes y administradores
          let userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (!userDoc.exists()) {
            userDoc = await getDoc(doc(db, 'clientes', user.uid));
          }
          if (!userDoc.exists()) {
            userDoc = await getDoc(doc(db, 'administradores', user.uid));
          }
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setError('No se encontraron datos para este usuario.');
          }
        } else {
          setError('No hay usuario autenticado.');
        }
      } catch (err) {
        setError('Error al obtener los datos: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <div className="container mt-5"><p>Cargando datos...</p></div>;
  if (error) return <div className="container mt-5"><p>{error}</p></div>;

  // Solo mostrar los campos deseados
  const camposMostrar = [
    ["email", "Email"],
    ["rol", "Rol"],
    ["nombre", "Nombre"],
    ["telefono", "Teléfono"],
    ["edad", "Edad"],
    ["direccion", "Dirección"]
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Información Personal</h1>
      <ul className="list-group">
        {camposMostrar.map(([key, label]) => (
          userData[key] && (
            <li key={key} className="list-group-item">
              <strong>{label}:</strong> {String(userData[key])}
            </li>
          )
        ))}
      </ul>
      {/* Mostrar contacto de emergencia si existe */}
      {userData.contactoEmergencia && (
        <div className="mt-4">
          <h5>Contacto de Emergencia</h5>
          <ul className="list-group">
            {userData.contactoEmergencia.nombre && (
              <li className="list-group-item">
                <strong>Nombre:</strong> {userData.contactoEmergencia.nombre}
              </li>
            )}
            {userData.contactoEmergencia.telefono && (
              <li className="list-group-item">
                <strong>Teléfono:</strong> {userData.contactoEmergencia.telefono}
              </li>
            )}
            {userData.contactoEmergencia.relacion && (
              <li className="list-group-item">
                <strong>Relación:</strong> {userData.contactoEmergencia.relacion}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Perfil;

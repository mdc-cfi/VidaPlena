import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';

const MedicamentosList = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          console.log("Intentando obtener medicamentos para UID:", user.uid);
          const docRef = doc(db, "medicamentos", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log("Datos obtenidos desde Firestore:", docSnap.data());
            const medicamentosData = docSnap.data().medicamentos;
            console.log("Medicamentos obtenidos para el usuario:", medicamentosData);
            console.log("Medicamentos obtenidos:", medicamentosData);
            setMedicamentos(medicamentosData);
          } else {
            console.warn("No se encontraron medicamentos para este usuario.");
          }
        } else {
          console.warn("No hay un usuario autenticado en MedicamentosList.");
        }
      } catch (err) {
        console.error("Error al obtener los medicamentos:", err);
        setError("No se pudo cargar la información de los medicamentos.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicamentos();
  }, []);

  if (loading) {
    return <p>Cargando medicamentos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Recordatorios de Medicamentos</h1>
        <p className="text-center">Aquí puedes gestionar los medicamentos registrados, agregar nuevos o editar los existentes.</p>
        <ul className="list-group">
          {medicamentos.map((medicamento) => (
            <li key={medicamento.id} className="list-group-item">
              <strong>{medicamento.nombre}</strong> - {medicamento.dosis} - {medicamento.frecuencia}
              <br />
              <em>Cliente:</em> {medicamento.clienteNombre || 'No especificado'}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MedicamentosList;
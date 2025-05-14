import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase.config';

const MedicamentosList = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setError('No hay usuario autenticado.');
          setLoading(false);
          return;
        }
        // Suponiendo que la colección 'medicamentos' tiene un campo 'userId' que relaciona el medicamento con el usuario
        const q = query(collection(db, 'medicamentos'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const meds = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMedicamentos(meds);
      } catch (err) {
        setError('Error al obtener los medicamentos.');
      } finally {
        setLoading(false);
      }
    };
    fetchMedicamentos();
  }, []);

  if (loading) return <p>Cargando medicamentos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Recordatorios de Medicamentos</h1>
      <p className="text-center">Aquí puedes gestionar los medicamentos registrados, agregar nuevos o editar los existentes.</p>
      <ul className="list-group">
        {medicamentos.length === 0 ? (
          <li className="list-group-item">No tienes medicamentos registrados.</li>
        ) : (
          medicamentos.map((medicamento) => (
            <li key={medicamento.id} className="list-group-item">
              <strong>{medicamento.nombre}</strong> - {medicamento.dosis} - {medicamento.frecuencia}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default MedicamentosList;
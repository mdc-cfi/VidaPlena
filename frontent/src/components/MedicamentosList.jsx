import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
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
          // Verificar si es admin
          const adminDoc = await getDoc(doc(db, "administradores", user.uid));
          if (adminDoc.exists()) {
            // ADMIN: obtener todos los medicamentos de todos los clientes
            let allMeds = [];
            // 1. Leer de la colección 'medicamentos'
            const querySnapshot = await getDocs(collection(db, "medicamentos"));
            for (const docu of querySnapshot.docs) {
              const data = docu.data();
              if (Array.isArray(data.medicamentos)) {
                allMeds = allMeds.concat(
                  data.medicamentos.map(med => ({
                    ...med,
                    clienteNombre: data.clienteNombre || docu.id
                  }))
                );
              }
            }
            // 2. Leer de la colección 'clientes' -> campo 'recordatoriosMedicamentos'
            const clientesSnapshot = await getDocs(collection(db, "clientes"));
            for (const clienteDoc of clientesSnapshot.docs) {
              const clienteData = clienteDoc.data();
              const recordatorios = clienteData.recordatoriosMedicamentos || [];
              recordatorios.forEach((med, idx) => {
                allMeds.push({
                  nombre: med.nombreMedicamento || med.nombre || "(Sin nombre)",
                  dosis: med.dosis || "-",
                  frecuencia: med.frecuencia || "-",
                  clienteNombre: clienteData.nombre || clienteData.name || clienteData.email || clienteDoc.id
                });
              });
            }
            setMedicamentos(allMeds);
          } else {
            // CLIENTE: dar prioridad a 'recordatoriosMedicamentos'
            const clienteDoc = await getDoc(doc(db, "clientes", user.uid));
            if (clienteDoc.exists()) {
              const recordatorios = clienteDoc.data().recordatoriosMedicamentos || [];
              if (recordatorios.length > 0) {
                // Si hay recordatorios, mostrar solo esos
                const adaptados = recordatorios.map((med, idx) => ({
                  id: idx,
                  nombre: med.nombreMedicamento || med.nombre || "(Sin nombre)",
                  dosis: med.dosis || "-",
                  frecuencia: med.frecuencia || "-"
                }));
                setMedicamentos(adaptados);
              } else {
                // Si no hay recordatorios, buscar en 'medicamentos'
                const docRef = doc(db, "medicamentos", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                  const medicamentosData = docSnap.data().medicamentos;
                  setMedicamentos(medicamentosData);
                } else {
                  setMedicamentos([]);
                }
              }
            } else {
              setMedicamentos([]);
            }
          }
        } else {
          setMedicamentos([]);
        }
      } catch (err) {
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
      <div className="container mt-5">
        <h1 className="text-center mb-4">Recordatorios de Medicamentos</h1>
        <p className="text-center">Aquí puedes gestionar los medicamentos registrados, agregar nuevos o editar los existentes.</p>
        <ul className="list-group">
          {medicamentos.map((medicamento, idx) => (
            <li key={medicamento.id || medicamento.nombre + idx} className="list-group-item">
              <strong>{medicamento.nombre}</strong> - {medicamento.dosis} - {medicamento.frecuencia}
              {medicamento.clienteNombre && (
                <><br /><em>Cliente:</em> {medicamento.clienteNombre}</>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MedicamentosList;
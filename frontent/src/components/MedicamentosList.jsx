import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';

const MedicamentosList = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editMed, setEditMed] = useState({});

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          // Verificar si es admin
          const adminDoc = await getDoc(doc(db, "administradores", user.uid));
          if (adminDoc.exists()) {
            setIsAdmin(true);
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
              recordatorios.forEach((med) => {
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

      } finally {
        setLoading(false);
      }
    
    };

    fetchMedicamentos();
  }, []);

  const handleEditClick = (idx) => {
    setEditIndex(idx);
    setEditMed(medicamentos[idx]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditMed((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (medicamento) => {
    // Buscar el cliente por nombre
    const clientesSnapshot = await getDocs(collection(db, "clientes"));
    const cliente = clientesSnapshot.docs.find(docu => (docu.data().nombre === medicamento.clienteNombre));
    if (cliente) {
      // Actualizar el medicamento en el array
      const recordatorios = cliente.data().recordatoriosMedicamentos || [];
      const idx = recordatorios.findIndex(med => med.nombreMedicamento === medicamento.nombre);
      if (idx !== -1) {
        recordatorios[idx] = {
          nombreMedicamento: editMed.nombre,
          dosis: editMed.dosis,
          frecuencia: editMed.frecuencia
        };
        await doc(db, "clientes", cliente.id).update({ recordatoriosMedicamentos: recordatorios });
      }
    }
    setEditIndex(null);
    setEditMed({});
    // Refrescar lista
    window.location.reload();
  };

  const handleDelete = async (medicamento) => {
    // Buscar el cliente por nombre
    const clientesSnapshot = await getDocs(collection(db, "clientes"));
    const cliente = clientesSnapshot.docs.find(docu => (docu.data().nombre === medicamento.clienteNombre));
    if (cliente) {
      let recordatorios = cliente.data().recordatoriosMedicamentos || [];
      recordatorios = recordatorios.filter(med => med.nombreMedicamento !== medicamento.nombre);
      await doc(db, "clientes", cliente.id).update({ recordatoriosMedicamentos: recordatorios });
    }
    // Refrescar lista
    window.location.reload();
  };

  if (loading) {
    return <p>Cargando medicamentos...</p>;
  }
  return (
    <>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Recordatorios de Medicamentos</h1>
        <p className="text-center">Aquí puedes gestionar los medicamentos registrados, agregar nuevos o editar los existentes.</p>
        <ul className="list-group">
          {medicamentos.map((medicamento, idx) => (
            <li key={medicamento.id || medicamento.nombre + idx} className="list-group-item">
              {isAdmin && editIndex === idx ? (
                <>
                  <input name="nombre" value={editMed.nombre} onChange={handleEditChange} /> -
                  <input name="dosis" value={editMed.dosis} onChange={handleEditChange} /> -
                  <input name="frecuencia" value={editMed.frecuencia} onChange={handleEditChange} />
                  <button className="guardar" onClick={() => handleEditSave(medicamento)}>Guardar</button>
                  <button className="cancelar" onClick={() => setEditIndex(null)}>Cancelar</button>
                </>
              ) : (
                <>
                  <strong>{medicamento.nombre}</strong> - {medicamento.dosis} - {medicamento.frecuencia}
                  {medicamento.clienteNombre && (
                    <><br /><em>Cliente:</em> {medicamento.clienteNombre}</>
                  )}
                  {isAdmin && (
                    <>
                      <button className="btn btn-warning btn-sm ms-2" onClick={() => handleEditClick(idx)}>Editar</button>
                      <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(medicamento)}>Eliminar</button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MedicamentosList;
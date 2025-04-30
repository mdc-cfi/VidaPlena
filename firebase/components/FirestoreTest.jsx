// src/components/FirestoreTest.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';

const FirestoreTest = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para obtener los documentos de la colección "items"
    const fetchData = async () => {
      try {
        const itemsCollection = collection(db, 'items'); // nombre de la colección
        const snapshot = await getDocs(itemsCollection);
        // Mapea los documentos y genera un arreglo
        const itemsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(itemsList);
      } catch (error) {
        console.error("Error al obtener los datos desde Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Datos desde Firestore</h2>
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              <strong>{item.nombre}</strong>: {item.descripcion ? item.descripcion : 'Sin descripción'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FirestoreTest;

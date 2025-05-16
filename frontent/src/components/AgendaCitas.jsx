import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { getAuth } from "firebase/auth";

const AgendaCitas = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    fecha: "",
    tipo: "",
    descripcion: "",
  });
  const [citas, setCitas] = useState([]);
  const [isCliente, setIsCliente] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      console.log("Estado de autenticación del usuario:", user);
      if (user) {
        console.log("Usuario autenticado:", user.email);
        try {
          const userDoc = await getDoc(doc(db, "usuarios", user.uid));
          console.log("Intentando obtener el documento del usuario con UID:", user.uid);
          if (userDoc.exists()) {
            console.log("Datos del usuario obtenidos desde Firestore:", userDoc.data());
            const userRole = userDoc.data().rol;
            console.log("Rol del usuario detectado:", userRole);
            if (userRole === "cliente") {
              console.log("El usuario tiene el rol de cliente.");
              setIsCliente(true);
            } else {
              console.warn("El usuario no tiene el rol de cliente. Rol detectado:", userRole);
            }
          } else {
            console.warn("No se encontró el documento del usuario en la base de datos.");
          }
        } catch (error) {
          console.error("Error al verificar el rol del usuario:", error);
        }
      } else {
        console.warn("No hay un usuario autenticado.");
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          console.log("Obteniendo citas para el usuario con UID:", user.uid);
          const querySnapshot = await getDocs(collection(db, "citas"));
          const citasData = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((cita) => cita.userId === user.uid);
          setCitas(citasData);
        } else {
          console.warn("No hay un usuario autenticado.");
        }
      } catch (error) {
        console.error("Error al cargar las citas:", error);
      }
    };

    fetchCitas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const nuevaCita = { ...formData, fecha: new Date(formData.fecha).toISOString(), userId: user.uid };
        const docRef = await addDoc(collection(db, "citas"), nuevaCita);
        console.log("Cita guardada con ID:", docRef.id);

        setCitas((prev) => [...prev, { id: docRef.id, ...nuevaCita }]);

        alert("Cita agendada con éxito");
        setFormData({ nombre: "", apellidos: "", fecha: "", tipo: "", descripcion: "" });
      } else {
        console.warn("No hay un usuario autenticado para guardar la cita.");
      }
    } catch (error) {
      console.error("Error al agendar la cita:", error);
      alert("Hubo un error al agendar la cita. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <>
      <div className="container mt-5">
        <h1 className="text-center">Agenda de Citas</h1>
        <p className="text-center">Organiza y visualiza tus citas médicas programadas.</p>
        <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-control"
              value={formData.nombre || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="apellidos" className="form-label">
              Apellidos
            </label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              className="form-control"
              value={formData.apellidos || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fecha" className="form-label">
              Fecha
            </label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              className="form-control"
              value={formData.fecha}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tipo" className="form-label">
              Tipo de Cita
            </label>
            <input
              type="text"
              id="tipo"
              name="tipo"
              className="form-control"
              value={formData.tipo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              className="form-control"
              value={formData.descripcion || ""}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Agendar Cita
          </button>
        </form>
        <h2 className="text-center mt-5">Citas Programadas</h2>
        <ul className="list-group">
          {citas.map((cita) => (
            <li key={cita.id} className="list-group-item">
              <p><strong>Nombre:</strong> {cita.nombre} {cita.apellidos}</p>
              <p><strong>Fecha:</strong> {cita.fecha}</p>
              <p><strong>Tipo:</strong> {cita.tipo}</p>
              <p><strong>Descripción:</strong> {cita.descripcion}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AgendaCitas;

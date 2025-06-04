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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        setIsAuthenticated(true);
        // Buscar en administradores
        const adminDoc = await getDoc(doc(db, "administradores", user.uid));
        if (adminDoc.exists()) {
          setIsAdmin(true);
        }
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    // Si es admin, obtener la lista de clientes
    const fetchClientes = async () => {
      if (isAdmin) {
        const querySnapshot = await getDocs(collection(db, "clientes"));
        setClientes(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    };
    fetchClientes();
  }, [isAdmin]);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const querySnapshot = await getDocs(collection(db, "citas"));
        let citasData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (!isAdmin && user) {
          citasData = citasData.filter((cita) => cita.userId === user.uid);
        }
        // Filtrar solo las citas cuya fecha es posterior a hoy
        const hoy = new Date();
        hoy.setHours(0,0,0,0);
        citasData = citasData.filter((cita) => {
          if (!cita.fecha) return false;
          const fechaCita = new Date(cita.fecha);
          fechaCita.setHours(0,0,0,0);
          // Solo mostrar si la cita es después de hoy
          return fechaCita > hoy;
        });
        setCitas(citasData);
      } catch (error) {
        console.error("Error al cargar las citas:", error);
      }
    };
    fetchCitas();
  }, [isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      let userId = user ? user.uid : null;
      if (isAdmin) {
        userId = selectedCliente;
      }
      if (userId) {
        const nuevaCita = { ...formData, fecha: new Date(formData.fecha).toISOString(), userId };
        const docRef = await addDoc(collection(db, "citas"), nuevaCita);
        console.log("Cita guardada con ID:", docRef.id);
        setCitas((prev) => [...prev, { id: docRef.id, ...nuevaCita }]);
        alert("Cita agendada con éxito");
        setFormData({ nombre: "", apellidos: "", fecha: "", tipo: "", descripcion: "" });
        if (isAdmin) setSelectedCliente("");
      } else {
        console.warn("No hay un usuario autenticado o seleccionado para guardar la cita.");
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
        {isAuthenticated && (
          <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
            {isAdmin && (
              <div className="mb-3">
                <label htmlFor="cliente" className="form-label">Seleccionar Cliente</label>
                <select
                  id="cliente"
                  className="form-control"
                  value={selectedCliente}
                  onChange={e => setSelectedCliente(e.target.value)}
                  required
                >
                  <option value="">Selecciona un cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                  ))}
                </select>
              </div>
            )}
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
        )}
        <h2 className="text-center mt-5">Citas Programadas</h2>
        {citas.length === 0 ? (
          <p className="text-center">No tienes citas futuras programadas.</p>
        ) : (
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
        )}
      </div>
    </>
  );
};

export default AgendaCitas;

import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { getAuth } from "firebase/auth";

const InformeCliente = () => {
  const [texto, setTexto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchInforme = async () => {
      if (!user) return setCargando(false);
      try {
        const docRef = doc(db, "clientes", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTexto(docSnap.data().informeCliente || "");
        }
      } catch (error) {
        setMensaje("Error al cargar el informe: " + error.message);
      } finally {
        setCargando(false);
      }
    };
    fetchInforme();
    // eslint-disable-next-line
  }, [user]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!user) return setMensaje("Usuario no autenticado");
    try {
      await updateDoc(doc(db, "clientes", user.uid), { informeCliente: texto });
      setMensaje("Informe guardado correctamente.");
    } catch (error) {
      setMensaje("Error al guardar: " + error.message);
    }
  };

  const handleBorrar = async () => {
    if (!user) return setMensaje("Usuario no autenticado");
    try {
      await updateDoc(doc(db, "clientes", user.uid), { informeCliente: "" });
      setTexto("");
      setMensaje("Informe borrado correctamente.");
    } catch (error) {
      setMensaje("Error al borrar: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Informe del Cliente</h2>
      {cargando ? (
        <div>Cargando informe...</div>
      ) : (
        <form onSubmit={handleGuardar}>
          <textarea
            className="form-control"
            rows={8}
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Escribe aquí tu informe, notas o cualquier información que desees guardar..."
          />
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-success" type="submit">Guardar</button>
            <button className="btn btn-outline-danger" type="button" onClick={handleBorrar} disabled={texto === ""}>
              Borrar
            </button>
          </div>
        </form>
      )}
      {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
    </div>
  );
};

export default InformeCliente;

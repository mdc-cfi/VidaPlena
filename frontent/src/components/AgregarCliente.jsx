import React, { useState } from "react";
import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";

const initialCliente = {
  nombre: "",
  edad: "",
  direccion: "",
  telefono: "",
  contactoEmergencia: {
    nombre: "",
    relacion: "",
    telefono: ""
  },
  historialMedico: {
    condiciones: "",
    notas: ""
  },
  recordatoriosMedicamentos: [{
    nombreMedicamento: "",
    dosis: "",
    frecuencia: ""
  }],
  agendaCitas: [{
    fecha: "",
    tipo: "",
    descripcion: ""
  }]
};

const labelStyle = { fontWeight: "bold", marginBottom: "4px" };
const inputStyle = {
  marginBottom: "14px",
  padding: "7px",
  borderRadius: "4px",
  border: "1px solid #444",
  background: "#222",
  color: "#fff",
  width: "95%"
};

const formGrid = {
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
};

const colStyle = {
  flex: "1 1 240px",
  minWidth: "220px",
  maxWidth: "350px",
  display: "flex",
  flexDirection: "column"
};

const AgregarCliente = () => {
  const [cliente, setCliente] = useState(initialCliente);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setCliente((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCliente((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación SIN fecha obligatoria
    if (
      !cliente.nombre ||
      !cliente.edad ||
      !cliente.direccion ||
      !cliente.telefono ||
      !cliente.contactoEmergencia.nombre ||
      !cliente.contactoEmergencia.telefono
    ) {
      setMensaje("Por favor, rellena todos los campos obligatorios marcados con *.");
      return;
    }

    const clienteID = cliente.nombre.toLowerCase().replace(/\s+/g, "_");

    const historialMedico = {
      condiciones: cliente.historialMedico.condiciones
        ? cliente.historialMedico.condiciones.split(",").map(s => s.trim())
        : [],
      notas: cliente.historialMedico.notas
    };

    const recordatoriosMedicamentos = [{
      nombreMedicamento: cliente.recordatoriosMedicamentos[0].nombreMedicamento,
      dosis: cliente.recordatoriosMedicamentos[0].dosis,
      frecuencia: cliente.recordatoriosMedicamentos[0].frecuencia
    }];

    const agendaCitas = [{
      fecha: cliente.agendaCitas[0].fecha,
      tipo: cliente.agendaCitas[0].tipo,
      descripcion: cliente.agendaCitas[0].descripcion
    }];

    try {
      await setDoc(doc(collection(db, "clientes"), clienteID), {
        nombre: cliente.nombre,
        edad: Number(cliente.edad),
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        contactoEmergencia: cliente.contactoEmergencia,
        historialMedico,
        recordatoriosMedicamentos,
        agendaCitas
      });
      setMensaje("Cliente agregado correctamente.");
      setCliente(initialCliente);
    } catch (error) {
      setMensaje("Error al agregar cliente.");
      console.error(error);
    }
  };

  return (
    <div style={{
      background: "#232323",
      borderRadius: "12px",
      padding: "25px",
      marginBottom: "32px",
      boxShadow: "0 4px 24px #0004",
      maxWidth: "900px"
    }}>
      <h2 style={{ marginBottom: "18px" }}>Agregar Cliente</h2>
      <form onSubmit={handleSubmit} style={formGrid}>
        {/* Columna 1 */}
        <div style={colStyle}>
          <label style={labelStyle}>Nombre completo *</label>
          <input style={inputStyle} type="text" name="nombre" placeholder="Ej: Juan Pérez" value={cliente.nombre} onChange={handleChange} required />

          <label style={labelStyle}>Edad *</label>
          <input style={inputStyle} type="number" name="edad" placeholder="Ej: 75" value={cliente.edad} onChange={handleChange} required />

          <label style={labelStyle}>Dirección *</label>
          <input style={inputStyle} type="text" name="direccion" placeholder="Ej: Calle, número, ciudad" value={cliente.direccion} onChange={handleChange} required />

          <label style={labelStyle}>Teléfono *</label>
          <input style={inputStyle} type="text" name="telefono" placeholder="Ej: 555-1234567" value={cliente.telefono} onChange={handleChange} required />

          <label style={labelStyle}>Contacto de Emergencia (Nombre) *</label>
          <input style={inputStyle} type="text" name="contactoEmergencia.nombre" placeholder="Ej: María Pérez" value={cliente.contactoEmergencia.nombre} onChange={handleChange} required />

          <label style={labelStyle}>Relación de Contacto</label>
          <input style={inputStyle} type="text" name="contactoEmergencia.relacion" placeholder="Ej: Hija, Esposo/a, etc." value={cliente.contactoEmergencia.relacion} onChange={handleChange} />

          <label style={labelStyle}>Teléfono de Emergencia *</label>
          <input style={inputStyle} type="text" name="contactoEmergencia.telefono" placeholder="Ej: 555-7654321" value={cliente.contactoEmergencia.telefono} onChange={handleChange} required />
        </div>

        {/* Columna 2 */}
        <div style={colStyle}>
          <label style={labelStyle}>Condiciones médicas (separadas por coma) </label>
          <input style={inputStyle} type="text" name="historialMedico.condiciones" placeholder="Ej: Diabetes, Hipertensión" value={cliente.historialMedico.condiciones} onChange={handleChange} />

          <label style={labelStyle}>Notas médicas</label>
          <input style={inputStyle} type="text" name="historialMedico.notas" placeholder="Notas adicionales" value={cliente.historialMedico.notas} onChange={handleChange} />

          <label style={labelStyle}>Medicamento</label>
          <input style={inputStyle} type="text" name="recordatoriosMedicamentos.0.nombreMedicamento" placeholder="Nombre del medicamento" value={cliente.recordatoriosMedicamentos[0].nombreMedicamento} onChange={e => setCliente(prev => ({
            ...prev,
            recordatoriosMedicamentos: [{
              ...prev.recordatoriosMedicamentos[0],
              nombreMedicamento: e.target.value
            }]
          }))} />

          <label style={labelStyle}>Dosis</label>
          <input style={inputStyle} type="text" name="recordatoriosMedicamentos.0.dosis" placeholder="Dosis" value={cliente.recordatoriosMedicamentos[0].dosis} onChange={e => setCliente(prev => ({
            ...prev,
            recordatoriosMedicamentos: [{
              ...prev.recordatoriosMedicamentos[0],
              dosis: e.target.value
            }]
          }))} />

          <label style={labelStyle}>Frecuencia</label>
          <input style={inputStyle} type="text" name="recordatoriosMedicamentos.0.frecuencia" placeholder="Frecuencia" value={cliente.recordatoriosMedicamentos[0].frecuencia} onChange={e => setCliente(prev => ({
            ...prev,
            recordatoriosMedicamentos: [{
              ...prev.recordatoriosMedicamentos[0],
              frecuencia: e.target.value
            }]
          }))} />

          <label style={labelStyle}>Fecha de cita</label>
          <input style={inputStyle} type="date" name="agendaCitas.0.fecha" value={cliente.agendaCitas[0].fecha} onChange={e => setCliente(prev => ({
            ...prev,
            agendaCitas: [{
              ...prev.agendaCitas[0],
              fecha: e.target.value
            }]
          }))} />

          <label style={labelStyle}>Tipo de cita</label>
          <input style={inputStyle} type="text" name="agendaCitas.0.tipo" placeholder="Ej: Revisión general" value={cliente.agendaCitas[0].tipo} onChange={e => setCliente(prev => ({
            ...prev,
            agendaCitas: [{
              ...prev.agendaCitas[0],
              tipo: e.target.value
            }]
          }))} />

          <label style={labelStyle}>Descripción cita</label>
          <input style={inputStyle} type="text" name="agendaCitas.0.descripcion" placeholder="Motivo de la cita" value={cliente.agendaCitas[0].descripcion} onChange={e => setCliente(prev => ({
            ...prev,
            agendaCitas: [{
              ...prev.agendaCitas[0],
              descripcion: e.target.value
            }]
          }))} />
        </div>

        {/* Botón y mensaje */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          minWidth: "160px"
        }}>
          <button
            type="submit"
            style={{
              marginTop: "14px",
              padding: "14px",
              background: "#222",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "7px",
              border: "none",
              fontSize: "1.1em",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            Agregar
          </button>
          {mensaje && <p style={{ marginTop: "12px", color: mensaje.includes("Error") ? "#ff7272" : "#8aff8a" }}>{mensaje}</p>}
          <p style={{ fontSize: "13px", color: "#aaa" }}>* Campos obligatorios</p>
        </div>
      </form>
    </div>
  );
};

export default AgregarCliente;

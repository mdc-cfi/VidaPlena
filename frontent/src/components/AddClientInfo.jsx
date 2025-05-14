import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase.config";

const AddClientInfo = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const initialCliente = {
    nombre: "",
    edad: "",
    direccion: "",
    telefono: "",
    contactoEmergencia: {
      nombre: "",
      relacion: "",
      telefono: "",
    },
    historialMedico: {
      condiciones: "",
      notas: "",
    },
    recordatoriosMedicamentos: [
      {
        nombreMedicamento: "",
        dosis: "",
        frecuencia: "",
      },
    ],
    agendaCitas: [
      {
        fecha: "",
        tipo: "",
        descripcion: "",
      },
    ],
  };

  const [cliente, setCliente] = useState(initialCliente);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleNestedChange = (e, field, subField) => {
    const { value } = e.target;
    setCliente({
      ...cliente,
      [field]: {
        ...cliente[field],
        [subField]: value,
      },
    });
  };

  const handleArrayChange = (e, field, index, subField) => {
    const { value } = e.target;
    const updatedArray = [...cliente[field]];
    updatedArray[index][subField] = value;
    setCliente({
      ...cliente,
      [field]: updatedArray,
    });
  };

  const addArrayItem = (field, newItem) => {
    setCliente({
      ...cliente,
      [field]: [...cliente[field], newItem],
    });
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = cliente[field].filter((_, i) => i !== index);
    setCliente({
      ...cliente,
      [field]: updatedArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "clientes", userId), cliente, { merge: true });
      alert("Información guardada exitosamente.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al guardar la información: ", error);
      alert("Hubo un error al guardar la información.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Añadir Información del Cliente</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={cliente.nombre}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Edad</label>
              <input
                type="number"
                name="edad"
                value={cliente.edad}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group mt-3">
          <label>Dirección</label>
          <input
            type="text"
            name="direccion"
            value={cliente.direccion}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={cliente.telefono}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <h3 className="mt-4">Contacto de Emergencia</h3>
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={cliente.contactoEmergencia.nombre}
                onChange={(e) => handleNestedChange(e, "contactoEmergencia", "nombre")}
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label>Relación</label>
              <input
                type="text"
                value={cliente.contactoEmergencia.relacion}
                onChange={(e) => handleNestedChange(e, "contactoEmergencia", "relacion")}
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                value={cliente.contactoEmergencia.telefono}
                onChange={(e) => handleNestedChange(e, "contactoEmergencia", "telefono")}
                className="form-control"
                required
              />
            </div>
          </div>
        </div>

        <h3 className="mt-4">Historial Médico</h3>
        <div className="form-group">
          <label>Condiciones</label>
          <textarea
            value={cliente.historialMedico.condiciones}
            onChange={(e) => handleNestedChange(e, "historialMedico", "condiciones")}
            className="form-control"
          />
        </div>
        <div className="form-group mt-3">
          <label>Notas</label>
          <textarea
            value={cliente.historialMedico.notas}
            onChange={(e) => handleNestedChange(e, "historialMedico", "notas")}
            className="form-control"
          />
        </div>

        <h3 className="mt-4">Recordatorios de Medicamentos</h3>
        {cliente.recordatoriosMedicamentos.map((med, index) => (
          <div key={index} className="form-group border p-3 mt-3">
            <label>Nombre del Medicamento</label>
            <input
              type="text"
              value={med.nombreMedicamento}
              onChange={(e) => handleArrayChange(e, "recordatoriosMedicamentos", index, "nombreMedicamento")}
              className="form-control"
            />
            <label>Dosis</label>
            <input
              type="text"
              value={med.dosis}
              onChange={(e) => handleArrayChange(e, "recordatoriosMedicamentos", index, "dosis")}
              className="form-control"
            />
            <label>Frecuencia</label>
            <input
              type="text"
              value={med.frecuencia}
              onChange={(e) => handleArrayChange(e, "recordatoriosMedicamentos", index, "frecuencia")}
              className="form-control"
            />
            <button
              type="button"
              onClick={() => removeArrayItem("recordatoriosMedicamentos", index)}
              className="btn btn-danger mt-2"
            >
              ❌ Eliminar Medicamento
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("recordatoriosMedicamentos", { nombreMedicamento: "", dosis: "", frecuencia: "" })}
          className="btn btn-success mt-3"
        >
          ➕ Añadir Medicamento
        </button>

        <h3 className="mt-4">Agenda de Citas</h3>
        {cliente.agendaCitas.map((cita, index) => (
          <div key={index} className="form-group border p-3 mt-3">
            <label>Fecha</label>
            <input
              type="date"
              value={cita.fecha}
              onChange={(e) => handleArrayChange(e, "agendaCitas", index, "fecha")}
              className="form-control"
            />
            <label>Tipo</label>
            <input
              type="text"
              value={cita.tipo}
              onChange={(e) => handleArrayChange(e, "agendaCitas", index, "tipo")}
              className="form-control"
            />
            <label>Descripción</label>
            <textarea
              value={cita.descripcion}
              onChange={(e) => handleArrayChange(e, "agendaCitas", index, "descripcion")}
              className="form-control"
            />
            <button
              type="button"
              onClick={() => removeArrayItem("agendaCitas", index)}
              className="btn btn-danger mt-2"
            >
              ❌ Eliminar Cita
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("agendaCitas", { fecha: "", tipo: "", descripcion: "" })}
          className="btn btn-success mt-3"
        >
          ➕ Añadir Cita
        </button>

        <button type="submit" className="btn btn-primary mt-4">
          Guardar Información
        </button>
      </form>
    </div>
  );
};

export default AddClientInfo;
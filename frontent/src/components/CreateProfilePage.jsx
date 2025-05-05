import React, { useState } from "react";
import { registerUserWithRole } from "../firebaseAuth";
import { useNavigate } from "react-router-dom";

const CreateProfilePage = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    sexo: "",
    fechaNacimiento: "",
    pais: "",
    numeroContacto: "",
    correoElectronico: "",
    medicoTratante: "",
    alergias: "",
    condicionesMedicas: "",
    medicamentos: [{
      nombre: "",
      dosis: "",
      frecuencia: "",
      horarios: "",
      duracion: "",
      notas: "",
    }],
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMedicamentoChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMedicamentos = [...formData.medicamentos];
    updatedMedicamentos[index][name] = value;
    setFormData({ ...formData, medicamentos: updatedMedicamentos });
  };

  const addMedicamento = () => {
    setFormData({
      ...formData,
      medicamentos: [
        ...formData.medicamentos,
        { nombre: "", dosis: "", frecuencia: "", horarios: "", duracion: "", notas: "" },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUserWithRole(formData.correoElectronico, "password123", formData); // Replace with actual password input
      console.log("Perfil creado con los datos:", formData);
      navigate("/dashboard"); // Redirige al dashboard o página principal
    } catch (error) {
      console.error("Error al guardar el perfil:", error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Crear Perfil</h1>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>
        <div>
          <label>Nombre completo:</label>
          <input
            type="text"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Sexo:</label>
          <select name="sexo" value={formData.sexo} onChange={handleInputChange} required>
            <option value="">Seleccione</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div>
          <label>Fecha de nacimiento:</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>País / zona horaria:</label>
          <input
            type="text"
            name="pais"
            value={formData.pais}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Número de contacto (opcional):</label>
          <input
            type="text"
            name="numeroContacto"
            value={formData.numeroContacto}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Correo electrónico (opcional):</label>
          <input
            type="email"
            name="correoElectronico"
            value={formData.correoElectronico}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Médico tratante (opcional):</label>
          <input
            type="text"
            name="medicoTratante"
            value={formData.medicoTratante}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Alergias conocidas:</label>
          <textarea
            name="alergias"
            value={formData.alergias}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label>Condiciones médicas actuales:</label>
          <textarea
            name="condicionesMedicas"
            value={formData.condicionesMedicas}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <h3>Medicamentos:</h3>
          {formData.medicamentos.map((medicamento, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <label>Nombre del medicamento:</label>
              <input
                type="text"
                name="nombre"
                value={medicamento.nombre}
                onChange={(e) => handleMedicamentoChange(index, e)}
              />
              <label>Dosis:</label>
              <input
                type="text"
                name="dosis"
                value={medicamento.dosis}
                onChange={(e) => handleMedicamentoChange(index, e)}
              />
              <label>Frecuencia:</label>
              <input
                type="text"
                name="frecuencia"
                value={medicamento.frecuencia}
                onChange={(e) => handleMedicamentoChange(index, e)}
              />
              <label>Horarios específicos:</label>
              <input
                type="text"
                name="horarios"
                value={medicamento.horarios}
                onChange={(e) => handleMedicamentoChange(index, e)}
              />
              <label>Duración del tratamiento:</label>
              <input
                type="text"
                name="duracion"
                value={medicamento.duracion}
                onChange={(e) => handleMedicamentoChange(index, e)}
              />
              <label>Notas / instrucciones:</label>
              <textarea
                name="notas"
                value={medicamento.notas}
                onChange={(e) => handleMedicamentoChange(index, e)}
              ></textarea>
            </div>
          ))}
          <button type="button" onClick={addMedicamento}>
            Añadir otro medicamento
          </button>
        </div>
        <button type="submit">Guardar Perfil</button>
      </form>
    </div>
  );
};

export default CreateProfilePage;
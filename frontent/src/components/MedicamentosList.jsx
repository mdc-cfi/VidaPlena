import React, { useState } from 'react';
import Navbar from './Navbar';

const MedicamentosList = () => {
  const [medicamentos, setMedicamentos] = useState([
    { id: 1, nombre: 'Paracetamol', dosis: '500mg', frecuencia: 'Cada 8 horas' },
    { id: 2, nombre: 'Ibuprofeno', dosis: '200mg', frecuencia: 'Cada 12 horas' },
  ]);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Recordatorios de Medicamentos</h1>
        <p className="text-center">Aquí puedes gestionar los medicamentos registrados, agregar nuevos o editar los existentes.</p>
        <ul className="list-group">
          {medicamentos.map((medicamento) => (
            <li key={medicamento.id} className="list-group-item">
              <strong>{medicamento.nombre}</strong> - {medicamento.dosis} - {medicamento.frecuencia}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MedicamentosList;
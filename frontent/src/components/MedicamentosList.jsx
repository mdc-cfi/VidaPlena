import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';

const MedicamentosList = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editMed, setEditMed] = useState({});
  const [expedientes, setExpedientes] = useState([]);

  // --- ARCHIVADO SEMANAL Y CREACIÓN DE NUEVA SEMANA ---
  useEffect(() => {
    const archivarSemanaAnterior = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      // Calcular semana actual y anterior
      function getYearWeek(date) {
        const d = new Date(date);
        d.setHours(0,0,0,0);
        d.setDate(d.getDate() + 4 - (d.getDay()||7));
        const yearStart = new Date(d.getFullYear(),0,1);
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
        return `${d.getFullYear()}-W${weekNo}`;
      }
      const today = new Date();
      const semanaActual = getYearWeek(today);
      // Semana anterior
      const semanaAnteriorDate = new Date(today);
      semanaAnteriorDate.setDate(today.getDate() - 7);
      const semanaAnterior = getYearWeek(semanaAnteriorDate);
      // Buscar en localStorage todos los keys de dosisChecks de la semana anterior
      const keys = Object.keys(localStorage).filter(k => k.includes(`dosisChecks_${user.uid}`) && k.includes(semanaAnterior));
      if (keys.length === 0) return;
      // Obtener los datos de medicamentos para asociar los checks
      const clienteDoc = await getDoc(doc(db, "clientes", user.uid));
      if (!clienteDoc.exists()) return;
      const recordatorios = clienteDoc.data().recordatoriosMedicamentos || [];
      // Para cada key, archivar en expedientesMedicamentos
      let expedientesNuevos = [];
      keys.forEach(key => {
        try {
          const checks = JSON.parse(localStorage.getItem(key));
          // Extraer nombre y idx del medicamento del key
          const match = key.match(/dosisChecks_[^_]+_(.+)_(\d+)_/);
          if (!match) return;
          const nombre = match[1];
          const idx = parseInt(match[2], 10);
          const med = recordatorios[idx] || { nombreMedicamento: nombre };
          expedientesNuevos.push({
            ...med,
            semana: semanaAnterior,
            checks,
            soloLectura: true
          });
        } catch {}
      });
      if (expedientesNuevos.length > 0) {
        // Guardar en Firebase (arrayUnion para no sobrescribir)
        await updateDoc(doc(db, "clientes", user.uid), {
          expedientesMedicamentos: arrayUnion(...expedientesNuevos)
        });
        // Limpiar localStorage de la semana anterior
        keys.forEach(key => localStorage.removeItem(key));
      }
    };
    archivarSemanaAnterior();
  }, []);

  // --- CARGA DE MEDICAMENTOS Y EXPEDIENTES ---
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
                    nombre: med.nombreMedicamento || med.nombre || "(Sin nombre)",
                    dosis: med.dosis || "-",
                    frecuencia: med.frecuencia || "-",
                    dias: med.dias || med.Dias || med.dia || [],
                    hora: med.hora || med.Hora || "",
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
                  dias: med.dias || [],
                  hora: med.hora || "",
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
                  frecuencia: med.frecuencia || "-",
                  dias: med.dias || [],
                  hora: med.hora || ""
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
    const med = medicamentos[idx];
    setEditIndex(idx);
    setEditMed({
      ...med,
      hora: typeof med.hora === 'string' ? med.hora : "",
      dias: Array.isArray(med.dias) ? med.dias : (typeof med.dias === "string" && med.dias.length > 0 ? med.dias.split(/,|;/).map(d => d.trim()).filter(Boolean) : []),
      frecuencia: med.frecuencia ? String(med.frecuencia) : "1",
      checks: Array(Number(med.frecuencia || 1)).fill(false)
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditMed((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (medicamento) => {
    try {
      const clientesSnapshot = await getDocs(collection(db, "clientes"));
      const auth = getAuth();
      const user = auth.currentUser;
      let cliente;
      if (user && !isAdmin) {
        cliente = clientesSnapshot.docs.find(docu => docu.id === user.uid);
      }
      if (!cliente) {
        // Buscar por nombre (admin) o por id
        cliente = clientesSnapshot.docs.find(docu => (docu.data().nombre === medicamento.clienteNombre || docu.id === medicamento.clienteNombre));
      }
      // Determinar el id del cliente para actualizar ambos lados
      const clienteId = cliente ? cliente.id : (medicamento.clienteNombre || (user ? user.uid : null));
      if (clienteId) {
        // Actualizar en la colección 'medicamentos'
        const medDocRef = doc(db, "medicamentos", clienteId);
        const medDocSnap = await getDoc(medDocRef);
        let medsAdmin = [];
        if (medDocSnap.exists()) {
          medsAdmin = medDocSnap.data().medicamentos || [];
          let idxAdmin = medsAdmin.findIndex(med =>
            (med.nombreMedicamento === medicamento.nombre || med.nombre === medicamento.nombre) &&
            med.dosis === medicamento.dosis &&
            med.frecuencia === medicamento.frecuencia
          );
          if (idxAdmin === -1) {
            idxAdmin = medsAdmin.findIndex(med => (med.nombreMedicamento === medicamento.nombre || med.nombre === medicamento.nombre));
          }
          if (idxAdmin === -1 && medsAdmin.length > 0) {
            idxAdmin = 0;
          }
          const nuevoMed = {
            nombre: editMed.nombre, // Para visualización admin
            nombreMedicamento: editMed.nombre, // Para compatibilidad cliente
            dosis: editMed.dosis,
            frecuencia: editMed.frecuencia,
            dias: editMed.dias || [],
            hora: editMed.hora || ""
          };
          if (idxAdmin !== -1) {
            medsAdmin[idxAdmin] = nuevoMed;
          } else {
            medsAdmin.push(nuevoMed);
          }
          await updateDoc(medDocRef, { medicamentos: medsAdmin });
        } else {
          // Si no existe el doc, crearlo con setDoc
          await setDoc(medDocRef, { medicamentos: [{
            nombreMedicamento: editMed.nombre,
            dosis: editMed.dosis,
            frecuencia: editMed.frecuencia,
            dias: editMed.dias || [],
            hora: editMed.hora || ""
          }] });
        }
        // Actualizar también en el perfil del cliente
        if (cliente) {
          let recordatorios = cliente.data().recordatoriosMedicamentos || [];
          let idx = recordatorios.findIndex(med =>
            med.nombreMedicamento === medicamento.nombre &&
            med.dosis === medicamento.dosis &&
            med.frecuencia === medicamento.frecuencia
          );
          if (idx === -1) {
            idx = recordatorios.findIndex(med => med.nombreMedicamento === medicamento.nombre);
          }
          if (idx === -1 && recordatorios.length > 0) {
            idx = 0;
          }
          if (idx !== -1) {
            recordatorios[idx] = {
              nombreMedicamento: editMed.nombre,
              dosis: editMed.dosis,
              frecuencia: editMed.frecuencia,
              dias: editMed.dias || [],
              hora: editMed.hora || ""
            };
            await updateDoc(doc(db, "clientes", cliente.id), { recordatoriosMedicamentos: recordatorios });
          }
        }
        setEditIndex(null);
        setEditMed({});
        window.location.reload();
        return;
      } else {
        alert("No se encontró el cliente para guardar el medicamento.");
      }
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
    setEditIndex(null);
    setEditMed({});
  };

  const handleDelete = async (medicamento) => {
    // Buscar el cliente por nombre
    const clientesSnapshot = await getDocs(collection(db, "clientes"));
    const cliente = clientesSnapshot.docs.find(docu => (docu.data().nombre === medicamento.clienteNombre));
    if (cliente) {
      let recordatorios = cliente.data().recordatoriosMedicamentos || [];
      recordatorios = recordatorios.filter(med => med.nombreMedicamento !== medicamento.nombre);
      await updateDoc(doc(db, "clientes", cliente.id), { recordatoriosMedicamentos: recordatorios });
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
        {/* EXPEDIENTES HISTÓRICOS SOLO LECTURA */}
        {expedientes.length > 0 && (
          <div className="mb-4">
            <h4>Expedientes históricos (solo lectura)</h4>
            <ul className="list-group">
              {expedientes.map((exp) => (
                <li key={exp.id} className="list-group-item bg-light">
                  <strong>{exp.nombreMedicamento || exp.nombre}</strong> - {exp.dosis} - Frecuencia {exp.frecuencia} al día
                  <div style={{ fontSize: '0.95em', color: '#555', marginTop: 4 }}>
                    <span><b>Días:</b> {(Array.isArray(exp.dias) ? exp.dias.join(', ') : exp.dias) || '-'}</span>
                    <span style={{ marginLeft: 16 }}><b>Hora:</b> {exp.hora || '-'}</span>
                    <span style={{ marginLeft: 16 }}><b>Semana:</b> {exp.semana}</span>
                  </div>
                  {/* Mostrar checks de la semana archivada */}
                  {exp.checks && (
                    <div style={{marginTop: 6}}>
                      <b>Registro de tomas:</b>
                      <ul style={{marginLeft: 16}}>
                        {Object.entries(exp.checks).map(([dia, arr]) => (
                          <li key={dia}>{dia}: {arr.map((v,i) => v ? '✔️' : '❌').join(' | ')}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* MEDICAMENTOS ACTIVOS EDITABLES */}
        <ul className="list-group">
          {medicamentos.map((medicamento, idx) => (
            <li key={medicamento.id || medicamento.nombre + idx} className="list-group-item">
              {isAdmin ? (
                // Vista ADMIN: solo nombre, dosis, frecuencia, días y nombre del cliente
                <>
                  <strong>{medicamento.nombre}</strong> - {medicamento.dosis} - Frecuencia {medicamento.frecuencia} al día
                  <div style={{ fontSize: '0.95em', color: '#555', marginTop: 4 }}>
                    <span><b>Días:</b> {
                      (() => {
                        let dias = [];
                        if (Array.isArray(medicamento.dias)) {
                          dias = medicamento.dias.flatMap(d => {
                            const regex = /(Lunes|Martes|Mi[eí]rcoles|Jueves|Viernes|S[aá]bado|Domingo)/gim;
                            let encontrados = [];
                            let match;
                            while ((match = regex.exec(d)) !== null) {
                              let diaNorm = match[0]
                                .replace(/i|í/g, 'í')
                                .replace(/a|á/g, 'á')
                                .charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
                              encontrados.push(diaNorm);
                            }
                            return encontrados;
                          });
                        } else if (typeof medicamento.dias === 'string') {
                          const diasStr = medicamento.dias.replace(/\s/g, '');
                          const regex = /(Lunes|Martes|Mi[eí]rcoles|Jueves|Viernes|S[aá]bado|Domingo)/gim;
                          dias = [];
                          let match;
                          while ((match = regex.exec(diasStr)) !== null) {
                            let diaNorm = match[0]
                              .replace(/i|í/g, 'í')
                              .replace(/a|á/g, 'á')
                              .charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
                            dias.push(diaNorm);
                          }
                        }
                        // Solo mostrar los días seleccionados, si no hay ninguno mostrar '-'
                        const diasUnicos = Array.from(new Set(dias));
                        return diasUnicos.length > 0 ? diasUnicos.join(', ') : '-';
                      })()
                    }</span>
                    {medicamento.clienteNombre && (
                      <span style={{ marginLeft: 16 }}><b>Cliente:</b> {medicamento.clienteNombre}</span>
                    )}
                  </div>
                </>
              ) : (
                (editIndex === idx) ? (
                  <>
                    <input name="nombre" value={editMed.nombre} onChange={handleEditChange} /> -
                    <input name="dosis" value={editMed.dosis} onChange={handleEditChange} /> -
                    {/* Nuevo: frecuencia como select y checkboxes */}
                    <label style={{marginRight: 8}}>Frecuencia:</label>
                    <select
                      name="frecuencia"
                      value={editMed.frecuencia || "1"}
                      onChange={e => {
                        const value = e.target.value;
                        setEditMed(prev => ({
                          ...prev,
                          frecuencia: value,
                          checks: Array(Number(value)).fill(false)
                        }));
                      }}
                      style={{width: 60, marginRight: 8}}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                    {/* Mostrar checkboxes según frecuencia */}
                    {Array.from({length: Number(editMed.frecuencia || 1)}).map((_, i) => (
                      <input
                        key={i}
                        type="checkbox"
                        checked={!!(editMed.checks && editMed.checks[i])}
                        onChange={e => {
                          // Siempre crear un array del tamaño correcto
                          const newChecks = Array(Number(editMed.frecuencia || 1)).fill(false);
                          if (editMed.checks) {
                            editMed.checks.forEach((val, idx) => { if (idx < newChecks.length) newChecks[idx] = val; });
                          }
                          newChecks[i] = e.target.checked;
                          setEditMed(prev => ({ ...prev, checks: newChecks }));
                        }}
                        style={{marginRight: 4}}
                      />
                    ))}
                    {/* Nuevo: editar días de la semana */}
                    <div style={{ marginTop: 8 }}>
                      <label><b>Días:</b></label>
                      <div style={{ display: 'inline-flex', gap: 8, marginLeft: 8 }}>
                        {['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map(dia => (
                          <label key={dia} style={{ marginRight: 6, fontWeight: 400 }}>
                            <input
                              type="checkbox"
                              checked={Array.isArray(editMed.dias) ? editMed.dias.includes(dia) : false}
                              onChange={e => {
                                let nuevosDias = Array.isArray(editMed.dias) ? [...editMed.dias] : [];
                                if (e.target.checked) {
                                  if (!nuevosDias.includes(dia)) nuevosDias.push(dia);
                                } else {
                                  nuevosDias = nuevosDias.filter(d => d !== dia);
                                }
                                setEditMed(prev => ({ ...prev, dias: nuevosDias }));
                              }}
                            /> {dia}
                          </label>
                        ))}
                      </div>
                      <label style={{ marginLeft: 16 }}><b>Hora:</b></label>
                      <input
                        name="hora"
                        type="time"
                        value={editMed.hora || ""}
                        onChange={handleEditChange}
                        style={{ marginLeft: 8 }}
                      />
                    </div>
                    <button className="guardar" onClick={() => handleEditSave(medicamento)}>Guardar</button>
                    <button className="cancelar" onClick={() => setEditIndex(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <strong>{medicamento.nombre}</strong> - {medicamento.dosis} - Frecuencia {medicamento.frecuencia} al día
                    {/* Mostrar días de la semana y hora si existen */}
                    <div style={{ fontSize: '0.95em', color: '#555', marginTop: 4 }}>
                      <span><b>Días:</b> {
                        (() => {
                          // Normalizar y limpiar días para visualización
                          const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                          let dias = [];
                          if (Array.isArray(medicamento.dias)) {
                            dias = medicamento.dias.flatMap(d => {
                              const regex = /(Lunes|Martes|Mi[eí]rcoles|Jueves|Viernes|S[aá]bado|Domingo)/gim;
                              let encontrados = [];
                              let match;
                              while ((match = regex.exec(d)) !== null) {
                                let diaNorm = match[0]
                                  .replace(/i|í/g, 'í')
                                  .replace(/a|á/g, 'á')
                                  .charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
                                encontrados.push(diaNorm);
                              }
                              return encontrados;
                            });
                          } else if (typeof medicamento.dias === 'string') {
                            const diasStr = medicamento.dias.replace(/\s/g, '');
                            const regex = /(Lunes|Martes|Mi[eí]rcoles|Jueves|Viernes|S[aá]bado|Domingo)/gim;
                            dias = [];
                            let match;
                            while ((match = regex.exec(diasStr)) !== null) {
                              let diaNorm = match[0]
                                .replace(/i|í/g, 'í')
                                .replace(/a|á/g, 'á')
                                .charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
                              dias.push(diaNorm);
                            }
                          }
                          // Eliminar duplicados y mostrar
                          const diasUnicos = Array.from(new Set(dias.length > 0 ? dias : diasSemana));
                          return diasUnicos.join(', ');
                        })()
                      }</span>
                      <span style={{ marginLeft: 16 }}><b>Hora:</b> {medicamento.hora ? medicamento.hora : 'No especificada'}</span>
                    </div>
                    {/* Mostrar checkboxes de toma diaria según frecuencia */}
                    <DosisChecks
                      medicamento={medicamento}
                      idx={idx}
                    />
                    {medicamento.clienteNombre && (
                      <><br /><em>Cliente:</em> {medicamento.clienteNombre}</>
                    )}
                    {/* Mostrar botones de editar y eliminar para admin y cliente */}
                    <>
                      {(!medicamento.soloLectura) && (
                        <>
                          <button className="btn btn-warning btn-sm ms-2" onClick={() => handleEditClick(idx)}>Editar</button>
                          <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(medicamento)}>Eliminar</button>
                        </>
                      )}
                    </>
                  </>
                )
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

// Componente auxiliar para los checks de dosis
function DosisChecks({ medicamento, idx }) {
  // Obtener usuario actual para la clave de localStorage
  const auth = getAuth();
  const user = auth.currentUser;

  // Obtener días seleccionados (array de strings, bien formateados y separados)
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  let dias = [];
  if (Array.isArray(medicamento.dias)) {
    dias = medicamento.dias.flatMap(d => {
      // Mejorar regex para soportar tildes y mayúsculas/minúsculas
      const regex = /(Lunes|Martes|Mi[eí]rcoles|Jueves|Viernes|S[aá]bado|Domingo)/gim;
      let encontrados = [];
      let match;
      while ((match = regex.exec(d)) !== null) {
        // Normalizar tildes
        let diaNorm = match[0]
          .replace(/i|í/g, 'í')
          .replace(/a|á/g, 'á')
          .charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
        encontrados.push(diaNorm);
      }
      return encontrados;
    });
  } else if (typeof medicamento.dias === 'string') {
    const diasStr = medicamento.dias.replace(/\s/g, '');
    const regex = /(Lunes|Martes|Mi[eí]rcoles|Jueves|Viernes|S[aá]bado|Domingo)/gim;
    dias = [];
    let match;
    while ((match = regex.exec(diasStr)) !== null) {
      let diaNorm = match[0]
        .replace(/i|í/g, 'í')
        .replace(/a|á/g, 'á')
        .charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
      dias.push(diaNorm);
    }
  }
  // Eliminar días duplicados preservando el orden
  const diasElegidos = Array.from(new Set((dias.length > 0 ? dias : diasSemana)));
  // Asegurar que frecuencia sea un número válido y mayor que 0
  let frecuencia = Number(medicamento.frecuencia);
  if (!frecuencia || isNaN(frecuencia) || frecuencia < 1) frecuencia = 1;
  const baseHora = medicamento.hora || "07:00";
  // Calcular horas sugeridas según frecuencia y hora base
  function calcularHoras(base, freq) {
    const [h, m] = base.split(":").map(Number);
    const horas = [];
    const intervalo = Math.floor(24 / freq);
    for (let i = 0; i < freq; i++) {
      let hora = (h + i * intervalo) % 24;
      let horaStr = hora.toString().padStart(2, '0') + ":" + m.toString().padStart(2, '0');
      horas.push(horaStr);
    }
    return horas;
  }
  const horasSugeridas = calcularHoras(baseHora, frecuencia);
  // Calcular semana actual (año-semana)
  function getYearWeek(date) {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    const yearStart = new Date(d.getFullYear(),0,1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
    return `${d.getFullYear()}-W${weekNo}`;
  }
  const today = new Date();
  const semanaActual = getYearWeek(today);
  // Día de la semana actual (en español, normalizado para tildes)
  const diasSemanaMap = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  let diaActual = diasSemanaMap[today.getDay()];
  function normalizarDia(dia) {
    // Eliminar tildes correctamente y pasar a minúsculas
    return dia.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
  // Clave única por usuario, medicamento, semana
  const localKey = `dosisChecks_${user ? user.uid : 'anon'}_${medicamento.nombre}_${idx}_${semanaActual}`;
  const [checks, setChecks] = React.useState(() => {
    const saved = localStorage.getItem(localKey);
    if (saved) return JSON.parse(saved);
    // Estructura: { [dia]: [bool, bool, ...] }
    const obj = {};
    diasElegidos.forEach(dia => { obj[dia] = Array(frecuencia).fill(false); });
    return obj;
  });
  React.useEffect(() => {
    localStorage.setItem(localKey, JSON.stringify(checks));
  }, [checks, localKey]);
  // Si cambia la frecuencia o días, reiniciar los checks
  React.useEffect(() => {
    setChecks(prev => {
      const nuevo = {};
      diasElegidos.forEach(dia => {
        nuevo[dia] = prev[dia] && prev[dia].length === frecuencia ? prev[dia] : Array(frecuencia).fill(false);
      });
      return nuevo;
    });
    // eslint-disable-next-line
  }, [frecuencia, diasElegidos.join(",")]);
  // Mostrar controles por día de la semana, solo habilitar el día actual
  return (
    <div style={{margin: '8px 0'}}>
      <span style={{marginRight: 8}}><b>Tomado esta semana ({semanaActual}):</b></span>
      <div style={{display:'block', marginTop: 4}}>
        {diasElegidos.map((dia, dIdx) => (
          <div key={dia} style={{minWidth: 120, marginBottom: 6}}>
            <span style={{fontWeight: 500, marginRight: 8}}>{dia}:</span>
            {Array.from({length: frecuencia}).map((_, i) => (
              <span key={i} style={{marginLeft: 6, display: 'inline-flex', alignItems: 'center'}}>
                <input
                  type="checkbox"
                  checked={checks[dia] && checks[dia][i]}
                  disabled={normalizarDia(dia) !== normalizarDia(diaActual)}
                  onChange={e => {
                    if (normalizarDia(dia) !== normalizarDia(diaActual)) return;
                    const newChecks = {...checks};
                    newChecks[dia] = [...(newChecks[dia] || Array(frecuencia).fill(false))];
                    newChecks[dia][i] = e.target.checked;
                    setChecks(newChecks);
                  }}
                  style={{marginRight: 2}}
                />
                <span style={{fontSize: '0.95em', color: '#888', minWidth: 48}}>{horasSugeridas[i]}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MedicamentosList;
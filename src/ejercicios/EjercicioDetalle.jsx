// src/ejercicios/EjercicioDetalle.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import rutinaService from "../services/rutinaService";
import "./EjercicioDetalle.css";

function EjercicioDetalle({ ejercicio, onBack, isAdmin, onEditar, onEliminar }) {
  const navigate = useNavigate();
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [rutinaData, setRutinaData] = useState({
    dia: "LUNES",
    series: 3,
    repeticiones: 12,
    peso: 0,
    notas: ""
  });

  const diasSemana = [
    { key: "LUNES", label: "Lunes" },
    { key: "MARTES", label: "Martes" },
    { key: "MIERCOLES", label: "Miércoles" },
    { key: "JUEVES", label: "Jueves" },
    { key: "VIERNES", label: "Viernes" },
    { key: "SABADO", label: "Sábado" },
    { key: "DOMINGO", label: "Domingo" }
  ];

// EjercicioDetalle.jsx - handleAgregarRutina
const handleAgregarRutina = async (e) => {
  e.preventDefault();
  setGuardando(true);

  try {
    // ✅ CORRECCIÓN: El backend espera "dia" no "diaSemana"
    const rutinaCompleta = {
      ejercicioId: ejercicio.id,
      dia: rutinaData.dia.toUpperCase(), // ✅ CAMBIO AQUÍ: "dia" en lugar de "diaSemana"
      series: parseInt(rutinaData.series),
      repeticiones: parseInt(rutinaData.repeticiones),
      peso: parseFloat(rutinaData.peso),
      notas: rutinaData.notas
    };

    console.log('📤 Enviando rutina al backend:', rutinaCompleta);
    await rutinaService.agregarEjercicio(rutinaCompleta);
    
    Swal.fire({
      icon: "success",
      title: "¡Agregado!",
      text: `${ejercicio.nombre} agregado a tu rutina del ${rutinaData.dia.toLowerCase()}`,
      confirmButtonColor: "#2ecc71",
      showCancelButton: true,
      cancelButtonText: "Seguir viendo ejercicios",
      confirmButtonText: "Ir a mis rutinas"
    }).then((result) => {
      setShowAgregarModal(false);
      if (result.isConfirmed) {
        navigate("/rutinas");
      }
    });
    
  } catch (error) {
    console.error('❌ Error completo:', error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message || "No se pudo agregar a la rutina",
      confirmButtonColor: "#e74c3c"
    });
  } finally {
    setGuardando(false);
  }
};

  return (
    <div className="detalle">
      <button className="back" onClick={onBack}>← Volver</button>

      <div className="video-placeholder">▶</div>

      <h2>{ejercicio.nombre}</h2>
      <p className="sub">{ejercicio.musculoTrabajado}</p>

      <h3>Instrucciones</h3>
      <p>{ejercicio.descripcion}</p>

      {/* Botones según el rol */}
      <div className="detalle-actions">
        {isAdmin ? (
          <>
            <button className="btn-editar" onClick={() => onEditar(ejercicio)}>
              <span className="material-icons">edit</span>
              Editar Ejercicio
            </button>
            <button className="btn-eliminar" onClick={() => onEliminar(ejercicio)}>
              <span className="material-icons">delete</span>
              Eliminar Ejercicio
            </button>
          </>
        ) : (
          <button className="btn-rutina" onClick={() => setShowAgregarModal(true)}>
            <span className="material-icons">add</span>
            Agregar a Rutina
          </button>
        )}
      </div>

      {/* Modal para agregar a rutina */}
      {showAgregarModal && (
        <div className="modal-overlay" onClick={() => !guardando && setShowAgregarModal(false)}>
          <div className="rutina-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Agregar a Rutina</h3>
              <button 
                onClick={() => setShowAgregarModal(false)} 
                className="close-btn"
                disabled={guardando}
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="ejercicio-info-modal">
                <h4>{ejercicio.nombre}</h4>
                <span className="musculo-tag">{ejercicio.musculoTrabajado}</span>
              </div>

              <form className="rutina-form" onSubmit={handleAgregarRutina}>
                <div className="form-field">
                  <label>Día de la semana</label>
                  <select
                    value={rutinaData.dia}
                    onChange={(e) => setRutinaData({...rutinaData, dia: e.target.value})}
                    disabled={guardando}
                    required
                  >
                    {diasSemana.map(dia => (
                      <option key={dia.key} value={dia.key}>{dia.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>Series</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={rutinaData.series}
                      onChange={(e) => setRutinaData({...rutinaData, series: parseInt(e.target.value)})}
                      disabled={guardando}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Repeticiones</label>
                    <input
                      type="number"
                      min="1"
                      value={rutinaData.repeticiones}
                      onChange={(e) => setRutinaData({...rutinaData, repeticiones: parseInt(e.target.value)})}
                      disabled={guardando}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Peso (kg) - opcional</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={rutinaData.peso}
                    onChange={(e) => setRutinaData({...rutinaData, peso: parseFloat(e.target.value) || 0})}
                    placeholder="0 para solo peso corporal"
                    disabled={guardando}
                  />
                </div>

                <div className="form-field">
                  <label>Notas personales - opcional</label>
                  <textarea
                    value={rutinaData.notas}
                    onChange={(e) => setRutinaData({...rutinaData, notas: e.target.value})}
                    placeholder="Ej: Mantener espalda recta, 60s de descanso entre series..."
                    rows="3"
                    disabled={guardando}
                  />
                </div>

                {/* 🔥 BOTONES AHORA VISIBLES */}
                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowAgregarModal(false)}
                    className="btn-cancel"
                    disabled={guardando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-save"
                    disabled={guardando}
                  >
                    <span className="material-icons">add</span>
                    {guardando ? 'Guardando...' : 'Agregar a Rutina'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EjercicioDetalle;
// src/components/Rutinas/RutinasDia.jsx - SIN BOTÓN DE AGREGAR
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import rutinaService from '../../services/rutinaService';
import './RutinasDia.css';

const RutinasDia = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [diaSeleccionado, setDiaSeleccionado] = useState('LUNES');
  const [rutinas, setRutinas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModalEstadisticas, setShowModalEstadisticas] = useState(false);

  const diasSemana = [
    { key: 'LUNES', label: 'Lunes', icono: 'L' },
    { key: 'MARTES', label: 'Martes', icono: 'M' },
    { key: 'MIERCOLES', label: 'Miércoles', icono: 'M' },
    { key: 'JUEVES', label: 'Jueves', icono: 'J' },
    { key: 'VIERNES', label: 'Viernes', icono: 'V' },
    { key: 'SABADO', label: 'Sábado', icono: 'S' },
    { key: 'DOMINGO', label: 'Domingo', icono: 'D' }
  ];

  useEffect(() => {
    cargarRutinas();
    cargarEstadisticas();
  }, [diaSeleccionado]);

  const cargarRutinas = async () => {
    setLoading(true);
    try {
      const data = await rutinaService.obtenerRutinasPorDia(diaSeleccionado);
      setRutinas(data);
      console.log('✅ Rutinas cargadas:', data);
    } catch (error) {
      console.error('Error al cargar rutinas:', error);
      alert('Error al cargar las rutinas: ' + error);
    }
    setLoading(false);
  };

  const cargarEstadisticas = async () => {
    try {
      const stats = await rutinaService.obtenerEstadisticas();
      setEstadisticas(stats);
      console.log('✅ Estadísticas cargadas:', stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const toggleCompletado = async (rutinaId) => {
    try {
      await rutinaService.toggleCompletada(rutinaId);
      
      // Actualizar la lista localmente
      setRutinas(rutinas.map(rutina => 
        rutina.id === rutinaId 
          ? { ...rutina, completado: !rutina.completado }
          : rutina
      ));
      
      cargarEstadisticas();
    } catch (error) {
      console.error('Error al marcar como completado:', error);
      alert('Error al actualizar: ' + error.message);
    }
  };

  const eliminarRutina = async (rutinaId) => {
    if (window.confirm('¿Eliminar este ejercicio de la rutina?')) {
      try {
        await rutinaService.eliminarRutina(rutinaId);
        cargarRutinas();
        cargarEstadisticas();
        alert('✅ Rutina eliminada');
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar: ' + error);
      }
    }
  };

  const progresoDia = rutinas.length > 0 
    ? Math.round((rutinas.filter(r => r.completado).length / rutinas.length) * 100)
    : 0;

  return (
    <div className={`rutina-dia-container ${darkMode ? 'dark' : ''}`}>
      
      {/* Header */}
      <div className="rutina-header">
        <div className="rutina-title">
          <span className="material-icons rutina-icon">calendar_today</span>
          <div>
            <h1>Mis Rutinas Semanales</h1>
            <p className="rutina-fecha">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        <div className="rutina-stats">
          <button 
            className="stat-badge clickable"
            onClick={() => setShowModalEstadisticas(true)}
          >
            <span className="material-icons">bar_chart</span>
            Estadísticas
          </button>
        </div>
      </div>

      {/* Selector de Días */}
      <div className="dias-selector">
        {diasSemana.map(dia => (
          <button
            key={dia.key}
            className={`dia-btn ${diaSeleccionado === dia.key ? 'active' : ''}`}
            onClick={() => setDiaSeleccionado(dia.key)}
          >
            <span className="dia-emoji">{dia.icono}</span>
            <span className="dia-label">{dia.label}</span>
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-label">
            Progreso del {diasSemana.find(d => d.key === diaSeleccionado)?.label}
          </span>
          <span className="progress-percentage">{progresoDia}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progresoDia}%` }}
          ></div>
        </div>
        <p className="progress-text">
          {rutinas.filter(r => r.completado).length} de {rutinas.length} ejercicios completados
        </p>
      </div>

      {/* ✅ ELIMINADO: Botón "Agregar Ejercicio desde Catálogo" */}

      {/* Lista de Rutinas */}
      {loading ? (
        <div className="loading-state">
          <span className="material-icons rotating">refresh</span>
          <p>Cargando rutinas...</p>
        </div>
      ) : rutinas.length === 0 ? (
        <div className="empty-state">
          <span className="material-icons">fitness_center</span>
          <h3>No hay ejercicios para {diasSemana.find(d => d.key === diaSeleccionado)?.label}</h3>
          <p>Ve a la sección <strong>Ejercicios</strong> y selecciona "Agregar a Rutina" en los ejercicios que desees incluir</p>
          {/* ✅ ELIMINADO: Botón "Ir a Ejercicios" del estado vacío */}
        </div>
      ) : (
        <div className="ejercicios-list">
          {rutinas.map((rutina) => {
            const isCompleted = rutina.completado;
            
            return (
              <div 
                key={rutina.id} 
                className={`ejercicio-card ${isCompleted ? 'completed' : ''}`}
              >
                <div className="ejercicio-checkbox">
                  <input 
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => toggleCompletado(rutina.id)}
                    id={`ejercicio-${rutina.id}`}
                  />
                  <label htmlFor={`ejercicio-${rutina.id}`}></label>
                </div>

                <div className="ejercicio-icon">
                  <span className="material-icons">fitness_center</span>
                </div>

                <div className="ejercicio-info">
                  <h3>{rutina.ejercicio?.nombre || 'Ejercicio'}</h3>
                  <span className="musculo-tag">
                    {rutina.ejercicio?.musculoTrabajado || 'General'}
                  </span>
                </div>

                <div className="ejercicio-details">
                  <div className="detail-item">
                    <span className="material-icons">repeat</span>
                    <span>{rutina.series} series</span>
                  </div>
                  <div className="detail-item">
                    <span className="material-icons">fitness_center</span>
                    <span>{rutina.repeticiones} reps</span>
                  </div>
                  {rutina.peso > 0 && (
                    <div className="detail-item">
                      <span className="material-icons">monitor_weight</span>
                      <span>{rutina.peso} kg</span>
                    </div>
                  )}
                </div>

                {rutina.notas && (
                  <div className="ejercicio-notas">
                    📝 {rutina.notas}
                  </div>
                )}

                <button 
                  className="btn-eliminar"
                  onClick={() => eliminarRutina(rutina.id)}
                >
                  <span className="material-icons">delete</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Estadísticas */}
      {showModalEstadisticas && estadisticas && (
        <div className="modal-overlay" onClick={() => setShowModalEstadisticas(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Estadísticas de Rutinas</h3>
              <button onClick={() => setShowModalEstadisticas(false)} className="close-btn">
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="estadisticas-content">
              <div className="stat-card-large">
                <span className="material-icons stat-icon-large">assignment</span>
                <div className="stat-info-large">
                  <h4>Total Rutinas</h4>
                  <p className="stat-value-large">{estadisticas.totalRutinas || 0}</p>
                </div>
              </div>

              <div className="stat-card-large">
                <span className="material-icons stat-icon-large success">check_circle</span>
                <div className="stat-info-large">
                  <h4>Completadas</h4>
                  <p className="stat-value-large success">{estadisticas.completadas || 0}</p>
                </div>
              </div>

              <div className="stat-card-large">
                <span className="material-icons stat-icon-large warning">pending</span>
                <div className="stat-info-large">
                  <h4>Pendientes</h4>
                  <p className="stat-value-large warning">{estadisticas.pendientes || 0}</p>
                </div>
              </div>

              <div className="stat-card-large highlight">
                <span className="material-icons stat-icon-large">analytics</span>
                <div className="stat-info-large">
                  <h4>Progreso Total</h4>
                  <p className="stat-value-large">{estadisticas.porcentajeCompletado || 0}%</p>
                </div>
              </div>
            </div>

            <div className="progress-bar-large">
              <div 
                className="progress-fill-large" 
                style={{ width: `${estadisticas.porcentajeCompletado || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RutinasDia;
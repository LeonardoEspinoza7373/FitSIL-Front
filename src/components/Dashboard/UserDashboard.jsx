// src/components/Dashboard/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import authService from "../../services/authService";
import rutinaService from "../../services/rutinaService";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { darkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    peso: "",
    altura: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [progresoSemanal, setProgresoSemanal] = useState([]);
  const [minutosSemanales, setMinutosSemanales] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        nombre: currentUser.nombre || "",
        apellido: currentUser.apellido || "",
        telefono: currentUser.telefono || "",
        peso: currentUser.peso || "",
        altura: currentUser.altura || "",
      });
    }
    cargarProgresoSemanal();
  }, []);

  const cargarProgresoSemanal = async () => {
    try {
      const estadisticas = await rutinaService.obtenerEstadisticas();
      
      // Obtener rutinas por día y calcular progreso
      const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
      const diasAbreviados = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      const progreso = await Promise.all(
        diasSemana.map(async (dia, index) => {
          try {
            const rutinas = await rutinaService.obtenerRutinasPorDia(dia);
            const completadas = rutinas.filter(r => r.completado).length;
            const total = rutinas.length;
            
            // Calcular minutos estimados (cada ejercicio = 10 min aprox)
            const minutosCompletados = completadas * 10;
            
            return {
              dia: diasAbreviados[index],
              diaCompleto: dia,
              hizoEjercicio: completadas > 0,
              completadas: completadas,
              total: total,
              minutos: minutosCompletados
            };
          } catch (error) {
            console.error(`Error al cargar rutinas de ${dia}:`, error);
            return {
              dia: diasAbreviados[index],
              diaCompleto: dia,
              hizoEjercicio: false,
              completadas: 0,
              total: 0,
              minutos: 0
            };
          }
        })
      );
      
      setProgresoSemanal(progreso);
      
      // Calcular total de minutos de la semana
      const totalMinutos = progreso.reduce((sum, dia) => sum + dia.minutos, 0);
      setMinutosSemanales(totalMinutos);
      
    } catch (error) {
      console.error('Error al cargar progreso semanal:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const updatedData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        peso: parseFloat(formData.peso) || 0,
        altura: parseFloat(formData.altura) || 0,
      };

      const updated = await authService.updatePerfil(user.correo, updatedData);
      setUser(updated);
      setEditMode(false);
      setMessage({
        type: "success",
        text: "¡Perfil actualizado exitosamente!",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMessage({
        type: "error",
        text: error.message || "Error al actualizar el perfil",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "⚠️ ¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer."
      )
    ) {
      try {
        await authService.deletePerfil(user.correo);
        alert("Cuenta eliminada exitosamente");
        authService.logout();
      } catch (error) {
        console.error("Error al eliminar:", error);
        setMessage({
          type: "error",
          text: error.message || "Error al eliminar la cuenta",
        });
      }
    }
  };

  const calcularIMC = () => {
    if (user?.peso && user?.altura && user.altura > 0) {
      const imc = user.peso / (user.altura * user.altura);
      return imc.toFixed(1);
    }
    return "N/A";
  };

  const getIMCCategoria = (imc) => {
    if (imc === "N/A") return "Sin datos";
    const valor = parseFloat(imc);
    if (valor < 18.5) return "Bajo peso";
    if (valor < 25) return "Normal";
    if (valor < 30) return "Sobrepeso";
    return "Obesidad";
  };

  const formatearTiempo = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}m`;
  };

  if (!user) {
    return (
      <div className={`user-dashboard-modern ${darkMode ? "dark" : ""}`}>
        <div className="loading-state">Cargando...</div>
      </div>
    );
  }

  const imc = calcularIMC();

  return (
    <div className={`user-dashboard-modern ${darkMode ? "dark" : ""}`}>
      {/* Header */}
      <div className="dashboard-header-user">
        <div className="header-info">
          <p className="welcome-text">Bienvenido de nuevo,</p>
          <h2 className="user-name">{user.nombre}</h2>
        </div>
        <div className="header-actions">
          {/* ✅ CAMBIO AQUÍ: Avatar ahora navega al perfil en lugar de abrir modal */}
          <div
            className="user-avatar clickable"
            onClick={() => navigate('/perfil')}
            title="Ver mi perfil"
            style={{ cursor: 'pointer' }}
          >
            <span className="avatar-initials">
              {user.nombre?.charAt(0)}
              {user.apellido?.charAt(0) || ""}
            </span>
          </div>
        </div>
      </div>

      {/* Mensaje de alerta */}
      {message.text && (
        <div className={`alert-message ${message.type}`}>{message.text}</div>
      )}

      {/* ✅ ELIMINADO: Modal de edición, ya no se usa en dashboard */}

      {/* Grid de estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="material-icons stat-icon">monitor_weight</span>
          <div className="stat-content">
            <h3 className="stat-title">Peso</h3>
            <p className="stat-value">
              {user.peso ? `${user.peso} kg` : "N/A"}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <span className="material-icons stat-icon">height</span>
          <div className="stat-content">
            <h3 className="stat-title">Altura</h3>
            <p className="stat-value">
              {user.altura ? `${user.altura} m` : "N/A"}
            </p>
          </div>
        </div>

        <div className="stat-card highlight">
          <span className="material-icons stat-icon">insights</span>
          <div className="stat-content">
            <h3 className="stat-title">IMC</h3>
            <p className="stat-value">{imc}</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="material-icons stat-icon">favorite</span>
          <div className="stat-content">
            <h3 className="stat-title">Estado</h3>
            <p className="stat-value stat-small">{getIMCCategoria(imc)}</p>
          </div>
        </div>
      </div>

      {/* IMC Card */}
      <div className="imc-card">
        <h3 className="card-title">Índice de Masa Corporal</h3>
        <div className="imc-display-large">
          <div className="imc-circle">
            <span className="imc-number-large">{imc}</span>
            <span className="imc-label-small">IMC</span>
          </div>
          <div className="imc-info-text">
            <p className="imc-category">{getIMCCategoria(imc)}</p>
            {imc === "N/A" ? (
              <p className="imc-description">Registra tu peso y altura</p>
            ) : (
              <p className="imc-description">
                Tu IMC está en rango de {getIMCCategoria(imc).toLowerCase()}
              </p>
            )}
          </div>
        </div>

        <div className="imc-ranges-visual">
          <div className="range-bar">
            <div className="range-segment bajo"></div>
            <div className="range-segment normal"></div>
            <div className="range-segment sobrepeso"></div>
            <div className="range-segment obesidad"></div>
          </div>
          <div className="range-labels">
            <span>&lt;18.5</span>
            <span>18.5-24.9</span>
            <span>25-29.9</span>
            <span>≥30</span>
          </div>
        </div>
      </div>

      {/* Progreso Semanal - CON DATOS REALES */}
      <div className="weekly-card">
        <div className="weekly-header">
          <h3 className="weekly-title">Progreso Semanal</h3>
          <p className="weekly-subtitle">Total minutos esta semana</p>
          <span className="weekly-time">{formatearTiempo(minutosSemanales)}</span>
        </div>

        <div className="weekly-progress">
          {progresoSemanal.map((dia, index) => (
            <div 
              key={index} 
              className="dia-columna"
              onClick={() => navigate('/rutinas')}
              style={{ cursor: 'pointer' }}
              title={`${dia.diaCompleto}: ${dia.completadas}/${dia.total} ejercicios completados`}
            >
              <div
                className={`dia-circulo ${dia.hizoEjercicio ? "activo" : ""}`}
              >
                {dia.hizoEjercicio && (
                  <span className="material-icons check-icon">check</span>
                )}
              </div>
              <span
                className={`dia-texto ${dia.hizoEjercicio ? "activo" : ""}`}
              >
                {dia.dia}
              </span>
              {dia.total > 0 && (
                <span className="dia-count">
                  {dia.completadas}/{dia.total}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="weekly-footer">
          <button 
            className="btn-ver-rutinas"
            onClick={() => navigate('/rutinas')}
          >
            <span className="material-icons">calendar_today</span>
            Ver mis rutinas
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
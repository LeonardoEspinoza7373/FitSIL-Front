// src/components/Profile/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import authService from '../../services/authService';
import rutinaService from '../../services/rutinaService';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    peso: '',
    altura: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [estadisticas, setEstadisticas] = useState({
    rutinasCompletadas: 0,
    ejerciciosRealizados: 0,
    tiempoTotal: '0h 0min',
    rachaActual: 0
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        nombre: currentUser.nombre || '',
        apellido: currentUser.apellido || '',
        telefono: currentUser.telefono || '',
        peso: currentUser.peso || '',
        altura: currentUser.altura || ''
      });
    }
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const stats = await rutinaService.obtenerEstadisticas();
      setEstadisticas({
        rutinasCompletadas: stats.rutinasCompletadas || 0,
        ejerciciosRealizados: stats.ejerciciosCompletados || 0,
        tiempoTotal: stats.tiempoTotal || '0h 0min',
        rachaActual: stats.diasConsecutivos || 0
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updatedData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        peso: parseFloat(formData.peso) || 0,
        altura: parseFloat(formData.altura) || 0
      };

      const updated = await authService.updatePerfil(user.correo, updatedData);
      setUser(updated);
      setEditMode(false);
      setMessage({
        type: 'success',
        text: '¡Perfil actualizado exitosamente!'
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error al actualizar:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Error al actualizar el perfil'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('⚠️ ¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      try {
        await authService.deletePerfil(user.correo);
        alert('Cuenta eliminada exitosamente');
        authService.logout();
        navigate('/login');
      } catch (error) {
        console.error('Error al eliminar:', error);
        setMessage({
          type: 'error',
          text: error.message || 'Error al eliminar la cuenta'
        });
      }
    }
  };

  const calcularIMC = () => {
    if (user?.peso && user?.altura && user.altura > 0) {
      const imc = user.peso / (user.altura * user.altura);
      return imc.toFixed(1);
    }
    return 'N/A';
  };

  const getIMCCategoria = (imc) => {
    if (imc === 'N/A') return 'Sin datos';
    const valor = parseFloat(imc);
    if (valor < 18.5) return 'Bajo peso';
    if (valor < 25) return 'Normal';
    if (valor < 30) return 'Sobrepeso';
    return 'Obesidad';
  };

  if (!user) {
    return (
      <div className={`user-profile-container ${darkMode ? 'dark' : ''}`}>
        <div className="loading-state">Cargando...</div>
      </div>
    );
  }

  const imc = calcularIMC();

  return (
    <div className={`user-profile-container ${darkMode ? 'dark' : ''}`}>
      <button className="back-btn-profile" onClick={() => navigate('/user/dashboard')}>
        <span className="material-icons">arrow_back</span>
        <span>Volver al Dashboard</span>
      </button>

      {/* Header del Perfil */}
      <div className="profile-header-user">
        <div className="profile-avatar-section">
          <div className="profile-avatar-large-user">
            <span className="avatar-initials-large-user">
              {user.nombre?.charAt(0)}{user.apellido?.charAt(0) || ''}
            </span>
            <div className="verified-badge">
              <span className="material-icons">verified</span>
            </div>
          </div>
        </div>
        
        <div className="profile-info-header-user">
          <h1>{user.nombre} {user.apellido}</h1>
          <p className="profile-email-user">{user.correo}</p>
          <span className="profile-badge-user">
            <span className="material-icons">person</span>
            {user.rol}
          </span>
        </div>

        <button className="edit-profile-btn-user" onClick={() => setEditMode(true)}>
          <span className="material-icons">edit</span>
          Editar Perfil
        </button>
      </div>

      {/* Mensaje de alerta */}
      {message.text && (
        <div className={`alert-message-user ${message.type}`}>
          <span className="material-icons">
            {message.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {message.text}
        </div>
      )}

      {/* Pestañas */}
      <div className="profile-tabs-user">
        <button 
          className={`tab-btn-user ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <span className="material-icons">person</span>
          Información Personal
        </button>
        <button 
          className={`tab-btn-user ${activeTab === 'physical' ? 'active' : ''}`}
          onClick={() => setActiveTab('physical')}
        >
          <span className="material-icons">fitness_center</span>
          Datos Físicos
        </button>
        <button 
          className={`tab-btn-user ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <span className="material-icons">bar_chart</span>
          Estadísticas
        </button>
        <button 
          className={`tab-btn-user ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span className="material-icons">settings</span>
          Configuración
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="profile-content-user">
        {/* Pestaña Información Personal */}
        {activeTab === 'info' && (
          <div className="info-section-user">
            <div className="info-card-user">
              <div className="card-header-user">
                <h3>
                  <span className="material-icons">badge</span>
                  Datos Personales
                </h3>
              </div>
              <div className="info-grid-user">
                <div className="info-item-user">
                  <span className="material-icons">person</span>
                  <div>
                    <label>Nombre</label>
                    <p>{user.nombre}</p>
                  </div>
                </div>
                <div className="info-item-user">
                  <span className="material-icons">person_outline</span>
                  <div>
                    <label>Apellido</label>
                    <p>{user.apellido || 'No registrado'}</p>
                  </div>
                </div>
                <div className="info-item-user">
                  <span className="material-icons">email</span>
                  <div>
                    <label>Correo Electrónico</label>
                    <p>{user.correo}</p>
                  </div>
                </div>
                <div className="info-item-user">
                  <span className="material-icons">phone</span>
                  <div>
                    <label>Teléfono</label>
                    <p>{user.telefono || 'No registrado'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pestaña Datos Físicos */}
        {activeTab === 'physical' && (
          <div className="physical-section-user">
            <div className="info-card-user">
              <div className="card-header-user">
                <h3>
                  <span className="material-icons">fitness_center</span>
                  Información Física
                </h3>
              </div>
              <div className="physical-stats-grid">
                <div className="physical-stat-card peso">
                  <div className="stat-icon-wrapper">
                    <span className="material-icons">monitor_weight</span>
                  </div>
                  <div className="stat-info">
                    <label>Peso</label>
                    <p className="stat-value-large">{user.peso ? `${user.peso} kg` : 'No registrado'}</p>
                  </div>
                </div>
                <div className="physical-stat-card altura">
                  <div className="stat-icon-wrapper">
                    <span className="material-icons">height</span>
                  </div>
                  <div className="stat-info">
                    <label>Altura</label>
                    <p className="stat-value-large">{user.altura ? `${user.altura} m` : 'No registrado'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card del IMC */}
            <div className="info-card-user imc-card-user">
              <div className="card-header-user">
                <h3>
                  <span className="material-icons">insights</span>
                  Índice de Masa Corporal
                </h3>
              </div>
              <div className="imc-display-container">
                <div className="imc-circle-large">
                  <div className="imc-value-large">{imc}</div>
                  <div className="imc-label">IMC</div>
                </div>
                <div className="imc-info">
                  <p className="imc-category-large">{getIMCCategoria(imc)}</p>
                  <p className="imc-description">
                    {imc === 'N/A' 
                      ? 'Registra tu peso y altura para calcular tu IMC'
                      : `Tu IMC está en rango de ${getIMCCategoria(imc).toLowerCase()}`
                    }
                  </p>
                </div>
              </div>

              {/* Barra de rangos del IMC */}
              <div className="imc-ranges">
                <div className="range-bar-visual">
                  <div className="range-segment bajo"></div>
                  <div className="range-segment normal"></div>
                  <div className="range-segment sobrepeso"></div>
                  <div className="range-segment obesidad"></div>
                </div>
                <div className="range-labels-visual">
                  <span>&lt;18.5</span>
                  <span>18.5-24.9</span>
                  <span>25-29.9</span>
                  <span>≥30</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pestaña Estadísticas */}
        {activeTab === 'stats' && (
          <div className="stats-section-user">
            <div className="info-card-user">
              <div className="card-header-user">
                <h3>
                  <span className="material-icons">trending_up</span>
                  Estadísticas de Entrenamiento
                </h3>
              </div>
              <div className="stats-grid-user">
                <div className="stat-card-detailed rutinas">
                  <div className="stat-icon-detailed">
                    <span className="material-icons">fitness_center</span>
                  </div>
                  <label>Rutinas Completadas</label>
                  <p className="stat-value-detailed">{estadisticas.rutinasCompletadas}</p>
                </div>
                <div className="stat-card-detailed ejercicios">
                  <div className="stat-icon-detailed">
                    <span className="material-icons">sports_gymnastics</span>
                  </div>
                  <label>Ejercicios Realizados</label>
                  <p className="stat-value-detailed">{estadisticas.ejerciciosRealizados}</p>
                </div>
                <div className="stat-card-detailed tiempo">
                  <div className="stat-icon-detailed">
                    <span className="material-icons">schedule</span>
                  </div>
                  <label>Tiempo Total</label>
                  <p className="stat-value-detailed">{estadisticas.tiempoTotal}</p>
                </div>
                <div className="stat-card-detailed racha">
                  <div className="stat-icon-detailed">
                    <span className="material-icons">local_fire_department</span>
                  </div>
                  <label>Racha Actual</label>
                  <p className="stat-value-detailed">{estadisticas.rachaActual} días</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pestaña Configuración */}
        {activeTab === 'settings' && (
          <div className="settings-section-user">
            <div className="info-card-user">
              <div className="card-header-user">
                <h3>
                  <span className="material-icons">security</span>
                  Seguridad
                </h3>
              </div>
              <div className="settings-list">
                <button className="settings-btn-user">
                  <span className="material-icons">lock</span>
                  Cambiar Contraseña
                </button>
                <button className="settings-btn-user">
                  <span className="material-icons">shield</span>
                  Autenticación de dos factores
                </button>
              </div>
            </div>

            <div className="info-card-user danger-zone-user">
              <div className="card-header-user">
                <h3>
                  <span className="material-icons">warning</span>
                  Zona de Peligro
                </h3>
              </div>
              <p className="danger-text-user">
                Estas acciones son irreversibles. Procede con precaución.
              </p>
              <button className="danger-btn-user" onClick={handleDelete}>
                <span className="material-icons">delete_forever</span>
                Eliminar Cuenta Permanentemente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {editMode && (
        <div className="modal-overlay" onClick={() => setEditMode(false)}>
          <div className="modal-content-user" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-user">
              <h3>Editar Perfil</h3>
              <button onClick={() => setEditMode(false)} className="close-btn">
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="modal-body-user">
              <div className="form-group">
                <label>
                  <span className="material-icons">person</span>
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  minLength="3"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>
                  <span className="material-icons">person_outline</span>
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>
                  <span className="material-icons">phone</span>
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <span className="material-icons">monitor_weight</span>
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="peso"
                    value={formData.peso}
                    onChange={handleChange}
                    min="0"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <span className="material-icons">height</span>
                    Altura (m)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="altura"
                    value={formData.altura}
                    onChange={handleChange}
                    min="0"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="btn-cancel-user"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={loading}
                  className="btn-save-user"
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
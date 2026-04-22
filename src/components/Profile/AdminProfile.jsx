import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import authService from '../../services/authService';
import ModalCambiarContrasena from '../Modals/ModalCambiarContrasena';
import './AdminProfile.css';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    departamento: '',
    usuario: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    cargarDatosAdmin();
  }, []);

  const cargarDatosAdmin = () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setAdmin(currentUser);
      setFormData({
        nombre: currentUser.nombre || '',
        apellido: currentUser.apellido || '',
        telefono: currentUser.telefono || '',
        departamento: currentUser.departamento || '',
        usuario: currentUser.usuario || ''
      });
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
        departamento: formData.departamento,
        usuario: formData.usuario
      };

      // ✅ Usar updateAdminPerfil
      const updated = await authService.updateAdminPerfil(admin.correo, updatedData);
      
      // ✅ Actualizar el estado local
      setAdmin(updated);
      
      // ✅ Actualizar localStorage
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updated };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      setEditMode(false);
      setMessage({
        type: 'success',
        text: '¡Perfil actualizado exitosamente!'
      });
      
      setTimeout(() => {
        cargarDatosAdmin();
        setMessage({ type: '', text: '' });
      }, 2000);
      
    } catch (error) {
      console.error('Error al actualizar:', error);
      setMessage({
        type: 'error',
        text: error.error || error.message || 'Error al actualizar el perfil'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarContrasena = async (passwords) => {
    try {
      await authService.cambiarContrasenaAdmin(admin.correo, passwords);
      setMessage({
        type: 'success',
        text: '¡Contraseña cambiada exitosamente!'
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      throw error;
    }
  };

  if (!admin) {
    return (
      <div className={`admin-profile-container ${darkMode ? 'dark' : ''}`}>
        <div className="loading-state">Cargando...</div>
      </div>
    );
  }

  return (
    <div className={`admin-profile-container ${darkMode ? 'dark' : ''}`}>
      <button className="back-btn-profile" onClick={() => navigate('/admin/dashboard')}>
        <span className="material-icons">arrow_back</span>
        <span>Volver al Dashboard</span>
      </button>

      <div className="profile-header-admin">
        <div className="profile-avatar-large-admin">
          <span className="avatar-initials-large-admin">
            {admin.nombre?.charAt(0)}{admin.apellido?.charAt(0) || 'A'}
          </span>
          <div className="admin-badge-overlay">
            <span className="material-icons">admin_panel_settings</span>
          </div>
        </div>
        <div className="profile-info-header-admin">
          <h1>{admin.nombre} {admin.apellido}</h1>
          <p className="profile-email-admin">{admin.correo}</p>
          <span className="profile-badge-admin">
            <span className="material-icons">verified_user</span>
            ADMINISTRADOR
          </span>
        </div>
        <button className="edit-profile-btn" onClick={() => setEditMode(true)}>
          <span className="material-icons">edit</span>
          Editar Perfil
        </button>
      </div>

      {/* Mensaje de alerta */}
      {message.text && (
        <div className={`alert-message ${message.type}`}>
          <span className="material-icons">
            {message.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {message.text}
        </div>
      )}

      <div className="profile-tabs-admin">
        <button 
          className={`tab-btn-admin ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <span className="material-icons">badge</span>
          Información Personal
        </button>
        <button 
          className={`tab-btn-admin ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <span className="material-icons">history</span>
          Actividad Reciente
        </button>
        <button 
          className={`tab-btn-admin ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span className="material-icons">settings</span>
          Configuración
        </button>
      </div>

      <div className="profile-content-admin">
        {activeTab === 'info' && (
          <div className="info-section-admin">
            <div className="info-card-admin">
              <div className="card-header-admin">
                <h3>
                  <span className="material-icons">person</span>
                  Datos Personales
                </h3>
              </div>
              <div className="info-grid-admin">
                <div className="info-item-admin">
                  <span className="material-icons">badge</span>
                  <div>
                    <label>Usuario</label>
                    <p>@{admin.usuario || 'N/A'}</p>
                  </div>
                </div>
                <div className="info-item-admin">
                  <span className="material-icons">email</span>
                  <div>
                    <label>Correo Electrónico</label>
                    <p>{admin.correo}</p>
                  </div>
                </div>
                <div className="info-item-admin">
                  <span className="material-icons">phone</span>
                  <div>
                    <label>Teléfono</label>
                    <p>{admin.telefono || 'No registrado'}</p>
                  </div>
                </div>
                <div className="info-item-admin">
                  <span className="material-icons">business</span>
                  <div>
                    <label>Departamento</label>
                    <p>{admin.departamento || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card-admin">
              <div className="card-header-admin">
                <h3>
                  <span className="material-icons">admin_panel_settings</span>
                  Permisos y Accesos
                </h3>
              </div>
              <div className="permissions-grid">
                <div className="permission-item">
                  <span className="material-icons active">check_circle</span>
                  <p>Gestión de Usuarios</p>
                </div>
                <div className="permission-item">
                  <span className="material-icons active">check_circle</span>
                  <p>Gestión de Ejercicios</p>
                </div>
                <div className="permission-item">
                  <span className="material-icons active">check_circle</span>
                  <p>Gestión de Recetas</p>
                </div>
                <div className="permission-item">
                  <span className="material-icons active">check_circle</span>
                  <p>Reportes y Estadísticas</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-section-admin">
            <div className="activity-card-admin">
              <h3>
                <span className="material-icons">history</span>
                Actividad Reciente
              </h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="material-icons">login</span>
                  <div>
                    <p>Inicio de sesión</p>
                    <span className="activity-time">Hace 5 minutos</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="material-icons">person_add</span>
                  <div>
                    <p>Usuario creado</p>
                    <span className="activity-time">Hace 2 horas</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="material-icons">edit</span>
                  <div>
                    <p>Ejercicio modificado</p>
                    <span className="activity-time">Hace 1 día</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section-admin">
            <div className="settings-card-admin">
              <h3>
                <span className="material-icons">security</span>
                Seguridad
              </h3>
              <button 
                className="settings-btn-admin"
                onClick={() => setShowPasswordModal(true)}
              >
                <span className="material-icons">lock</span>
                Cambiar Contraseña
              </button>
              <button className="settings-btn-admin">
                <span className="material-icons">shield</span>
                Autenticación de dos factores
              </button>
            </div>

            <div className="settings-card-admin danger-zone">
              <h3>
                <span className="material-icons">warning</span>
                Zona de Peligro
              </h3>
              <p className="danger-text">
                Estas acciones son irreversibles. Procede con precaución.
              </p>
              <button className="settings-btn-admin danger">
                <span className="material-icons">logout</span>
                Cerrar todas las sesiones
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {editMode && (
        <div className="modal-overlay" onClick={() => setEditMode(false)}>
          <div className="modal-content-admin" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-admin">
              <h3>Editar Perfil de Administrador</h3>
              <button onClick={() => setEditMode(false)} className="close-btn">
                <span className="material-icons">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="modal-body-admin">
                <div className="form-row">
                  <div className="form-field">
                    <label>
                      <span className="material-icons">person</span>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      minLength="3"
                      className="input-admin"
                      placeholder="Ingresa tu nombre"
                    />
                  </div>
                  <div className="form-field">
                    <label>
                      <span className="material-icons">person_outline</span>
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      className="input-admin"
                      placeholder="Ingresa tu apellido"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>
                    <span className="material-icons">badge</span>
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleChange}
                    className="input-admin"
                    placeholder="Nombre de usuario"
                  />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>
                      <span className="material-icons">phone</span>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="input-admin"
                      placeholder="Ej: 0925412305"
                    />
                  </div>
                  <div className="form-field">
                    <label>
                      <span className="material-icons">business</span>
                      Departamento
                    </label>
                    <input
                      type="text"
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleChange}
                      className="input-admin"
                      placeholder="Ej: Sistemas"
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="btn-cancel-admin"
                    disabled={loading}
                  >
                    <span className="material-icons">close</span>
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={loading} 
                    className="btn-save-admin"
                  >
                    <span className="material-icons">
                      {loading ? 'hourglass_empty' : 'save'}
                    </span>
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de cambiar contraseña */}
      <ModalCambiarContrasena
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleCambiarContrasena}
        isAdmin={true}
      />
    </div>
  );
};

export default AdminProfile;
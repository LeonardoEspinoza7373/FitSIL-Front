// src/components/Dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import authService from '../../services/authService';
import adminService from '../../services/adminService';
import notificationService from '../../services/notificationService';
import reporteService from '../../services/reporteService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const [admin, setAdmin] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const [usuarios, setUsuarios] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    administradores: 0,
    usuarios: 0,
    promedioPeso: 0,
    promedioAltura: 0
  });
  const [loading, setLoading] = useState(false);
  const [usuariosActivos, setUsuariosActivos] = useState(0);
  
  // Estados de notificaciones
  const [notificaciones, setNotificaciones] = useState([]);
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0);
  
  // Estados de reportes
  const [reportes, setReportes] = useState([]);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nuevoReporte, setNuevoReporte] = useState({
    nombre: '',
    tipo: 'USUARIOS',
    fechaInicio: '',
    fechaFin: '',
    filtros: {}
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setAdmin(currentUser);
    }
    cargarDatos();
    cargarNotificaciones();
    cargarReportes();

    // Suscribirse a cambios en notificaciones
    const actualizarNotificaciones = () => {
      cargarNotificaciones();
    };
    notificationService.suscribir(actualizarNotificaciones);

    return () => {
      notificationService.desuscribir(actualizarNotificaciones);
    };
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      let usuariosData = [];
      try {
        usuariosData = await adminService.listarUsuarios();
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
      
      let statsData = { total: 0, administradores: 0, usuarios: 0 };
      try {
        statsData = await adminService.obtenerEstadisticas();
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
      
      let promedioPeso = 0;
      let promedioAltura = 0;
      
      if (usuariosData.length > 0) {
        const usuariosConPeso = usuariosData.filter(u => u.peso && u.peso > 0);
        const usuariosConAltura = usuariosData.filter(u => u.altura && u.altura > 0);
        
        if (usuariosConPeso.length > 0) {
          promedioPeso = usuariosConPeso.reduce((sum, u) => sum + u.peso, 0) / usuariosConPeso.length;
        }
        
        if (usuariosConAltura.length > 0) {
          promedioAltura = usuariosConAltura.reduce((sum, u) => sum + u.altura, 0) / usuariosConAltura.length;
        }
      }
      
      setUsuarios(usuariosData);
      setEstadisticas({
        ...statsData,
        promedioPeso,
        promedioAltura
      });
      setUsuariosActivos(adminService.calcularUsuariosActivos(usuariosData));
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarNotificaciones = async () => {
    try {
      const notifs = await notificationService.obtenerNotificaciones();
      setNotificaciones(notifs);
      const noLeidas = notifs.filter(n => !n.leida).length;
      setNotificacionesNoLeidas(noLeidas);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  const cargarReportes = async () => {
    try {
      const reps = await reporteService.obtenerReportes();
      setReportes(reps);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    }
  };

  const handleMarcarLeida = async (id) => {
    await notificationService.marcarComoLeida(id);
    cargarNotificaciones();
  };

  const handleMarcarTodasLeidas = async () => {
    await notificationService.marcarTodasComoLeidas();
    cargarNotificaciones();
  };

  const handleEliminarNotificacion = async (id) => {
    await notificationService.eliminarNotificacion(id);
    cargarNotificaciones();
  };

  const handleCrearReporte = async () => {
    try {
      const reporte = await reporteService.generarReportePersonalizado(nuevoReporte);
      await reporteService.crearReporte(reporte);
      alert('Reporte creado exitosamente');
      setShowReportModal(false);
      setNuevoReporte({
        nombre: '',
        tipo: 'USUARIOS',
        fechaInicio: '',
        fechaFin: '',
        filtros: {}
      });
      cargarReportes();
    } catch (error) {
      alert('Error al crear reporte');
    }
  };

  const handleActualizarReporte = async (id, datos) => {
    try {
      await reporteService.actualizarReporte(id, datos);
      alert('Reporte actualizado');
      setModoEdicion(false);
      setReporteSeleccionado(null);
      cargarReportes();
    } catch (error) {
      alert('Error al actualizar reporte');
    }
  };

  const handleEliminarReporte = async (id) => {
    if (window.confirm('¿Eliminar este reporte?')) {
      try {
        await reporteService.eliminarReporte(id);
        alert('Reporte eliminado');
        cargarReportes();
      } catch (error) {
        alert('Error al eliminar reporte');
      }
    }
  };

  const handleExportarReporte = (reporte, formato) => {
    if (formato === 'CSV') {
      reporteService.exportarCSV(reporte);
    } else if (formato === 'JSON') {
      reporteService.exportarJSON(reporte);
    }
  };

  const getIconoNotificacion = (tipo) => {
    switch (tipo) {
      case 'NUEVO_USUARIO': return 'person_add';
      case 'CAMBIO_ROL': return 'swap_horiz';
      case 'ELIMINACION': return 'delete';
      case 'SISTEMA': return 'info';
      default: return 'notifications';
    }
  };

  if (!admin) {
    return (
      <div className={`admin-dashboard-modern ${darkMode ? 'dark' : ''}`}>
        <div className="loading-state">Cargando...</div>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard-modern ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="material-icons logo-icon">fitness_center</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <span className="material-icons">dashboard</span>
            <span className="nav-text">Dashboard</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => navigate('/admin/usuarios')}
          >
            <span className="material-icons">group</span>
            <span className="nav-text">Usuarios</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'exercises' ? 'active' : ''}`}
            onClick={() => navigate('/ejercicios')}
          >
            <span className="material-icons">sports_gymnastics</span>
            <span className="nav-text">Ejercicios</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveSection('analytics')}
          >
            <span className="material-icons">analytics</span>
            <span className="nav-text">Reportes</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        {/* Header */}
        <header className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          
          <div className="admin-header-actions">
            {/* Botón de notificaciones */}
            <div className="notification-container">
              <button 
                className="notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="material-icons">notifications</span>
                {notificacionesNoLeidas > 0 && (
                  <span className="notification-badge">{notificacionesNoLeidas}</span>
                )}
              </button>

              {/* Panel de notificaciones */}
              {showNotifications && (
                <div className="notifications-panel">
                  <div className="notifications-header">
                    <h3>Notificaciones</h3>
                    {notificacionesNoLeidas > 0 && (
                      <button 
                        className="mark-all-read"
                        onClick={handleMarcarTodasLeidas}
                      >
                        Marcar todas como leídas
                      </button>
                    )}
                  </div>
                  
                  <div className="notifications-list">
                    {notificaciones.length === 0 ? (
                      <div className="empty-notifications">
                        <span className="material-icons">notifications_none</span>
                        <p>No hay notificaciones</p>
                      </div>
                    ) : (
                      notificaciones.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`notification-item ${notif.leida ? 'read' : 'unread'}`}
                        >
                          <div className="notification-icon">
                            <span className="material-icons">
                              {getIconoNotificacion(notif.tipo)}
                            </span>
                          </div>
                          <div className="notification-content">
                            <p className="notification-message">{notif.mensaje}</p>
                            <span className="notification-time">
                              {new Date(notif.fecha).toLocaleString('es-ES')}
                            </span>
                          </div>
                          <div className="notification-actions">
                            {!notif.leida && (
                              <button 
                                className="btn-icon"
                                onClick={() => handleMarcarLeida(notif.id)}
                                title="Marcar como leída"
                              >
                                <span className="material-icons">done</span>
                              </button>
                            )}
                            <button 
                              className="btn-icon delete"
                              onClick={() => handleEliminarNotificacion(notif.id)}
                              title="Eliminar"
                            >
                              <span className="material-icons">close</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="admin-avatar" onClick={() => navigate('/admin/perfil')}>
              <span className="avatar-initials">
                {admin.nombre?.charAt(0)}{admin.apellido?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Modal de perfil */}
        {showProfileModal && (
          <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
            <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="profile-header-content">
                  <div className="profile-avatar-large admin-profile">
                    <span className="avatar-initials-large">
                      {admin.nombre?.charAt(0)}{admin.apellido?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="profile-header-text">
                    <h3>{admin.nombre} {admin.apellido}</h3>
                    <p className="profile-role">Administrador</p>
                  </div>
                </div>
                <button onClick={() => setShowProfileModal(false)} className="close-btn">
                  <span className="material-icons">close</span>
                </button>
              </div>

              <div className="profile-modal-body">
                <div className="profile-info-section">
                  <h4 className="section-title">
                    <span className="material-icons">admin_panel_settings</span>
                    Información del Administrador
                  </h4>
                  
                  <div className="profile-info-list">
                    <div className="profile-info-item">
                      <div className="info-icon-wrapper">
                        <span className="material-icons">badge</span>
                      </div>
                      <div className="info-text">
                        <span className="info-label-profile">Usuario</span>
                        <span className="info-value-profile">@{admin.usuario || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <div className="info-icon-wrapper">
                        <span className="material-icons">email</span>
                      </div>
                      <div className="info-text">
                        <span className="info-label-profile">Correo</span>
                        <span className="info-value-profile">{admin.correo}</span>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <div className="info-icon-wrapper">
                        <span className="material-icons">phone</span>
                      </div>
                      <div className="info-text">
                        <span className="info-label-profile">Teléfono</span>
                        <span className="info-value-profile">{admin.telefono || 'No registrado'}</span>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <div className="info-icon-wrapper">
                        <span className="material-icons">business</span>
                      </div>
                      <div className="info-text">
                        <span className="info-label-profile">Departamento</span>
                        <span className="info-value-profile">{admin.departamento || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="admin-content">
          {/* Statistics Cards */}
          <section className="stats-section">
            <div className="stat-card-admin">
              <p className="stat-label-admin">Total Usuarios</p>
              <p className="stat-value-admin">{estadisticas.total || 0}</p>
            </div>
            
            <div className="stat-card-admin">
              <p className="stat-label-admin">Administradores</p>
              <p className="stat-value-admin">{estadisticas.administradores || 0}</p>
            </div>
            
            <div className="stat-card-admin">
              <p className="stat-label-admin">Peso Promedio</p>
              <p className="stat-value-admin">
                {estadisticas.promedioPeso > 0 ? estadisticas.promedioPeso.toFixed(1) : '0'} kg
              </p>
            </div>
            
            <div className="stat-card-admin">
              <p className="stat-label-admin">Altura Promedio</p>
              <p className="stat-value-admin">
                {estadisticas.promedioAltura > 0 ? estadisticas.promedioAltura.toFixed(2) : '0'} m
              </p>
            </div>
          </section>

          {/* Dashboard Overview */}
          {activeSection === 'dashboard' && (
            <section className="management-section">
              <h2 className="section-title-main">Resumen del Sistema</h2>
              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <div className="dashboard-card-icon users">
                    <span className="material-icons">group</span>
                  </div>
                  <div className="dashboard-card-content">
                    <h3>Usuarios</h3>
                    <p>Gestionar usuarios del sistema</p>
                    <p className="card-stat">{estadisticas.usuarios || 0} usuarios</p>
                    <p className="card-stat">{estadisticas.administradores || 0} administradores</p>
                    <button onClick={() => navigate('/admin/usuarios')} className="card-action-btn">
                      Ver más →
                    </button>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-icon exercises">
                    <span className="material-icons">sports_gymnastics</span>
                  </div>
                  <div className="dashboard-card-content">
                    <h3>Ejercicios</h3>
                    <p>Biblioteca de ejercicios</p>
                    <button onClick={() => navigate('/ejercicios')} className="card-action-btn">
                      Ver más →
                    </button>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-icon analytics">
                    <span className="material-icons">analytics</span>
                  </div>
                  <div className="dashboard-card-content">
                    <h3>Reportes</h3>
                    <p>Estadísticas y análisis</p>
                    <p className="card-stat">{usuariosActivos} activos hoy</p>
                    <button onClick={() => setActiveSection('analytics')} className="card-action-btn">
                      Ver más →
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Analytics & Reports */}
          {activeSection === 'analytics' && (
            <section className="management-section">
              <div className="section-header">
                <h2 className="section-title-main">Gestión de Reportes</h2>
                <button 
                  className="btn-primary"
                  onClick={() => setShowReportModal(true)}
                >
                  <span className="material-icons">add</span>
                  Nuevo Reporte
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card-large">
                  <h3>Total de Usuarios</h3>
                  <p className="stat-large-value">{estadisticas.total || 0}</p>
                  <div className="stat-breakdown">
                    <p>{estadisticas.usuarios || 0} Usuarios regulares</p>
                    <p>{estadisticas.administradores || 0} Administradores</p>
                  </div>
                </div>

                <div className="stat-card-large">
                  <h3>Promedios Físicos</h3>
                  <div className="stat-breakdown">
                    <p>Peso: {estadisticas.promedioPeso > 0 ? estadisticas.promedioPeso.toFixed(1) : '0'} kg</p>
                    <p>Altura: {estadisticas.promedioAltura > 0 ? estadisticas.promedioAltura.toFixed(2) : '0'} m</p>
                  </div>
                </div>
              </div>

              {/* Lista de reportes */}
              <div className="reportes-lista">
                <h3>Reportes Guardados</h3>
                {reportes.length === 0 ? (
                  <div className="empty-state">
                    <span className="material-icons">description</span>
                    <p>No hay reportes creados</p>
                  </div>
                ) : (
                  <div className="reportes-grid">
                    {reportes.map(reporte => (
                      <div key={reporte.id} className="reporte-card">
                        <div className="reporte-header">
                          <h4>{reporte.nombre}</h4>
                          <span className="reporte-tipo">{reporte.tipo}</span>
                        </div>
                        <p className="reporte-fecha">
                          Creado: {new Date(reporte.fechaCreacion).toLocaleDateString('es-ES')}
                        </p>
                        <div className="reporte-actions">
                          <button 
                            className="btn-icon"
                            onClick={() => handleExportarReporte(reporte, 'CSV')}
                            title="Exportar CSV"
                          >
                            <span className="material-icons">download</span>
                          </button>
                          <button 
                            className="btn-icon"
                            onClick={() => {
                              setReporteSeleccionado(reporte);
                              setModoEdicion(true);
                            }}
                            title="Editar"
                          >
                            <span className="material-icons">edit</span>
                          </button>
                          <button 
                            className="btn-icon delete"
                            onClick={() => handleEliminarReporte(reporte.id)}
                            title="Eliminar"
                          >
                            <span className="material-icons">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Modal de creación/edición de reporte */}
      {(showReportModal || modoEdicion) && (
        <div className="modal-overlay" onClick={() => {
          setShowReportModal(false);
          setModoEdicion(false);
          setReporteSeleccionado(null);
        }}>
          <div className="modal-content report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modoEdicion ? 'Editar Reporte' : 'Nuevo Reporte'}</h3>
              <button 
                onClick={() => {
                  setShowReportModal(false);
                  setModoEdicion(false);
                  setReporteSeleccionado(null);
                }} 
                className="close-btn"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Nombre del Reporte</label>
                <input 
                  type="text"
                  className="form-control"
                  value={modoEdicion ? reporteSeleccionado?.nombre : nuevoReporte.nombre}
                  onChange={(e) => {
                    if (modoEdicion) {
                      setReporteSeleccionado({...reporteSeleccionado, nombre: e.target.value});
                    } else {
                      setNuevoReporte({...nuevoReporte, nombre: e.target.value});
                    }
                  }}
                  placeholder="Ej: Reporte Mensual de Usuarios"
                />
              </div>

              <div className="form-group">
                <label>Tipo de Reporte</label>
                <select 
                  className="form-control"
                  value={modoEdicion ? reporteSeleccionado?.tipo : nuevoReporte.tipo}
                  onChange={(e) => {
                    if (modoEdicion) {
                      setReporteSeleccionado({...reporteSeleccionado, tipo: e.target.value});
                    } else {
                      setNuevoReporte({...nuevoReporte, tipo: e.target.value});
                    }
                  }}
                >
                  <option value="USUARIOS">Usuarios</option>
                  <option value="ACTIVIDAD">Actividad</option>
                  <option value="EJERCICIOS">Ejercicios</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha Inicio</label>
                  <input 
                    type="date"
                    className="form-control"
                    value={modoEdicion ? reporteSeleccionado?.fechaInicio : nuevoReporte.fechaInicio}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setReporteSeleccionado({...reporteSeleccionado, fechaInicio: e.target.value});
                      } else {
                        setNuevoReporte({...nuevoReporte, fechaInicio: e.target.value});
                      }
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>Fecha Fin</label>
                  <input 
                    type="date"
                    className="form-control"
                    value={modoEdicion ? reporteSeleccionado?.fechaFin : nuevoReporte.fechaFin}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setReporteSeleccionado({...reporteSeleccionado, fechaFin: e.target.value});
                      } else {
                        setNuevoReporte({...nuevoReporte, fechaFin: e.target.value});
                      }
                    }}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowReportModal(false);
                    setModoEdicion(false);
                    setReporteSeleccionado(null);
                  }}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    if (modoEdicion) {
                      handleActualizarReporte(reporteSeleccionado.id, reporteSeleccionado);
                    } else {
                      handleCrearReporte();
                    }
                  }}
                >
                  {modoEdicion ? 'Actualizar' : 'Crear'} Reporte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
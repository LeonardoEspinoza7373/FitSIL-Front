// src/components/Admin/AdminUsuarios.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import adminService from '../../services/adminService';
import notificationService from '../../services/notificationService';
import './AdminUsuarios.css';

const AdminUsuarios = () => {
  const { darkMode } = useTheme();
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await adminService.listarUsuarios();
      setUsuarios(data);
      setUsuariosFiltrados(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const resultados = adminService.buscarUsuarios(usuarios, searchTerm);
    setUsuariosFiltrados(resultados);
  }, [searchTerm, usuarios]);

  const handleEliminarUsuario = async (email) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario ${email}?`)) {
      try {
        await adminService.eliminarUsuario(email);
        
        // Crear notificación
        await notificationService.notificarEliminacionUsuario(email);
        
        alert('Usuario eliminado exitosamente');
        cargarUsuarios();
      } catch (error) {
        alert('Error al eliminar usuario');
      }
    }
  };

  const handleCambiarRol = async (email, rolActual) => {
    const nuevoRol = rolActual === 'USUARIO' ? 'ADMINISTRADOR' : 'USUARIO';
    
    if (window.confirm(`¿Cambiar rol de ${email} a ${nuevoRol}?`)) {
      try {
        await adminService.cambiarRol(email, nuevoRol);
        
        // Crear notificación
        await notificationService.notificarCambioRol(email, rolActual, nuevoRol);
        
        alert('Rol actualizado exitosamente');
        cargarUsuarios();
      } catch (error) {
        alert('Error al cambiar rol');
      }
    }
  };

  return (
    <div className={`admin-usuarios-page ${darkMode ? 'dark' : ''}`}>
      <div className="page-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
            <span className="material-icons">arrow_back</span>
          </button>
          <div className="header-text">
            <h1>Gestión de Usuarios</h1>
            <p>Administra los usuarios del sistema</p>
          </div>
        </div>
        
        {/* Botón de actualizar arreglado */}
        <button 
          className="btn-refresh" 
          onClick={cargarUsuarios}
          disabled={loading}
          title="Actualizar lista"
        >
          <span className={`material-icons ${loading ? 'spinning' : ''}`}>
            refresh
          </span>
          <span className="btn-text">Actualizar</span>
        </button>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <span className="material-icons search-icon">search</span>
          <input 
            type="text" 
            placeholder="Buscar por nombre, correo o usuario..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              <span className="material-icons">close</span>
            </button>
          )}
        </div>
        
        <div className="search-info">
          <span className="material-icons">info</span>
          Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
        </div>
      </div>

      <div className="usuarios-container">
        {loading ? (
          <div className="loading-state">
            <span className="material-icons spinning">refresh</span>
            <p>Cargando usuarios...</p>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">group</span>
            <p>{searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}</p>
            {searchTerm && (
              <button 
                className="btn-secondary"
                onClick={() => setSearchTerm('')}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Peso</th>
                  <th>Altura</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>
                      <span className="user-id">#{usuario.id}</span>
                    </td>
                    <td>
                      <div className="user-name-cell">
                        <div className="user-avatar-small">
                          {usuario.nombre?.charAt(0)}{usuario.apellido?.charAt(0)}
                        </div>
                        <span>{usuario.nombre} {usuario.apellido}</span>
                      </div>
                    </td>
                    <td>
                      <span className="username">@{usuario.usuario}</span>
                    </td>
                    <td>{usuario.correo}</td>
                    <td>
                      <span className="metric-value">
                        {usuario.peso || 'N/A'} {usuario.peso && 'kg'}
                      </span>
                    </td>
                    <td>
                      <span className="metric-value">
                        {usuario.altura || 'N/A'} {usuario.altura && 'm'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${usuario.rol?.toLowerCase()}`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-action edit"
                          title="Cambiar rol"
                          onClick={() => handleCambiarRol(usuario.correo, usuario.rol)}
                        >
                          <span className="material-icons">swap_horiz</span>
                        </button>
                        <button 
                          className="btn-action delete"
                          title="Eliminar"
                          onClick={() => handleEliminarUsuario(usuario.correo)}
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsuarios;
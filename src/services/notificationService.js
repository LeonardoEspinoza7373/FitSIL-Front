// src/services/notificationService.js
import api from './api';

class NotificationService {
  constructor() {
    this.listeners = [];
  }

  // ========================================
  // ✅ MÉTODOS DEL ADMINISTRADOR
  // ========================================

  // Obtener todas las notificaciones (Admin)
  async obtenerNotificaciones() {
    try {
      const response = await api.get('/api/notificaciones/usuario');
      return response.data;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      return this.obtenerNotificacionesLocal();
    }
  }

  // Crear notificación (Admin)
  async crearNotificacion(tipo, mensaje, datos = {}) {
    const notificacion = {
      id: Date.now(),
      tipo, // 'NUEVO_USUARIO', 'CAMBIO_ROL', 'ELIMINACION', 'SISTEMA', 'NUEVO_REPORTE'
      mensaje,
      datos,
      leida: false,
      fecha: new Date().toISOString()
    };

    try {
      const response = await api.post('/api/notificaciones', notificacion);
      this.notificarListeners();
      return response.data;
    } catch (error) {
      console.warn('Endpoint no disponible, usando localStorage');
      this.guardarNotificacionLocal(notificacion);
      this.notificarListeners();
      return notificacion;
    }
  }

  // Marcar como leída (Admin)
  async marcarComoLeida(id) {
    try {
      await api.put(`/api/notificaciones/${id}/marcar-leida`);
    } catch (error) {
      this.marcarLeidaLocal(id);
    }
    this.notificarListeners();
  }

  // Marcar todas como leídas (Admin)
  async marcarTodasComoLeidas() {
    try {
      await api.put('/api/notificaciones/marcar-todas-leidas');
    } catch (error) {
      this.marcarTodasLeidasLocal();
    }
    this.notificarListeners();
  }

  // Eliminar notificación (Admin)
  async eliminarNotificacion(id) {
    try {
      await api.delete(`/api/notificaciones/${id}`);
    } catch (error) {
      this.eliminarNotificacionLocal(id);
    }
    this.notificarListeners();
  }

  // Contar no leídas (Admin)
  async contarNoLeidas() {
    const notificaciones = await this.obtenerNotificaciones();
    return notificaciones.filter(n => !n.leida).length;
  }

  // ========================================
  // ✅ MÉTODOS LOCALES (FALLBACK)
  // ========================================

  obtenerNotificacionesLocal() {
    const notificaciones = localStorage.getItem('notificaciones_admin');
    return notificaciones ? JSON.parse(notificaciones) : this.generarNotificacionesDemo();
  }

  generarNotificacionesDemo() {
    return [
      {
        id: 1,
        tipo: 'SISTEMA',
        mensaje: 'Sistema de notificaciones activado',
        leida: false,
        fecha: new Date().toISOString()
      },
      {
        id: 2,
        tipo: 'NUEVO_USUARIO',
        mensaje: 'Nuevo usuario registrado: Juan Pérez',
        leida: false,
        fecha: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }

  guardarNotificacionLocal(notificacion) {
    const notificaciones = this.obtenerNotificacionesLocal();
    notificaciones.unshift(notificacion);
    // Mantener solo las últimas 50
    if (notificaciones.length > 50) {
      notificaciones.pop();
    }
    localStorage.setItem('notificaciones_admin', JSON.stringify(notificaciones));
  }

  marcarLeidaLocal(id) {
    const notificaciones = this.obtenerNotificacionesLocal();
    const notif = notificaciones.find(n => n.id === id);
    if (notif) {
      notif.leida = true;
      localStorage.setItem('notificaciones_admin', JSON.stringify(notificaciones));
    }
  }

  marcarTodasLeidasLocal() {
    const notificaciones = this.obtenerNotificacionesLocal();
    notificaciones.forEach(n => n.leida = true);
    localStorage.setItem('notificaciones_admin', JSON.stringify(notificaciones));
  }

  eliminarNotificacionLocal(id) {
    let notificaciones = this.obtenerNotificacionesLocal();
    notificaciones = notificaciones.filter(n => n.id !== id);
    localStorage.setItem('notificaciones_admin', JSON.stringify(notificaciones));
  }

  // ========================================
  // ✅ SISTEMA DE EVENTOS
  // ========================================

  suscribir(callback) {
    this.listeners.push(callback);
  }

  desuscribir(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  notificarListeners() {
    this.listeners.forEach(callback => callback());
  }

  // ========================================
  // ✅ NOTIFICACIONES PREDEFINIDAS
  // ========================================

  notificarNuevoUsuario(usuario) {
    return this.crearNotificacion(
      'NUEVO_USUARIO',
      `Nuevo usuario registrado: ${usuario.nombre} ${usuario.apellido}`,
      { email: usuario.correo, rol: usuario.rol }
    );
  }

  notificarCambioRol(email, rolAnterior, rolNuevo) {
    return this.crearNotificacion(
      'CAMBIO_ROL',
      `Rol actualizado para ${email}: ${rolAnterior} → ${rolNuevo}`,
      { email, rolAnterior, rolNuevo }
    );
  }

  notificarEliminacionUsuario(email) {
    return this.crearNotificacion(
      'ELIMINACION',
      `Usuario eliminado: ${email}`,
      { email }
    );
  }

  notificarSistema(mensaje) {
    return this.crearNotificacion(
      'SISTEMA',
      mensaje,
      {}
    );
  }

  notificarNuevoReporte(nombreReporte, reporteId) {
    return this.crearNotificacion(
      'NUEVO_REPORTE',
      `Nuevo reporte disponible: ${nombreReporte}`,
      { reporteId }
    );
  }
}

export default new NotificationService();
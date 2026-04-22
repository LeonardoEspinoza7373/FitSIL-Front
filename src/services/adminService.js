// src/services/adminService.js
import api from './api';

class AdminService {
  // Listar todos los usuarios
  async listarUsuarios() {
    try {
      console.log('🔍 Intentando obtener usuarios desde: /administradores/usuarios');
      console.log('🔑 Token actual:', localStorage.getItem('token'));
      
      const response = await api.get('/administradores/usuarios');
      
      console.log('✅ Usuarios obtenidos:', response.data);
      console.log('📊 Total de usuarios:', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al listar usuarios:', error);
      console.error('📍 URL intentada: /administradores/usuarios');
      console.error('🔢 Status:', error.response?.status);
      console.error('📄 Response data:', error.response?.data);
      console.error('🔑 Token enviado:', error.config?.headers?.Authorization);
      
      // Si es error 401, el token es inválido o expiró
      if (error.response?.status === 401) {
        console.error('🚨 Token inválido o expirado. Redirigiendo al login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      throw error;
    }
  }

  // Obtener estadísticas
  async obtenerEstadisticas() {
    try {
      console.log('🔍 Intentando obtener estadísticas desde: /administradores/usuarios/estadisticas');
      
      const response = await api.get('/administradores/usuarios/estadisticas');
      
      console.log('✅ Estadísticas obtenidas (raw):', response.data);
      
      // Si el backend retorna un string JSON, parsearlo
      if (typeof response.data === 'string') {
        const parsed = JSON.parse(response.data);
        console.log('✅ Estadísticas parseadas:', parsed);
        return parsed;
      }
      
      console.log('✅ Estadísticas ya son objeto:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      console.error('📍 URL intentada: /administradores/usuarios/estadisticas');
      console.error('🔢 Status:', error.response?.status);
      console.error('📄 Response:', error.response?.data);
      
      throw error;
    }
  }

  // Cambiar rol de usuario
  async cambiarRol(email, nuevoRol) {
    try {
      console.log(`🔄 Cambiando rol de ${email} a ${nuevoRol}`);
      
      const response = await api.put(
        `/administradores/usuarios/rol?email=${encodeURIComponent(email)}`,
        { rol: nuevoRol }
      );
      
      console.log('✅ Rol actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al cambiar rol:', error);
      console.error('Response:', error.response?.data);
      throw error;
    }
  }

  // Eliminar usuario
  async eliminarUsuario(email) {
    try {
      console.log(`🗑️ Eliminando usuario: ${email}`);
      
      const response = await api.delete(
        `/administradores/usuarios?email=${encodeURIComponent(email)}`
      );
      
      console.log('✅ Usuario eliminado:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error);
      console.error('Response:', error.response?.data);
      throw error;
    }
  }

  // Buscar usuarios por nombre o correo
  buscarUsuarios(usuarios, termino) {
    if (!termino || termino.trim() === '') {
      return usuarios;
    }
    
    const terminoLower = termino.toLowerCase().trim();
    
    return usuarios.filter(usuario => {
      const nombre = (usuario.nombre || '').toLowerCase();
      const apellido = (usuario.apellido || '').toLowerCase();
      const nombreCompleto = `${nombre} ${apellido}`.trim();
      const correo = (usuario.correo || '').toLowerCase();
      const nombreUsuario = (usuario.usuario || '').toLowerCase();
      
      return nombreCompleto.includes(terminoLower) ||
             correo.includes(terminoLower) ||
             nombreUsuario.includes(terminoLower) ||
             nombre.includes(terminoLower) ||
             apellido.includes(terminoLower);
    });
  }

  // Calcular usuarios activos
  calcularUsuariosActivos(usuarios) {
    if (!usuarios || usuarios.length === 0) {
      return 0;
    }
    
    // Si tienes un campo de última actividad, úsalo aquí
    // Por ahora, simulamos que el 30% está activo
    const activos = Math.floor(usuarios.length * 0.3);
    
    console.log(`📊 Usuarios activos calculados: ${activos} de ${usuarios.length}`);
    return activos;
  }
}

export default new AdminService();
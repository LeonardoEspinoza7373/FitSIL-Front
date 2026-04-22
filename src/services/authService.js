import api from './api';

const authService = {

  /* =========================
     REGISTROS
  ========================== */

  // Registro USUARIO
  register: async (userData) => {
    try {
      const response = await api.post('/usuarios/registro', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Error al registrar usuario';
    }
  },

  // Registro ADMINISTRADOR
  registerAdmin: async (adminData) => {
    try {
      const response = await api.post('/administradores/registro', adminData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Error al registrar administrador';
    }
  },

  /* =========================
     LOGIN (UNIFICADO REAL)
  ========================== */

  login: async (credentials) => {
    try {
      console.log('🔐 Intentando login en /auth/login');

      const response = await api.post('/auth/login', credentials);

      const { token, rol, correo, nombre, usuario } = response.data;

      // ✅ Validar que tenemos los datos necesarios
      if (!token || !rol || !correo) {
        throw new Error('Respuesta incompleta del servidor');
      }

      // Guardar sesión completa
      const userData = response.data.usuario || response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('rol', rol);
      localStorage.setItem('correo', correo);
      localStorage.setItem('user', JSON.stringify(userData));
      if (nombre) localStorage.setItem('nombre', nombre);

      console.log('✅ Login exitoso. Rol:', rol);

      return response.data;

    } catch (error) {
      console.error('❌ Error en login:', error.response?.data || error.message);

      if (error.response) {
        throw error.response.data?.error || 'Credenciales inválidas';
      }

      throw 'No se pudo conectar con el servidor';
    }
  },

  /* =========================
     SESIÓN
  ========================== */

  logout: () => {
    localStorage.clear();
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getRol: () => {
    return localStorage.getItem('rol');
  },

  getCorreo: () => {
    return localStorage.getItem('correo');
  },

  getNombre: () => {
    return localStorage.getItem('nombre');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error al parsear usuario:', error);
      return null;
    }
  },

  /* =========================
     PERFIL USUARIO
  ========================== */

  getPerfil: async (email) => {
    try {
      const response = await api.get(`/usuarios/perfil/${email}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Error al obtener perfil';
    }
  },

  updatePerfil: async (email, datos) => {
    try {
      console.log('📤 Actualizando perfil usuario:', email);
      const response = await api.put(`/usuarios/perfil?email=${email}`, datos);
      
      // ✅ Actualizar localStorage con los datos nuevos
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('✅ Usuario actualizado en localStorage');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error.response?.data || error.message);
      throw error.response?.data || 'Error al actualizar perfil';
    }
  },

  deletePerfil: async (email) => {
    try {
      const response = await api.delete(`/usuarios/perfil?email=${email}`);
      authService.logout();
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Error al eliminar perfil';
    }
  },

  /* =========================
     PERFIL ADMIN
  ========================== */

  updateAdminPerfil: async (email, datos) => {
    try {
      console.log('📤 Actualizando perfil admin:', email);
      const response = await api.put(`/administradores/perfil?email=${email}`, datos);
      
      // ✅ Actualizar localStorage con los datos nuevos
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('✅ Administrador actualizado en localStorage');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar admin:', error.response?.data || error.message);
      throw error.response?.data || 'Error al actualizar admin';
    }
  },

  /* =========================
     CAMBIAR CONTRASEÑA
  ========================== */

  cambiarContrasenaUsuario: async (email, passwords) => {
    try {
      console.log('🔒 Cambiando contraseña de usuario:', email);
      const response = await api.put(`/usuarios/cambiar-contrasena?email=${email}`, passwords);
      console.log('✅ Contraseña cambiada exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al cambiar contraseña:', error.response?.data || error.message);
      throw error.response?.data || { error: 'Error al cambiar contraseña' };
    }
  },

  cambiarContrasenaAdmin: async (email, passwords) => {
    try {
      console.log('🔒 Cambiando contraseña de administrador:', email);
      const response = await api.put(`/administradores/cambiar-contrasena?email=${email}`, passwords);
      console.log('✅ Contraseña cambiada exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al cambiar contraseña:', error.response?.data || error.message);
      throw error.response?.data || { error: 'Error al cambiar contraseña' };
    }
  }
};

export default authService;
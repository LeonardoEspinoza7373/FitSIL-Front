// src/services/api.js
import axios from 'axios';

// Crear instancia de axios
const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * ============================
 * INTERCEPTOR DE REQUEST
 * ============================
 * 👉 NO agrega token a:
 *    - /login
 *    - /registro
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // Endpoints que NO deben llevar token
    const isAuthEndpoint =
      config.url.includes('/login') ||
      config.url.includes('/registro');

    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token agregado a:', config.url);
    } else {
      console.log('🚫 Petición SIN token:', config.url);
    }

    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

/**
 * ============================
 * INTERCEPTOR DE RESPONSE
 * ============================
 */
api.interceptors.response.use(
  (response) => {
    console.log('✅ Respuesta OK:', response.config.url);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    console.error('❌ Error en respuesta:', url);
    console.error('Status:', status);
    console.error('Data:', error.response?.data);

    // Token inválido o expirado
    if (status === 401) {
      console.warn('🚨 Token inválido o expirado');

      // Limpiar sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirigir SOLO si no estamos en login
      if (!window.location.pathname.includes('/login')) {
        console.log('🔄 Redirigiendo a /login...');
        window.location.href = '/login';
      }
    }

    // Sin permisos
    if (status === 403) {
      console.warn('🚫 Acceso denegado (403)');
    }

    return Promise.reject(error);
  }
);

export default api;
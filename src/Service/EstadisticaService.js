// src/services/EstadisticaService.js
import api from "../services/api";

export const EstadisticaService = {
  /**
   * ✅ Obtener todas las estadísticas del usuario
   */
  obtenerPorUsuario: async () => {
    try {
      const response = await api.get('/api/estadisticas/usuario');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  /**
   * ✅ Obtener resumen por rango
   */
  obtenerResumen: async (rango = '1M') => {
    try {
      const response = await api.get('/api/estadisticas/usuario/resumen', {
        params: { rango }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener resumen:', error);
      throw error;
    }
  },

  /**
   * ✅ Obtener promedio de estrés
   */
  obtenerPromedioEstres: async () => {
    try {
      const response = await api.get('/api/estadisticas/usuario/promedio-estres');
      return response.data.promedioEstres || 0;
    } catch (error) {
      console.error('Error al obtener promedio de estrés:', error);
      return 0;
    }
  },

  /**
   * ✅ NUEVO: Obtener datos para gráfico semanal
   */
  obtenerDatosSemana: async () => {
    try {
      const response = await api.get('/api/estadisticas/usuario/semana');
      return response.data;
    } catch (error) {
      console.error('Error al obtener datos de la semana:', error);
      return [];
    }
  },

  /**
   * ✅ NUEVO: Obtener datos por categoría
   */
  obtenerDatosCategoria: async (rango = '1M') => {
    try {
      const response = await api.get('/api/estadisticas/usuario/categoria', {
        params: { rango }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener datos por categoría:', error);
      return [];
    }
  },

  /**
   * ✅ NUEVO: Obtener dashboard completo
   */
  obtenerDashboard: async (rango = '1M') => {
    try {
      const response = await api.get('/api/estadisticas/usuario/dashboard', {
        params: { rango }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener dashboard:', error);
      throw error;
    }
  },

  /**
   * ✅ Agregar estadística manualmente
   */
  agregar: async (estadistica) => {
    try {
      const response = await api.post('/api/estadisticas/agregar', estadistica);
      return response.data;
    } catch (error) {
      console.error('Error al agregar estadística:', error);
      throw error;
    }
  },

  /**
   * ✅ Generar estadística (testing)
   */
  generar: async (minutos) => {
    try {
      const response = await api.post('/api/estadisticas/generar', null, {
        params: { minutos }
      });
      return response.data;
    } catch (error) {
      console.error('Error al generar estadística:', error);
      throw error;
    }
  },

  /**
   * ✅ Eliminar estadística
   */
  eliminar: async (id) => {
    try {
      const response = await api.delete(`/api/estadisticas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar estadística:', error);
      throw error;
    }
  },

  /**
   * ✅ Helpers locales para procesar datos
   */
  
  // Calcular total de workouts
  calcularTotalWorkouts: (estadisticas) => {
    return estadisticas.length;
  },

  // Calcular promedio de duración
  calcularPromedioDuracion: (estadisticas) => {
    if (estadisticas.length === 0) return 0;
    const total = estadisticas.reduce((sum, e) => sum + e.minutosEjercicio, 0);
    return Math.round(total / estadisticas.length);
  },

  // Calcular total de calorías
  calcularTotalCalorias: (estadisticas) => {
    return Math.round(estadisticas.reduce((sum, e) => sum + e.caloriasQuemadas, 0));
  },

  // Formatear fecha
  formatearFecha: (fechaStr) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short' 
      });
    } catch {
      return fechaStr;
    }
  }
};
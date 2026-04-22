import api from './api';

class RutinaService {
  
  /**
   * ✅ Agregar ejercicio a la rutina
   * @param {Object} ejercicioData - { ejercicioId, dia, series, repeticiones, peso, notas }
   */

async agregarEjercicio(ejercicioData) {
  try {
    console.log('📝 Agregando ejercicio a rutina:', ejercicioData);
    
    // ✅ CORRECCIÓN: El backend espera "dia" no "diaSemana"
    const rutinaData = {
      ejercicioId: ejercicioData.ejercicioId,
      dia: ejercicioData.dia, // ✅ CAMBIO: "dia" en lugar de "diaSemana"
      series: ejercicioData.series || 3,
      repeticiones: ejercicioData.repeticiones || 12,
      peso: ejercicioData.peso || 0,
      notas: ejercicioData.notas || ''
    };

    console.log('📤 Datos enviados al backend:', rutinaData);
    
    const response = await api.post('/api/rutinas/agregar', rutinaData);
    console.log('✅ Respuesta del backend:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error al agregar ejercicio:', error);
    console.error('❌ Detalles:', error.response?.data);
    
    if (error.response) {
      const errorMsg = error.response.data?.error || error.response.data?.message || 'Error del servidor';
      throw new Error(errorMsg);
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor');
    } else {
      throw new Error('Error al procesar la solicitud');
    }
  }
}

  /**
   * ✅ Obtener todas las rutinas del usuario
   */
  async obtenerRutinasUsuario() {
    try {
      console.log('📥 Obteniendo rutinas del usuario...');
      const response = await api.get('/api/rutinas/usuario');
      console.log('✅ Rutinas obtenidas:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener rutinas:', error);
      throw error.response?.data?.error || 'Error al obtener rutinas';
    }
  }

  /**
   * ✅ Obtener rutinas de un día específico
   * @param {String} dia - LUNES, MARTES, etc.
   */
  async obtenerRutinasPorDia(dia) {
    try {
      console.log(`📅 Obteniendo rutinas del ${dia}...`);
      const response = await api.get(`/api/rutinas/dia/${dia.toUpperCase()}`);
      console.log('✅ Rutinas del día:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener rutinas del día:', error);
      throw error.response?.data?.error || 'Error al obtener rutinas del día';
    }
  }

  /**
   * ✅ Marcar rutina como completada (toggle)
   * @param {Number} rutinaId
   */
  async toggleCompletada(rutinaId) {
    try {
      console.log(`✔️ Marcando rutina ${rutinaId} como completada...`);
      const response = await api.put(`/api/rutinas/${rutinaId}/completar`);
      console.log('✅ Rutina actualizada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al marcar como completada:', error);
      throw error.response?.data?.error || 'Error al actualizar rutina';
    }
  }

  /**
   * ✅ Actualizar una rutina
   * @param {Number} rutinaId
   * @param {Object} datos - { dia?, series?, repeticiones?, peso?, notas? }
   */
  async actualizarRutina(rutinaId, datos) {
    try {
      console.log(`📝 Actualizando rutina ${rutinaId}:`, datos);
      const response = await api.put(`/api/rutinas/${rutinaId}`, datos);
      console.log('✅ Rutina actualizada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar rutina:', error);
      throw error.response?.data?.error || 'Error al actualizar rutina';
    }
  }

  /**
   * ✅ Eliminar una rutina
   * @param {Number} rutinaId
   */
  async eliminarRutina(rutinaId) {
    try {
      console.log(`🗑️ Eliminando rutina ${rutinaId}...`);
      const response = await api.delete(`/api/rutinas/${rutinaId}`);
      console.log('✅ Rutina eliminada');
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar rutina:', error);
      throw error.response?.data?.error || 'Error al eliminar rutina';
    }
  }

  /**
   * ✅ Eliminar todas las rutinas del usuario
   */
  async eliminarTodasLasRutinas() {
    try {
      console.log('🗑️ Eliminando todas las rutinas...');
      const response = await api.delete('/api/rutinas/usuario/todas');
      console.log('✅ Todas las rutinas eliminadas');
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar todas las rutinas:', error);
      throw error.response?.data?.error || 'Error al eliminar rutinas';
    }
  }

  /**
   * ✅ Obtener estadísticas de rutinas
   */
  async obtenerEstadisticas() {
    try {
      console.log('📊 Obteniendo estadísticas...');
      const response = await api.get('/api/rutinas/estadisticas');
      console.log('✅ Estadísticas:', response.data);
      
      // Si el backend devuelve un string JSON, parsearlo
      if (typeof response.data === 'string') {
        return JSON.parse(response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      throw error.response?.data?.error || 'Error al obtener estadísticas';
    }
  }

  /**
   * ✅ Obtener rutinas completadas
   */
  async obtenerRutinasCompletadas() {
    try {
      console.log('✅ Obteniendo rutinas completadas...');
      const response = await api.get('/api/rutinas/completadas');
      console.log('✅ Rutinas completadas:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener rutinas completadas:', error);
      throw error.response?.data?.error || 'Error al obtener rutinas completadas';
    }
  }

  /**
   * 🔧 Helpers locales
   */
  
  // Calcular progreso semanal
  calcularProgresoSemanal(rutinas) {
    if (!rutinas || rutinas.length === 0) return 0;
    const completadas = rutinas.filter(r => r.completado).length;
    return Math.round((completadas / rutinas.length) * 100);
  }

  // Agrupar rutinas por día
  agruparPorDia(rutinas) {
    const dias = {};
    const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
    
    diasSemana.forEach(dia => {
      dias[dia] = rutinas.filter(r => r.diaSemana === dia);
    });
    
    return dias;
  }

  // Calcular calorías estimadas (aproximación)
  calcularCaloriasEstimadas(rutina) {
    // Aproximación: 5 calorías por serie
    const calorias = (rutina.series || 0) * 5;
    return calorias;
  }

  // Calcular tiempo estimado de entrenamiento (minutos)
  calcularTiempoEstimado(rutinas) {
    if (!rutinas || rutinas.length === 0) return 0;
    
    // Aproximación: cada serie toma ~2 minutos (incluyendo descanso)
    const totalSeries = rutinas.reduce((sum, r) => sum + (r.series || 0), 0);
    return totalSeries * 2;
  }

  // Verificar si una rutina está asignada a un ejercicio específico
  existeEjercicioEnDia(rutinas, ejercicioId, dia) {
    return rutinas.some(r => 
      r.ejercicio?.id === ejercicioId && r.diaSemana === dia
    );
  }
}

export default new RutinaService();
// src/pages/Estadisticas/Service/reporteService.js
import api from "./api";

const reporteService = {
  /**
   * ========== REPORTES PERSONALES ==========
   */
  
  // Generar reporte mensual
  generarReporteMensual: async () => {
    try {
      const response = await api.get('/api/reportes/mensual');
      return response.data;
    } catch (error) {
      console.error('Error al generar reporte mensual:', error);
      throw error;
    }
  },

  // Generar reporte semanal
  generarReporteSemanal: async () => {
    try {
      const response = await api.get('/api/reportes/semanal');
      return response.data;
    } catch (error) {
      console.error('Error al generar reporte semanal:', error);
      throw error;
    }
  },

  // Generar reporte de calorías
  generarReporteCalorias: async (rango = '1M') => {
    try {
      const response = await api.get('/api/reportes/calorias', {
        params: { rango }
      });
      return response.data;
    } catch (error) {
      console.error('Error al generar reporte de calorías:', error);
      throw error;
    }
  },

  // Generar historial completo
  generarHistorialCompleto: async () => {
    try {
      const response = await api.get('/api/reportes/historial');
      return response.data;
    } catch (error) {
      console.error('Error al generar historial:', error);
      throw error;
    }
  },

  /**
   * ========== DESCARGAS ==========
   */
  
  // Descargar reporte como JSON
  descargarReporteJSON: async (tipo, rango = '1M') => {
    try {
      const response = await api.get(`/api/reportes/descargar/${tipo}`, {
        params: { rango },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_${tipo}_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar JSON:', error);
      throw error;
    }
  },

  // Descargar reporte como CSV
  descargarReporteCSV: async (tipo, rango = '1M') => {
    try {
      let reporte;
      
      switch (tipo) {
        case 'mensual':
          reporte = await reporteService.generarReporteMensual();
          break;
        case 'semanal':
          reporte = await reporteService.generarReporteSemanal();
          break;
        case 'calorias':
          reporte = await reporteService.generarReporteCalorias(rango);
          break;
        case 'historial':
          reporte = await reporteService.generarHistorialCompleto();
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }

      const csv = reporteService.convertirACSV(reporte);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_${tipo}_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar CSV:', error);
      throw error;
    }
  },

  // Convertir reporte a CSV
  convertirACSV: (reporte) => {
    let csv = `Reporte: ${reporte.titulo}\n`;
    csv += `Periodo: ${reporte.periodo}\n`;
    csv += `Fecha: ${reporte.fechaGeneracion}\n\n`;

    csv += 'Resumen\n';
    csv += `Entrenamientos,Duración Promedio,Calorías\n`;
    csv += `${reporte.resumen.entrenamientos},${reporte.resumen.duracionPromedio},${Math.round(reporte.resumen.calorias)}\n\n`;

    if (reporte.detalles && reporte.detalles.length > 0) {
      csv += 'Detalles\n';
      csv += 'Fecha,Minutos,Calorías,Nivel Estrés\n';
      reporte.detalles.forEach(d => {
        csv += `${d.fecha},${d.minutos},${d.calorias},${d.estres}\n`;
      });
    }

    return csv;
  },

  /**
   * ========== REPORTES DEL ADMINISTRADOR ==========
   */
  
  // ✅ Obtener todos los reportes (para admin)
  obtenerReportes: async () => {
    try {
      const response = await api.get('/api/reportes-admin');
      return response.data;
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      throw error;
    }
  },

  // ✅ Crear nuevo reporte (admin)
  crearReporte: async (reporte) => {
    try {
      console.log('📤 Enviando reporte:', reporte);
      const response = await api.post('/api/reportes-admin', reporte);
      console.log('✅ Reporte creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear reporte:', error.response || error);
      throw error;
    }
  },

  // ✅ Actualizar reporte (admin)
  actualizarReporte: async (id, datos) => {
    try {
      const response = await api.put(`/api/reportes-admin/${id}`, datos);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar reporte:', error);
      throw error;
    }
  },

  // ✅ Eliminar reporte (admin)
  eliminarReporte: async (id) => {
    try {
      const response = await api.delete(`/api/reportes-admin/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
      throw error;
    }
  },

  // ✅ Generar reporte personalizado (admin)
  generarReportePersonalizado: async (config) => {
    try {
      console.log('📊 Generando reporte personalizado:', config);
      const response = await api.post('/api/reportes-admin/generar', config);
      console.log('✅ Reporte generado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al generar reporte personalizado:', error);
      // Generar reporte de fallback
      return {
        id: Date.now(),
        nombre: config.nombre,
        tipo: config.tipo,
        fechaCreacion: new Date().toISOString(),
        fechaInicio: config.fechaInicio,
        fechaFin: config.fechaFin,
        datos: JSON.stringify({ mensaje: 'Reporte generado localmente' })
      };
    }
  },

  // ✅ Exportar reporte como CSV (admin)
  exportarCSV: (reporte) => {
    try {
      let csv = `Reporte: ${reporte.nombre}\n`;
      csv += `Tipo: ${reporte.tipo}\n`;
      csv += `Fecha de Creación: ${new Date(reporte.fechaCreacion).toLocaleDateString('es-ES')}\n\n`;

      // Si tiene datos en formato JSON, intentar parsearlos
      if (reporte.datos) {
        try {
          const datosObj = typeof reporte.datos === 'string' 
            ? JSON.parse(reporte.datos) 
            : reporte.datos;
          
          if (Array.isArray(datosObj)) {
            const headers = Object.keys(datosObj[0]);
            csv += headers.join(',') + '\n';
            
            datosObj.forEach(row => {
              csv += headers.map(header => row[header] || '').join(',') + '\n';
            });
          }
        } catch (e) {
          console.warn('No se pudo parsear datos del reporte');
        }
      }

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reporte.nombre}_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      throw error;
    }
  },

  // ✅ Exportar reporte como JSON (admin)
  exportarJSON: (reporte) => {
    try {
      const json = JSON.stringify(reporte, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reporte.nombre}_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar JSON:', error);
      throw error;
    }
  },

  // ✅ Obtener reportes públicos generados por admin (para usuarios)
  obtenerReportesPublicosAdmin: async () => {
    try {
      const response = await api.get('/api/reportes-admin/publicos');
      return response.data;
    } catch (error) {
      console.warn('Endpoint no disponible para reportes públicos');
      return [];
    }
  },

  // ✅ Descargar reporte del admin
  descargarReporteAdmin: async (reporteId, formato = 'JSON') => {
    try {
      const response = await api.get(`/api/reportes-admin/${reporteId}/descargar`, {
        params: { formato },
        responseType: 'blob'
      });

      const extension = formato.toLowerCase();
      const blob = new Blob([response.data], { 
        type: formato === 'JSON' ? 'application/json' : 'text/csv' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_admin_${reporteId}_${Date.now()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar reporte del admin:', error);
      throw error;
    }
  },

  /**
   * ========== NOTIFICACIONES DE USUARIOS ==========
   */
  
  // ✅ Obtener notificaciones de reportes nuevos
  obtenerNotificacionesUsuario: async () => {
    try {
      const response = await api.get('/api/notificaciones-usuario');
      return response.data;
    } catch (error) {
      console.warn('Endpoint no disponible para notificaciones de usuario');
      return [];
    }
  },

  // ✅ Marcar notificación como leída
  marcarNotificacionLeida: async (notifId) => {
    try {
      await api.put(`/api/notificaciones-usuario/${notifId}/leer`);
    } catch (error) {
      console.warn('Error al marcar notificación como leída');
    }
  },

  /**
   * ========== UTILIDADES ==========
   */
  
  // Formatear fecha
  formatearFecha: (fechaStr) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return fechaStr;
    }
  },

  // Formatear número
  formatearNumero: (num) => {
    return new Intl.NumberFormat('es-ES').format(Math.round(num));
  }
};

export default reporteService;
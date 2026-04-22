// src/pages/Estadisticas/Componentes/Reportes.jsx
import { useState, useEffect } from "react";
import reporteService from "../services/reporteService";
import "./Reportes.css";

export default function Reportes({ estadisticas, resumen, rango }) {
  const [loading, setLoading] = useState(false);
  const [reportesDisponibles, setReportesDisponibles] = useState([]);
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    cargarReportesAdmin();
    cargarNotificaciones();
  }, []);

  const cargarReportesAdmin = async () => {
    try {
      const reportes = await reporteService.obtenerReportesPublicosAdmin();
      setReportesDisponibles(reportes);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    }
  };

  const cargarNotificaciones = async () => {
    try {
      const notifs = await reporteService.obtenerNotificacionesUsuario();
      setNotificaciones(notifs);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    }
  };

  const handleMarcarLeida = async (id) => {
    try {
      await reporteService.marcarNotificacionLeida(id);
      setNotificaciones(notificaciones.map(n => 
        n.id === id ? { ...n, leida: true } : n
      ));
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  const handleEliminarNotificacion = (id) => {
    setNotificaciones(notificaciones.filter(n => n.id !== id));
  };

  const handleMarcarTodasLeidas = () => {
    setNotificaciones(notificaciones.map(n => ({ ...n, leida: true })));
  };

  const handleGenerarReportePDF = async (tipo) => {
    setLoading(true);
    try {
      let reporte;
      
      switch (tipo) {
        case "mensual":
          reporte = await reporteService.generarReporteMensual();
          break;
        case "semanal":
          reporte = await reporteService.generarReporteSemanal();
          break;
        case "calorias":
          reporte = await reporteService.generarReporteCalorias(rango);
          break;
        case "historial":
          reporte = await reporteService.generarHistorialCompleto();
          break;
        default:
          throw new Error("Tipo de reporte no válido");
      }

      // Generar y descargar PDF
      generarPDF(reporte);
      
    } catch (error) {
      console.error("Error al generar reporte:", error);
      alert("Error al generar el reporte: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = (reporte) => {
    const ventana = window.open("", "_blank", "width=800,height=600");
    ventana.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reporte.titulo}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            background: #f5f7fa;
            color: #2d3748;
          }
          
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          
          h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 12px;
          }
          
          .meta {
            opacity: 0.95;
            font-size: 15px;
            line-height: 1.8;
          }
          
          .content {
            padding: 40px;
          }
          
          .section {
            margin-bottom: 40px;
          }
          
          h2 {
            color: #667eea;
            font-size: 24px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
          }
          
          .stat-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 25px 0;
          }
          
          .stat-card {
            background: linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%);
            padding: 24px;
            border-radius: 10px;
            text-align: center;
            border: 2px solid #e2e8f0;
            transition: transform 0.2s;
          }
          
          .stat-label {
            color: #718096;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
          }
          
          .stat-value {
            font-size: 36px;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 20px 0;
            border-radius: 10px;
            overflow: hidden;
          }
          
          thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          
          th {
            padding: 16px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          td {
            padding: 14px 16px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
          }
          
          tbody tr {
            background: white;
            transition: background 0.2s;
          }
          
          tbody tr:nth-child(even) {
            background: #f7fafc;
          }
          
          tbody tr:hover {
            background: #edf2f7;
          }
          
          .btn-container {
            text-align: center;
            margin-top: 40px;
            padding-top: 40px;
            border-top: 2px solid #e2e8f0;
          }
          
          .btn-print {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 14px 32px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
            transition: transform 0.2s, box-shadow 0.2s;
          }
          
          .btn-print:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
          }
          
          .analysis-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 25px 0;
          }
          
          .analysis-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          
          .analysis-label {
            color: #718096;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          
          .analysis-value {
            font-size: 20px;
            font-weight: 700;
            color: #2d3748;
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
            }
            
            .btn-container {
              display: none;
            }
            
            .container {
              box-shadow: none;
            }
          }
          
          @media (max-width: 768px) {
            .stat-grid,
            .analysis-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${reporte.titulo}</h1>
            <div class="meta">
              <p><strong>Periodo:</strong> ${reporte.periodo}</p>
              <p><strong>Generado:</strong> ${reporte.fechaGeneracion}</p>
            </div>
          </div>

          <div class="content">
            <div class="section">
              <h2> Resumen General</h2>
              <div class="stat-grid">
                <div class="stat-card">
                  <div class="stat-label">Entrenamientos</div>
                  <div class="stat-value">${reporte.resumen.entrenamientos}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-label">Duración Promedio</div>
                  <div class="stat-value">${Math.round(reporte.resumen.duracionPromedio)}<span style="font-size: 18px;">min</span></div>
                </div>
                <div class="stat-card">
                  <div class="stat-label">Calorías Totales</div>
                  <div class="stat-value">${Math.round(reporte.resumen.calorias)}<span style="font-size: 18px;">kcal</span></div>
                </div>
              </div>
            </div>

            ${reporte.analisis ? `
            <div class="section">
              <h2> Análisis Detallado</h2>
              <div class="analysis-grid">
                ${Object.entries(reporte.analisis).map(([key, value]) => `
                  <div class="analysis-card">
                    <div class="analysis-label">${key}</div>
                    <div class="analysis-value">${value}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}

            ${reporte.detalles && reporte.detalles.length > 0 ? `
            <div class="section">
              <h2> Detalles de Entrenamientos</h2>
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Duración</th>
                    <th>Calorías</th>
                    <th>Nivel Estrés</th>
                  </tr>
                </thead>
                <tbody>
                  ${reporte.detalles.map(d => `
                    <tr>
                      <td><strong>${d.fecha}</strong></td>
                      <td>${d.minutos} min</td>
                      <td>${Math.round(d.calorias)} kcal</td>
                      <td>${typeof d.estres === 'number' ? d.estres.toFixed(1) : d.estres}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            ` : ''}

            <div class="btn-container">
              <button class="btn-print" onclick="window.print()">
                 Imprimir / Guardar como PDF
              </button>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  };

  const handleDescargarReporteAdmin = async (reporteId, formato) => {
    try {
      await reporteService.descargarReporteAdmin(reporteId, formato);
      alert("Reporte descargado exitosamente");
    } catch (error) {
      alert("Error al descargar el reporte del administrador");
    }
  };

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="reportes-container">
      {/* Header con notificaciones */}
      <div className="reportes-header">
        <h3>Reportes Disponibles</h3>
        <div className="notification-bell" onClick={() => setShowNotificaciones(!showNotificaciones)}>
          <span className="material-icons">notifications</span>
          {notificacionesNoLeidas > 0 && (
            <span className="notification-badge">{notificacionesNoLeidas}</span>
          )}
        </div>

        {/* Panel de notificaciones - FLOTANTE */}
        {showNotificaciones && (
          <div className="notifications-dropdown">
            <div className="notifications-header-drop">
              <h4>Notificaciones</h4>
              <div className="notifications-actions">
                {notificacionesNoLeidas > 0 && (
                  <button 
                    className="mark-all-read"
                    onClick={handleMarcarTodasLeidas}
                  >
                    Marcar todas como leídas
                  </button>
                )}
                <button 
                  onClick={() => setShowNotificaciones(false)} 
                  className="btn-icon-small close-notif"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
            </div>
            
            <div className="notifications-list">
              {notificaciones.length === 0 ? (
                <div className="empty-notifications">
                  <span className="material-icons">inbox</span>
                  <p>No hay notificaciones</p>
                </div>
              ) : (
                notificaciones.map(notif => (
                  <div key={notif.id} className={`notif-item ${notif.leida ? 'leida' : ''}`}>
                    <span className="material-icons notif-icon">notifications</span>
                    <div className="notif-content">
                      <p>{notif.mensaje}</p>
                      <small>{new Date(notif.fecha).toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</small>
                    </div>
                    <div className="notif-actions">
                      {!notif.leida && (
                        <button 
                          className="btn-icon-notif"
                          onClick={() => handleMarcarLeida(notif.id)}
                          title="Marcar como leída"
                        >
                          <span className="material-icons">done</span>
                        </button>
                      )}
                      <button 
                        className="btn-icon-notif delete"
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

      {/* Reportes Personales - DISEÑO EN CUADRÍCULA 2x2 */}
      <div className="reportes-section">
        <h4>Mis Reportes</h4>
        <div className="reportes-grid-2x2">
          <div className="reporte-card-cuadrado">
            <div className="reporte-icon-grande mensual">
              <span className="material-icons">calendar_month</span>
            </div>
            <h3>Reporte Mensual</h3>
            <p>Resumen de entrenamientos del último mes</p>
            <button 
              className="btn-descargar-pdf"
              onClick={() => handleGenerarReportePDF("mensual")}
              disabled={loading}
            >
              <span className="material-icons">picture_as_pdf</span>
              Descargar PDF
            </button>
          </div>

          <div className="reporte-card-cuadrado">
            <div className="reporte-icon-grande semanal">
              <span className="material-icons">date_range</span>
            </div>
            <h3>Reporte Semanal</h3>
            <p>Actividad de los últimos 7 días</p>
            <button 
              className="btn-descargar-pdf"
              onClick={() => handleGenerarReportePDF("semanal")}
              disabled={loading}
            >
              <span className="material-icons">picture_as_pdf</span>
              Descargar PDF
            </button>
          </div>

          <div className="reporte-card-cuadrado">
            <div className="reporte-icon-grande calorias">
              <span className="material-icons">local_fire_department</span>
            </div>
            <h3>Consumo de Calorías</h3>
            <p>Detalle de calorías quemadas</p>
            <button 
              className="btn-descargar-pdf"
              onClick={() => handleGenerarReportePDF("calorias")}
              disabled={loading}
            >
              <span className="material-icons">picture_as_pdf</span>
              Descargar PDF
            </button>
          </div>

          <div className="reporte-card-cuadrado">
            <div className="reporte-icon-grande historial">
              <span className="material-icons">history</span>
            </div>
            <h3>Historial Completo</h3>
            <p>Todas las actividades registradas</p>
            <button 
              className="btn-descargar-pdf"
              onClick={() => handleGenerarReportePDF("historial")}
              disabled={loading}
            >
              <span className="material-icons">picture_as_pdf</span>
              Descargar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Reportes Generados por el Admin */}
      {reportesDisponibles.length > 0 && (
        <div className="reportes-section">
          <h4>Reportes del Administrador</h4>
          <div className="reportes-admin-list">
            {reportesDisponibles.map(reporte => (
              <div key={reporte.id} className="reporte-admin-card">
                <div className="reporte-admin-header">
                  <span className="material-icons">admin_panel_settings</span>
                  <div>
                    <h4>{reporte.nombre}</h4>
                    <p className="reporte-admin-date">
                      Publicado: {new Date(reporte.fechaCreacion).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <div className="reporte-admin-actions">
                  <button 
                    className="btn-download-admin"
                    onClick={() => handleDescargarReporteAdmin(reporte.id, "JSON")}
                  >
                    <span className="material-icons">download</span>
                    Descargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <span className="material-icons rotating">refresh</span>
            <p>Generando reporte PDF...</p>
          </div>
        </div>
      )}
    </div>
  );
}
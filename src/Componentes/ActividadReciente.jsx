// src/pages/Estadisticas/Componentes/ActividadReciente.jsx
import "./ActividadReciente.css";

export default function ActividadReciente({ estadisticas }) {
  const recientes = [...estadisticas]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  if (recientes.length === 0) {
    return (
      <div className="actividad-empty">
        <span className="material-icons">fitness_center</span>
        <p>Aún no hay actividad registrada</p>
        <p className="empty-subtitle">Completa ejercicios para ver tu historial</p>
      </div>
    );
  }

  const formatearFecha = (fechaStr) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return fechaStr;
    }
  };

  return (
    <div className="actividad">
      {recientes.map((a, i) => (
        <div key={i} className="actividad-item">
          <div className="actividad-icon">
            <span className="material-icons">fitness_center</span>
          </div>
          <div className="actividad-info">
            <strong className="actividad-titulo">Entrenamiento</strong>
            <p className="actividad-fecha">{formatearFecha(a.fecha)}</p>
            <div className="actividad-stats">
              <span className="stat-badge">
                <span className="material-icons">schedule</span>
                {a.minutosEjercicio} min
              </span>
              <span className="stat-badge">
                <span className="material-icons">local_fire_department</span>
                {Math.round(a.caloriasQuemadas)} kcal
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
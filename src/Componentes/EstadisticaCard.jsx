// src/pages/Estadisticas/Componentes/EstadisticaCard.jsx
import "./EstadisticaCard.css";

export default function EstadisticaCard({ titulo, valor, icono, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon-container" style={{ backgroundColor: `${color}20` }}>
        <span className="material-icons stat-icon-large" style={{ color }}>
          {icono || 'insights'}
        </span>
      </div>
      <div className="stat-content">
        <p className="stat-title">{titulo}</p>
        <p className="stat-value">{valor}</p>
      </div>
    </div>
  );
}
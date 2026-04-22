// src/pages/Estadisticas/FitEstadisticas.jsx
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import FiltroRango from "../Componentes/FiltroRango";
import EstadisticaCard from "../Componentes/EstadisticaCard";
import GraficoLinea from "../Componentes/GraficoLinea";
import GraficoBarras from "../Componentes/GraficoBarras";
import ActividadReciente from "../Componentes/ActividadReciente";
import Reportes from "../Componentes/Reportes";
import { EstadisticaService } from "../Service/EstadisticaService";
import "./FitEstadisticas.css";

export default function FitEstadisticas() {
  const { darkMode } = useTheme();
  const [rango, setRango] = useState("1M");
  const [estadisticas, setEstadisticas] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [datosSemana, setDatosSemana] = useState([]);
  const [datosCategoria, setDatosCategoria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, [rango]);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargar todos los datos en paralelo
      const [stats, res, semana, categoria] = await Promise.all([
        EstadisticaService.obtenerPorUsuario(),
        EstadisticaService.obtenerResumen(rango),
        EstadisticaService.obtenerDatosSemana(),
        EstadisticaService.obtenerDatosCategoria(rango)
      ]);
      
      setEstadisticas(stats);
      setResumen(res);
      setDatosSemana(semana);
      setDatosCategoria(categoria);
      
      console.log('✅ Datos cargados:', { stats, res, semana, categoria });
    } catch (error) {
      console.error("❌ Error al cargar estadísticas:", error);
      setError("No se pudieron cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`estadisticas-container ${darkMode ? 'dark' : ''}`}>
        <div className="loading-state">
          <span className="material-icons rotating">refresh</span>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`estadisticas-container ${darkMode ? 'dark' : ''}`}>
        <div className="error-state">
          <span className="material-icons">error_outline</span>
          <p>{error}</p>
          <button onClick={cargarDatos} className="btn-retry">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`estadisticas-container ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className="estadisticas-header">
        <div className="header-content">
          <h1>Mis Estadísticas</h1>
          <p>Seguimiento de tu progreso y rendimiento</p>
        </div>
        <button onClick={cargarDatos} className="btn-refresh">
          <span className="material-icons">refresh</span>
          Actualizar
        </button>
      </div>

      {/* Filtro de Rango */}
      <FiltroRango rango={rango} setRango={setRango} />

      {/* Cards de Resumen */}
      <div className="estadisticas-grid">
        <EstadisticaCard
          titulo="Entrenamientos totales"
          valor={resumen?.entrenamientos ?? 0}
          icono="fitness_center"
          color="#3b82f6"
        />
        <EstadisticaCard
          titulo="Duración promedio"
          valor={`${resumen?.duracionPromedio ?? 0} min`}
          icono="schedule"
          color="#8b5cf6"
        />
        <EstadisticaCard
          titulo="Calorías quemadas"
          valor={`${Math.round(resumen?.calorias ?? 0)} kcal`}
          icono="local_fire_department"
          color="#f59e0b"
        />
      </div>

      {/* Gráficos */}
      <div className="graficos-grid">
        <div className="grafico-card">
          <div className="grafico-header">
            <h3>Actividad Semanal</h3>
            <span className="material-icons">timeline</span>
          </div>
          <GraficoLinea data={datosSemana} />
        </div>

        <div className="grafico-card">
          <div className="grafico-header">
            <h3>Distribución por Tipo</h3>
            <span className="material-icons">bar_chart</span>
          </div>
          <GraficoBarras data={datosCategoria} />
        </div>
      </div>

      {/* Actividad Reciente y Reportes */}
      <div className="actividad-reportes">
        <div className="actividad-card">
          <div className="card-header">
            <h3>Actividad Reciente</h3>
            <span className="material-icons">history</span>
          </div>
          <ActividadReciente estadisticas={estadisticas} />
        </div>

        <div className="reportes-card">
          <div className="card-header">
            <h3>Reportes</h3>
            <span className="material-icons">description</span>
          </div>
          <Reportes 
            estadisticas={estadisticas} 
            resumen={resumen}
            rango={rango}
          />
        </div>
      </div>
    </div>
  );
}
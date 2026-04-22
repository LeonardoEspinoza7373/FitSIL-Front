import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import {
  obtenerRecetas,
  eliminarReceta,
} from "../../services/recetaService";
import RecetasLista from "./RecetasLista";
import RecetaDetalle from "./RecetaDetalle";
import RecetaFormModal from "./RecetaFormModal";
import "./recetas.css";

export default function RecetasPage() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [recetas, setRecetas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);

  const isAdmin = user?.rol === "ADMINISTRADOR";

  useEffect(() => {
    cargarRecetas();
  }, []);

  const cargarRecetas = async () => {
    try {
      setLoading(true);
      const data = await obtenerRecetas();
      setRecetas(data);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudieron cargar las recetas");
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaReceta = () => {
    setEditando(null);
    setShowModal(true);
  };

  const handleEditarReceta = (receta) => {
    setEditando(receta);
    setShowModal(true);
    setSeleccionada(null);
  };

  const handleEliminarReceta = async (receta) => {
    if (
      !window.confirm(
        `¿Estás seguro de eliminar la receta "${receta.nombre}"?`
      )
    ) {
      return;
    }

    try {
      await eliminarReceta(receta.id);
      alert("✅ Receta eliminada correctamente");
      setSeleccionada(null);
      cargarRecetas();
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Error al eliminar la receta");
    }
  };

  const handleGuardado = () => {
    setShowModal(false);
    setEditando(null);
    cargarRecetas();
  };

  if (loading) {
    return <p className="loading-message">Cargando recetas...</p>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>❌ {error}</p>
        <button onClick={cargarRecetas}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      {!seleccionada ? (
        <RecetasLista
          recetas={recetas}
          onSelect={setSeleccionada}
          isAdmin={isAdmin}
          onNueva={handleNuevaReceta}
          onEditar={handleEditarReceta}
          onEliminar={handleEliminarReceta}
        />
      ) : (
        <RecetaDetalle
          receta={seleccionada}
          onBack={() => setSeleccionada(null)}
          isAdmin={isAdmin}
          onEditar={handleEditarReceta}
          onEliminar={handleEliminarReceta}
        />
      )}

      {showModal && (
        <RecetaFormModal
          receta={editando}
          onClose={() => {
            setShowModal(false);
            setEditando(null);
          }}
          onGuardado={handleGuardado}
        />
      )}
    </div>
  );
}
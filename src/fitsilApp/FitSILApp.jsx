import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { obtenerEjercicios, eliminarEjercicio } from "../fitsilServices/FitApiEjercicios";
import EjerciciosLista from "../ejercicios/EjerciciosLista";
import EjercicioDetalle from "../ejercicios/EjercicioDetalle";
import EjercicioFormModal from "../ejercicios/EjercicioFormModal";
import "../ejercicios/ejercicios.css";

function FitSILApp() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ejercicios, setEjercicios] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);

  const isAdmin = user?.rol === "ADMINISTRADOR";

  useEffect(() => {
    cargarEjercicios();
  }, []);

  const cargarEjercicios = async () => {
    try {
      setLoading(true);
      const data = await obtenerEjercicios();
      setEjercicios(data);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudieron cargar los ejercicios");
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoEjercicio = () => {
    setEditando(null);
    setShowModal(true);
  };

  const handleEditarEjercicio = (ejercicio) => {
    setEditando(ejercicio);
    setShowModal(true);
    setSeleccionado(null);
  };

  const handleEliminarEjercicio = async (ejercicio) => {
    if (!window.confirm(`¿Estás seguro de eliminar el ejercicio "${ejercicio.nombre}"?`)) {
      return;
    }

    try {
      await eliminarEjercicio(ejercicio.id);
      alert("✅ Ejercicio eliminado correctamente");
      setSeleccionado(null);
      cargarEjercicios();
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Error al eliminar el ejercicio");
    }
  };

  const handleGuardado = () => {
    setShowModal(false);
    setEditando(null);
    cargarEjercicios();
  };

  if (loading) {
    return <p className="loading-message">Cargando ejercicios...</p>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>❌ {error}</p>
        <button onClick={cargarEjercicios}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      {!seleccionado ? (
        <EjerciciosLista 
          ejercicios={ejercicios} 
          onSelect={setSeleccionado}
          isAdmin={isAdmin}
          onNuevo={handleNuevoEjercicio}
          onEditar={handleEditarEjercicio}
          onEliminar={handleEliminarEjercicio}
        />
      ) : (
        <EjercicioDetalle
          ejercicio={seleccionado}
          onBack={() => setSeleccionado(null)}
          isAdmin={isAdmin}
          onEditar={handleEditarEjercicio}
          onEliminar={handleEliminarEjercicio}
        />
      )}

      {showModal && (
        <EjercicioFormModal
          ejercicio={editando}
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

export default FitSILApp;
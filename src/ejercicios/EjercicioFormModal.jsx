import { useState, useEffect } from "react";
import { guardarEjercicio, actualizarEjercicio } from "../fitsilServices/FitApiEjercicios";

function EjercicioFormModal({ ejercicio, onClose, onGuardado }) {
  const [nombre, setNombre] = useState("");
  const [musculo, setMusculo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ejercicio) {
      setNombre(ejercicio.nombre || "");
      setMusculo(ejercicio.musculoTrabajado || "");
      setDescripcion(ejercicio.descripcion || "");
    }
  }, [ejercicio]);

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!nombre || !musculo || !descripcion) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("musculoTrabajado", musculo);
      formData.append("descripcion", descripcion);
      if (imagen) formData.append("imagen", imagen);

      if (ejercicio) {
        // Actualizar ejercicio existente
        await actualizarEjercicio(ejercicio.id, formData);
        alert("✅ Ejercicio actualizado correctamente");
      } else {
        // Crear nuevo ejercicio
        await guardarEjercicio(formData);
        alert("✅ Ejercicio creado correctamente");
      }

      onGuardado();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{ejercicio ? "Editar Ejercicio" : "Nuevo Ejercicio"}</h2>
          <button className="close-btn" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        <form onSubmit={handleGuardar} className="ejercicio-form">
          <div className="form-group">
            <label>Nombre del ejercicio *</label>
            <input
              type="text"
              placeholder="Ej: Press de banca"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Músculo trabajado *</label>
            <select 
              value={musculo} 
              onChange={(e) => setMusculo(e.target.value)}
              required
            >
              <option value="">Selecciona un músculo</option>
              <option value="Pecho">Pecho</option>
              <option value="Espalda">Espalda</option>
              <option value="Piernas">Piernas</option>
              <option value="Brazos">Brazos</option>
              <option value="Hombros">Hombros</option>
              <option value="Abdomen">Abdomen</option>
            </select>
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea
              placeholder="Describe cómo realizar el ejercicio..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Imagen (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files[0])}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancelar" 
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-guardar"
              disabled={loading}
            >
              {loading ? "Guardando..." : (ejercicio ? "Actualizar" : "Crear")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EjercicioFormModal;
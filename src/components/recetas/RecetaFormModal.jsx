import { useState, useEffect } from "react";
import {
  crearReceta,
  actualizarReceta,
} from "../../services/recetaService";

function RecetaFormModal({ receta, onClose, onGuardado }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("Desayuno");
  const [imagenUrl, setImagenUrl] = useState("");
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [instrucciones, setInstrucciones] = useState("");
  const [calorias, setCalorias] = useState("");
  const [proteinas, setProteinas] = useState("");
  const [carbohidratos, setCarbohidratos] = useState("");
  const [grasas, setGrasas] = useState("");
  const [tiempoPreparacion, setTiempoPreparacion] = useState("");
  const [dificultad, setDificultad] = useState("Fácil");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (receta) {
      setNombre(receta.nombre || "");
      setDescripcion(receta.descripcion || "");
      setCategoria(receta.categoria || "Desayuno");
      setImagenUrl(receta.imagenUrl || "");
      setImagenPreview(receta.imagenUrl || "");
      setIngredientes(receta.ingredientes || "");
      setInstrucciones(receta.instrucciones || "");
      setCalorias(receta.calorias || "");
      setProteinas(receta.proteinas || "");
      setCarbohidratos(receta.carbohidratos || "");
      setGrasas(receta.grasas || "");
      setTiempoPreparacion(receta.tiempoPreparacion || "");
      setDificultad(receta.dificultad || "Fácil");
    }
  }, [receta]);

  // Manejar selección de archivo de imagen
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande. Máximo 5MB');
        return;
      }

      setImagenArchivo(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Eliminar imagen seleccionada
  const handleEliminarImagen = () => {
    setImagenArchivo(null);
    setImagenPreview("");
    setImagenUrl("");
    // Limpiar el input file
    const fileInput = document.getElementById('imagen-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleGuardar = async () => {
    if (!nombre || !descripcion || !ingredientes || !instrucciones) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      let urlImagen = imagenUrl;

      // Si se seleccionó un archivo, convertirlo a base64
      if (imagenArchivo) {
        const reader = new FileReader();
        urlImagen = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imagenArchivo);
        });
      }

      const recetaData = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        categoria,
        imagenUrl: urlImagen || null,
        ingredientes: ingredientes.trim(),
        instrucciones: instrucciones.trim(),
        calorias: calorias && calorias.toString().trim() !== "" ? parseInt(calorias, 10) : null,
        proteinas: proteinas && proteinas.toString().trim() !== "" ? parseInt(proteinas, 10) : null,
        carbohidratos: carbohidratos && carbohidratos.toString().trim() !== "" ? parseInt(carbohidratos, 10) : null,
        grasas: grasas && grasas.toString().trim() !== "" ? parseInt(grasas, 10) : null,
        tiempoPreparacion: tiempoPreparacion && tiempoPreparacion.toString().trim() !== "" ? parseInt(tiempoPreparacion, 10) : null,
        dificultad,
      };

      console.log("📝 Datos a guardar:", recetaData);

      if (receta) {
        await actualizarReceta(receta.id, recetaData);
        alert("✅ Receta actualizada correctamente");
      } else {
        await crearReceta(recetaData);
        alert("✅ Receta creada correctamente");
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
      <div
        className="modal-form modal-form-receta"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{receta ? "Editar Receta" : "Nueva Receta"}</h2>
          <button className="close-btn" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="ejercicio-form">
          {/* Información básica */}
          <div className="form-section">
            <h3 className="form-section-title">Información Básica</h3>

            <div className="form-group">
              <label>Nombre de la receta *</label>
              <input
                type="text"
                placeholder="Ej: Ensalada César con pollo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                placeholder="Breve descripción de la receta..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows="3"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categoría *</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                >
                  <option value="Desayuno">Desayuno</option>
                  <option value="Almuerzo">Almuerzo</option>
                  <option value="Cena">Cena</option>
                  <option value="Snack">Snack</option>
                  <option value="Postre">Postre</option>
                </select>
              </div>

              <div className="form-group">
                <label>Dificultad *</label>
                <select
                  value={dificultad}
                  onChange={(e) => setDificultad(e.target.value)}
                  required
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Media">Media</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tiempo (minutos)</label>
                <input
                  type="number"
                  placeholder="30"
                  value={tiempoPreparacion}
                  onChange={(e) => setTiempoPreparacion(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Sección de imagen mejorada */}
            <div className="form-group">
              <label>Imagen de la receta</label>
              
              {/* Opciones: URL o Archivo */}
              <div className="imagen-options">
                <div className="imagen-option">
                  <label className="upload-label">
                    <input
                      id="imagen-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImagenChange}
                      style={{ display: 'none' }}
                    />
                    <span className="material-icons">cloud_upload</span>
                    <span>Subir desde PC</span>
                  </label>
                </div>

                <div className="divider-text">
                  <span>O</span>
                </div>

                <div className="imagen-option">
                  <input
                    type="url"
                    placeholder="Pegar URL de imagen"
                    value={imagenUrl}
                    onChange={(e) => {
                      setImagenUrl(e.target.value);
                      setImagenPreview(e.target.value);
                      setImagenArchivo(null);
                    }}
                  />
                </div>
              </div>

              {/* Preview de imagen */}
              {imagenPreview && (
                <div className="imagen-preview-container">
                  <div className="imagen-preview">
                    <img src={imagenPreview} alt="Preview" />
                    <button
                      type="button"
                      className="btn-remove-image"
                      onClick={handleEliminarImagen}
                      title="Eliminar imagen"
                    >
                      <span className="material-icons">close</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información nutricional */}
          <div className="form-section">
            <h3 className="form-section-title">Información Nutricional</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Calorías (kcal)</label>
                <input
                  type="number"
                  placeholder="300"
                  value={calorias}
                  onChange={(e) => setCalorias(e.target.value)}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Proteínas (g)</label>
                <input
                  type="number"
                  placeholder="25"
                  value={proteinas}
                  onChange={(e) => setProteinas(e.target.value)}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Carbohidratos (g)</label>
                <input
                  type="number"
                  placeholder="40"
                  value={carbohidratos}
                  onChange={(e) => setCarbohidratos(e.target.value)}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Grasas (g)</label>
                <input
                  type="number"
                  placeholder="10"
                  value={grasas}
                  onChange={(e) => setGrasas(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Ingredientes */}
          <div className="form-section">
            <h3 className="form-section-title">Ingredientes *</h3>
            <div className="form-group">
              <label>
                Ingredientes (separados por comas)
              </label>
              <textarea
                placeholder="200g pechuga de pollo, 1 lechuga romana, 50g queso parmesano, 2 cucharadas de aceite de oliva"
                value={ingredientes}
                onChange={(e) => setIngredientes(e.target.value)}
                rows="4"
                required
              />
              <small className="form-hint">
                Separa cada ingrediente con una coma (,)
              </small>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="form-section">
            <h3 className="form-section-title">Instrucciones de Preparación *</h3>
            <div className="form-group">
              <label>
                Instrucciones (un paso por línea)
              </label>
              <textarea
                placeholder={`Cortar el pollo en cubos pequeños
Calentar aceite en una sartén
Cocinar el pollo hasta que esté dorado
Lavar y cortar la lechuga
Mezclar todos los ingredientes`}
                value={instrucciones}
                onChange={(e) => setInstrucciones(e.target.value)}
                rows="8"
                required
              />
              <small className="form-hint">
                Escribe cada paso en una línea nueva
              </small>
            </div>
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
              type="button"
              className="btn-guardar"
              onClick={handleGuardar}
              disabled={loading}
            >
              {loading
                ? "Guardando..."
                : receta
                ? "Actualizar"
                : "Crear"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecetaFormModal;
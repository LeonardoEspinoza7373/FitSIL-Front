import { useState } from "react";

function RecetaDetalle({ receta, onBack, isAdmin, onEditar, onEliminar }) {
  const [imagenError, setImagenError] = useState(false);

  const handleImageError = (e) => {
    console.warn("⚠️ Error cargando imagen:", receta.imagenUrl);
    setImagenError(true);
    e.target.style.display = "none";
  };

  const getEmojiCategoria = () => {
    switch (receta.categoria) {
      case "Desayuno": return "🥞";
      case "Almuerzo": return "🥗";
      case "Cena": return "🍽️";
      case "Snack": return "🥤";
      case "Postre": return "🍰";
      default: return "🍴";
    }
  };

  const getDificultadColor = () => {
    switch (receta.dificultad) {
      case "Fácil": return "#4caf50";
      case "Media": return "#ff9800";
      case "Difícil": return "#f44336";
      default: return "#666";
    }
  };

  return (
    <div className="detalle">
      <button className="back" onClick={onBack}>
        <span className="material-icons">arrow_back</span>
        Volver
      </button>

      {/* Imagen o emoji de fallback */}
      {receta.imagenUrl && !imagenError ? (
        <div className="imagen-detalle">
          <img 
            src={receta.imagenUrl} 
            alt={receta.nombre}
            onError={handleImageError}
            loading="lazy"
          />
        </div>
      ) : (
        <div className="imagen-detalle" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
          fontSize: "120px"
        }}>
          {getEmojiCategoria()}
        </div>
      )}

      <h2>{receta.nombre}</h2>
      <p className="sub">{receta.descripcion}</p>

      {/* Información básica */}
      <div className="info-basica" style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "24px"
      }}>
        {receta.categoria && (
          <span className="tag">{receta.categoria}</span>
        )}
        {receta.dificultad && (
          <span className="tag" style={{ 
            background: getDificultadColor(), 
            color: "white" 
          }}>
            {receta.dificultad}
          </span>
        )}
        {receta.tiempoPreparacion && (
          <span className="tag-time">
            <span className="material-icons">schedule</span>
            {receta.tiempoPreparacion} min
          </span>
        )}
      </div>

      {/* Información nutricional */}
      {(receta.calorias || receta.proteinas || receta.carbohidratos || receta.grasas) && (
        <div className="info-nutricional">
          <h3>
            <span className="material-icons" style={{ verticalAlign: "middle", marginRight: "8px" }}>
              local_dining
            </span>
            Información Nutricional
          </h3>
          <div className="nutricion-grid">
            {receta.calorias && (
              <div className="nutricion-item">
                <span className="material-icons">local_fire_department</span>
                <p>{receta.calorias} kcal</p>
              </div>
            )}
            {receta.proteinas && (
              <div className="nutricion-item">
                <span className="material-icons">fitness_center</span>
                <p>{receta.proteinas}g proteína</p>
              </div>
            )}
            {receta.carbohidratos && (
              <div className="nutricion-item">
                <span className="material-icons">grain</span>
                <p>{receta.carbohidratos}g carbos</p>
              </div>
            )}
            {receta.grasas && (
              <div className="nutricion-item">
                <span className="material-icons">water_drop</span>
                <p>{receta.grasas}g grasas</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ingredientes */}
      <h3>
        <span className="material-icons" style={{ verticalAlign: "middle", marginRight: "8px" }}>
          shopping_basket
        </span>
        Ingredientes
      </h3>
      <div className="ingredientes-list">
        {receta.ingredientes ? (
          receta.ingredientes.split(",").map((ing, idx) => (
            <div key={idx} className="ingrediente-item">
              <span className="material-icons">check_circle</span>
              <p>{ing.trim()}</p>
            </div>
          ))
        ) : (
          <p style={{ color: "#999", fontStyle: "italic" }}>
            No se han especificado ingredientes
          </p>
        )}
      </div>

      {/* Instrucciones */}
      <h3>
        <span className="material-icons" style={{ verticalAlign: "middle", marginRight: "8px" }}>
          restaurant
        </span>
        Preparación
      </h3>
      <div className="instrucciones-list">
        {receta.instrucciones ? (
          receta.instrucciones.split("\n").filter(paso => paso.trim()).map((paso, idx) => (
            <div key={idx} className="paso-item">
              <span className="paso-numero">{idx + 1}</span>
              <p>{paso.trim()}</p>
            </div>
          ))
        ) : (
          <p style={{ color: "#999", fontStyle: "italic" }}>
            No se han especificado instrucciones
          </p>
        )}
      </div>

      {/* Botones solo para administradores */}
      {isAdmin && (
        <div className="detalle-actions">
          <button className="btn-editar" onClick={() => onEditar(receta)}>
            <span className="material-icons">edit</span>
            Editar Receta
          </button>
          <button
            className="btn-eliminar"
            onClick={() => onEliminar(receta)}
          >
            <span className="material-icons">delete</span>
            Eliminar Receta
          </button>
        </div>
      )}
    </div>
  );
}

export default RecetaDetalle;
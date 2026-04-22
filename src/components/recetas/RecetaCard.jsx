import { useState } from "react";

function RecetaCard({ receta, onClick, isAdmin, onEditar, onEliminar }) {
  const [imagenError, setImagenError] = useState(false);

  const getImagenUrl = () => {
    if (receta.imagenUrl && !imagenError) {
      return receta.imagenUrl;
    }
    return null;
  };

  const imagen = getImagenUrl();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleEditar = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onEditar) {
      onEditar(receta);
    }
  };

  const handleEliminar = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onEliminar) {
      onEliminar(receta);
    }
  };

  const handleImageError = (e) => {
    console.warn("⚠️ Error cargando imagen:", receta.imagenUrl);
    setImagenError(true);
    e.target.style.display = "none";
  };

  // Emoji basado en categoría
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

  return (
    <div className="card">
      {/* IMAGEN */}
      <div className="card-img" onClick={handleCardClick}>
        {imagen && !imagenError ? (
          <img
            src={imagen}
            alt={receta.nombre}
            onError={handleImageError}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
              color: "white",
              fontSize: "64px",
            }}
          >
            {getEmojiCategoria()}
          </div>
        )}
      </div>

      {/* CONTENIDO */}
      <div className="card-body">
        <div onClick={handleCardClick} style={{ cursor: "pointer" }}>
          <h3>{receta.nombre}</h3>
          <p className="receta-descripcion">{receta.descripcion}</p>
          <div className="receta-info">
            {receta.categoria && (
              <span className="tag">{receta.categoria}</span>
            )}
            {receta.dificultad && (
              <span className="tag">{receta.dificultad}</span>
            )}
            {receta.tiempoPreparacion && (
              <span className="tag-time">
                <span className="material-icons">schedule</span>
                {receta.tiempoPreparacion} min
              </span>
            )}
          </div>
        </div>

        {/* BOTONES ADMIN */}
        {isAdmin && (
          <div className="card-admin-actions">
            <button
              className="btn-editar-card"
              type="button"
              onClick={handleEditar}
            >
              <span className="material-icons">edit</span>
              <span className="btn-text">Editar</span>
            </button>

            <button
              className="btn-eliminar-card"
              type="button"
              onClick={handleEliminar}
            >
              <span className="material-icons">delete</span>
              <span className="btn-text">Eliminar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecetaCard;
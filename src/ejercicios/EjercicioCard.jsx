function EjercicioCard({ ejercicio, onClick, isAdmin, onEditar, onEliminar }) {
  const getImagenUrl = () => {
    // Si el ejercicio tiene imagen
    if (ejercicio.imagenUrl) {
      // Si ya es una URL completa, usarla directamente
      if (ejercicio.imagenUrl.startsWith('http')) {
        return ejercicio.imagenUrl;
      }
      // Si es solo el nombre del archivo, construir la URL correcta
      return `http://localhost:8081/ejercicios/imagen/${ejercicio.imagenUrl}`;
    }
    return null;
  };

  const imagen = getImagenUrl();

  // Debug: ver qué URL se está generando
  console.log('Ejercicio:', ejercicio.nombre);
  console.log('imagenUrl en BD:', ejercicio.imagenUrl);
  console.log('URL generada:', imagen);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleEditar = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Editando ejercicio:', ejercicio);
    if (onEditar) {
      onEditar(ejercicio);
    }
  };

  const handleEliminar = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Eliminando ejercicio:', ejercicio);
    if (onEliminar) {
      onEliminar(ejercicio);
    }
  };

  return (
    <div className="card">
      {/* IMAGEN */}
      <div
        className="card-img"
        style={{
          backgroundImage: imagen ? `url(${imagen})` : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
        onClick={handleCardClick}
      >
        {!imagen && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "white",
            fontSize: "48px",
            fontWeight: "bold"
          }}>
            💪
          </div>
        )}
      </div>

      {/* CONTENIDO */}
      <div className="card-body">
        <div onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          <h3>{ejercicio.nombre}</h3>
          <span className="tag">{ejercicio.musculoTrabajado}</span>
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

export default EjercicioCard;
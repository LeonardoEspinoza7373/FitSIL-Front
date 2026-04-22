import { useState } from "react";
import RecetaCard from "./RecetaCard";

function RecetasLista({ recetas, onSelect, isAdmin, onNueva, onEditar, onEliminar }) {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("TODAS");

  const recetasFiltradas = recetas.filter((r) => {
    const matchNombre = r.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const matchCategoria =
      categoriaFiltro === "TODAS" || r.categoria === categoriaFiltro;
    return matchNombre && matchCategoria;
  });

  return (
    <>
      <div className="header-recetas">
        <h2 className="titulo">🍽️ Recetas Saludables</h2>

        {isAdmin && (
          <button
            className="btn-nuevo-ejercicio"
            onClick={onNueva}
            type="button"
          >
            <span className="material-icons">add</span>
            Nueva Receta
          </button>
        )}
      </div>

      {/* Barra de búsqueda */}
      <div className="filtros-container">
        <input
          className="search"
          type="text"
          placeholder="Buscar recetas..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          className="filtro-categoria"
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          <option value="TODAS">Todas las categorías</option>
          <option value="Desayuno">Desayuno</option>
          <option value="Almuerzo">Almuerzo</option>
          <option value="Cena">Cena</option>
          <option value="Snack">Snack</option>
        </select>
      </div>

      {recetasFiltradas.length === 0 ? (
        <p className="no-results">No se encontraron recetas</p>
      ) : (
        <div className="grid">
          {recetasFiltradas.map((r) => (
            <RecetaCard
              key={r.id}
              receta={r}
              onClick={() => onSelect(r)}
              isAdmin={isAdmin}
              onEditar={onEditar}
              onEliminar={onEliminar}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default RecetasLista;
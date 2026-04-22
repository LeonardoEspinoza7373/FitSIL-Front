import { useState } from "react";
import EjercicioCard from "./EjercicioCard";

function EjerciciosLista({ ejercicios, onSelect, isAdmin, onNuevo, onEditar, onEliminar }) {
  const [busqueda, setBusqueda] = useState("");

  const ejerciciosFiltrados = ejercicios.filter(e =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <div className="header-ejercicios">
        <h2 className="titulo">Ejercicios</h2>
        
        {isAdmin && (
          <button 
            className="btn-nuevo-ejercicio" 
            onClick={onNuevo}
            type="button"
          >
            <span className="material-icons">add</span>
            Nuevo Ejercicio
          </button>
        )}
      </div>

      <input
        className="search"
        type="text"
        placeholder="Buscar ejercicios..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {ejerciciosFiltrados.length === 0 ? (
        <p className="no-results">No se encontraron ejercicios</p>
      ) : (
        <div className="grid">
          {ejerciciosFiltrados.map(e => (
            <EjercicioCard
              key={e.id}
              ejercicio={e}
              onClick={() => onSelect(e)}
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

export default EjerciciosLista;
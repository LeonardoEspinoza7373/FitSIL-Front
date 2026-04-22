const BASE_URL = "http://localhost:8082/api/recetas";

// ============================================
// OBTENER TODAS LAS RECETAS
// ============================================
export async function obtenerRecetas() {
  const token = localStorage.getItem("token");
  
  const res = await fetch(BASE_URL, {
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    }
  });
  
  if (!res.ok) {
    throw new Error("Error al obtener recetas");
  }
  
  return res.json();
}

// ============================================
// OBTENER RECETA POR ID
// ============================================
export async function obtenerRecetaPorId(id) {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    }
  });
  
  if (!res.ok) {
    throw new Error("Receta no encontrada");
  }
  
  return res.json();
}

// ============================================
// CREAR NUEVA RECETA
// ============================================
export async function crearReceta(receta) {
  const token = localStorage.getItem("token");
  
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(receta),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al crear receta");
  }
  
  return res.json();
}

// ============================================
// ACTUALIZAR RECETA EXISTENTE
// ============================================
export async function actualizarReceta(id, receta) {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(receta),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al actualizar receta");
  }
  
  return res.json();
}

// ============================================
// ELIMINAR RECETA
// ============================================
export async function eliminarReceta(id) {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al eliminar receta");
  }
  
  return res.json();
}

// ============================================
// BUSCAR RECETAS POR NOMBRE
// ============================================
export async function buscarRecetas(nombre) {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${BASE_URL}/buscar?nombre=${encodeURIComponent(nombre)}`, {
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    }
  });
  
  if (!res.ok) {
    throw new Error("Error al buscar recetas");
  }
  
  return res.json();
}
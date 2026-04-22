const BASE_URL = "http://localhost:8081/ejercicios";

// ============================================
// OBTENER TODOS LOS EJERCICIOS
// ============================================
export async function obtenerEjercicios() {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${BASE_URL}/obtener`, {
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    }
  });
  
  if (!res.ok) {
    throw new Error("Error al obtener ejercicios");
  }
  
  return res.json();
}

// ============================================
// CREAR NUEVO EJERCICIO
// ============================================
export async function guardarEjercicio(formData) {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${BASE_URL}/guardar`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      // NO incluir Content-Type cuando envías FormData
    },
    body: formData,
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al guardar ejercicio");
  }
  
  return res.json();
}

// ============================================
// ACTUALIZAR EJERCICIO EXISTENTE
// ============================================
export async function actualizarEjercicio(id, formData) {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${BASE_URL}/actualizar/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      // NO incluir Content-Type cuando envías FormData
    },
    body: formData,
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al actualizar ejercicio");
  }
  
  return res.json();
}

// ============================================
// ELIMINAR EJERCICIO
// ============================================
export async function eliminarEjercicio(id) {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${BASE_URL}/eliminar/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al eliminar ejercicio");
  }
  
  return res.json();
}

// ============================================
// BUSCAR EJERCICIO POR NOMBRE
// ============================================
export async function buscarEjercicio(nombre) {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${BASE_URL}/buscar?nombre=${encodeURIComponent(nombre)}`, {
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    }
  });
  
  if (!res.ok) {
    throw new Error("Ejercicio no encontrado");
  }
  
  return res.json();
}
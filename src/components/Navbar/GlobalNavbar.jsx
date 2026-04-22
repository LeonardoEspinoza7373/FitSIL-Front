// src/components/Navbar/GlobalNavbar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import "./GlobalNavbar.css";

const GlobalNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme, increaseText, decreaseText, textScale, speakOnHover, toggleSpeak } = useTheme();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  const isAdmin = user.rol === "ADMINISTRADOR";
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm("¿Cerrar sesión?")) {
      logout();
      navigate("/login");
    }
  };

  // ✅ Función para ir al perfil según el rol
  const handleGoToProfile = () => {
    setShowMenu(false);
    if (isAdmin) {
      navigate("/admin/perfil");
    } else {
      navigate("/perfil");
    }
  };

  return (
    <nav className={`global-navbar ${darkMode ? "dark" : ""}`}>
      <div className="navbar-container">
        {/* LOGO */}
        <div
          className="navbar-brand"
          onClick={() =>
            navigate(isAdmin ? "/admin/dashboard" : "/user/dashboard")
          }
        >
          <span className="material-icons">fitness_center</span>
          <span>FitSIL</span>
        </div>

        {/* LINKS */}
        <div className="navbar-links">
          {/* Dashboard - Para todos */}
          <button
            className={`nav-link ${
              isActive("/user/dashboard") || isActive("/admin/dashboard")
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigate(isAdmin ? "/admin/dashboard" : "/user/dashboard")
            }
          >
            <span className="material-icons">dashboard</span>
            Dashboard
          </button>

          {/* Ejercicios - Para todos */}
          <button
            className={`nav-link ${
              isActive("/admin/ejercicios") || isActive("/ejercicios") ? "active" : ""
            }`}
            onClick={() => navigate(isAdmin ? "/admin/ejercicios" : "/ejercicios")}
          >
            <span className="material-icons">fitness_center</span>
            Ejercicios
          </button>

          {/* Recetas - Para todos */}
          <button
            className={`nav-link ${isActive("/recetas") ? "active" : ""}`}
            onClick={() => navigate("/recetas")}
          >
            <span className="material-icons">restaurant_menu</span>
            Recetas
          </button>

          {/* SOLO USUARIOS - Rutinas */}
          {!isAdmin && (
            <button
              className={`nav-link ${isActive("/rutinas") ? "active" : ""}`}
              onClick={() => navigate("/rutinas")}
            >
              <span className="material-icons">repeat</span>
              Rutinas
            </button>
          )}

          {/* SOLO USUARIOS - Estadísticas */}
          {!isAdmin && (
            <button
              className={`nav-link ${isActive("/estadisticas") ? "active" : ""}`}
              onClick={() => navigate("/estadisticas")}
            >
              <span className="material-icons">bar_chart</span>
              Estadísticas
            </button>
          )}

          {/* SOLO ADMIN - Usuarios */}
          {isAdmin && (
            <button
              className={`nav-link ${isActive("/admin/usuarios") ? "active" : ""}`}
              onClick={() => navigate("/admin/usuarios")}
            >
              <span className="material-icons">group</span>
              Usuarios
            </button>
          )}
        </div>

        {/* ACCIONES */}
        <div className="navbar-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? "☀️" : "🌙"}
          </button>

          <div className="user-menu">
            {/* Avatar abre el menú desplegable como antes */}
            <div
              className="user-avatar"
              onClick={() => setShowMenu(!showMenu)}
            >
              <span className="avatar-initials">
                {user.nombre[0]}
                {user.apellido?.[0] || ""}
              </span>
            </div>

            {showMenu && (
              <div className="dropdown-menu">
                <div className="user-info">
                  <p className="user-name">{user.nombre} {user.apellido}</p>
                  <p className="user-email">{user.correo}</p>
                  <span className={`user-role ${isAdmin ? "admin" : "user"}`}>
                    {user.rol}
                  </span>
                </div>

                <div className="menu-divider"></div>

                {/* Aumentar/Disminuir tamaño de texto */}
                <div className="text-zoom">
                  <button className="text-zoom-btn" onClick={decreaseText}>A-</button>
                  <span className="text-zoom-value">{textScale}%</span>
                  <button className="text-zoom-btn" onClick={increaseText}>A+</button>
                </div>

                {/* Lectura guiada */}
                <button className="menu-item" onClick={toggleSpeak}>
                  <span className="material-icons">record_voice_over</span>
                  {speakOnHover ? "Desactivar lectura" : "Activar lectura"}
                </button>

                <div className="menu-divider"></div>

                {/* ✅ Mi Perfil - Redirige según el rol */}
                <button className="menu-item" onClick={handleGoToProfile}>
                  <span className="material-icons">person</span>
                  Mi Perfil
                </button>

                {isAdmin && (
                  <button className="menu-item" onClick={() => {
                    setShowMenu(false);
                    navigate("/admin/usuarios");
                  }}>
                    <span className="material-icons">group</span>
                    Gestionar Usuarios
                  </button>
                )}

                <button className="menu-item logout" onClick={handleLogout}>
                  <span className="material-icons">logout</span>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GlobalNavbar;
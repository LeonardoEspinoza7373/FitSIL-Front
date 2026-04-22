// src/components/Auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    contrasenia: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ Cargar tema solo una vez
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setDarkMode(savedTheme === 'dark');
  }, []);

  // ✅ Aplicar tema cuando cambie
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);

      // 🔑 El backend devuelve { token, usuario }
      const usuario = response.usuario;

      // ✅ Avisar al AuthContext
      login(usuario);

      // ✅ Redirección según el rol
      if (usuario.rol === 'ADMINISTRADOR') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }

    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`login-container-modern ${darkMode ? 'dark' : ''}`}>
      {/* Botón de cambio de tema */}
      <button onClick={toggleTheme} className="theme-toggle" aria-label="Cambiar tema">
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div className="login-wrapper">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo-image">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgyXkwDfXt_C6aH_XP0K1G-Yy8x2axHH4CF8_jzDHIbSyw7De5w04I--q6dtolu11bObd7cgrCSbUwvmxVILrgD7dPJXUcWRpGz2d--Bz5M7wTjNjZRFdm4lrD2udS4fWwgNFkLSOPkM2k3Qqal0nAN806BYUSBv-b9GdhTniQs8XXUnVLn1s6BdOLPZOtLK8y3LxO2pd3iX4IkZ1Ux2Al8lBitlCjxRZ1QFS2u_z8dXSqbzb8ko7bftSBuAvG2hBa68GH0w25Wpo"
              alt="Logo FitSIL"
            />
          </div>
          <p className="logo-text">FitSIL</p>
        </div>

        {/* Título */}
        <h1 className="login-title">Iniciar Sesión</h1>

        {/* Mensaje de Error */}
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form-modern">
          {/* Campo Email */}
          <div className="form-field">
            <label htmlFor="correo" className="field-label">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="Ingresa tu correo electrónico"
              className="field-input"
              required
              disabled={loading}
            />
          </div>

          {/* Campo Contraseña */}
          <div className="form-field">
            <label htmlFor="contrasenia" className="field-label">Contraseña</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="contrasenia"
                name="contrasenia"
                value={formData.contrasenia}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                className="field-input password-input"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label="Mostrar u ocultar contraseña"
                disabled={loading}
              >
                <span className="material-icons">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Botón de Login */}
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Enlace a Registro */}
        <div className="register-link">
          <p className="register-text">
            ¿No tienes una cuenta?
            <Link to="/register" className="register-link-text"> Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
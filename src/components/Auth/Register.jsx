// src/components/Auth/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import './Register.css';

const Register = () => {
  const [tipoRegistro, setTipoRegistro] = useState('USUARIO');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    usuario: '',
    contrasenia: '',
    confirmPassword: '',
    peso: '',
    altura: '',
    departamento: '',
    codigoAdmin: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

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

  const handleTipoChange = (e) => {
    setTipoRegistro(e.target.value);
    setError('');
  };

  const validateForm = () => {
    if (!formData.nombre || !formData.correo || !formData.usuario || !formData.contrasenia) {
      setError('Los campos: nombre, correo, usuario y contraseña son obligatorios');
      return false;
    }

    if (formData.nombre.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return false;
    }

    if (formData.usuario.length < 3 || formData.usuario.length > 20) {
      setError('El usuario debe tener entre 3 y 20 caracteres');
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(formData.usuario)) {
      setError('El usuario solo puede contener letras, números y guiones bajos');
      return false;
    }

    if (formData.contrasenia.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (formData.contrasenia !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError('Por favor ingresa un correo válido');
      return false;
    }

    if (tipoRegistro === 'USUARIO') {
      if (formData.peso && formData.peso <= 0) {
        setError('El peso debe ser un valor positivo');
        return false;
      }
      if (formData.altura && formData.altura <= 0) {
        setError('La altura debe ser un valor positivo');
        return false;
      }
    }

    if (tipoRegistro === 'ADMINISTRADOR') {
      if (!formData.departamento) {
        setError('El departamento es obligatorio para administradores');
        return false;
      }
      if (!formData.codigoAdmin) {
        setError('El código de administrador es obligatorio');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...datos } = formData;
      
      let dataToSend;
      
      if (tipoRegistro === 'USUARIO') {
        dataToSend = {
          nombre: datos.nombre,
          apellido: datos.apellido || '',
          telefono: datos.telefono || '',
          correo: datos.correo,
          usuario: datos.usuario,
          contrasenia: datos.contrasenia,
          rol: 'USUARIO',
          peso: parseFloat(datos.peso) || 0,
          altura: parseFloat(datos.altura) || 0
        };
        
        // ✅ Registrar USUARIO
        await authService.register(dataToSend);
        
      } else {
        dataToSend = {
          nombre: datos.nombre,
          apellido: datos.apellido || '',
          telefono: datos.telefono || '',
          correo: datos.correo,
          usuario: datos.usuario,
          contrasenia: datos.contrasenia,
          rol: 'ADMINISTRADOR',
          departamento: datos.departamento,
          codigoAdmin: parseInt(datos.codigoAdmin)
        };
        
        // ✅ Registrar ADMINISTRADOR (método diferente)
        await authService.registerAdmin(dataToSend);
      }
      
      alert('¡Registro exitoso! Ahora puedes iniciar sesión');
      navigate('/login');
      
    } catch (err) {
      console.error('Error completo:', err);
      
      let errorMessage = 'Error al registrar usuario. Intenta nuevamente.';
      
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Error ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No se pudo conectar con el servidor';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`register-container-modern ${darkMode ? 'dark' : ''}`}>
      <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div className="register-wrapper">
        <div className="logo-section">
          <div className="logo-image">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgyXkwDfXt_C6aH_XP0K1G-Yy8x2axHH4CF8_jzDHIbSyw7De5w04I--q6dtolu11bObd7cgrCSbUwvmxVILrgD7dPJXUcWRpGz2d--Bz5M7wTjNjZRFdm4lrD2udS4fWwgNFkLSOPkM2k3Qqal0nAN806BYUSBv-b9GdhTniQs8XXUnVLn1s6BdOLPZOtLK8y3LxO2pd3iX4IkZ1Ux2Al8lBitlCjxRZ1QFS2u_z8dXSqbzb8ko7bftSBuAvG2hBa68GH0w25Wpo"
              alt="FitSIL Logo"
            />
          </div>
          <p className="logo-text">FitSIL</p>
        </div>

        <h1 className="register-title">Crear Cuenta</h1>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form-modern">
          {/* Selector de tipo */}
          <div className="form-field">
            <label htmlFor="tipoRegistro" className="field-label">Tipo de Cuenta</label>
            <select
              id="tipoRegistro"
              value={tipoRegistro}
              onChange={handleTipoChange}
              className="field-input"
            >
              <option value="USUARIO">Usuario</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
          </div>

          {/* Campos en dos columnas */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="nombre" className="field-label">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="field-input"
                required
                minLength="3"
              />
            </div>

            <div className="form-field">
              <label htmlFor="apellido" className="field-label">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Tu apellido"
                className="field-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="correo" className="field-label">Email *</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="email@ejemplo.com"
                className="field-input"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="telefono" className="field-label">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="0987654321"
                className="field-input"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="usuario" className="field-label">Nombre de Usuario *</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="usuario123"
              className="field-input"
              required
              minLength="3"
              maxLength="20"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="contrasenia" className="field-label">Contraseña *</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="contrasenia"
                  name="contrasenia"
                  value={formData.contrasenia}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className="field-input password-input"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  <span className="material-icons">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword" className="field-label">Confirmar *</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite tu contraseña"
                  className="field-input password-input"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  <span className="material-icons">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Campos específicos por tipo */}
          {tipoRegistro === 'USUARIO' && (
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="peso" className="field-label">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  id="peso"
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                  placeholder="70.5"
                  className="field-input"
                  min="0"
                />
              </div>

              <div className="form-field">
                <label htmlFor="altura" className="field-label">Altura (m)</label>
                <input
                  type="number"
                  step="0.01"
                  id="altura"
                  name="altura"
                  value={formData.altura}
                  onChange={handleChange}
                  placeholder="1.75"
                  className="field-input"
                  min="0"
                />
              </div>
            </div>
          )}

          {tipoRegistro === 'ADMINISTRADOR' && (
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="departamento" className="field-label">Departamento *</label>
                <input
                  type="text"
                  id="departamento"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  placeholder="Administración"
                  className="field-input"
                  required={tipoRegistro === 'ADMINISTRADOR'}
                />
              </div>

              <div className="form-field">
                <label htmlFor="codigoAdmin" className="field-label">Código Admin *</label>
                <input
                  type="number"
                  id="codigoAdmin"
                  name="codigoAdmin"
                  value={formData.codigoAdmin}
                  onChange={handleChange}
                  placeholder="12345"
                  className="field-input"
                  required={tipoRegistro === 'ADMINISTRADOR'}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="login-link">
          <p className="login-text">
            ¿Ya tienes cuenta? 
            <Link to="/login" className="login-link-text"> Iniciar Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
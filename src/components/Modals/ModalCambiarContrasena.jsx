// src/components/Modals/ModalCambiarContrasena.jsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ModalCambiarContrasena.css';

const ModalCambiarContrasena = ({ isOpen, onClose, onSubmit, isAdmin = false }) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    contrasenaActual: '',
    contrasenaNueva: '',
    confirmarContrasena: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const toggleShowPassword = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.contrasenaActual || !formData.contrasenaNueva || !formData.confirmarContrasena) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (formData.contrasenaNueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.contrasenaNueva !== formData.confirmarContrasena) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (formData.contrasenaActual === formData.contrasenaNueva) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        contrasenaActual: formData.contrasenaActual,
        contrasenaNueva: formData.contrasenaNueva
      });
      
      // Limpiar formulario
      setFormData({
        contrasenaActual: '',
        contrasenaNueva: '',
        confirmarContrasena: ''
      });
      onClose();
    } catch (err) {
      setError(err.error || err.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      contrasenaActual: '',
      contrasenaNueva: '',
      confirmarContrasena: ''
    });
    setError('');
    setShowPasswords({
      actual: false,
      nueva: false,
      confirmar: false
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-password" onClick={handleClose}>
      <div 
        className={`modal-content-password ${darkMode ? 'dark' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-password">
          <div className="header-icon">
            <span className="material-icons">lock</span>
          </div>
          <h3>Cambiar Contraseña</h3>
          <button onClick={handleClose} className="close-btn-password">
            <span className="material-icons">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body-password">
            {error && (
              <div className="alert-error">
                <span className="material-icons">error</span>
                {error}
              </div>
            )}

            <div className="form-group-password">
              <label>
                <span className="material-icons">lock_outline</span>
                Contraseña Actual *
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.actual ? 'text' : 'password'}
                  name="contrasenaActual"
                  value={formData.contrasenaActual}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña actual"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => toggleShowPassword('actual')}
                  tabIndex="-1"
                >
                  <span className="material-icons">
                    {showPasswords.actual ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="form-group-password">
              <label>
                <span className="material-icons">lock</span>
                Nueva Contraseña *
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.nueva ? 'text' : 'password'}
                  name="contrasenaNueva"
                  value={formData.contrasenaNueva}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength="6"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => toggleShowPassword('nueva')}
                  tabIndex="-1"
                >
                  <span className="material-icons">
                    {showPasswords.nueva ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="form-group-password">
              <label>
                <span className="material-icons">check_circle</span>
                Confirmar Nueva Contraseña *
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.confirmar ? 'text' : 'password'}
                  name="confirmarContrasena"
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                  placeholder="Confirma tu nueva contraseña"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => toggleShowPassword('confirmar')}
                  tabIndex="-1"
                >
                  <span className="material-icons">
                    {showPasswords.confirmar ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="password-requirements">
              <p className="requirements-title">
                <span className="material-icons">info</span>
                Requisitos de contraseña:
              </p>
              <ul>
                <li className={formData.contrasenaNueva.length >= 6 ? 'valid' : ''}>
                  Mínimo 6 caracteres
                </li>
                <li className={formData.contrasenaNueva !== formData.contrasenaActual && formData.contrasenaNueva ? 'valid' : ''}>
                  Debe ser diferente a la contraseña actual
                </li>
                <li className={formData.contrasenaNueva === formData.confirmarContrasena && formData.contrasenaNueva ? 'valid' : ''}>
                  Las contraseñas deben coincidir
                </li>
              </ul>
            </div>
          </div>

          <div className="modal-actions-password">
            <button
              type="button"
              onClick={handleClose}
              className="btn-cancel-password"
              disabled={loading}
            >
              <span className="material-icons">close</span>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit-password"
              disabled={loading}
            >
              <span className="material-icons">
                {loading ? 'hourglass_empty' : 'check'}
              </span>
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCambiarContrasena;
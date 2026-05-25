import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import InputPassword from '../components/InputPassword';
import { authService } from '../services/authService';
import { useAuthStore, useUIStore } from '../store/store';
import { validarContrasena } from '../utils/validaciones';

export default function CambiarContrasena() {
  const navigate = useNavigate();
  const { usuario, setUsuario } = useAuthStore();
  const { mostrarNotificacion } = useUIStore();

  const [formulario, setFormulario] = useState({
    contrasenaActual: '',
    contrasenaNueva: '',
    confirmarContrasena: ''
  });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!usuario?.id || usuario.id === 'temp') {
      // Modo recuperación - no necesita contraseña actual
      if (!validarContrasena(formulario.contrasenaNueva)) {
        nuevosErrores.contrasenaNueva = 'Mínimo 8 caracteres';
      }
    } else {
      // Modo cambio normal - requiere contraseña actual
      if (!formulario.contrasenaActual.trim()) {
        nuevosErrores.contrasenaActual = 'La contraseña actual es requerida';
      }
      if (!validarContrasena(formulario.contrasenaNueva)) {
        nuevosErrores.contrasenaNueva = 'Mínimo 8 caracteres';
      }
    }

    if (formulario.contrasenaNueva !== formulario.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      setCargando(true);

      if (usuario?.id === 'temp') {
        // Cambio de contraseña por recuperación
        const response = await authService.cambiarContrasenaRecuperacion(
          usuario.email,
          formulario.contrasenaNueva
        );
        setUsuario(response.data.usuario, response.data.token);
        mostrarNotificacion('Contraseña actualizada correctamente', 'success');
      } else {
        // Cambio de contraseña normal
        const response = await authService.passwordChange(
          usuario.email,
          formulario.contrasenaActual,
          formulario.contrasenaNueva
        );
        setUsuario(response.data.usuario, response.data.token);
        mostrarNotificacion('Contraseña actualizada correctamente', 'success');
      }

      navigate('/contactos');
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al cambiar contraseña';
      mostrarNotificacion(mensaje, 'error');
    } finally {
      setCargando(false);
    }
  };

  const esModoRecuperacion = usuario?.id === 'temp';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {esModoRecuperacion ? 'Crear Nueva Contraseña' : 'Cambiar Contraseña'}
          </h1>
          <p className="text-gray-600 mt-2">
            {esModoRecuperacion 
              ? 'Ingresa una nueva contraseña segura'
              : 'Actualiza tu contraseña de acceso'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!esModoRecuperacion && (
            <InputPassword
              label="Contraseña Actual"
              placeholder="Tu contraseña actual"
              value={formulario.contrasenaActual}
              onChange={(e) => handleChange({ target: { name: 'contrasenaActual', value: e.target.value } })}
              error={errores.contrasenaActual}
            />
          )}

          <InputPassword
            label={esModoRecuperacion ? 'Nueva Contraseña' : 'Nueva Contraseña'}
            placeholder="Mínimo 8 caracteres"
            value={formulario.contrasenaNueva}
            onChange={(e) => handleChange({ target: { name: 'contrasenaNueva', value: e.target.value } })}
            error={errores.contrasenaNueva}
          />

          <InputPassword
            label="Confirmar Contraseña"
            placeholder="Repite tu nueva contraseña"
            value={formulario.confirmarContrasena}
            onChange={(e) => handleChange({ target: { name: 'confirmarContrasena', value: e.target.value } })}
            error={errores.confirmarContrasena}
          />

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg hover:shadow-lg transition mt-6 font-semibold disabled:opacity-50"
          >
            {cargando ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>

          <button
            type="button"
            onClick={() => navigate(esModoRecuperacion ? '/login' : '/contactos')}
            className="w-full text-center text-blue-500 hover:text-blue-600 font-semibold mt-4"
          >
            {esModoRecuperacion ? 'Volver al Login' : 'Volver a Contactos'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

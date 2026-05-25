import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import InputPassword from '../components/InputPassword';
import { authService } from '../services/authService';
import { useAuthStore, useUIStore } from '../store/store';
import { validarEmail, validarContrasena } from '../utils/validaciones';

export default function Login() {
  const navigate = useNavigate();
  const { setUsuario, setCargando, setError } = useAuthStore();
  const { mostrarNotificacion } = useUIStore();

  const [modo, setModo] = useState('login'); // 'login', 'registro', 'recuperar'
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    preguntaSecreta: '',
    respuestaSecreta: ''
  });
  const [errores, setErrores] = useState({});
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (modo === 'registro') {
      if (!formulario.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!validarEmail(formulario.email)) {
      nuevosErrores.email = 'Email inválido';
    }

    if (modo !== 'recuperar' && !validarContrasena(formulario.contrasena)) {
      nuevosErrores.contrasena = 'Mínimo 8 caracteres';
    }

    if (modo === 'registro') {
      if (!formulario.preguntaSecreta.trim()) nuevosErrores.preguntaSecreta = 'Pregunta secreta requerida';
      if (!formulario.respuestaSecreta.trim()) nuevosErrores.respuestaSecreta = 'Respuesta requerida';
    }

    return nuevosErrores;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      setCargando(true);
      const response = await authService.login(formulario.email, formulario.contrasena);
      setUsuario(response.data.usuario, response.data.token);
      mostrarNotificacion('¡Bienvenido!', 'success');
      navigate('/contactos');
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error en login';
      mostrarNotificacion(mensaje, 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      setCargando(true);
      const response = await authService.registro(
        formulario.nombre,
        formulario.email,
        formulario.contrasena,
        formulario.preguntaSecreta,
        formulario.respuestaSecreta
      );
      setUsuario(response.data.usuario, response.data.token);
      mostrarNotificacion('¡Registro exitoso!', 'success');
      navigate('/contactos');
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error en registro';
      mostrarNotificacion(mensaje, 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleRecuperar = async (e) => {
    e.preventDefault();

    try {
      setCargando(true);

      if (!pregunta) {
        const response = await authService.verificarPreguntaSecreta(formulario.email);
        setPregunta(response.data.pregunta);
      } else {
        const response = await authService.recuperarContrasena(formulario.email, respuesta);
        setUsuario({
          id: 'temp',
          email: formulario.email,
          nombre: 'Usuario'
        }, response.data.token);
        mostrarNotificacion('Pregunta correcta. Cambia tu contraseña.', 'success');
        navigate('/cambiar-contrasena');
      }
    } catch (error) {
      mostrarNotificacion(error.response?.data?.error || 'Error', 'error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">📇</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">ContactosPro</h1>
          <p className="text-gray-600 mt-2">Tu agenda digital inteligente</p>
        </div>

        {modo === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formulario.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errores.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errores.email && <p className="text-red-500 text-sm mt-1">{errores.email}</p>}
            </div>

            <InputPassword
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              value={formulario.contrasena}
              onChange={(e) => handleChange({ target: { name: 'contrasena', value: e.target.value } })}
              error={errores.contrasena}
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg hover:shadow-lg transition mt-6 font-semibold"
            >
              Iniciar Sesión
            </button>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setModo('registro');
                  setErrores({});
                }}
                className="flex-1 text-center text-blue-500 hover:text-blue-600 font-semibold"
              >
                Registrarse
              </button>
              <button
                type="button"
                onClick={() => {
                  setModo('recuperar');
                  setErrores({});
                }}
                className="flex-1 text-center text-gray-500 hover:text-gray-600 text-sm"
              >
                ¿Olvidaste contraseña?
              </button>
            </div>
          </form>
        )}

        {modo === 'registro' && (
          <form onSubmit={handleRegistro}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre completo"
                value={formulario.nombre}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errores.nombre ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errores.nombre && <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formulario.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errores.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errores.email && <p className="text-red-500 text-sm mt-1">{errores.email}</p>}
            </div>

            <InputPassword
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              value={formulario.contrasena}
              onChange={(e) => handleChange({ target: { name: 'contrasena', value: e.target.value } })}
              error={errores.contrasena}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pregunta Secreta</label>
              <input
                type="text"
                name="preguntaSecreta"
                placeholder="¿Cuál es tu comida favorita?"
                value={formulario.preguntaSecreta}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errores.preguntaSecreta ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errores.preguntaSecreta && <p className="text-red-500 text-sm mt-1">{errores.preguntaSecreta}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Respuesta Secreta</label>
              <input
                type="text"
                name="respuestaSecreta"
                placeholder="Tu respuesta"
                value={formulario.respuestaSecreta}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errores.respuestaSecreta ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errores.respuestaSecreta && <p className="text-red-500 text-sm mt-1">{errores.respuestaSecreta}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg hover:shadow-lg transition mt-6 font-semibold"
            >
              Registrarse
            </button>

            <button
              type="button"
              onClick={() => {
                setModo('login');
                setErrores({});
              }}
              className="w-full text-center text-blue-500 hover:text-blue-600 font-semibold mt-4"
            >
              Volver al Login
            </button>
          </form>
        )}

        {modo === 'recuperar' && (
          <form onSubmit={handleRecuperar}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formulario.email}
                onChange={handleChange}
                disabled={!!pregunta}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {pregunta && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pregunta de Seguridad</label>
                <p className="bg-blue-50 p-3 rounded-lg text-gray-700 mb-3">{pregunta}</p>
                <input
                  type="text"
                  placeholder="Tu respuesta"
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg hover:shadow-lg transition mt-6 font-semibold"
            >
              {pregunta ? 'Verificar Respuesta' : 'Continuar'}
            </button>

            <button
              type="button"
              onClick={() => {
                setModo('login');
                setErrores({});
                setPregunta('');
              }}
              className="w-full text-center text-blue-500 hover:text-blue-600 font-semibold mt-4"
            >
              Volver al Login
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

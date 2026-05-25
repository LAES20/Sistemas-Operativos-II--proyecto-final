import client from './api';

export const authService = {
  registro: (nombre, email, contrasena, preguntaSecreta, respuestaSecreta) =>
    client.post('/auth/registro', {
      nombre,
      email,
      contrasena,
      pregunta_secreta: preguntaSecreta,
      respuesta_secreta: respuestaSecreta
    }),

  login: (email, contrasena) =>
    client.post('/auth/login', { email, contrasena }),

  obtenerPerfil: () =>
    client.get('/auth/perfil'),

  actualizarPerfil: (nombre, email) =>
    client.put('/auth/perfil', { nombre, email }),

  cambiarContrasena: (contrasenaActual, contrasenaNueva) =>
    client.post('/auth/cambiar-contrasena', {
      contrasena_actual: contrasenaActual,
      contrasena_nueva: contrasenaNueva
    }),

  passwordChange: (email, contrasenaActual, contrasenaNueva) =>
    client.post('/auth/cambiar-contrasena', {
      email,
      contrasena_actual: contrasenaActual,
      contrasena_nueva: contrasenaNueva
    }),

  cambiarContrasenaRecuperacion: (email, contrasenaNueva) =>
    client.post('/auth/recuperar/cambiar-contrasena', {
      email,
      contrasena_nueva: contrasenaNueva
    }),

  verificarPreguntaSecreta: (email) =>
    client.post('/auth/recuperar/pregunta', { email }),

  recuperarContrasena: (email, respuesta) =>
    client.post('/auth/recuperar/verificar', { email, respuesta })
};

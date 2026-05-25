import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import * as Usuario from '../models/Usuario.js';
import * as Categoria from '../models/Categoria.js';
import * as Auditoria from '../models/Auditoria.js';

export async function registro(req, res) {
  try {
    const { nombre, email, contrasena, preguntaSecreta, respuestaSecreta } = req.body;

    // Validaciones
    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ error: 'Campos requeridos faltantes' });
    }

    if (contrasena.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres' });
    }

    const usuarioExistente = await Usuario.obtenerUsuarioPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = await hashPassword(contrasena);
    const nuevoUsuario = await Usuario.crearUsuario(
      nombre,
      email,
      hashedPassword,
      preguntaSecreta,
      respuestaSecreta
    );

    // Crear categorías por defecto
    await Categoria.crearCategoriasDefault(nuevoUsuario.id);

    // Registrar en bitácora
    await Auditoria.registrarAccion(nuevoUsuario.id, 'REGISTRO', 'usuarios', nuevoUsuario.id, null, nuevoUsuario);

    const token = generateToken(nuevoUsuario.id, 'Usuario estándar');

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      },
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function login(req, res) {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const usuario = await Usuario.obtenerUsuarioPorEmail(email);
    if (!usuario) {
      await Usuario.registrarIntentoFallido(email);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar bloqueo temporal
    if (usuario.bloqueado_hasta && new Date(usuario.bloqueado_hasta) > new Date()) {
      return res.status(429).json({ 
        error: 'Cuenta temporalmente bloqueada por demasiados intentos fallidos. Intente más tarde.' 
      });
    }

    // Verificar estado
    if (usuario.estado === 'inactivo') {
      return res.status(401).json({ error: 'Usuario inactivo' });
    }

    const passwordValida = await comparePassword(contrasena, usuario.contrasena);
    if (!passwordValida) {
      const intentos = await Usuario.registrarIntentoFallido(email);
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        intentos: 5 - intentos
      });
    }

    // Limpiar intentos fallidos
    await Usuario.limpiarIntentosFallidos(email);
    await Usuario.obtenerUsuarioPorId(usuario.id); // Reset intentos en BD

    // Registrar en bitácora
    await Auditoria.registrarAccion(usuario.id, 'LOGIN', 'usuarios', usuario.id, null, { email });

    const token = generateToken(usuario.id, usuario.rol);

    res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function verificarPreguntaSecreta(req, res) {
  try {
    const { email } = req.body;

    const usuario = await Usuario.obtenerUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      pregunta: usuario.pregunta_secreta
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function recuperarContrasena(req, res) {
  try {
    const { email, respuesta } = req.body;

    const usuario = await Usuario.obtenerUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (usuario.respuesta_secreta !== respuesta) {
      return res.status(401).json({ error: 'Respuesta incorrecta' });
    }

    // Generar token temporal
    const token = generateToken(usuario.id, usuario.rol);

    res.json({
      mensaje: 'Respuesta correcta',
      temporal: true,
      token
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function cambiarContrasena(req, res) {
  try {
    const { contrasenaActual, contrasenaNueva } = req.body;
    const userId = req.userId;

    if (!contrasenaActual || !contrasenaNueva) {
      return res.status(400).json({ error: 'Campos requeridos faltantes' });
    }

    if (contrasenaNueva.length < 8) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener mínimo 8 caracteres' });
    }

    const usuario = await Usuario.obtenerUsuarioPorId(userId);
    const passwordValida = await comparePassword(contrasenaActual, usuario.contrasena);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    const hashedPassword = await hashPassword(contrasenaNueva);
    await Usuario.cambiarContrasena(userId, hashedPassword);

    await Auditoria.registrarAccion(userId, 'CAMBIO_CONTRASEÑA', 'usuarios', userId, null, null);

    res.json({ 
      mensaje: 'Contraseña cambiada exitosamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function cambiarContrasenaRecuperacion(req, res) {
  try {
    const { email, contrasenaNueva } = req.body;

    if (!email || !contrasenaNueva) {
      return res.status(400).json({ error: 'Campos requeridos faltantes' });
    }

    if (contrasenaNueva.length < 8) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener mínimo 8 caracteres' });
    }

    const usuario = await Usuario.obtenerUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const hashedPassword = await hashPassword(contrasenaNueva);
    await Usuario.cambiarContrasena(usuario.id, hashedPassword);

    await Auditoria.registrarAccion(usuario.id, 'CAMBIO_CONTRASEÑA_RECUPERACION', 'usuarios', usuario.id, null, null);

    const token = generateToken(usuario.id, usuario.rol);

    res.json({ 
      mensaje: 'Contraseña cambiada exitosamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      token
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function obtenerPerfil(req, res) {
  try {
    const usuario = await Usuario.obtenerUsuarioPorId(req.userId);
    res.json(usuario);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function actualizarPerfil(req, res) {
  try {
    const { nombre, email } = req.body;
    const usuario = await Usuario.actualizarUsuario(req.userId, nombre, email);
    
    await Auditoria.registrarAccion(req.userId, 'ACTUALIZAR_PERFIL', 'usuarios', req.userId, null, usuario);
    
    res.json({ mensaje: 'Perfil actualizado', usuario });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

import * as Usuario from '../models/Usuario.js';
import * as Auditoria from '../models/Auditoria.js';
import { hashPassword } from '../utils/password.js';

export async function obtenerTodosLosUsuarios(req, res) {
  try {
    const usuarios = await Usuario.obtenerTodosLosUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function cambiarRol(req, res) {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    const usuarioAnterior = await Usuario.obtenerUsuarioPorId(id);
    if (!usuarioAnterior) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuarioActualizado = await Usuario.cambiarRolUsuario(id, rol);
    await Auditoria.registrarAccion(
      req.userId,
      'CAMBIO_ROL',
      'usuarios',
      id,
      usuarioAnterior,
      usuarioActualizado
    );

    res.json({
      mensaje: 'Rol actualizado exitosamente',
      usuario: usuarioActualizado
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function desactivarUsuario(req, res) {
  try {
    const { id } = req.params;

    const usuario = await Usuario.obtenerUsuarioPorId(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await Usuario.desactivarUsuario(id);
    await Auditoria.registrarAccion(req.userId, 'DESACTIVAR_USUARIO', 'usuarios', id, usuario, null);

    res.json({ mensaje: 'Usuario desactivado exitosamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function obtenerBitacora(req, res) {
  try {
    const bitacora = await Auditoria.obtenerBitacoraUsuario(req.userId);
    res.json(bitacora);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function obtenerBitacoraCompleta(req, res) {
  try {
    const bitacora = await Auditoria.obtenerBitacoraCompleta();
    res.json(bitacora);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

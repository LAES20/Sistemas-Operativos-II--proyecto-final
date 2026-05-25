import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

export async function crearUsuario(nombre, email, hashedPassword, preguntaSecreta, respuestaSecreta) {
  const connection = await pool.getConnection();
  try {
    const id = uuidv4();
    const query = `
      INSERT INTO usuarios (id, nombre, email, contrasena, pregunta_secreta, respuesta_secreta)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(query, [
      id,
      nombre,
      email,
      hashedPassword,
      preguntaSecreta || null,
      respuestaSecreta || null
    ]);
    return { id, nombre, email };
  } finally {
    connection.release();
  }
}

export async function obtenerUsuarioPorEmail(email) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

export async function obtenerUsuarioPorId(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT id, nombre, email, rol, estado FROM usuarios WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

export async function obtenerTodosLosUsuarios() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT id, nombre, email, rol, estado, fecha_creacion FROM usuarios WHERE estado = "activo"'
    );
    return rows;
  } finally {
    connection.release();
  }
}

export async function actualizarUsuario(id, nombre, email) {
  const connection = await pool.getConnection();
  try {
    const query = `
      UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?
    `;
    await connection.execute(query, [nombre, email, id]);
    return await obtenerUsuarioPorId(id);
  } finally {
    connection.release();
  }
}

export async function cambiarContrasena(id, hashedPassword) {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'UPDATE usuarios SET contrasena = ? WHERE id = ?',
      [hashedPassword, id]
    );
  } finally {
    connection.release();
  }
}

export async function desactivarUsuario(id) {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'UPDATE usuarios SET estado = "inactivo" WHERE id = ?',
      [id]
    );
  } finally {
    connection.release();
  }
}

export async function registrarIntentoFallido(email) {
  const connection = await pool.getConnection();
  try {
    const id = uuidv4();
    await connection.execute(
      'INSERT INTO intentos_login_fallidos (id, email) VALUES (?, ?)',
      [id, email]
    );

    // Contar intentos en últimos 15 minutos
    const [rows] = await connection.execute(
      'SELECT COUNT(*) as count FROM intentos_login_fallidos WHERE email = ? AND fecha_intento > DATE_SUB(NOW(), INTERVAL 15 MINUTE)',
      [email]
    );

    const intentos = rows[0].count;
    const usuario = await obtenerUsuarioPorEmail(email);

    if (intentos >= 5 && usuario) {
      // Bloquear por 30 minutos
      const bloqueadoHasta = new Date(Date.now() + 30 * 60 * 1000);
      await connection.execute(
        'UPDATE usuarios SET bloqueado_hasta = ? WHERE id = ?',
        [bloqueadoHasta, usuario.id]
      );
    }

    return intentos;
  } finally {
    connection.release();
  }
}

export async function limpiarIntentosFallidos(email) {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'DELETE FROM intentos_login_fallidos WHERE email = ?',
      [email]
    );
  } finally {
    connection.release();
  }
}

export async function cambiarRolUsuario(id, nuevoRol) {
  const connection = await pool.getConnection();
  try {
    if (!['Administrador', 'Usuario estándar'].includes(nuevoRol)) {
      throw new Error('Rol inválido');
    }
    await connection.execute(
      'UPDATE usuarios SET rol = ? WHERE id = ?',
      [nuevoRol, id]
    );
    return await obtenerUsuarioPorId(id);
  } finally {
    connection.release();
  }
}

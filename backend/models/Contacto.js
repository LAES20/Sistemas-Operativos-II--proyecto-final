import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

export async function crearContacto(usuarioId, datos) {
  const connection = await pool.getConnection();
  try {
    const id = uuidv4();
    const query = `
      INSERT INTO contactos 
      (id, usuario_id, nombre, telefono, email, direccion, ciudad, pais, fecha_nacimiento, notas, imagen_url, categoria_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(query, [
      id,
      usuarioId,
      datos.nombre,
      datos.telefono,
      datos.email || null,
      datos.direccion || null,
      datos.ciudad || null,
      datos.pais || null,
      datos.fecha_nacimiento || null,
      datos.notas || null,
      datos.imagen_url || null,
      datos.categoria_id || null
    ]);
    return { id, ...datos };
  } finally {
    connection.release();
  }
}

export async function obtenerContactosPorUsuario(usuarioId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT c.*, cat.nombre as categoria_nombre, cat.color, cat.icono
      FROM contactos c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      WHERE c.usuario_id = ? AND c.id NOT IN (SELECT contacto_id FROM papelera_contactos)
      ORDER BY c.nombre ASC
    `, [usuarioId]);
    return rows;
  } finally {
    connection.release();
  }
}

export async function obtenerContactoPorId(id, usuarioId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT c.*, cat.nombre as categoria_nombre, cat.color, cat.icono
      FROM contactos c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      WHERE c.id = ? AND c.usuario_id = ?
    `, [id, usuarioId]);
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

export async function buscarContactos(usuarioId, termino) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT c.*, cat.nombre as categoria_nombre, cat.color, cat.icono
      FROM contactos c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      WHERE c.usuario_id = ? AND (
        c.nombre LIKE ? OR 
        c.telefono LIKE ? OR 
        c.email LIKE ? OR
        c.ciudad LIKE ?
      ) AND c.id NOT IN (SELECT contacto_id FROM papelera_contactos)
      ORDER BY c.nombre ASC
    `, [usuarioId, `%${termino}%`, `%${termino}%`, `%${termino}%`, `%${termino}%`]);
    return rows;
  } finally {
    connection.release();
  }
}

export async function obtenerContactosPorCategoria(usuarioId, categoriaId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT c.*, cat.nombre as categoria_nombre, cat.color, cat.icono
      FROM contactos c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      WHERE c.usuario_id = ? AND c.categoria_id = ? AND c.id NOT IN (SELECT contacto_id FROM papelera_contactos)
      ORDER BY c.nombre ASC
    `, [usuarioId, categoriaId]);
    return rows;
  } finally {
    connection.release();
  }
}

export async function actualizarContacto(id, usuarioId, datos) {
  const connection = await pool.getConnection();
  try {
    const query = `
      UPDATE contactos 
      SET nombre = ?, telefono = ?, email = ?, direccion = ?, ciudad = ?, pais = ?, 
          fecha_nacimiento = ?, notas = ?, imagen_url = ?, categoria_id = ?
      WHERE id = ? AND usuario_id = ?
    `;
    await connection.execute(query, [
      datos.nombre,
      datos.telefono,
      datos.email || null,
      datos.direccion || null,
      datos.ciudad || null,
      datos.pais || null,
      datos.fecha_nacimiento || null,
      datos.notas || null,
      datos.imagen_url || null,
      datos.categoria_id || null,
      id,
      usuarioId
    ]);
    return await obtenerContactoPorId(id, usuarioId);
  } finally {
    connection.release();
  }
}

export async function eliminarContacto(id, usuarioId) {
  const connection = await pool.getConnection();
  try {
    // Obtener datos antes de eliminar para la papelera
    const contacto = await obtenerContactoPorId(id, usuarioId);
    if (!contacto) return false;

    // Insertar en papelera
    const papeleraId = uuidv4();
    await connection.execute(
      'INSERT INTO papelera_contactos (id, usuario_id, contacto_id, datos_contacto) VALUES (?, ?, ?, ?)',
      [papeleraId, usuarioId, id, JSON.stringify(contacto)]
    );

    // Eliminar etiquetas
    await connection.execute(
      'DELETE FROM etiquetas WHERE contacto_id = ?',
      [id]
    );

    // Eliminar contacto
    const [result] = await connection.execute(
      'DELETE FROM contactos WHERE id = ? AND usuario_id = ?',
      [id, usuarioId]
    );
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}

export async function toggleFavorito(id, usuarioId) {
  const connection = await pool.getConnection();
  try {
    const contacto = await obtenerContactoPorId(id, usuarioId);
    if (!contacto) return null;

    const nuevoEstado = !contacto.favorito;
    await connection.execute(
      'UPDATE contactos SET favorito = ? WHERE id = ?',
      [nuevoEstado, id]
    );
    return { ...contacto, favorito: nuevoEstado };
  } finally {
    connection.release();
  }
}

export async function obtenerFavoritos(usuarioId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT c.*, cat.nombre as categoria_nombre, cat.color, cat.icono
      FROM contactos c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      WHERE c.usuario_id = ? AND c.favorito = TRUE AND c.id NOT IN (SELECT contacto_id FROM papelera_contactos)
      ORDER BY c.nombre ASC
    `, [usuarioId]);
    return rows;
  } finally {
    connection.release();
  }
}

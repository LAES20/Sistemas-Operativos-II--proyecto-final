import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

export async function crearCategoria(usuarioId, nombre, descripcion, color, icono, predefinida = false) {
  const connection = await pool.getConnection();
  try {
    const id = uuidv4();
    const query = `
      INSERT INTO categorias (id, usuario_id, nombre, descripcion, color, icono, predefinida)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(query, [
      id,
      usuarioId,
      nombre,
      descripcion,
      color,
      icono,
      predefinida
    ]);
    return { id, nombre, descripcion, color, icono, predefinida };
  } finally {
    connection.release();
  }
}

export async function obtenerCategoriasPorUsuario(usuarioId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM categorias WHERE usuario_id = ? ORDER BY nombre ASC',
      [usuarioId]
    );
    return rows;
  } finally {
    connection.release();
  }
}

export async function obtenerCategoriaPorId(id, usuarioId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM categorias WHERE id = ? AND usuario_id = ?',
      [id, usuarioId]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

export async function actualizarCategoria(id, usuarioId, nombre, descripcion, color, icono) {
  const connection = await pool.getConnection();
  try {
    const query = `
      UPDATE categorias 
      SET nombre = ?, descripcion = ?, color = ?, icono = ?
      WHERE id = ? AND usuario_id = ?
    `;
    await connection.execute(query, [
      nombre,
      descripcion,
      color,
      icono,
      id,
      usuarioId
    ]);
    return await obtenerCategoriaPorId(id, usuarioId);
  } finally {
    connection.release();
  }
}

export async function eliminarCategoria(id, usuarioId) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      'DELETE FROM categorias WHERE id = ? AND usuario_id = ? AND predefinida = FALSE',
      [id, usuarioId]
    );
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}

export async function crearCategoriasDefault(usuarioId) {
  const categoriasDefault = [
    { nombre: 'Trabajo', color: '#3498db', icono: 'briefcase' },
    { nombre: 'Familia', color: '#e74c3c', icono: 'users' },
    { nombre: 'Amigos', color: '#2ecc71', icono: 'heart' },
    { nombre: 'Clientes', color: '#f39c12', icono: 'star' }
  ];

  for (const cat of categoriasDefault) {
    await crearCategoria(usuarioId, cat.nombre, '', cat.color, cat.icono, true);
  }
}

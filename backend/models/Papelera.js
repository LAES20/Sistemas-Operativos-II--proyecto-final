import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

export async function obtenerPapelera(usuarioId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM papelera_contactos WHERE usuario_id = ? ORDER BY fecha_eliminacion DESC',
      [usuarioId]
    );
    return rows;
  } finally {
    connection.release();
  }
}

export async function restaurarContacto(papeleraId, usuarioId) {
  const connection = await pool.getConnection();
  try {
    const [papelera] = await connection.execute(
      'SELECT * FROM papelera_contactos WHERE id = ? AND usuario_id = ?',
      [papeleraId, usuarioId]
    );

    if (!papelera[0]) return null;

    const datos = papelera[0].datos_contacto;
    const contactoId = papelera[0].contacto_id;

    // Restaurar contacto
    const query = `
      INSERT INTO contactos 
      (id, usuario_id, nombre, telefono, email, direccion, ciudad, pais, fecha_nacimiento, notas, imagen_url, categoria_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(query, [
      contactoId,
      usuarioId,
      datos.nombre,
      datos.telefono,
      datos.email,
      datos.direccion,
      datos.ciudad,
      datos.pais,
      datos.fecha_nacimiento,
      datos.notas,
      datos.imagen_url,
      datos.categoria_id
    ]);

    // Eliminar de papelera
    await connection.execute(
      'DELETE FROM papelera_contactos WHERE id = ?',
      [papeleraId]
    );

    return datos;
  } finally {
    connection.release();
  }
}

export async function eliminarPermanentemente(papeleraId, usuarioId) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      'DELETE FROM papelera_contactos WHERE id = ? AND usuario_id = ?',
      [papeleraId, usuarioId]
    );
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}

export async function vaciarPapelaraExpirada() {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'DELETE FROM papelera_contactos WHERE fecha_expiracion < NOW()'
    );
  } finally {
    connection.release();
  }
}

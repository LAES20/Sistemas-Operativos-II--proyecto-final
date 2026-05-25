import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

export async function registrarAccion(usuarioId, accion, tablaAfectada, registroId, datosAntiguos, datosNuevos) {
  const connection = await pool.getConnection();
  try {
    const id = uuidv4();
    const query = `
      INSERT INTO bitacora_auditoria 
      (id, usuario_id, accion, tabla_afectada, registro_id, datos_antiguos, datos_nuevos)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(query, [
      id,
      usuarioId,
      accion,
      tablaAfectada,
      registroId,
      datosAntiguos ? JSON.stringify(datosAntiguos) : null,
      datosNuevos ? JSON.stringify(datosNuevos) : null
    ]);
  } finally {
    connection.release();
  }
}

export async function obtenerBitacoraUsuario(usuarioId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM bitacora_auditoria WHERE usuario_id = ? ORDER BY fecha_accion DESC LIMIT 100',
      [usuarioId]
    );
    return rows;
  } finally {
    connection.release();
  }
}

export async function obtenerBitacoraCompleta() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM bitacora_auditoria ORDER BY fecha_accion DESC LIMIT 500'
    );
    return rows;
  } finally {
    connection.release();
  }
}

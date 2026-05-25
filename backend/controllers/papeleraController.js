import * as Papelera from '../models/Papelera.js';
import * as Auditoria from '../models/Auditoria.js';

export async function obtenerPapelera(req, res) {
  try {
    const papelera = await Papelera.obtenerPapelera(req.userId);
    res.json(papelera);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function restaurarContacto(req, res) {
  try {
    const { id } = req.params;
    const contacto = await Papelera.restaurarContacto(id, req.userId);

    if (!contacto) {
      return res.status(404).json({ error: 'Elemento en papelera no encontrado' });
    }

    await Auditoria.registrarAccion(req.userId, 'RESTAURAR_CONTACTO', 'papelera', id, null, contacto);

    res.json({
      mensaje: 'Contacto restaurado exitosamente',
      contacto
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function eliminarPermanentemente(req, res) {
  try {
    const { id } = req.params;
    const resultado = await Papelera.eliminarPermanentemente(id, req.userId);

    if (!resultado) {
      return res.status(404).json({ error: 'Elemento no encontrado' });
    }

    await Auditoria.registrarAccion(req.userId, 'ELIMINAR_PERMANENTE', 'papelera', id, null, null);

    res.json({ mensaje: 'Elemento eliminado permanentemente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function vaciarPapelera(req, res) {
  try {
    await Papelera.vaciarPapelaraExpirada();
    res.json({ mensaje: 'Papelera vaciada' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

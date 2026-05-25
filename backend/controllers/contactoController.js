import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as Contacto from '../models/Contacto.js';
import * as Auditoria from '../models/Auditoria.js';

export async function agregarContacto(req, res) {
  try {
    const { nombre, telefono, email, direccion, ciudad, pais, fecha_nacimiento, notas, categoria_id } = req.body;

    if (!nombre || !telefono) {
      return res.status(400).json({ error: 'Nombre y teléfono son requeridos' });
    }

    let imagen_url = null;
    if (req.file) {
      imagen_url = `/uploads/${req.file.filename}`;
    }

    const nuevoContacto = await Contacto.crearContacto(req.userId, {
      nombre,
      telefono,
      email,
      direccion,
      ciudad,
      pais,
      fecha_nacimiento,
      notas,
      imagen_url,
      categoria_id
    });

    await Auditoria.registrarAccion(req.userId, 'CREAR_CONTACTO', 'contactos', nuevoContacto.id, null, nuevoContacto);

    res.status(201).json({
      mensaje: 'Contacto agregado exitosamente',
      contacto: nuevoContacto
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function listarContactos(req, res) {
  try {
    const contactos = await Contacto.obtenerContactosPorUsuario(req.userId);
    res.json(contactos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function buscarContactos(req, res) {
  try {
    const { termino } = req.query;

    if (!termino) {
      return res.status(400).json({ error: 'Término de búsqueda requerido' });
    }

    const contactos = await Contacto.buscarContactos(req.userId, termino);
    res.json(contactos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function obtenerContactoPorId(req, res) {
  try {
    const { id } = req.params;
    const contacto = await Contacto.obtenerContactoPorId(id, req.userId);

    if (!contacto) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    res.json(contacto);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function editarContacto(req, res) {
  try {
    const { id } = req.params;
    const { nombre, telefono, email, direccion, ciudad, pais, fecha_nacimiento, notas, categoria_id } = req.body;

    const contactoAnterior = await Contacto.obtenerContactoPorId(id, req.userId);
    if (!contactoAnterior) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    let imagen_url = contactoAnterior.imagen_url;
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (contactoAnterior.imagen_url) {
        const rutaAnterior = path.join(process.cwd(), 'uploads', path.basename(contactoAnterior.imagen_url));
        if (fs.existsSync(rutaAnterior)) {
          fs.unlinkSync(rutaAnterior);
        }
      }
      imagen_url = `/uploads/${req.file.filename}`;
    }

    const contactoActualizado = await Contacto.actualizarContacto(id, req.userId, {
      nombre,
      telefono,
      email,
      direccion,
      ciudad,
      pais,
      fecha_nacimiento,
      notas,
      imagen_url,
      categoria_id
    });

    await Auditoria.registrarAccion(
      req.userId,
      'ACTUALIZAR_CONTACTO',
      'contactos',
      id,
      contactoAnterior,
      contactoActualizado
    );

    res.json({
      mensaje: 'Contacto actualizado exitosamente',
      contacto: contactoActualizado
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function eliminarContacto(req, res) {
  try {
    const { id } = req.params;
    const contacto = await Contacto.obtenerContactoPorId(id, req.userId);

    if (!contacto) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    // Eliminar imagen si existe
    if (contacto.imagen_url) {
      const rutaImagen = path.join(process.cwd(), 'uploads', path.basename(contacto.imagen_url));
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen);
      }
    }

    await Contacto.eliminarContacto(id, req.userId);
    await Auditoria.registrarAccion(req.userId, 'ELIMINAR_CONTACTO', 'contactos', id, contacto, null);

    res.json({ mensaje: 'Contacto eliminado exitosamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function obtenerContactosPorCategoria(req, res) {
  try {
    const { categoriaId } = req.params;
    const contactos = await Contacto.obtenerContactosPorCategoria(req.userId, categoriaId);
    res.json(contactos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function toggleFavorito(req, res) {
  try {
    const { id } = req.params;
    const contacto = await Contacto.toggleFavorito(id, req.userId);

    if (!contacto) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    await Auditoria.registrarAccion(
      req.userId,
      'TOGGLE_FAVORITO',
      'contactos',
      id,
      null,
      { favorito: contacto.favorito }
    );

    res.json({
      mensaje: 'Favorito actualizado',
      contacto
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function obtenerFavoritos(req, res) {
  try {
    const contactos = await Contacto.obtenerFavoritos(req.userId);
    res.json(contactos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function obtenerEstadisticas(req, res) {
  try {
    const contactos = await Contacto.obtenerContactosPorUsuario(req.userId);
    const favoritos = await Contacto.obtenerFavoritos(req.userId);
    
    const estadisticas = {
      totalContactos: contactos.length,
      totalFavoritos: favoritos.length,
      ultimoAgregado: contactos.length > 0 ? contactos[0] : null
    };

    res.json(estadisticas);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

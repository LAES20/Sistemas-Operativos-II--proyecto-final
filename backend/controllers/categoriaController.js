import * as Categoria from '../models/Categoria.js';
import * as Auditoria from '../models/Auditoria.js';

export async function crearCategoria(req, res) {
  try {
    const { nombre, descripcion, color, icono } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre de categoría requerido' });
    }

    const nuevaCategoria = await Categoria.crearCategoria(
      req.userId,
      nombre,
      descripcion,
      color || '#3498db',
      icono || 'folder',
      false
    );

    await Auditoria.registrarAccion(req.userId, 'CREAR_CATEGORIA', 'categorias', nuevaCategoria.id, null, nuevaCategoria);

    res.status(201).json({
      mensaje: 'Categoría creada exitosamente',
      categoria: nuevaCategoria
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function obtenerCategorias(req, res) {
  try {
    const categorias = await Categoria.obtenerCategoriasPorUsuario(req.userId);
    res.json(categorias);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function actualizarCategoria(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion, color, icono } = req.body;

    const categoriaAnterior = await Categoria.obtenerCategoriaPorId(id, req.userId);
    if (!categoriaAnterior) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    if (categoriaAnterior.predefinida && nombre !== categoriaAnterior.nombre) {
      return res.status(400).json({ error: 'No se pueden renombrar categorías predefinidas' });
    }

    const categoriaActualizada = await Categoria.actualizarCategoria(
      id,
      req.userId,
      nombre || categoriaAnterior.nombre,
      descripcion !== undefined ? descripcion : categoriaAnterior.descripcion,
      color || categoriaAnterior.color,
      icono || categoriaAnterior.icono
    );

    await Auditoria.registrarAccion(
      req.userId,
      'ACTUALIZAR_CATEGORIA',
      'categorias',
      id,
      categoriaAnterior,
      categoriaActualizada
    );

    res.json({
      mensaje: 'Categoría actualizada exitosamente',
      categoria: categoriaActualizada
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export async function eliminarCategoria(req, res) {
  try {
    const { id } = req.params;
    const categoria = await Categoria.obtenerCategoriaPorId(id, req.userId);

    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    if (categoria.predefinida) {
      return res.status(400).json({ error: 'No se pueden eliminar categorías predefinidas' });
    }

    await Categoria.eliminarCategoria(id, req.userId);
    await Auditoria.registrarAccion(req.userId, 'ELIMINAR_CATEGORIA', 'categorias', id, categoria, null);

    res.json({ mensaje: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

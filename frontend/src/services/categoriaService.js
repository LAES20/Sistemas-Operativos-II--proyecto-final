import client from './api';

export const categoriaService = {
  crearCategoria: (nombre, descripcion, color, icono) =>
    client.post('/categorias', { nombre, descripcion, color, icono }),

  obtenerCategorias: () =>
    client.get('/categorias'),

  actualizarCategoria: (id, nombre, descripcion, color, icono) =>
    client.put(`/categorias/${id}`, { nombre, descripcion, color, icono }),

  eliminarCategoria: (id) =>
    client.delete(`/categorias/${id}`)
};

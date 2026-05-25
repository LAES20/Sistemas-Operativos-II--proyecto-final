import client from './api';

export const contactoService = {
  agregarContacto: (formData) =>
    client.post('/contactos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  listarContactos: () =>
    client.get('/contactos'),

  buscarContactos: (termino) =>
    client.get('/contactos/buscar', { params: { termino } }),

  obtenerContacto: (id) =>
    client.get(`/contactos/${id}`),

  editarContacto: (id, formData) =>
    client.put(`/contactos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  eliminarContacto: (id) =>
    client.delete(`/contactos/${id}`),

  toggleFavorito: (id) =>
    client.patch(`/contactos/${id}/favorito`),

  obtenerFavoritos: () =>
    client.get('/contactos/favoritos'),

  obtenerContactosPorCategoria: (categoriaId) =>
    client.get(`/contactos/categoria/${categoriaId}`),

  obtenerEstadisticas: () =>
    client.get('/contactos/estadisticas')
};

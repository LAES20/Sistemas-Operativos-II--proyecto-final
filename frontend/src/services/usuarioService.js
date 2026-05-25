import client from './api';

export const usuarioService = {
  obtenerUsuarios: () =>
    client.get('/usuarios/admin/usuarios'),

  cambiarRol: (id, rol) =>
    client.put(`/usuarios/admin/usuarios/${id}/rol`, { rol }),

  desactivarUsuario: (id) =>
    client.delete(`/usuarios/admin/usuarios/${id}`),

  obtenerBitacora: () =>
    client.get('/usuarios/bitacora'),

  obtenerBitacoraCompleta: () =>
    client.get('/usuarios/admin/bitacora'),

  obtenerPapelera: () =>
    client.get('/usuarios/papelera'),

  restaurarContacto: (id) =>
    client.post(`/usuarios/papelera/${id}/restaurar`),

  eliminarPermanentemente: (id) =>
    client.delete(`/usuarios/papelera/${id}`)
};

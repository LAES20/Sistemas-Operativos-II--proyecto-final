import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  usuario: JSON.parse(localStorage.getItem('usuario')) || null,
  token: localStorage.getItem('token') || null,
  cargando: false,
  error: null,

  setUsuario: (usuario, token) => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', token);
    set({ usuario, token, error: null });
  },

  logout: () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    set({ usuario: null, token: null });
  },

  setCargando: (cargando) => set({ cargando }),
  setError: (error) => set({ error }),
  limpiarError: () => set({ error: null })
}));

export const useContactoStore = create((set, get) => ({
  contactos: [],
  contactoSeleccionado: null,
  cargando: false,
  error: null,
  filtro: '',

  setContactos: (contactos) => set({ contactos }),
  setContactoSeleccionado: (contacto) => set({ contactoSeleccionado: contacto }),
  setCargando: (cargando) => set({ cargando }),
  setError: (error) => set({ error }),
  setFiltro: (filtro) => set({ filtro }),
  limpiarError: () => set({ error: null })
}));

export const useCategoriaStore = create((set) => ({
  categorias: [],
  categoriaSeleccionada: null,
  cargando: false,
  error: null,

  setCategorias: (categorias) => set({ categorias }),
  setCategoriaSeleccionada: (categoria) => set({ categoriaSeleccionada: categoria }),
  setCargando: (cargando) => set({ cargando }),
  setError: (error) => set({ error }),
  limpiarError: () => set({ error: null })
}));

export const useUIStore = create((set) => ({
  modalAbierto: false,
  modalFormulario: false,
  modalEditar: false,
  modalBusqueda: false,
  darkMode: JSON.parse(localStorage.getItem('darkMode')) || false,
  notificacion: null,

  abrirModal: () => set({ modalAbierto: true }),
  cerrarModal: () => set({ modalAbierto: false }),
  abrirFormulario: () => set({ modalFormulario: true }),
  cerrarFormulario: () => set({ modalFormulario: false }),
  abrirEditar: () => set({ modalEditar: true }),
  cerrarEditar: () => set({ modalEditar: false }),
  abrirBusqueda: () => set({ modalBusqueda: true }),
  cerrarBusqueda: () => set({ modalBusqueda: false }),

  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.darkMode;
      localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
      return { darkMode: newDarkMode };
    });
  },

  mostrarNotificacion: (mensaje, tipo = 'info') => {
    set({ notificacion: { mensaje, tipo } });
    setTimeout(() => set({ notificacion: null }), 3000);
  },

  limpiarNotificacion: () => set({ notificacion: null })
}));

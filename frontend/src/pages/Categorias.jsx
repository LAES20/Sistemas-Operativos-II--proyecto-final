import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Lock } from 'lucide-react';
import { categoriaService } from '../services/categoriaService';
import { useUIStore } from '../store/store';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    color: '#3498db',
    icono: 'folder'
  });
  const { mostrarNotificacion, darkMode } = useUIStore();

  const iconos = ['folder', 'briefcase', 'heart', 'star', 'users', 'check', 'tag', 'pin'];
  const colores = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#c0392b'];

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setCargando(true);
      const response = await categoriaService.obtenerCategorias();
      setCategorias(response.data);
    } catch (error) {
      mostrarNotificacion('Error al cargar categorías', 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      mostrarNotificacion('El nombre es obligatorio', 'error');
      return;
    }

    try {
      if (editando) {
        await categoriaService.actualizarCategoria(
          editando.id,
          formData.nombre,
          formData.descripcion,
          formData.color,
          formData.icono
        );
        mostrarNotificacion('Categoría actualizada', 'success');
      } else {
        await categoriaService.crearCategoria(
          formData.nombre,
          formData.descripcion,
          formData.color,
          formData.icono
        );
        mostrarNotificacion('Categoría creada', 'success');
      }
      setFormData({ nombre: '', descripcion: '', color: '#3498db', icono: 'folder' });
      setEditando(null);
      setMostrarFormulario(false);
      cargarCategorias();
    } catch (error) {
      mostrarNotificacion('Error al guardar categoría', 'error');
    }
  };

  const handleEditar = (categoria) => {
    setEditando(categoria);
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      color: categoria.color,
      icono: categoria.icono
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id, esPredefinida) => {
    if (esPredefinida) {
      mostrarNotificacion('No puedes eliminar categorías predefinidas', 'error');
      return;
    }

    if (confirm('¿Eliminar esta categoría?')) {
      try {
        await categoriaService.eliminarCategoria(id);
        mostrarNotificacion('Categoría eliminada', 'success');
        cargarCategorias();
      } catch (error) {
        mostrarNotificacion('Error al eliminar categoría', 'error');
      }
    }
  };

  const handleCancelar = () => {
    setFormData({ nombre: '', descripcion: '', color: '#3498db', icono: 'folder' });
    setEditando(null);
    setMostrarFormulario(false);
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Gestión de Categorías</h1>
          {!mostrarFormulario && (
            <button
              onClick={() => setMostrarFormulario(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition flex items-center gap-2"
            >
              <Plus size={20} />
              Nueva Categoría
            </button>
          )}
        </div>
      </motion.div>

      {mostrarFormulario && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {editando ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {colores.map(color => (
                    <button
                      key={color}
                      type="button"
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-10 h-10 rounded-lg border-4 transition ${
                        formData.color === color ? `border-gray-900 dark:border-gray-100` : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Ícono</label>
              <div className="flex gap-2 flex-wrap">
                {iconos.map(icono => (
                  <button
                    key={icono}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icono }))}
                    className={`px-4 py-2 border-2 rounded-lg transition ${
                      formData.icono === icono
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700'
                    }`}
                  >
                    {icono}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows="3"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition"
              >
                {editando ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={handleCancelar}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map(categoria => (
          <div key={categoria.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                style={{ backgroundColor: categoria.color }}
              >
                📁
              </div>
              {categoria.predefinida ? (
                <Lock size={20} className="text-gray-400" />
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditar(categoria)}
                    className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleEliminar(categoria.id, categoria.predefinida)}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{categoria.nombre}</h3>
            {categoria.descripcion && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{categoria.descripcion}</p>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              {categoria.predefinida && <span className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 px-2 py-1 rounded">Predefinida</span>}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

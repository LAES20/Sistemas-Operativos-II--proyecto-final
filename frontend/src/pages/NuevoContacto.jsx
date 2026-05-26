import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload } from 'lucide-react';
import { contactoService } from '../services/contactoService';
import { categoriaService } from '../services/categoriaService';
import { useAuthStore, useUIStore } from '../store/store';

export default function NuevoContacto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuthStore();
  const { mostrarNotificacion, darkMode } = useUIStore();
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    ciudad: '',
    categoria_id: '',
    notas: ''
  });
  
  const [categorias, setCategorias] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    cargarCategorias();
    if (id) {
      cargarContacto();
    }
  }, [id]);

  const cargarCategorias = async () => {
    try {
      const response = await categoriaService.obtenerCategorias();
      setCategorias(response.data);
      if (response.data.length > 0 && !formData.categoria_id) {
        setFormData(prev => ({
          ...prev,
          categoria_id: response.data[0].id
        }));
      }
    } catch (error) {
      mostrarNotificacion('Error al cargar categorías', 'error');
    }
  };

  const cargarContacto = async () => {
    try {
      setCargando(true);
      const response = await contactoService.obtenerContacto(id);
      const contacto = response.data;
      setFormData({
        nombre: contacto.nombre || '',
        email: contacto.email || '',
        telefono: contacto.telefono || '',
        ciudad: contacto.ciudad || '',
        categoria_id: contacto.categoria_id || '',
        notas: contacto.notas || ''
      });
      setModoEdicion(true);
    } catch (error) {
      mostrarNotificacion('Error al cargar contacto', 'error');
      navigate('/contactos');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      mostrarNotificacion('El nombre es obligatorio', 'error');
      return;
    }

    if (!formData.telefono.trim()) {
      mostrarNotificacion('El teléfono es obligatorio', 'error');
      return;
    }

    try {
      setCargando(true);
      
      const formDataMultipart = new FormData();
      formDataMultipart.append('nombre', formData.nombre);
      formDataMultipart.append('email', formData.email);
      formDataMultipart.append('telefono', formData.telefono);
      formDataMultipart.append('ciudad', formData.ciudad);
      formDataMultipart.append('categoria_id', formData.categoria_id);
      formDataMultipart.append('notas', formData.notas);
      
      if (archivo) {
        formDataMultipart.append('imagen', archivo);
      }

      if (modoEdicion) {
        await contactoService.editarContacto(id, formDataMultipart);
        mostrarNotificacion('Contacto actualizado exitosamente', 'success');
      } else {
        await contactoService.agregarContacto(formDataMultipart);
        mostrarNotificacion('Contacto creado exitosamente', 'success');
      }
      
      navigate('/contactos');
    } catch (error) {
      mostrarNotificacion(
        modoEdicion ? 'Error al actualizar contacto' : 'Error al crear contacto',
        'error'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <button
            onClick={() => navigate('/contactos')}
            className="flex items-center gap-2 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-3 text-sm md:text-base"
          >
            <ArrowLeft size={18} />
            Volver
          </button>
          
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {modoEdicion ? 'Editar Contacto' : 'Nuevo Contacto'}
          </h1>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-xl p-4 md:p-8"
        >
          {/* Nombre */}
          <div className="mb-4 md:mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm md:text-base">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              required
              className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Email */}
          <div className="mb-4 md:mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm md:text-base">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Teléfono */}
          <div className="mb-4 md:mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm md:text-base">
              Teléfono *
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+34 123 456 789"
              required
              className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Ciudad */}
          <div className="mb-4 md:mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm md:text-base">
              Ciudad
            </label>
            <input
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              placeholder="Madrid"
              className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Categoría */}
          <div className="mb-4 md:mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm md:text-base">
              Categoría
            </label>
            <select
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Seleccionar categoría...</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Notas */}
          <div className="mb-4 md:mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm md:text-base">
              Notas
            </label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              placeholder="Notas o detalles..."
              rows="4"
              className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Imagen */}
          <div className="mb-6 md:mb-8">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm md:text-base">
              Foto de perfil
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 text-sm md:text-base">
                <Upload size={18} />
                <span>Seleccionar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleArchivoChange}
                  className="hidden"
                />
              </label>
              {archivo && (
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 break-all">{archivo.name}</span>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={cargando}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 md:py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 text-sm md:text-base"
            >
              {cargando ? 'Guardando...' : modoEdicion ? 'Actualizar' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/contactos')}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition text-sm md:text-base"
            >
              Cancelar
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

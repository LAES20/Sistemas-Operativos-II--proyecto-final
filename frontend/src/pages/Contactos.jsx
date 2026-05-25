import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, BarChart3 } from 'lucide-react';
import TarjetaContacto from '../components/TarjetaContacto';
import { contactoService } from '../services/contactoService';
import { useAuthStore, useContactoStore, useUIStore } from '../store/store';

export default function Contactos() {
  const navigate = useNavigate();
  const { usuario } = useAuthStore();
  const { mostrarNotificacion } = useUIStore();
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [contactosFiltrados, setContactosFiltrados] = useState([]);

  useEffect(() => {
    cargarContactos();
  }, []);

  useEffect(() => {
    if (busqueda.trim()) {
      setContactosFiltrados(
        contactos.filter(c =>
          c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          c.telefono.includes(busqueda) ||
          (c.email && c.email.toLowerCase().includes(busqueda.toLowerCase()))
        )
      );
    } else {
      setContactosFiltrados(contactos);
    }
  }, [busqueda, contactos]);

  const cargarContactos = async () => {
    try {
      setCargando(true);
      const response = await contactoService.listarContactos();
      setContactos(response.data);
    } catch (error) {
      mostrarNotificacion('Error al cargar contactos', 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleAgregar = () => {
    navigate('/contactos/nuevo');
  };

  const handleEditar = (id) => {
    navigate(`/contactos/${id}/editar`);
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
      try {
        await contactoService.eliminarContacto(id);
        setContactos(contactos.filter(c => c.id !== id));
        mostrarNotificacion('Contacto eliminado', 'success');
      } catch (error) {
        mostrarNotificacion('Error al eliminar contacto', 'error');
      }
    }
  };

  const handleFavorito = async (id) => {
    try {
      const response = await contactoService.toggleFavorito(id);
      const actualizados = contactos.map(c =>
        c.id === id ? response.data.contacto : c
      );
      setContactos(actualizados);
    } catch (error) {
      mostrarNotificacion('Error al actualizar favorito', 'error');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Mis Contactos</h1>

        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleAgregar}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition flex items-center gap-2"
          >
            <Plus size={20} />
            Agregar Contacto
          </button>
        </div>
      </motion.div>

      {cargando ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : contactosFiltrados.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-gray-500 text-lg">
            {busqueda ? 'No se encontraron contactos' : 'No tienes contactos aún'}
          </p>
          {!busqueda && (
            <button
              onClick={handleAgregar}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Crear tu primer contacto
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {contactosFiltrados.map(contacto => (
            <TarjetaContacto
              key={contacto.id}
              contacto={contacto}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
              onFavorito={handleFavorito}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

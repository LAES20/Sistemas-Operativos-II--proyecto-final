import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, RotateCcw } from 'lucide-react';
import { usuarioService } from '../services/usuarioService';
import { useUIStore } from '../store/store';

export default function Papelera() {
  const [papelera, setPapelera] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { mostrarNotificacion } = useUIStore();

  useEffect(() => {
    cargarPapelera();
  }, []);

  const cargarPapelera = async () => {
    try {
      setCargando(true);
      const response = await usuarioService.obtenerPapelera();
      setPapelera(response.data);
    } catch (error) {
      mostrarNotificacion('Error al cargar papelera', 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleRestaurar = async (id) => {
    try {
      await usuarioService.restaurarContacto(id);
      setPapelera(papelera.filter(item => item.id !== id));
      mostrarNotificacion('Contacto restaurado', 'success');
    } catch (error) {
      mostrarNotificacion('Error al restaurar contacto', 'error');
    }
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar permanentemente este contacto?')) {
      try {
        await usuarioService.eliminarPermanentemente(id);
        setPapelera(papelera.filter(item => item.id !== id));
        mostrarNotificacion('Contacto eliminado permanentemente', 'success');
      } catch (error) {
        mostrarNotificacion('Error al eliminar contacto', 'error');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Papelera</h1>
        <p className="text-gray-600">Contactos eliminados (se borran automáticamente en 30 días)</p>
      </motion.div>

      {cargando ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : papelera.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Trash2 size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Tu papelera está vacía</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {papelera.map(item => {
            // Manejar ambos casos: string JSON o objeto
            let contacto = {};
            if (typeof item.datos_contacto === 'string') {
              contacto = JSON.parse(item.datos_contacto || '{}');
            } else {
              contacto = item.datos_contacto || {};
            }
            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{contacto.nombre}</h3>
                  <p className="text-gray-600 text-sm">📱 {contacto.telefono}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Eliminado: {new Date(item.fecha_eliminacion).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestaurar(item.id)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-4 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    <RotateCcw size={18} />
                    Restaurar
                  </button>
                  <button
                    onClick={() => handleEliminar(item.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

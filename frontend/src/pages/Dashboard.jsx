import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, Heart, TrendingUp } from 'lucide-react';
import { contactoService } from '../services/contactoService';
import { useUIStore } from '../store/store';

export default function Dashboard() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { mostrarNotificacion, darkMode } = useUIStore();

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const response = await contactoService.obtenerEstadisticas();
      setEstadisticas(response.data);
    } catch (error) {
      mostrarNotificacion('Error al cargar estadísticas', 'error');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  const tarjetas = [
    {
      titulo: 'Total de Contactos',
      valor: estadisticas?.totalContactos || 0,
      icono: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      titulo: 'Contactos Favoritos',
      valor: estadisticas?.totalFavoritos || 0,
      icono: Heart,
      color: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Resumen de tu agenda de contactos</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {tarjetas.map((tarjeta, index) => {
          const Icon = tarjeta.icono;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${tarjeta.color} text-white p-6 rounded-lg shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">{tarjeta.titulo}</p>
                  <h2 className="text-4xl font-bold mt-2">{tarjeta.valor}</h2>
                </div>
                <Icon size={48} className="opacity-50" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Información General</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>📊 Tienes un total de <strong>{estadisticas?.totalContactos}</strong> contactos en tu agenda</p>
          <p>❤️ Has marcado <strong>{estadisticas?.totalFavoritos}</strong> contacto(s) como favorito(s)</p>
          <p>🎯 Mantén organizados tus contactos por categorías para un mejor acceso</p>
        </div>
      </motion.div>
    </div>
  );
}

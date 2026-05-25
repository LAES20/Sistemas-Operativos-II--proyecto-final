import { motion } from 'framer-motion';
import { useUIStore } from '../store/store';

export default function Notificacion() {
  const { notificacion } = useUIStore();

  if (!notificacion) return null;

  const colores = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  return (
    <motion.div
      initial={{ translateY: -100, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      exit={{ translateY: -100, opacity: 0 }}
      className={`fixed top-4 right-4 ${colores[notificacion.tipo] || colores.info} text-white px-6 py-3 rounded-lg shadow-lg z-50`}
    >
      {notificacion.mensaje}
    </motion.div>
  );
}

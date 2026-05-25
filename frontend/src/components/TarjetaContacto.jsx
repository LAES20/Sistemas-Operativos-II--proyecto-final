import { motion } from 'framer-motion';
import { Trash2, Heart, Edit2 } from 'lucide-react';
import { obtenerIniciales, generarColorPorNombre } from '../utils/helpers';

export default function TarjetaContacto({ contacto, onEditar, onEliminar, onFavorito }) {
  const color = generarColorPorNombre(contacto.nombre);

  return (
    <motion.div
      whileHover={{ translateY: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
    >
      {contacto.imagen_url ? (
        <img
          src={contacto.imagen_url}
          alt={contacto.nombre}
          className="w-full h-36 md:h-48 object-cover"
        />
      ) : (
        <div
          className="w-full h-36 md:h-48 flex items-center justify-center text-white text-2xl md:text-3xl font-bold"
          style={{ backgroundColor: color }}
        >
          {obtenerIniciales(contacto.nombre)}
        </div>
      )}

      <div className="p-3 md:p-4">
        <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-2 truncate">{contacto.nombre}</h3>

        <div className="space-y-1 mb-4 text-xs md:text-sm">
          <p className="text-gray-600 dark:text-gray-400">📱 {contacto.telefono}</p>
          {contacto.email && <p className="text-gray-600 dark:text-gray-400">✉️ {contacto.email}</p>}
          {contacto.categoria_nombre && (
            <div className="flex items-center gap-2 mt-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: contacto.color }}
              ></span>
              <span className="text-gray-600 dark:text-gray-400 text-xs">{contacto.categoria_nombre}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-between">
          <button
            onClick={() => onFavorito(contacto.id)}
            className="flex-1 bg-pink-100 hover:bg-pink-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-pink-600 dark:text-pink-400 py-1.5 md:py-2 rounded-lg transition flex items-center justify-center gap-1"
            title="Favorito"
          >
            <Heart size={16} fill={contacto.favorito ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => onEditar(contacto.id)}
            className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 py-1.5 md:py-2 rounded-lg transition flex items-center justify-center gap-1"
            title="Editar"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onEliminar(contacto.id)}
            className="flex-1 bg-red-100 hover:bg-red-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 py-1.5 md:py-2 rounded-lg transition flex items-center justify-center gap-1"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

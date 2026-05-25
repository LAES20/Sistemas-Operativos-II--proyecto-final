import { motion } from 'framer-motion';
import { Trash2, Heart, Edit2 } from 'lucide-react';
import { obtenerIniciales, generarColorPorNombre } from '../utils/helpers';

export default function TarjetaContacto({ contacto, onEditar, onEliminar, onFavorito }) {
  const color = generarColorPorNombre(contacto.nombre);

  return (
    <motion.div
      whileHover={{ translateY: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
    >
      {contacto.imagen_url ? (
        <img
          src={contacto.imagen_url}
          alt={contacto.nombre}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div
          className="w-full h-48 flex items-center justify-center text-white text-3xl font-bold"
          style={{ backgroundColor: color }}
        >
          {obtenerIniciales(contacto.nombre)}
        </div>
      )}

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{contacto.nombre}</h3>

        <div className="space-y-1 mb-4 text-sm">
          <p className="text-gray-600">📱 {contacto.telefono}</p>
          {contacto.email && <p className="text-gray-600">✉️ {contacto.email}</p>}
          {contacto.categoria_nombre && (
            <div className="flex items-center gap-2 mt-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: contacto.color }}
              ></span>
              <span className="text-gray-600 text-xs">{contacto.categoria_nombre}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-between">
          <button
            onClick={() => onFavorito(contacto.id)}
            className="flex-1 bg-pink-100 hover:bg-pink-200 text-pink-600 py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Heart size={18} fill={contacto.favorito ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => onEditar(contacto.id)}
            className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-600 py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onEliminar(contacto.id)}
            className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

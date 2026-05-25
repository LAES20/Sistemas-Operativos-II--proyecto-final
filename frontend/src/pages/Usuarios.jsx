import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Shield, User } from 'lucide-react';
import { usuarioService } from '../services/usuarioService';
import { useUIStore, useAuthStore } from '../store/store';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [nuevoRol, setNuevoRol] = useState('Usuario estándar');
  const { mostrarNotificacion } = useUIStore();
  const { usuario: usuarioActual } = useAuthStore();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const response = await usuarioService.obtenerUsuarios();
      setUsuarios(response.data);
    } catch (error) {
      mostrarNotificacion('Error al cargar usuarios (requiere permisos de admin)', 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleCambiarRol = async (id) => {
    if (id === usuarioActual?.id) {
      mostrarNotificacion('No puedes cambiar tu propio rol', 'error');
      return;
    }

    try {
      await usuarioService.cambiarRol(id, nuevoRol);
      mostrarNotificacion('Rol actualizado', 'success');
      setEditando(null);
      cargarUsuarios();
    } catch (error) {
      mostrarNotificacion('Error al cambiar rol', 'error');
    }
  };

  const handleEliminar = async (id) => {
    if (id === usuarioActual?.id) {
      mostrarNotificacion('No puedes eliminar tu propia cuenta', 'error');
      return;
    }

    if (confirm('¿Desactivar este usuario?')) {
      try {
        await usuarioService.desactivarUsuario(id);
        mostrarNotificacion('Usuario desactivado', 'success');
        cargarUsuarios();
      } catch (error) {
        mostrarNotificacion('Error al desactivar usuario', 'error');
      }
    }
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
        <h1 className="text-4xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p className="text-gray-600 mt-2">Administra roles y permisos de usuarios</p>
      </motion.div>

      {usuarios.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <User size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No hay usuarios para mostrar</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rol</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {user.nombre.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{user.nombre}</span>
                      {user.id === usuarioActual?.id && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Tú</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    {editando?.id === user.id ? (
                      <select
                        value={nuevoRol}
                        onChange={(e) => setNuevoRol(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg"
                      >
                        <option value="Usuario estándar">Usuario estándar</option>
                        <option value="Administrador">Administrador</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        {user.rol === 'Administrador' ? (
                          <>
                            <Shield size={18} className="text-orange-500" />
                            <span className="text-orange-600 font-medium">Administrador</span>
                          </>
                        ) : (
                          <span className="text-gray-600">Usuario estándar</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {editando?.id === user.id ? (
                        <>
                          <button
                            onClick={() => handleCambiarRol(user.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditando(null)}
                            className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-400 transition"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditando(user);
                              setNuevoRol(user.rol);
                            }}
                            disabled={user.id === usuarioActual?.id}
                            className="text-blue-500 hover:text-blue-700 disabled:text-gray-400"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleEliminar(user.id)}
                            disabled={user.id === usuarioActual?.id}
                            className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}

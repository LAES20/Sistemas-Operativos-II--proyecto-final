import { motion } from 'framer-motion';
import { Info, Code, Users, Database } from 'lucide-react';

export default function Ayuda() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Acerca de Agenda de Contactos</h1>
      </motion.div>

      {/* Logo y título principal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg p-8 mb-8 text-center"
      >
        <div className="text-6xl mb-4">📇</div>
        <h2 className="text-3xl font-bold mb-2">ContactosPro</h2>
        <p className="text-lg opacity-90">Tu agenda digital inteligente</p>
      </motion.div>

      {/* Información de versión */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Info size={24} className="text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900">Información de Versión</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Versión</span>
            <span className="font-semibold text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Fecha de lanzamiento</span>
            <span className="font-semibold text-gray-900">22 de mayo de 2026</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Estado</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded font-semibold">Producción</span>
          </div>
        </div>
      </motion.div>

      {/* Características */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Code size={24} className="text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900">Características</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <span className="text-blue-500 text-xl">✓</span>
            <div>
              <p className="font-semibold text-gray-900">Gestión de Contactos</p>
              <p className="text-gray-600 text-sm">Crear, editar, eliminar y buscar contactos</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-500 text-xl">✓</span>
            <div>
              <p className="font-semibold text-gray-900">Categorización</p>
              <p className="text-gray-600 text-sm">Organiza contactos por categorías personalizadas</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-500 text-xl">✓</span>
            <div>
              <p className="font-semibold text-gray-900">Favoritos</p>
              <p className="text-gray-600 text-sm">Marca contactos importantes como favoritos</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-500 text-xl">✓</span>
            <div>
              <p className="font-semibold text-gray-900">Papelera de Reciclaje</p>
              <p className="text-gray-600 text-sm">Recupera contactos eliminados hasta 30 días</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-500 text-xl">✓</span>
            <div>
              <p className="font-semibold text-gray-900">Dashboard</p>
              <p className="text-gray-600 text-sm">Visualiza estadísticas de tus contactos</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-500 text-xl">✓</span>
            <div>
              <p className="font-semibold text-gray-900">Seguridad</p>
              <p className="text-gray-600 text-sm">Autenticación JWT y encriptación de datos</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stack Tecnológico */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Code size={24} className="text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900">Stack Tecnológico</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Frontend</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• React 18.2.0</li>
              <li>• Vite 5.4.21</li>
              <li>• React Router v6</li>
              <li>• Tailwind CSS 3.3.6</li>
              <li>• Zustand 4.4.0</li>
              <li>• Framer Motion</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Backend</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• Node.js + Express.js</li>
              <li>• MySQL 8.4.7</li>
              <li>• JWT para autenticación</li>
              <li>• Bcryptjs para seguridad</li>
              <li>• PM2 para process management</li>
              <li>• Multer para upload de archivos</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Base de datos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Database size={24} className="text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900">Base de Datos</h2>
        </div>

        <div className="space-y-3 text-gray-600 mb-4">
          <p>
            <span className="font-semibold text-gray-900">Normalización:</span> 3ª Forma Normal (3FN)
          </p>
          <p>
            <span className="font-semibold text-gray-900">Tablas:</span> 9 tablas relacionales con integridad referencial
          </p>
        </div>

        <div className="bg-gray-50 rounded p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">Tablas del sistema:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• usuarios - Gestión de cuentas de usuario</li>
            <li>• categorias - Categorías predefinidas y personalizadas</li>
            <li>• contactos - Información de contactos</li>
            <li>• etiquetas - Etiquetas para contactos</li>
            <li>• bitacora_auditoria - Registro completo de acciones</li>
            <li>• papelera_contactos - Contactos eliminados (soft-delete)</li>
            <li>• respaldos - Registro de backups</li>
            <li>• intentos_login_fallidos - Control de seguridad</li>
            <li>• migraciones_ejecutadas - Control de versiones DB</li>
          </ul>
        </div>
      </motion.div>

      {/* Equipo de desarrollo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Users size={24} className="text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900">Créditos</h2>
        </div>

        <p className="text-gray-600 mb-4">
          <span className="font-semibold text-gray-900">Sistema Operativo:</span> Linux
        </p>

        <p className="text-gray-600 mb-4">
          <span className="font-semibold text-gray-900">Servidor Web:</span> Apache
        </p>

        <p className="text-gray-600">
          <span className="font-semibold text-gray-900">Desarrollador:</span> Sistema de Agenda de Contactos v1.0
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center mt-12 text-gray-500 text-sm"
      >
        <p>© 2026 ContactosPro. Todos los derechos reservados.</p>
      </motion.div>
    </div>
  );
}

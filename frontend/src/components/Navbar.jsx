import { useNavigate } from 'react-router-dom';
import { LogOut, Moon, Sun, BarChart3, Trash2, Menu, X, Home, Users, Layers, HelpCircle } from 'lucide-react';
import { useAuthStore, useUIStore } from '../store/store';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useUIStore();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icono: Home, label: 'Contactos', ruta: '/contactos' },
    { icono: Layers, label: 'Categorías', ruta: '/categorias' },
    { icono: Users, label: 'Usuarios', ruta: '/usuarios' },
    { icono: HelpCircle, label: 'Ayuda', ruta: '/ayuda' }
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-md sticky top-0 z-40`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm sm:text-lg">📇</span>
          </div>
          <h1 className={`text-lg sm:text-2xl font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ContactosPro
          </h1>
        </div>

        {usuario && (
          <div className="flex items-center gap-1 sm:gap-3">
            <span className={`text-xs sm:text-sm font-medium hidden md:block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {usuario.nombre}
            </span>

            {/* Menú horizontal para desktop */}
            <div className="hidden md:flex items-center gap-1">
              {menuItems.map(item => {
                const Icon = item.icono;
                return (
                  <button
                    key={item.ruta}
                    onClick={() => navigate(item.ruta)}
                    className={`p-1.5 rounded-lg transition ${
                      darkMode
                        ? 'hover:bg-gray-800 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    title={item.label}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              title="Dashboard"
            >
              <BarChart3 className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={18} />
            </button>

            <button
              onClick={() => navigate('/papelera')}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              title="Papelera"
            >
              <Trash2 className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={18} />
            </button>

            {/* Menú móvil */}
            <div className="md:hidden flex items-center gap-1">
              <button
                onClick={toggleDarkMode}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                {darkMode ? (
                  <Sun className="text-yellow-400" size={18} />
                ) : (
                  <Moon className="text-gray-600" size={18} />
                )}
              </button>
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                {menuAbierto ? (
                  <X className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={18} />
                ) : (
                  <Menu className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={18} />
                )}
              </button>
            </div>

            <button
              onClick={toggleDarkMode}
              className="hidden md:block p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              {darkMode ? (
                <Sun className="text-yellow-400" size={18} />
              ) : (
                <Moon className="text-gray-600" size={18} />
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg transition text-sm sm:text-base"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        )}
      </div>

      {/* Menú móvil desplegable */}
      {menuAbierto && usuario && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t md:hidden`}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            <span className={`px-4 py-2 text-sm font-medium block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {usuario.nombre}
            </span>
            {menuItems.map(item => {
              const Icon = item.icono;
              return (
                <button
                  key={item.ruta}
                  onClick={() => {
                    navigate(item.ruta);
                    setMenuAbierto(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    darkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-white text-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 space-y-2">
               <button
                onClick={() => {
                  navigate('/dashboard');
                  setMenuAbierto(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  darkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-white text-gray-700'
                }`}
              >
                <BarChart3 size={20} />
                Dashboard
              </button>
              <button
                onClick={() => {
                  navigate('/papelera');
                  setMenuAbierto(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  darkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-white text-gray-700'
                }`}
              >
                <Trash2 size={20} />
                Papelera
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

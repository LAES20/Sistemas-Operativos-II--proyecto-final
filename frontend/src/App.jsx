import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from './store/store';
import Navbar from './components/Navbar';
import Notificacion from './components/Notificacion';
import Login from './pages/Login';
import Contactos from './pages/Contactos';
import NuevoContacto from './pages/NuevoContacto';
import Dashboard from './pages/Dashboard';
import Papelera from './pages/Papelera';
import Categorias from './pages/Categorias';
import Usuarios from './pages/Usuarios';
import Ayuda from './pages/Ayuda';
import CambiarContrasena from './pages/CambiarContrasena';
import './index.css';

function ProtectedRoute({ element }) {
  const { token } = useAuthStore();
  return token ? element : <Navigate to="/login" />;
}

export default function App() {
  const { token } = useAuthStore();
  const { darkMode } = useUIStore();

  return (
    <Router>
      <div className={darkMode ? 'dark bg-gray-950 text-white' : 'bg-white text-gray-900'}>
        {token && <Navbar />}
        <Notificacion />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />
          <Route path="/contactos" element={<ProtectedRoute element={<Contactos />} />} />
          <Route path="/contactos/nuevo" element={<ProtectedRoute element={<NuevoContacto />} />} />
          <Route path="/contactos/:id/editar" element={<ProtectedRoute element={<NuevoContacto />} />} />
          <Route path="/categorias" element={<ProtectedRoute element={<Categorias />} />} />
          <Route path="/usuarios" element={<ProtectedRoute element={<Usuarios />} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/papelera" element={<ProtectedRoute element={<Papelera />} />} />
          <Route path="/ayuda" element={<ProtectedRoute element={<Ayuda />} />} />
          <Route path="/" element={token ? <Navigate to="/contactos" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

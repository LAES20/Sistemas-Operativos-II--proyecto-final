import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import contactoRoutes from './routes/contactoRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

// Crear carpeta uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Servir frontend estático
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
}

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/contactos', contactoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SPA fallback - cualquier ruta no encontrada en /api, retorna index.html para React Router
app.get('*', (req, res) => {
  const indexPath = path.join(frontendDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Ruta no encontrada' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     AGENDA DE CONTACTOS - BACKEND EN EJECUCIÓN             ║
╚════════════════════════════════════════════════════════════╝
🚀 Servidor ejecutándose en: http://localhost:${PORT}
📡 Ambiente: ${process.env.NODE_ENV || 'development'}
🗄️  Base de datos: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}
💾 Base de datos: ${process.env.DB_NAME || 'agenda_contactos'}
  `);
});

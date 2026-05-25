import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import * as authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = express.Router();

// Configurar multer para descargas de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Rutas públicas
router.post('/registro', authController.registro);
router.post('/login', authController.login);
router.post('/recuperar/pregunta', authController.verificarPreguntaSecreta);
router.post('/recuperar/verificar', authController.recuperarContrasena);
router.post('/recuperar/cambiar-contrasena', authController.cambiarContrasenaRecuperacion);

// Rutas protegidas
router.get('/perfil', authMiddleware, authController.obtenerPerfil);
router.put('/perfil', authMiddleware, authController.actualizarPerfil);
router.post('/cambiar-contrasena', authMiddleware, authController.cambiarContrasena);

export default router;

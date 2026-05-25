import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import * as contactoController from '../controllers/contactoController.js';
import { authMiddleware } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = express.Router();

// Configurar multer
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

// Todas las rutas de contactos requieren autenticación
router.use(authMiddleware);

router.post('/', upload.single('imagen'), contactoController.agregarContacto);
router.get('/', contactoController.listarContactos);
router.get('/buscar', contactoController.buscarContactos);
router.get('/favoritos', contactoController.obtenerFavoritos);
router.get('/estadisticas', contactoController.obtenerEstadisticas);
router.get('/:id', contactoController.obtenerContactoPorId);
router.put('/:id', upload.single('imagen'), contactoController.editarContacto);
router.delete('/:id', contactoController.eliminarContacto);
router.patch('/:id/favorito', contactoController.toggleFavorito);
router.get('/categoria/:categoriaId', contactoController.obtenerContactosPorCategoria);

export default router;

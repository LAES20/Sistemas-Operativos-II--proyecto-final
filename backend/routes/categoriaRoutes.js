import express from 'express';
import * as categoriaController from '../controllers/categoriaController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', categoriaController.crearCategoria);
router.get('/', categoriaController.obtenerCategorias);
router.put('/:id', categoriaController.actualizarCategoria);
router.delete('/:id', categoriaController.eliminarCategoria);

export default router;

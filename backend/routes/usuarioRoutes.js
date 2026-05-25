import express from 'express';
import * as usuarioController from '../controllers/usuarioController.js';
import * as papeleraController from '../controllers/papeleraController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

// Rutas de administración (solo para administradores)
router.get('/admin/usuarios', adminMiddleware, usuarioController.obtenerTodosLosUsuarios);
router.put('/admin/usuarios/:id/rol', adminMiddleware, usuarioController.cambiarRol);
router.delete('/admin/usuarios/:id', adminMiddleware, usuarioController.desactivarUsuario);
router.get('/admin/bitacora', adminMiddleware, usuarioController.obtenerBitacoraCompleta);

// Rutas de bitácora del usuario
router.get('/bitacora', usuarioController.obtenerBitacora);

// Rutas de papelera
router.get('/papelera', papeleraController.obtenerPapelera);
router.post('/papelera/:id/restaurar', papeleraController.restaurarContacto);
router.delete('/papelera/:id', papeleraController.eliminarPermanentemente);

export default router;

import { verifyToken } from '../utils/jwt.js';

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  req.userId = decoded.userId;
  req.userRole = decoded.role;
  next();
}

export function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.userRole !== 'Administrador') {
      return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador' });
    }
    next();
  });
}

export default { authMiddleware, adminMiddleware };

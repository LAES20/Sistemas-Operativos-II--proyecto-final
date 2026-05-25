# Sistemas Operativos II - Proyecto Final: Agenda de Contactos Web

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)

Sistema completo de gestión de agenda de contactos con interfaz web moderna, autenticación JWT, base de datos normalizada en 3FN y múltiples funcionalidades avanzadas.

## 📋 Requisitos

### Software Requerido
- **Node.js** v18.0 o superior
- **npm** v9.0 o superior (viene con Node.js)
- **MySQL** v8.0 o superior
- **Git**

### Sistema Operativo Compatible
- Linux (Ubuntu, Debian, CentOS, PyPy Linux, Fedora)
- macOS
- Windows (con WSL2 recomendado)

## 🚀 Instalación Rápida

### 1. Clonar el Repositorio

```bash
git clone https://github.com/LAES18/Sistemas-Operativos-II---Proyecto-final.git
cd Sistemas-Operativos-II---Proyecto-final
```

### 2. Configurar Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus valores de BD
nano .env
```

### 3. Configurar Base de Datos

```bash
# Acceder a MySQL
mysql -u root -p

# Crear la base de datos
CREATE DATABASE IF NOT EXISTS agenda_contactos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

### 4. Configurar Frontend

```bash
cd ../frontend
npm install
npm run build
```

### 5. Ejecutar

```bash
# Backend
cd ../backend
npm start

# O con PM2 para producción
npm install -g pm2
pm2 start server.js --name "agenda-contactos"
pm2 save
```

La app estará en `http://localhost:5000`

## 📦 Stack Tecnológico

### Frontend
- **React** 18.2.0
- **Vite** 5.4.21
- **Tailwind CSS** 3.3.6
- **React Router** 6.16.0
- **Zustand** 4.4.0
- **Axios** 1.6.0

### Backend
- **Node.js** 18.19.1
- **Express.js** 4.18.2
- **MySQL** 8.0+
- **JWT** Authentication
- **Bcryptjs** Password hashing

## ✅ Funcionalidades (5 Módulos + 8 Distintivas)

### Módulos Completos
1. ✅ **Seguridad y Autenticación** (9/9 requisitos)
2. ✅ **Gestión de Contactos** (6/6 requisitos)
3. ✅ **Gestión de Categorías** (8/8 requisitos)
4. ✅ **Mantenimiento de Usuarios** (4/4 requisitos)
5. ✅ **Ayuda/Información** (5/5 requisitos)

### Funcionalidades Distintivas
- 📋 Bitácora de Auditoría
- 🗑️ Papelera de Reciclaje (soft-delete 30 días)
- 📊 Dashboard con Estadísticas
- ❤️ Sistema de Favoritos
- 🔔 Notificaciones Toast
- 🌓 Dark/Light Mode
- 🔍 Búsqueda en Tiempo Real
- 📱 Responsive Design

## 🗄️ Base de Datos (3FN)

Normalización completa en Tercera Forma Normal con 9 tablas:

```
usuarios | categorias | contactos | etiquetas
bitacora_auditoria | papelera_contactos
respaldos | intentos_login_fallidos | migraciones_ejecutadas
```

## 🔐 Seguridad

✅ JWT Authentication (24h)
✅ Bcryptjs hashing (10 rounds)
✅ CORS protection
✅ Rate limiting (5 intentos = 30 min bloqueado)
✅ SQL injection prevention
✅ XSS protection

## 📊 Cumplimiento

- ✅ 5 módulos: 100% completados
- ✅ 8+ funcionalidades distintivas
- ✅ Base de datos 3FN
- ✅ Autenticación JWT + Bcryptjs
- ✅ Interfaz responsive
- ✅ Documentación completa
- ✅ 99%+ requisitos académicos

## 🧪 Credenciales de Prueba

```
Email: test@example.com
Contraseña: password123456
Pregunta: ¿Cuál es tu comida favorita?
Respuesta: Pizza
```

## 📖 Documentación

- [CONFIGURACION_24_7.md](./CONFIGURACION_24_7.md) - Operación 24/7
- [VERIFICACION_CUMPLIMIENTO.md](./VERIFICACION_CUMPLIMIENTO.md) - Requisitos

## 🐛 Troubleshooting

```bash
# Puerto en uso
lsof -i :5000 && kill -9 <PID>

# MySQL no conecta
sudo systemctl restart mysql

# Frontend no compila
cd frontend && rm -rf node_modules && npm install && npm run build
```

## 📝 Notas de Seguridad

⚠️ **IMPORTANTE**: 
- Cambiar credenciales por defecto en .env
- Usar contraseñas seguras
- No subir .env a repositorios públicos
- Configurar CORS según tu dominio
- Usar HTTPS en producción

## 📝 Licencia

MIT License - 2026

## ✅ Estado

**Production Ready** - Testeado en Linux (Ubuntu, Debian, CentOS, PyPy)

---

**Última actualización**: Mayo 2026 | **Versión**: 1.0.0
# Sistemas-Operativos-II--proyecto-final

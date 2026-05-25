# 📚 Índice del Proyecto - Agenda de Contactos

## 📂 Estructura de Carpetas

```
Proyecto SO II/
│
├── 📄 README.md                        ← Documentación principal
├── 📄 QUICK_START.md                   ← Inicio rápido (5 min)
├── 📄 DATABASE_NORMALIZATION.md        ← Explicación 3FN
├── 📄 DISTINTIVOS.md                   ← Funcionalidades extras
├── 📄 REQUISITOS_CUMPLIDOS.md          ← Checklist de requisitos
├── 📄 ESTRUCTURA.md                    ← Este archivo
├── 🔧 install.sh                       ← Script de instalación
├── 🔧 setup.sh                         ← Script de configuración
│
├── 📁 backend/                         ← Servidor Express.js
│   ├── 📁 config/
│   │   └── database.js                 ← Conexión MySQL
│   │
│   ├── 📁 controllers/
│   │   ├── authController.js           ← Autenticación
│   │   ├── contactoController.js       ← Gestión de contactos
│   │   ├── categoriaController.js      ← Categorías
│   │   ├── usuarioController.js        ← Usuarios (Admin)
│   │   └── papeleraController.js       ← Papelera de reciclaje
│   │
│   ├── 📁 middleware/
│   │   └── auth.js                     ← Protección de rutas
│   │
│   ├── 📁 models/
│   │   ├── Usuario.js                  ← Modelo de usuarios
│   │   ├── Contacto.js                 ← Modelo de contactos
│   │   ├── Categoria.js                ← Modelo de categorías
│   │   ├── Auditoria.js                ← Bitácora
│   │   └── Papelera.js                 ← Papelera
│   │
│   ├── 📁 migrations/
│   │   ├── migrations.js               ← Definición de tablas
│   │   └── runMigrations.js            ← Ejecutor de migraciones
│   │
│   ├── 📁 routes/
│   │   ├── authRoutes.js               ← Rutas de auth
│   │   ├── contactoRoutes.js           ← Rutas de contactos
│   │   ├── categoriaRoutes.js          ← Rutas de categorías
│   │   └── usuarioRoutes.js            ← Rutas de usuarios
│   │
│   ├── 📁 utils/
│   │   ├── jwt.js                      ← Manejo de JWT
│   │   └── password.js                 ← Encriptación de contraseñas
│   │
│   ├── 📁 uploads/                     ← Imágenes de contactos
│   │   └── (vacío - se crea dinámicamente)
│   │
│   ├── 📄 package.json                 ← Dependencias backend
│   ├── 📄 .env.example                 ← Variables de entorno (ejemplo)
│   ├── 📄 .gitignore                   ← Archivos ignorados
│   └── server.js                       ← Punto de entrada
│
└── 📁 frontend/                        ← React + Vite
    ├── 📁 src/
    │   ├── 📁 components/
    │   │   ├── Navbar.jsx              ← Barra de navegación
    │   │   ├── Notificacion.jsx        ← Sistema de notificaciones
    │   │   ├── InputPassword.jsx       ← Input con toggle password
    │   │   ├── Modal.jsx               ← Modal reutilizable
    │   │   └── TarjetaContacto.jsx     ← Tarjeta de contacto
    │   │
    │   ├── 📁 pages/
    │   │   ├── Login.jsx               ← Página de login/registro
    │   │   ├── Contactos.jsx           ← Página de contactos
    │   │   ├── Dashboard.jsx           ← Dashboard con estadísticas
    │   │   └── Papelera.jsx            ← Papelera de reciclaje
    │   │
    │   ├── 📁 services/
    │   │   ├── api.js                  ← Cliente Axios configurado
    │   │   ├── authService.js          ← Servicios de autenticación
    │   │   ├── contactoService.js      ← Servicios de contactos
    │   │   ├── categoriaService.js     ← Servicios de categorías
    │   │   └── usuarioService.js       ← Servicios de usuarios
    │   │
    │   ├── 📁 store/
    │   │   └── store.js                ← Estado global (Zustand)
    │   │
    │   ├── 📁 utils/
    │   │   ├── validaciones.js         ← Funciones de validación
    │   │   └── helpers.js              ← Funciones auxiliares
    │   │
    │   ├── App.jsx                     ← Componente principal
    │   ├── main.jsx                    ← Punto de entrada React
    │   └── index.css                   ← Estilos globales
    │
    ├── 📄 package.json                 ← Dependencias frontend
    ├── 📄 vite.config.js               ← Configuración Vite
    ├── 📄 tailwind.config.js           ← Configuración Tailwind
    ├── 📄 postcss.config.js            ← Configuración PostCSS
    ├── 📄 .gitignore                   ← Archivos ignorados
    ├── index.html                      ← HTML principal
    └── 📄 src/index.css                ← Estilos principales
```

---

## 🗄️ Base de Datos

### Tablas Principales
- `usuarios` - Cuentas de usuario
- `contactos` - Información de contactos
- `categorias` - Categorización de contactos
- `etiquetas` - Etiquetas adicionales
- `bitacora_auditoria` - Log de acciones
- `papelera_contactos` - Contactos eliminados
- `respaldos` - Copias de seguridad
- `intentos_login_fallidos` - Intentos de login
- `migraciones_ejecutadas` - Control de migraciones

---

## 🔄 Flujo de Datos

```
Frontend (React)
    ↓
Axios Client (con interceptores)
    ↓
Backend (Express)
    ↓
Middleware (Autenticación)
    ↓
Controllers (Lógica de negocio)
    ↓
Models (Interacción con BD)
    ↓
MySQL Database
```

---

## 🚀 Scripts Disponibles

### Backend
```bash
npm run start      # Producción
npm run dev        # Desarrollo (con nodemon)
npm run migrate    # Ejecutar migraciones
```

### Frontend
```bash
npm run dev        # Desarrollo (Vite)
npm run build      # Producción
npm run preview    # Preview de build
```

### Proyecto Root
```bash
./install.sh       # Instalación automática
./setup.sh         # Configuración interactiva
```

---

## 🔐 Seguridad Implementada

| Aspecto | Implementación |
|---------|-----------------|
| **Contraseñas** | bcryptjs (10 rounds) |
| **Autenticación** | JWT (24 horas) |
| **Bloqueo** | 5 intentos = 30 min bloqueado |
| **Validación** | Frontend y Backend |
| **CORS** | Configurado |
| **SQL Injection** | Consultas parametrizadas |
| **Roles** | Admin + Usuario estándar |

---

## 📊 API Endpoints

### Autenticación
```
POST   /api/auth/registro              Registrar usuario
POST   /api/auth/login                 Iniciar sesión
GET    /api/auth/perfil                Obtener perfil
PUT    /api/auth/perfil                Actualizar perfil
POST   /api/auth/cambiar-contrasena    Cambiar contraseña
POST   /api/auth/recuperar/pregunta    Obtener pregunta secreta
POST   /api/auth/recuperar/verificar   Verificar respuesta
```

### Contactos
```
GET    /api/contactos                  Listar todos
POST   /api/contactos                  Crear contacto
GET    /api/contactos/:id              Obtener uno
PUT    /api/contactos/:id              Actualizar
DELETE /api/contactos/:id              Eliminar (papelera)
PATCH  /api/contactos/:id/favorito     Toggle favorito
GET    /api/contactos/favoritos        Listar favoritos
GET    /api/contactos/buscar           Buscar
GET    /api/contactos/categoria/:id    Por categoría
GET    /api/contactos/estadisticas     Estadísticas
```

### Categorías
```
GET    /api/categorias                 Listar todas
POST   /api/categorias                 Crear categoría
PUT    /api/categorias/:id             Actualizar
DELETE /api/categorias/:id             Eliminar
```

### Usuarios (Admin)
```
GET    /api/usuarios/admin/usuarios    Listar usuarios
PUT    /api/usuarios/admin/usuarios/:id/rol   Cambiar rol
DELETE /api/usuarios/admin/usuarios/:id       Desactivar
GET    /api/usuarios/admin/bitacora   Bitácora completa
GET    /api/usuarios/bitacora         Mi bitácora
```

### Papelera
```
GET    /api/usuarios/papelera          Listar papelera
POST   /api/usuarios/papelera/:id/restaurar   Restaurar
DELETE /api/usuarios/papelera/:id     Eliminar permanente
```

---

## 📚 Dependencias Principales

### Backend
- `express` - Framework web
- `mysql2` - Driver MySQL
- `bcryptjs` - Encriptación
- `jsonwebtoken` - JWT
- `multer` - Carga de archivos
- `cors` - CORS middleware

### Frontend
- `react` - UI framework
- `react-router-dom` - Enrutamiento
- `axios` - Cliente HTTP
- `zustand` - State management
- `tailwindcss` - Estilos
- `framer-motion` - Animaciones
- `lucide-react` - Iconos

---

## 🎨 Tecnologías Utilizadas

```
Frontend         Backend          Database
──────────────   ──────────────   ──────────
React 18         Node.js          MySQL 5.7+
Vite             Express.js       8 tablas
Tailwind CSS     bcryptjs         3FN
Zustand          JWT              JSON support
Framer Motion    Multer           Índices
Lucide React     CORS             FK Relations
React Router     Migraciones
Axios            Validaciones
```

---

## 📋 Checklist de Implementación

- ✅ Autenticación completa
- ✅ Gestión de contactos CRUD
- ✅ Categorización
- ✅ Búsqueda avanzada
- ✅ Favoritos
- ✅ Papelera de reciclaje
- ✅ Bitácora de auditoría
- ✅ Sistema de roles
- ✅ Bloqueo anti-fuerza bruta
- ✅ Encriptación de contraseñas
- ✅ Dashboard con estadísticas
- ✅ Modo oscuro
- ✅ Diseño responsive
- ✅ Base de datos 3FN
- ✅ Recuperación por pregunta secreta
- ✅ Migraciones automáticas

---

## 🆘 Archivos de Ayuda

| Archivo | Propósito |
|---------|-----------|
| README.md | Documentación completa |
| QUICK_START.md | Inicio en 5 minutos |
| DATABASE_NORMALIZATION.md | Explicación de 3FN |
| DISTINTIVOS.md | Funcionalidades extras |
| REQUISITOS_CUMPLIDOS.md | Checklist de requisitos |
| ESTRUCTURA.md | Este archivo |

---

## 🎯 Próximos Pasos

1. Lee `QUICK_START.md` para comenzar
2. Ejecuta `./setup.sh` para configuración automática
3. Inicia backend: `npm run dev` (en carpeta backend)
4. Inicia frontend: `npm run dev` (en carpeta frontend)
5. Abre http://localhost:3000

---

**Documento generado: 2026-05-21**
**Estado: LISTO PARA USAR ✅**

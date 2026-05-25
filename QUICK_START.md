# 🚀 Guía de Inicio Rápido - Agenda de Contactos

## ⚡ Instalación Rápida (5 minutos)

### Paso 1: Preparar Base de Datos

```bash
# Abre MySQL
mysql -u root -p

# Crea la base de datos (opcional, las migraciones lo hacen)
CREATE DATABASE agenda_contactos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Paso 2: Configurar Backend

```bash
cd backend

# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus valores:
# - DB_HOST: localhost
# - DB_USER: root
# - DB_PASSWORD: (tu contraseña)
# - DB_NAME: agenda_contactos
```

### Paso 3: Instalar Dependencias y Migraciones

```bash
npm install
npm run migrate
```

### Paso 4: Iniciar Backend

```bash
npm run dev
# El servidor correrá en http://localhost:5000
```

### Paso 5: Configurar Frontend

```bash
cd ../frontend
npm install
npm run dev
# Abre http://localhost:3000 en tu navegador
```

---

## 📝 Cuentas de Prueba

### Crear tu primera cuenta:
1. Haz clic en **"Registrarse"** en la pantalla de login
2. Completa los datos:
   - **Nombre**: Tu nombre
   - **Email**: tu@email.com
   - **Contraseña**: mínimo 8 caracteres
   - **Pregunta Secreta**: ¿Cuál es tu comida favorita?
   - **Respuesta**: pizza (o tu respuesta)

### Acceso Administrativo:
Por defecto, el primer usuario registrado será **Administrador**

---

## 🎯 Flujo Principal

### 1. **Login/Registro**
```
/ → Login → Registro/Recuperar contraseña
```

### 2. **Panel Principal**
```
Contactos → Dashboard/Papelera/Favoritos
```

### 3. **Gestionar Contactos**
```
Agregar → Editar → Buscar → Eliminar → Papelera
```

---

## 📱 Funciones Clave

| Función | Ruta | Descripción |
|---------|------|-------------|
| Login | `/login` | Iniciar sesión |
| Contactos | `/contactos` | Lista de todos |
| Dashboard | `/dashboard` | Estadísticas |
| Papelera | `/papelera` | Recuperar eliminados |

---

## 🔑 API Endpoints Principales

```bash
# Autenticación
POST /api/auth/login
POST /api/auth/registro
GET /api/auth/perfil
POST /api/auth/cambiar-contrasena

# Contactos
GET /api/contactos
POST /api/contactos
GET /api/contactos/buscar?termino=xxx
DELETE /api/contactos/:id

# Categorías
GET /api/categorias
POST /api/categorias
```

---

## 🐛 Solucionar Problemas

### Error: "Cannot connect to database"
```bash
# Verifica que MySQL está corriendo
sudo systemctl status mysql

# Reinicia MySQL
sudo systemctl restart mysql

# Verifica las credenciales en .env
```

### Error: "Port 3000 already in use"
```bash
# Cambia el puerto en vite.config.js
# O mata el proceso existente
lsof -i :3000
kill -9 <PID>
```

### Error en migraciones
```bash
# Borra la BD y crea una nueva
mysql -u root -p
DROP DATABASE agenda_contactos;
CREATE DATABASE agenda_contactos;

# Ejecuta migraciones nuevamente
npm run migrate
```

---

## 📚 Documentación Adicional

- 📖 [README.md](./README.md) - Documentación completa
- 🗄️ [DATABASE_NORMALIZATION.md](./DATABASE_NORMALIZATION.md) - Normalización 3FN
- 🎯 [DISTINTIVOS.md](./DISTINTIVOS.md) - Funcionalidades extras

---

## ✨ Tips Útiles

### Desarrollo
- Usa Devtools de React para debugging
- Los cambios en frontend se recargan automáticamente
- Backend necesita reiniciarse para cambios en código

### Usuarios
- Pregunta secreta debe ser memorable
- Contraseña mínimo 8 caracteres
- Email debe ser único

### Base de Datos
- Las migraciones se ejecutan una sola vez
- Los respaldos expiran a los 30 días
- Los logs están en bitacora_auditoria

---

## 🎓 Estructura del Proyecto

```
Proyecto SO II/
├── backend/
│   ├── config/         → Configuración de BD
│   ├── controllers/    → Lógica de negocio
│   ├── models/         → Interacción con BD
│   ├── routes/         → Definición de endpoints
│   ├── middleware/     → Autenticación, validación
│   ├── uploads/        → Imágenes de contactos
│   └── server.js       → Entrada principal
│
├── frontend/
│   ├── src/
│   │   ├── components/ → Componentes React
│   │   ├── pages/      → Páginas principales
│   │   ├── services/   → Llamadas a API
│   │   ├── store/      → Estado global (Zustand)
│   │   └── utils/      → Funciones auxiliares
│   └── index.html      → HTML principal
│
└── README.md           → Documentación
```

---

## 🎨 Paleta de Colores

```
Primario:      #3498db (Azul)
Secundario:    #2ecc71 (Verde)
Danger:        #e74c3c (Rojo)
Warning:       #f39c12 (Naranja)
Dark:          #2c3e50 (Gris oscuro)
Light:         #ecf0f1 (Gris claro)
```

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en la terminal
2. Verifica la conexión a MySQL
3. Borra `node_modules` y reinstala: `npm install`
4. Revisa la documentación en README.md

---

**Última actualización: 2026-05-21**

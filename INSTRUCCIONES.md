# 🚀 INSTRUCCIONES DE EJECUCIÓN - Agenda de Contactos

## ✨ Requisitos Previos

- **Node.js** v16 o superior: https://nodejs.org/
- **MySQL** 5.7 o superior: https://www.mysql.com/
- **npm** (viene con Node.js)
- **Git** (opcional, para control de versiones)

## ⚙️ Instalación (3 pasos)

### Paso 1: Instalación Automática

**Opción A: Script Linux/Mac**
```bash
cd "Proyecto SO II"
chmod +x setup.sh
./setup.sh
```

**Opción B: Instalación Manual**
```bash
# Backend
cd backend
cp .env.example .env
nano .env  # Edita con tus credenciales
npm install
npm run migrate

# Frontend
cd ../frontend
npm install
```

### Paso 2: Configurar Base de Datos (si no lo hizo automáticamente)

```bash
# Abre MySQL
mysql -u root -p

# Ejecuta (en la terminal MySQL):
CREATE DATABASE agenda_contactos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Paso 3: Iniciar Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# El servidor iniciará en http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Abre 
 en tu navegador
```

---

## 📊 Verificación de Instalación

Después de ejecutar los comandos anteriores, deberías ver:

**Backend Terminal:**
```
╔════════════════════════════════════════════════════════════╗
║     AGENDA DE CONTACTOS - BACKEND EN EJECUCIÓN             ║
╚════════════════════════════════════════════════════════════╝
🚀 Servidor ejecutándose en: http://localhost:5000
📡 Ambiente: development
🗄️  Base de datos: localhost:3306
💾 Base de datos: agenda_contactos
```

**Frontend Terminal:**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

---

## 🔐 Crear Cuenta de Prueba

1. Abre http://localhost:3000 en tu navegador
2. Haz clic en **"Registrarse"**
3. Completa los datos:
   ```
   Nombre: Tu Nombre
   Email: tu@email.com
   Contraseña: Minimo8Chars123
   Pregunta Secreta: ¿Cuál es tu color favorito?
   Respuesta: azul
   ```
4. ¡Haz clic en Registrarse!
5. ¡Bienvenido! Ya puedes empezar a agregar contactos

---

## 📱 Estructura de Carpetas Creadas

```
Proyecto SO II/
├── backend/          ← Servidor Express
├── frontend/         ← Aplicación React
├── README.md         ← Documentación
├── QUICK_START.md    ← Inicio rápido
├── setup.sh          ← Script automático
└── ... (otros archivos de documentación)
```

---

## ⚡ Comandos Útiles

### Backend
```bash
npm run dev         # Desarrollo (auto-reload)
npm run migrate     # Ejecutar migraciones
npm start           # Producción
```

### Frontend
```bash
npm run dev         # Desarrollo
npm run build       # Crear build
npm run preview     # Ver build
```

---

## 🔧 Configuración Avanzada

### Cambiar Puerto del Backend
Edita `backend/.env`:
```env
PORT=5001  # Cambiar a otro puerto
```

### Cambiar Puerto del Frontend
Edita `frontend/vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3001,  // Nuevo puerto
    ...
  }
})
```

---

## 🐛 Solucionar Problemas

### Error: "EADDRINUSE: address already in use"
```bash
# Encontrar el proceso usando el puerto
lsof -i :3000

# Matar el proceso
kill -9 <PID>
```

### Error: "Cannot connect to database"
```bash
# Verificar que MySQL está corriendo
mysql -u root -p -e "SELECT 1"

# Si no funciona, reiniciar MySQL
sudo systemctl restart mysql  # Linux
brew services restart mysql   # Mac
```

### Error: "Module not found"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Las migraciones fallan
```bash
# Verificar credenciales en .env
cat backend/.env

# Eliminar BD y recrear
mysql -u root -p -e "DROP DATABASE agenda_contactos;"
npm run migrate
```

---

## 📊 Variables de Entorno

### Backend (.env)
```env
# Servidor
PORT=5000

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=agenda_contactos

# Seguridad
JWT_SECRET=tu_secreto_super_seguro

# Ambiente
NODE_ENV=development
```

---

## 🌐 Acceso a la Aplicación

| Componente | URL | Estado |
|------------|-----|--------|
| **Frontend** | http://localhost:3000 | 🟢 Accesible |
| **Backend** | http://localhost:5000 | 🟢 API REST |
| **BD** | localhost:3306 | 🟢 MySQL |

---

## ✅ Checklist de Inicio

- [ ] Node.js instalado: `node -v`
- [ ] npm instalado: `npm -v`
- [ ] MySQL instalado: `mysql -u root -p`
- [ ] Archivo `.env` creado en backend/
- [ ] Migraciones ejecutadas: `npm run migrate`
- [ ] Backend iniciado en terminal 1
- [ ] Frontend iniciado en terminal 2
- [ ] Navegador abierto en http://localhost:3000
- [ ] Página de login visible

---

## 🚨 Requisitos del Sistema Mínimos

| Componente | Versión | Mínima |
|------------|---------|--------|
| Node.js | 18.x | 14.x |
| npm | 10.x | 6.x |
| MySQL | 8.0 | 5.7 |
| RAM | 2GB | 1GB |
| Espacio Disco | 500MB | 200MB |

---

## 📞 Ayuda Rápida

**¿Dónde está el código?**
- Backend: `backend/server.js`
- Frontend: `frontend/src/App.jsx`
- BD: Las migraciones están en `backend/migrations/`

**¿Cómo cambio algo?**
1. Backend: Edita los archivos y reinicia `npm run dev`
2. Frontend: Edita los archivos (se recarga automáticamente)

**¿Cómo veo los logs?**
1. Backend: Terminal donde ejecutaste `npm run dev`
2. Frontend: Consola del navegador (F12)
3. BD: `mysql -u root -p` y examina con SQL

---

## 🎓 Documentación Completa

Para más detalles, consulta:
- `README.md` - Documentación general
- `QUICK_START.md` - Inicio rápido
- `DATABASE_NORMALIZATION.md` - Base de datos
- `DISTINTIVOS.md` - Funcionalidades extras
- `ESTRUCTURA.md` - Estructura del proyecto

---

## 🎉 ¡Listo para Comenzar!

Una vez que todo esté corriendo:
1. Abre http://localhost:3000
2. Haz clic en "Registrarse"
3. Crea tu cuenta
4. ¡Empieza a agregar contactos!

---

**Última actualización: 2026-05-21**
**Versión: 1.0.0**

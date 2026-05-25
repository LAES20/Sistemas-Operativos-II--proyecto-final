# ⚙️ CONFIGURACIÓN 24/7 - SISTEMA DE AGENDA DE CONTACTOS

## Estado del Sistema: ✅ OPERATIVO 24/7

---

## 📊 COMPONENTES ACTIVOS

### 1️⃣ Base de Datos MySQL
- **Estado**: ✅ ACTIVO
- **Versión**: 8.4.7
- **Servicio**: mysql.service
- **Puerto**: 3306
- **Comando para verificar**:
  ```bash
  sudo systemctl status mysql
  ```

### 2️⃣ Backend Node.js + Express
- **Estado**: ✅ ACTIVO (PID: 15339)
- **Versión**: Node.js v18.19.1
- **Proceso**: PM2 (agenda-contactos-backend)
- **Puerto**: 5000
- **Health Check**:
  ```bash
  curl http://localhost:5000/api/health
  ```

### 3️⃣ Frontend React (Compilado)
- **Estado**: ✅ ACTIVO
- **Compilado**: Vite 5.4.21 (dist/)
- **Servido por**: Express.js puerto 5000
- **Acceso**: http://192.168.0.12:5000

### 4️⃣ Process Manager PM2
- **Estado**: ✅ ACTIVO
- **Modo**: Systemd integration
- **Servicio**: pm2-lester.service
- **Auto-reinicio**: ✅ HABILITADO
- **Logs**: `/home/lester/.pm2/logs/`

---

## 🔄 MECANISMOS DE CONFIABILIDAD

### A. Auto-Reinicio de Procesos
```bash
# PM2 reinicia automáticamente si el proceso falla
pm2 show agenda-contactos-backend
# Ver: "Max restarts": unlimited
```

### B. Inicio Automático en Boot
```bash
# PM2 inicia automáticamente cuando el servidor se reinicia
systemctl status pm2-lester
# Estado: "enabled" - se inicia en cada boot
```

### C. Monitoreo Continuo
```bash
# PM2 monitorea constantemente todos los procesos
pm2 monit
```

### D. Logs Persistentes
- **Error log**: `/home/lester/.pm2/logs/agenda-contactos-backend-error.log`
- **Output log**: `/home/lester/.pm2/logs/agenda-contactos-backend-out.log`
- **PID**: `/home/lester/.pm2/pids/agenda-contactos-backend-0.pid`

---

## 🚀 COMANDOS ÚTILES

### Monitoreo
```bash
# Ver estado de procesos
pm2 status
pm2 show agenda-contactos-backend

# Ver logs en tiempo real
pm2 logs agenda-contactos-backend

# Ver últimas líneas del log
pm2 logs agenda-contactos-backend --lines 50 --nostream
```

### Control del Proceso
```bash
# Reiniciar backend
pm2 restart agenda-contactos-backend

# Detener (no recomendado si está en producción)
pm2 stop agenda-contactos-backend

# Reanudar
pm2 start agenda-contactos-backend

# Ver monitoreo en vivo
pm2 monit
```

### Base de Datos
```bash
# Verificar estado de MySQL
sudo systemctl status mysql

# Reiniciar MySQL si es necesario
sudo systemctl restart mysql

# Acceder a MySQL desde CLI
mysql -u root -p -h localhost
```

---

## 📱 ACCESO AL SISTEMA

### URL Principal
```
http://192.168.0.12:5000
```

### Credenciales de Prueba
- **Email**: test@example.com
- **Contraseña**: password123456

### Rutas Disponibles
| Ruta | Descripción |
|------|-------------|
| `/login` | Página de autenticación |
| `/contactos` | Gestión de contactos |
| `/categorias` | Gestión de categorías |
| `/usuarios` | Gestión de usuarios (Admin) |
| `/dashboard` | Estadísticas |
| `/papelera` | Papelera de reciclaje |
| `/ayuda` | Información del sistema |
| `/api/health` | Health check (JSON) |

---

## 🔒 CONFIGURACIÓN DE SEGURIDAD

### Firewall
```bash
# Puerto 5000 abierto
sudo ufw status numbered
# Verifica que 5000 está en la lista

# Si necesitas abrir el puerto:
sudo ufw allow 5000/tcp
```

### Base de Datos
- **Usuario**: root
- **Contraseña**: RootPassword2026@Secure
- **Database**: agenda_contactos
- **Host**: localhost (TCP)
- **Puerto**: 3306

### Autenticación
- **JWT**: Tokens de 24 horas
- **Hash**: Bcryptjs (10 salt rounds)
- **Rate Limiting**: 5 intentos fallidos = 30 min bloqueado

---

## 🆘 TROUBLESHOOTING

### El sitio no abre
```bash
# 1. Verificar que el backend está corriendo
pm2 status

# 2. Verificar que MySQL está corriendo
sudo systemctl status mysql

# 3. Revisar logs de errores
pm2 logs agenda-contactos-backend --err

# 4. Probar health check
curl http://localhost:5000/api/health

# 5. Si no responde, reiniciar
pm2 restart agenda-contactos-backend
```

### El proceso se detiene
```bash
# Aumentar límites de archivo abierto
ulimit -n

# Ver configuración actual de PM2
pm2 show agenda-contactos-backend

# Guardar configuración después de cambios
pm2 save
```

### Problema de memoria
```bash
# Ver uso de memoria
pm2 monit

# Reiniciar si usa mucha memoria
pm2 restart agenda-contactos-backend
```

---

## 📈 ESTADÍSTICAS ACTUALES

```
Proceso: agenda-contactos-backend
Estado: online
Reinicios: 8
Uptime: 3+ horas
Memoria: ~75 MB
CPU: ~0%
Node.js: v18.19.1
PM2: v7.0.1
```

---

## 🔄 HISTORIAL DE CONFIGURACIÓN

| Fecha | Acción | Estado |
|-------|--------|--------|
| 22 May 2026 | Backend levantado | ✅ Online |
| 22 May 2026 | PM2 startup configurado | ✅ Habilitado |
| 22 May 2026 | MySQL verificado | ✅ Activo |
| 22 May 2026 | Systemd integration | ✅ Activo |

---

## ⚡ PRÓXIMAS ACCIONES RECOMENDADAS

1. ✅ **Configurar backups automáticos de base de datos**
   ```bash
   # Crear script de backup diario
   ```

2. ✅ **Monitoreo remoto de logs**
   ```bash
   # Considerar usar pm2-plus o New Relic
   ```

3. ✅ **SSL/TLS para producción**
   ```bash
   # Instalar certbot y certificados Let's Encrypt
   ```

4. ✅ **Monitoreo de recursos**
   ```bash
   # Configurar alertas si CPU/memoria excede umbrales
   ```

---

## 📞 INFORMACIÓN DE CONTACTO

**Sistema**: Agenda de Contactos v1.0.0
**Fecha de Instalación**: 22 de mayo de 2026
**Estado**: ✅ PRODUCCIÓN
**Disponibilidad**: 24/7

---

**Última verificación**: 23 de mayo de 2026, 03:11 CST
**Sistema operativo**: Linux
**Servidor**: Apache + Node.js

✅ **EL SISTEMA ESTÁ CONFIGURADO PARA OPERACIÓN CONTINUA 24/7**

# 🚀 Instrucciones para Subir a GitHub

## Opción 1: Usando Token de Acceso Personal (Recomendado)

```bash
cd "/var/www/Proyecto SO II"

# Agregar el remote de GitHub
git remote add origin https://github.com/LAES18/Sistemas-Operativos-II---Proyecto-final.git

# Hacer push a main
git push -u origin main
```

Cuando pida credenciales:
- **Usuario**: Tu usuario de GitHub
- **Contraseña**: Tu Personal Access Token (no tu contraseña)

## Opción 2: Usando SSH (Más Seguro)

Si ya tienes SSH configurado en GitHub:

```bash
cd "/var/www/Proyecto SO II"

# Usar URL SSH en lugar de HTTPS
git remote add origin git@github.com:LAES18/Sistemas-Operativos-II---Proyecto-final.git

# Hacer push
git push -u origin main
```

## Verificar Que Todo Está Correcto

Antes de hacer push, verifica:

```bash
cd "/var/www/Proyecto SO II"

# Ver archivos que se subirán
git status

# Ver commits
git log --oneline

# Ver remotes
git remote -v

# Verify que .env NO está en los archivos
git ls-files | grep "\.env$" && echo "❌ ALERTA: .env será subido!" || echo "✅ OK: .env NO será subido"
```

## Después del Push

Una vez que hayas hecho push:

1. Verifica en https://github.com/LAES18/Sistemas-Operativos-II---Proyecto-final
2. Confirma que los archivos estén todos
3. Verifica que NO hay archivos sensibles (.env, credenciales, etc.)

## Cambios Futuros

```bash
# Después de hacer cambios
git add .
git commit -m "Descripción del cambio"
git push origin main
```

## Seguridad

✅ **Protegido:**
- ✅ .env no se sube (está en .gitignore)
- ✅ node_modules no se sube
- ✅ dist/ no se sube (frontend compilado)
- ✅ Credenciales de BD no están en archivos

✅ **Incluido:**
- ✅ .env.example (para que sepan qué variables configurar)
- ✅ README.md (instrucciones de instalación)
- ✅ Código fuente completo
- ✅ Documentación de requisitos

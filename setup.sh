#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     CONFIGURADOR - AGENDA DE CONTACTOS                     ║"
echo "╚════════════════════════════════════════════════════════════╝"

echo ""
echo "📋 Este script ayudará a configurar tu ambiente"
echo ""

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js detectado: $NODE_VERSION"
else
    echo "❌ Node.js no está instalado"
    echo "📥 Descargalo desde: https://nodejs.org/"
    exit 1
fi

# Verificar npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm detectado: $NPM_VERSION"
else
    echo "❌ npm no está instalado"
    exit 1
fi

# Verificar MySQL
if command -v mysql &> /dev/null; then
    echo "✅ MySQL detectado"
else
    echo "⚠️  MySQL no está en PATH, pero podría estar instalado"
    echo "📥 Si no tienes MySQL, descargalo desde: https://www.mysql.com/"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Preguntar por credenciales de MySQL
read -p "📊 ¿Cuál es el usuario de MySQL? (default: root): " db_user
db_user=${db_user:-root}

read -sp "🔐 ¿Cuál es la contraseña de MySQL? (deja en blanco si no tiene): " db_password
echo ""

read -p "🗄️  ¿Cuál es el nombre de la BD? (default: agenda_contactos): " db_name
db_name=${db_name:-agenda_contactos}

read -p "🌍 ¿Cuál es el host de MySQL? (default: localhost): " db_host
db_host=${db_host:-localhost}

# Crear archivo .env
echo ""
echo "📝 Creando archivo .env..."

cat > backend/.env << EOF
PORT=5000
DB_HOST=$db_host
DB_PORT=3306
DB_USER=$db_user
DB_PASSWORD=$db_password
DB_NAME=$db_name
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=development
EOF

echo "✅ Archivo .env creado"

echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias del backend..."
cd backend
npm install --silent
echo "✅ Backend listo"

cd ..

echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install --silent
echo "✅ Frontend listo"

cd ..

echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Mensaje final
echo "✅ ¡Configuración completada!"
echo ""
echo "🚀 Para iniciar:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   $ cd backend"
echo "   $ npm run migrate"
echo "   $ npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   $ cd frontend"
echo "   $ npm run dev"
echo ""
echo "🌐 Luego abre: http://localhost:3000"
echo ""

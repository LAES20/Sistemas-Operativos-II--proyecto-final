#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     INSTALADOR - AGENDA DE CONTACTOS                       ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Colores para la terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

# Verificar si MySQL está instalado
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL no está instalado${NC}"
    echo "Por favor instala MySQL desde https://www.mysql.com/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js y MySQL detectados${NC}"

# Instalar dependencias del backend
echo -e "${YELLOW}📦 Instalando dependencias del backend...${NC}"
cd backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias del backend${NC}"
    exit 1
fi

# Crear archivo .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creando archivo .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Archivo .env creado (edita los valores si es necesario)${NC}"
fi

# Ejecutar migraciones
echo -e "${YELLOW}🔧 Ejecutando migraciones de base de datos...${NC}"
npm run migrate
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en las migraciones${NC}"
    exit 1
fi

cd ..

# Instalar dependencias del frontend
echo -e "${YELLOW}📦 Instalando dependencias del frontend...${NC}"
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias del frontend${NC}"
    exit 1
fi

cd ..

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     ✅ INSTALACIÓN COMPLETADA EXITOSAMENTE                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📋 PRÓXIMOS PASOS:${NC}"
echo ""
echo -e "1. ${YELLOW}Backend (Terminal 1):${NC}"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo -e "2. ${YELLOW}Frontend (Terminal 2):${NC}"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo -e "3. ${YELLOW}Abre tu navegador en:${NC}"
echo "   http://localhost:3000"
echo ""
echo -e "${YELLOW}💡 NOTA:${NC} Asegúrate de que MySQL esté corriendo correctamente"
echo ""

#!/bin/bash
# Script para actualizar y desplegar cambios en AWS EC2 automáticamente

echo "🚀 Iniciando actualización completa del sistema..."

# Ir a la raíz del proyecto
cd /home/ubuntu/Gestion_de_equipos

# 1. Sincronizar con GitHub (Omitir si no hay cambios remotos)
echo "⬇️  Sincronizando código con GitHub (rama main)..."
git fetch origin
git reset --hard origin/main

# 2. Actualizar y reiniciar el Backend
echo "📦 Actualizando dependencias y reiniciando Backend..."
cd /home/ubuntu/Gestion_de_equipos/backend
npm install --no-audit --no-fund
pm2 restart gestion-backend

# 3. Construir y desplegar el Frontend
echo "🎨 Construyendo nueva versión del Frontend..."
cd /home/ubuntu/Gestion_de_equipos/frontend
npm install --no-audit --no-fund
npm run build

echo "🌐 Actualizando archivos en Nginx (/var/www/frontend)..."
sudo rm -rf /var/www/frontend/*
sudo cp -r dist/* /var/www/frontend/

echo "--------------------------------------------------------"
echo "✅ ¡El sistema ha sido actualizado con éxito!"
echo "--------------------------------------------------------"

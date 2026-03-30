# 🛠️ Sistema de Gestión de Equipos - Guía de Desarrollador

¡Bienvenido! Este proyecto es un sistema robusto diseñado para la administración de equipos, mantenimientos, licencias y más. Esta guía está pensada para que cualquier desarrollador pueda entender y modificar el sistema de forma rápida.

---

## 🏗️ Arquitectura del Proyecto

El sistema está dividido en dos partes principales:

### 🔙 Backend (Servidor)
*   **Tecnología:** Node.js + Express.
*   **Puerto:** Corre en el puerto `4000`.
*   **Base de Datos:** MySQL.
*   **Gestión de procesos:** Usa **PM2** para mantenerse activo 24/7 en el servidor AWS.

### 🎨 Frontend (Interfaz)
*   **Tecnología:** React + Vite.
*   **Producción:** Servido por **Nginx** en la ruta física `/var/www/frontend`.

---

## 📁 Estructura Manual (Lo más importante)

```text
Gestion_de_equipos/
├── backend/                # Lógica del servidor y API
│   ├── src/
│   │   ├── models/        # Esquemas de la base de datos
│   │   ├── routes/        # Definición de rutas (/api)
│   │   └── index.js       # Punto de entrada del servidor
│   └── .env               # Configuración de BD y puertos
├── frontend/               # Interfaz de usuario
│   ├── src/
│   │   ├── components/    # Piezas visuales reutilizables
│   │   ├── pages/         # Vistas principales (Login, Home, etc.)
│   │   └── App.jsx        # Corazón de la navegación
│   └── .env               # URL de la API (VITE_API_URL)
└── actualizar.sh           # 🚀 Script de auto-despliegue
```

---

## ⚡ Cómo aplicar cambios al servidor (Despliegue)

He creado un script automático para simplificar el despliegue en AWS EC2. No necesitas ejecutar comandos manuales uno por uno.

### Paso único para desplegar:
Desde la carpeta raíz del proyecto, ejecuta:
```bash
./actualizar.sh
```
**¿Qué hace este script?** Trae el código de GitHub, reconstruye el frontend, actualiza Nginx y reinicia el backend automáticamente.

---

## 🗄️ Base de Datos (MySQL)

El sistema utiliza una base de datos centralizada llamada `gestion_equipos`.

### Estructura y Seguridad Mejorada:
1.  **Integridad de Datos:** Se han implementado **Llaves Foráneas (Foreign Keys)**. Esto significa que si borras un equipo, el historial, las copias de seguridad y los mantenimientos asociados se borrarán automáticamente (**ON DELETE CASCADE**), manteniendo la base de datos limpia.
2.  **Seguridad Local:** La conexión se realiza a través de `127.0.0.1` (localhost) en lugar de la IP pública, lo que mejora el rendimiento y la seguridad.
3.  **Prevención de Errores:** Se han eliminado tablas duplicadas con nombres similares para evitar confusiones por la sensibilidad a mayúsculas en Linux.

### Tablas Principales:
*   `equipos`: Información técnica de cada dispositivo.
*   `usuarios` y `auth`: Gestión de acceso y roles.
*   `mantenimiento`: Registro de actividades técnicas.
*   `CopiasDeSeguridad`: Historial de backups.
*   `historial_equipos`: Auditoría de cambios de usuario y área.

---

## ✍️ Autor y Créditos
Este sistema ha sido desarrollado y liderado íntegramente por:
**Juan Camilo Valencia**  
*Ingeniero y Diseñador Principal*

*Documentación revisada y optimizada el 30 de marzo de 2026.*

---

## 📄 Notas Finales
Si vas a realizar cambios en la base de datos, asegúrate de actualizar el archivo `.env` en la carpeta `backend`. Si agregas nuevas rutas en el backend, estas deben comenzar siempre con `/api` para que Nginx las redirija correctamente.

# 📘 Documentación Técnica - Sistema de Gestión de Equipos

## 🎯 Descripción General

El **Sistema de Gestión de Equipos** es una aplicación web completa desarrollada con tecnologías modernas para la administración integral de equipos informáticos, mantenimientos, copias de seguridad, licenciamiento e impresoras.

### Características Principales
- ✅ Gestión completa de equipos informáticos
- ✅ Control de mantenimientos preventivos y correctivos
- ✅ Registro de copias de seguridad
- ✅ Administración de licencias de software
- ✅ Control de impresoras
- ✅ Historial completo de cambios
- ✅ Generación de reportes PDF profesionales
- ✅ Sistema de notificaciones y recordatorios
- ✅ Interfaz responsive (escritorio y móvil)
- ✅ Dos niveles de usuario: Administrador y Usuario Ordinario

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

#### **Backend**
- **Node.js** v18+ - Entorno de ejecución
- **Express.js** - Framework web
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación y autorización
- **bcryptjs** - Encriptación de contraseñas
- **Multer** - Manejo de archivos
- **CORS** - Seguridad entre dominios

#### **Frontend**
- **React** v18+ - Librería de UI
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **jsPDF** - Generación de PDFs
- **React Big Calendar** - Calendario interactivo
- **React Icons** - Iconografía
- **Moment.js** - Manejo de fechas

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js v18 o superior
- MySQL 8.0 o superior
- npm o yarn

### 1. Clonar el Repositorio
```bash
git clone https://github.com/juancamilo1914/gestion_de_equipos.git
cd gestion_de_equipos
```

### 2. Configurar Backend

#### Instalar dependencias
```bash
cd backend
npm install
```

#### Configurar variables de entorno
Crear archivo `.env` en `/backend`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_contraseña
DB_NAME=gestion_equipos
PORT=3000
JWT_SECRET=tu_clave_secreta_jwt
```

#### Crear la base de datos
```sql
CREATE DATABASE gestion_equipos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Iniciar el servidor backend
```bash
npm start
# o en modo desarrollo:
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### 3. Configurar Frontend

#### Instalar dependencias
```bash
cd ../frontend
npm install
```

#### Configurar variables de entorno
Crear archivo `.env` en `/frontend`:
```env
VITE_API_URL=http://localhost:3000
```

#### Iniciar el servidor frontend
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
gestion_de_equipos/
├── backend/
│   ├── src/
│   │   ├── config.js              # Configuración de BD
│   │   ├── models/                # Modelos de datos
│   │   │   ├── usuarios.model.js
│   │   │   ├── equipos.model.js
│   │   │   ├── mantenimiento.model.js
│   │   │   ├── copias.model.js
│   │   │   └── ...
│   │   ├── routes/                # Rutas de la API
│   │   │   ├── auth.routes.js
│   │   │   ├── usuarios.routes.js
│   │   │   ├── equipos.routes.js
│   │   │   └── ...
│   │   ├── controllers/           # Lógica de negocio
│   │   ├── middleware/            # Middleware personalizado
│   │   └── app.js                 # Configuración Express
│   ├── uploads/                   # Archivos subidos
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/                   # Configuración de Axios
│   │   ├── assets/                # Imágenes y recursos
│   │   ├── components/            # Componentes reutilizables
│   │   │   ├── mobile/            # Componentes móviles
│   │   │   └── notifications/     # Sistema de notificaciones
│   │   ├── context/               # Context API
│   │   ├── hooks/                 # Custom hooks
│   │   ├── pages/                 # Páginas principales
│   │   │   ├── Login/
│   │   │   ├── home/              # Dashboards
│   │   │   ├── mantenimiento/
│   │   │   ├── copiasDeSeguridad/
│   │   │   ├── licenciamiento/
│   │   │   ├── impresoras/
│   │   │   └── historialEquipos/
│   │   ├── utils/                 # Utilidades
│   │   │   └── reportGenerator.js # Generador de PDFs
│   │   ├── App.jsx                # Componente principal
│   │   └── main.jsx               # Punto de entrada
│   ├── package.json
│   └── .env
│
└── DOCUMENTATION.md
```

---

## 🗄️ Modelo de Datos

### Tabla: usuarios
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | ID único |
| nombre | VARCHAR(100) | Nombre completo |
| correo | VARCHAR(100) | Email único |
| usuario | VARCHAR(50) | Nombre de usuario único |
| password | VARCHAR(255) | Contraseña encriptada |
| rol | ENUM('admin', 'usuario') | Rol del usuario |

### Tabla: equipos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | ID único |
| codigo | VARCHAR(50) | Código de inventario |
| usuario | VARCHAR(100) | Usuario asignado |
| area | VARCHAR(100) | Área del equipo |
| tipo | VARCHAR(50) | Tipo de equipo |
| marca | VARCHAR(50) | Marca |
| estado | VARCHAR(50) | Estado actual |

### Tabla: mantenimiento
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | ID único |
| equipo_id | INT | FK a equipos |
| fecha_de_elaboracion | DATE | Fecha de creación |
| fecha_de_ejecucion | DATE | Fecha de ejecución |
| fecha_ultimo_mantenimiento | DATE | Último mantenimiento |
| fecha_actual_de_mantenimiento | DATE | Próximo mantenimiento |
| actividades_realizadas | TEXT | Descripción |
| observaciones | TEXT | Notas |
| estado | ENUM | Estado del mantenimiento |
| firmas_tecnico | TEXT | Firma del técnico (base64) |
| firmas_aprobo | TEXT | Firma de aprobación |
| firmas_reviso | TEXT | Firma de revisión |

### Tabla: copias_de_seguridad
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | ID único |
| equipo_id | INT | FK a equipos |
| fecha | DATE | Fecha de la copia |
| estado_copia | VARCHAR(50) | Estado |
| tipo_copia | VARCHAR(50) | Tipo de copia |
| hora_inicio | TIME | Hora de inicio |
| hora_fin | TIME | Hora de fin |
| tiempo_duracion | VARCHAR(50) | Duración |
| ubicacion_almacenamiento | VARCHAR(200) | Ubicación |
| tamaño_datos | VARCHAR(50) | Tamaño |
| responsable | VARCHAR(100) | Responsable |
| observaciones | TEXT | Notas |

### Tabla: licenciamiento
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | ID único |
| equipo_id | INT | FK a equipos |
| sistema_operativo | VARCHAR(100) | SO instalado |
| software_de_oficina | VARCHAR(100) | Suite de oficina |
| otro_software | TEXT | Otro software |
| descripcion | TEXT | Descripción detallada |

### Tabla: impresoras
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | ID único |
| codigo | VARCHAR(50) | Código |
| marca | VARCHAR(50) | Marca |
| modelo | VARCHAR(100) | Modelo |
| ubicacion | VARCHAR(100) | Ubicación |
| estado | VARCHAR(50) | Estado |
| tipo | VARCHAR(50) | Tipo de impresora |

### Tabla: historial_equipos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | ID único |
| codigo_inventario | VARCHAR(50) | Código del equipo |
| usuario_anterior | VARCHAR(100) | Usuario previo |
| usuario_nuevo | VARCHAR(100) | Usuario nuevo |
| area_anterior | VARCHAR(100) | Área previa |
| area_nueva | VARCHAR(100) | Área nueva |
| fecha_cambio | DATETIME | Fecha del cambio |
| motivo_cambio | TEXT | Motivo |

### Tabla: recordatorios
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | ID único |
| title | VARCHAR(200) | Título |
| date | DATETIME | Fecha y hora |
| realizado | TINYINT | Estado (0/1) |

---

## 🌐 API Endpoints

### Autenticación
```
POST   /auth/login          # Iniciar sesión
POST   /auth/register       # Registrar usuario
```

### Usuarios
```
GET    /usuarios            # Listar todos
GET    /usuarios/:id        # Obtener uno
POST   /usuarios            # Crear
PUT    /usuarios/:id        # Actualizar
DELETE /usuarios/:id        # Eliminar
```

### Equipos
```
GET    /equipos             # Listar todos
GET    /equipos/:id         # Obtener uno
POST   /equipos             # Crear
PUT    /equipos/:id         # Actualizar
DELETE /equipos/:id         # Eliminar
```

### Mantenimiento
```
GET    /mantenimiento       # Listar todos
GET    /mantenimiento/:id   # Obtener uno
POST   /mantenimiento       # Crear
PUT    /mantenimiento/:id   # Actualizar
DELETE /mantenimiento/:id   # Eliminar
```

### Copias de Seguridad
```
GET    /CopiasDeSeguridad           # Listar todas
GET    /CopiasDeSeguridad/:id       # Obtener una
POST   /CopiasDeSeguridad           # Crear
PUT    /CopiasDeSeguridad/:id       # Actualizar
DELETE /CopiasDeSeguridad/:id       # Eliminar
```

### Licenciamiento
```
GET    /licenciamiento      # Listar todos
GET    /licenciamiento/:id  # Obtener uno
POST   /licenciamiento      # Crear
PUT    /licenciamiento/:id  # Actualizar
DELETE /licenciamiento/:id  # Eliminar
```

### Impresoras
```
GET    /impresoras          # Listar todas
GET    /impresoras/:id      # Obtener una
POST   /impresoras          # Crear
PUT    /impresoras/:id      # Actualizar
DELETE /impresoras/:id      # Eliminar
```

### Historial de Equipos
```
GET    /historial-equipos           # Listar todo el historial
GET    /historial-equipos/stats     # Obtener estadísticas
```

### Recordatorios
```
GET    /recordatorios       # Listar todos
POST   /recordatorios       # Crear
PUT    /recordatorios/:id   # Actualizar
DELETE /recordatorios/:id   # Eliminar
```

---

## 🎨 Características de la Interfaz

### Paleta de Colores Institucional
- **Rojo Principal**: #AD1A1C
- **Rojo Oscuro**: #8B1517
- **Amarillo Acento**: #FCE821
- **Blanco**: #FFFFFF
- **Negro**: #000000
- **Grises**: #f8fafc, #e2e8f0, #64748b

### Componentes Principales

#### Dashboard Administrador
- Gestión de usuarios
- Vista de estadísticas
- Acceso a todos los módulos
- Sistema de notificaciones

#### Dashboard Usuario Ordinario
- Vista de equipos asignados
- Gestión de mantenimientos
- Copias de seguridad
- Licencias
- Recordatorios personales

#### Generación de Reportes PDF
- Formato institucional estandarizado
- Logo institucional
- Código y versión de documento
- Secciones dinámicas (info, tablas, firmas)
- Exportación automática

---

## 🔒 Seguridad

### Autenticación
- JWT (JSON Web Tokens)
- Tokens almacenados en localStorage
- Expiración de sesión

### Encriptación
- Contraseñas hasheadas con bcryptjs
- Salt rounds: 10

### Validación
- Validación de entrada en frontend y backend
- Sanitización de datos
- Protección contra SQL injection

---

## 📱 Responsive Design

### Breakpoints
- **Móvil**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Características Móviles
- Layout adaptativo
- Menú hamburguesa
- Componentes optimizados para touch
- Tablas con scroll horizontal

---

## 🧪 Testing

### Comandos de Prueba
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## 📦 Despliegue

### Backend (Producción)
```bash
cd backend
npm run build
npm start
```

### Frontend (Producción)
```bash
cd frontend
npm run build
# Los archivos estarán en /dist
```

---

## 🛠️ Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instalar dependencias |
| `npm start` | Iniciar servidor (producción) |
| `npm run dev` | Iniciar servidor (desarrollo) |
| `npm run build` | Compilar para producción |
| `npm test` | Ejecutar pruebas |

---

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Verificar credenciales en `.env`
- Asegurar que MySQL esté corriendo
- Verificar que la base de datos exista

### Error de CORS
- Verificar configuración de CORS en backend
- Asegurar que la URL del frontend esté permitida

### Errores de autenticación
- Verificar que el token JWT sea válido
- Comprobar que el usuario exista en la base de datos

---

## 📚 Recursos Adicionales

- [Documentación de Express](https://expressjs.com/)
- [Documentación de React](https://react.dev/)
- [Documentación de MySQL](https://dev.mysql.com/doc/)
- [JWT.io](https://jwt.io/)

---

## 🔄 Control de Versiones

### Versión Actual: 2.0.0

#### Changelog
- **v2.0.0** (2025-01-26)
  - Rediseño completo de la interfaz
  - Sistema de notificaciones
  - Generación de reportes PDF mejorada
  - Soporte móvil completo
  - Logo institucional en toda la aplicación

- **v1.0.0** (2024-12-01)
  - Versión inicial del sistema

---

## 👨‍💻 Autor y Contribuidores

**Juan Camilo Valencia**  
📧 Email: [GitHub](https://github.com/juancamilo1914)

---

## 📄 Licencia

© 2025 Sistema de Gestión de Equipos Corporacion Nasakiwe - Todos los derechos reservados

---

## 🆘 Soporte

Para reportar problemas o solicitar nuevas características:
- Crear un issue en GitHub
- Contactar al administrador del sistema

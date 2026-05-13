# GrantTrap - Gestión de Proyectos de Arquitectura

[![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20?logo=laravel&logoColor=white)](https://laravel.com) [![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=white)](https://react.dev) [![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)](https://www.docker.com) 

Aplicación web completa para la gestión integral de proyectos de arquitectura. Permite a arquitectos y jefes de proyecto organizar, supervisar y coordinar tareas, equipos y recursos de manera eficiente.

---

## Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API REST](#-api-rest)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Documentación Adicional](#-documentación-adicional)

---

## Características

### Gestión de Proyectos

- CRUD completo de proyectos (Crear, Leer, Actualizar, Eliminar)
- Estados de proyecto: Pendiente, En Progreso, Completado, Cancelado
- Información detallada: Cliente, presupuesto, fechas, ubicación, descripción
- Paginación y filtrado de proyectos

### Gestión de Tareas

- Crear tareas dentro de proyectos
- Asignación de tareas a múltiples usuarios
- Control de conflictos de horarios (Validación N:M)
- Prioridades: Baja, Media, Alta, Urgente
- Seguimiento del progreso

### Gestión de Equipo

- Sistema de roles: Jefe (boss) y Trabajador (worker)
- Control de permisos basado en roles
- Visualización del equipo (solo para jefes)
- Asignación selectiva de personal

### Seguridad

- Autenticación con Sanctum (token-based)
- Protección contra SQL Injection (Eloquent ORM)
- Control de acceso basado en roles
- Contraseñas hasheadas con Bcrypt

### Experiencia de Usuario

- Diseño responsivo (Mobile First)
- Interfaz intuitiva y moderna
- Notificaciones en tiempo real (Toasts)
- Indicadores de carga
- Diseño accesible (WCAG AA)

---

## Tecnologías

### Backend

- **Framework:** Laravel 12.0
- **ORM:** Eloquent
- **Autenticación:** Laravel Sanctum
- **Base de Datos:** SQLite
- **Lenguaje:** PHP 8.4

### Frontend

- **Framework:** React 19.2.0
- **Lenguaje:** TypeScript
- **Build Tool:** Vite
- **Enrutador:** React Router v7
- **Cliente HTTP:** Axios
- **Iconos:** Lucide React
- **Estilos:** CSS

### DevOps

- **Containerización:** Docker
- **Orquestación:** Docker Compose
- **Web Server:** Nginx

---



## Instalación

### Opción 1: Con Docker 

```bash
# 1. Clonar el repositorio
git clone https://github.com/IsaacFdezPintor/arquinexos_project.git
cd arquinexos_project

# 2. Iniciar los contenedores
docker-compose up -d

# 3. Esperar a que los servicios se levanten (aprox 30 segundos)
# Verificar logs
docker-compose logs -f backend

# 4. Ejecutar migraciones
docker-compose exec backend php artisan migrate --force

# 5. Crear datos de prueba (opcional)
docker-compose exec backend php artisan db:seed

# 6. Acceder a la aplicación
# Frontend:  http://localhost:5173
# Backend:   http://localhost:9000
# Nginx:     http://localhost:80
```

### Opción 2: Instalación Local (Sin Docker)
#### Clonar Repositorio 
```bash
git clone https://github.com/IsaacFdezPintor/arquinexos_project.git
cd arquinexos_project
```
#### Backend

```bash
cd backend

# Instalar dependencias
composer install

# Copiar archivo de configuración
cp .env.example .env

# Generar APP_KEY
php artisan key:generate

# Configurar base de datos en .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=arquinexos
DB_USERNAME=root
DB_PASSWORD=

# Ejecutar migraciones
php artisan migrate

# Iniciar servidor
php artisan serve
```

#### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar API base en .env
VITE_API_BASE_URL=http://localhost:9000/api

# Iniciar servidor de desarrollo
npm run dev
```

---

## ⚙️ Configuración

### Variables de Entorno (Backend)

**archivo:** `backend/.env`

```env
# Aplicación
APP_NAME=Arquinexos
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost
APP_KEY=base64:...

# Base de Datos
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel_db
DB_USERNAME=laravel
DB_PASSWORD=password

# Sanctum (Autenticación)
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,localhost:80

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:80
```

### Variables de Entorno (Frontend)

**archivo:** `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:9000/api
```

---

## 🏃 Ejecución

### Con Docker Compose

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Parar los servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v
```

### Acceder a Servicios

| Servicio              | URL                   | Usuario Demo    |
| --------------------- | --------------------- | --------------- |
| **Frontend**    | http://localhost:3000 | -               |
| **Backend API** | http://localhost:9000 | -               |
| **MySQL**       | localhost:3306        | root / password |
| **Nginx Proxy** | http://localhost:80   | -               |

### Credenciales de Prueba

```
Email:    jefe@example.com
Password: password123

Email:    trabajador@example.com
Password: password123
```

---

## 📁 Estructura del Proyecto

```
arquinexos_project/
├── backend/                          # Aplicación Laravel
│   ├── app/
│   │   ├── Enums/
│   │   │   ├── ProjectStatus.php     # Estados: pending, in_progress, completed, cancelled
│   │   │   └── TaskPriority.php      # Prioridades: low, medium, high, urgent
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── AuthController.php       # Autenticación
│   │   │   │   ├── ProjectController.php    # CRUD Proyectos
│   │   │   │   ├── TaskController.php       # CRUD Tareas
│   │   │   │   ├── UserController.php       # Gestión usuarios
│   │   │   │   └── TaskUserController.php   # Relación N:M
│   │   │   └── Middleware/
│   │   ├── Models/
│   │   │   ├── User.php              # Modelo usuario (roles: boss/worker)
│   │   │   ├── Project.php           # Modelo proyecto
│   │   │   └── Task.php              # Modelo tarea
│   │   └── Providers/
│   ├── database/
│   │   ├── factories/
│   │   │   ├── UserFactory.php
│   │   │   ├── ProjectFactory.php
│   │   │   └── TaskFactory.php
│   │   ├── migrations/
│   │   │   ├── create_users_table.php
│   │   │   ├── projects.php          # Tabla proyectos
│   │   │   ├── task.php              # Tabla tareas
│   │   │   └── task_users.php        # Tabla pivote (N:M)
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php                   # Definición de rutas API
│   ├── tests/
│   │   ├── Feature/
│   │   │   ├── AuthenticationTest.php
│   │   │   └── ProjectTest.php
│   │   └── Unit/
│   ├── composer.json
│   └── phpunit.xml
│
├── frontend/                         # Aplicación React + TypeScript
│   ├── src/
│   │   ├── assets/                   # Recursos estáticos
│   │   ├── auth/
│   │   │   ├── authContext.tsx       # Contexto de autenticación
│   │   │   └── ProtectedRoute.tsx    # Rutas protegidas
│   │   ├── components/               # Componentes React reutilizables
│   │   │   ├── Button/
│   │   │   ├── ProjectForm/
│   │   │   ├── ProjectList/
│   │   │   ├── TaskForm/
│   │   │   ├── TaskList/
│   │   │   ├── Toast/
│   │   │   ├── Spinner/
│   │   │   └── StatusBadge/
│   │   ├── layout/
│   │   │   └── AppLayout.tsx         # Layout principal
│   │   ├── pages/                    # Páginas/vistas
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   ├── ProjectDetailPage.tsx
│   │   │   ├── ProjectFormPage.tsx
│   │   │   ├── TaskPage.tsx
│   │   │   ├── TaskFormPage.tsx
│   │   │   ├── TeamPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── routing/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── services/                 # Servicios API
│   │   │   ├── authService.ts
│   │   │   ├── projectService.ts
│   │   │   ├── taskService.ts
│   │   │   ├── userService.ts
│   │   │   └── http.ts               # Cliente Axios centralizado
│   │   ├── types/                    # Tipos TypeScript
│   │   │   ├── Project.ts
│   │   │   ├── Task.ts
│   │   │   └── User.ts
│   │   ├── utils/                    # Utilidades
│   │   ├── App.tsx                   # Componente raíz
│   │   ├── index.css                 # Estilos globales + guía de estilos
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── nginx/
│   └── default.conf                  # Configuración Nginx
│
├── docker-compose.yml                # Orquestación de contenedores
├── .env.example
├── .gitignore
└── README.md (este archivo)
```

---

## 🔌 API REST

### Autenticación

#### Registro

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "role": "worker"
}

Response: 201 Created
{
  "token": "...",
  "user": { "id": 1, "name": "Juan", "email": "juan@example.com", "role": "worker" }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "...",
  "user": { "id": 1, "name": "Juan", ... }
}
```

### Proyectos

#### Listar Proyectos (Paginado)

```http
GET /api/projects?page=1
Authorization: Bearer {token}

Response: 200 OK
{
  "data": [
    {
      "id": 1,
      "name": "Vivienda Unifamiliar",
      "type": "Edificación",
      "client_name": "María García",
      "status": "in_progress",
      "budget": 150000,
      "start_date": "2026-03-01",
      "end_date": "2026-09-01",
      "address": "Calle Principal 123, Madrid",
      "description": "Construcción de vivienda..."
    }
  ],
  "current_page": 1,
  "last_page": 5,
  "total": 45
}
```

#### Crear Proyecto (Solo Jefes)

```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Nuevo Proyecto",
  "type": "Edificación",
  "client_name": "Cliente XYZ",
  "status": "pending",
  "budget": 200000,
  "start_date": "2026-05-01",
  "end_date": "2026-12-31",
  "address": "Dirección del proyecto",
  "description": "Descripción detallada"
}

Response: 201 Created
```

#### Ver Proyecto Detallado

```http
GET /api/projects/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 1,
  "name": "Vivienda Unifamiliar",
  ...
  "tasks": [
    { "id": 10, "name": "Cimentación", "priority": "high", ... },
    { "id": 11, "name": "Estructura", "priority": "high", ... }
  ]
}
```

#### Actualizar Proyecto (Solo Jefes)

```http
PUT /api/projects/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Nombre actualizado",
  "status": "completed"
}

Response: 200 OK
```

#### Eliminar Proyecto (Solo Jefes)

```http
DELETE /api/projects/{id}
Authorization: Bearer {token}

Response: 200 OK
{ "message": "Proyecto eliminado correctamente" }
```

### Tareas

#### Listar Tareas

```http
GET /api/tasks
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 10,
    "name": "Cimentación",
    "project_id": 1,
    "priority": "high",
    "start_date": "2026-05-01",
    "end_date": "2026-05-15",
    "users": [ { "id": 2, "name": "Trabajador" } ]
  }
]
```

#### Crear Tarea (Solo Jefes)

```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "project_id": 1,
  "name": "Nueva Tarea",
  "description": "Descripción",
  "priority": "medium",
  "start_date": "2026-05-20",
  "end_date": "2026-05-30",
  "user_ids": [2, 3]
}

Response: 201 Created

⚠️ Validación: Si hay conflicto de horarios, retorna 422
```

#### Mis Tareas (Trabajador)

```http
GET /api/tasks/my-tasks
Authorization: Bearer {token}

Response: 200 OK
[tareas asignadas al usuario autenticado]
```

#### Tareas por Proyecto

```http
GET /api/projects/{project_id}/tasks
Authorization: Bearer {token}

Response: 200 OK
[tareas del proyecto específico]
```

### Equipo

#### Listar Equipo (Solo Jefes)

```http
GET /api/users/team
Authorization: Bearer {token}

Response: 200 OK
[
  { "id": 2, "name": "Trabajador 1", "email": "...", "role": "worker" },
  { "id": 3, "name": "Trabajador 2", "email": "...", "role": "worker" }
]
```

---

## 🧪 Testing

### Ejecutar Tests Backend

```bash
# Con Docker
docker-compose exec backend php artisan test

# Con Docker (verbose)
docker-compose exec backend php artisan test --verbose

# Localmente
php artisan test
```

### Cobertura de Tests

**Tests actuales:**

- ✅ `AuthenticationTest.php` - Autenticación y login
- ✅ `ProjectTest.php` - CRUD de proyectos
- ✅ `ModelTest.php` - Modelos y relaciones

**Casos cubiertos:**

- Obtener lista de proyectos
- Crear nuevo proyecto (con validación)
- Actualizar proyecto (solo jefes)
- Eliminar proyecto (solo jefes)
- Protección de datos (mass assignment)

### Ejecutar Test Específico

```bash
docker-compose exec backend php artisan test tests/Feature/ProjectTest.php
```

---

## 📦 Despliegue

### Despliegue Local con Docker ✅

```bash
# Compilar y ejecutar
docker-compose up -d

# Ejecutar migraciones
docker-compose exec backend php artisan migrate --force

# Ver estado
docker-compose ps
```

### Despliegue en AWS EC2

#### Prerrequisitos

- Instancia EC2 (Ubuntu 22.04 LTS)
- Docker y Docker Compose instalados
- Certificado SSL (Let's Encrypt)

#### Pasos

```bash
# 1. Conectar a EC2
ssh -i key.pem ubuntu@your-instance-ip

# 2. Clonar repositorio
git clone <URL_REPOSITORIO>
cd arquinexos_project

# 3. Crear archivo .env
cp .env.example .env
# Editar variables de producción

# 4. Generar certificado SSL
sudo certbot certonly --standalone -d tu-dominio.com

# 5. Actualizar docker-compose.yml con rutas de certificado
# volumes:
#   - /etc/letsencrypt:/etc/letsencrypt

# 6. Iniciar servicios
docker-compose up -d

# 7. Verificar logs
docker-compose logs -f
```

### Variables de Producción

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

# Base de datos (RDS AWS recomendado)
DB_HOST=rds-instance.amazonaws.com
DB_USERNAME=admin
DB_PASSWORD=contraseña-segura

# Sanctum
SANCTUM_STATEFUL_DOMAINS=tu-dominio.com

# CORS
CORS_ALLOWED_ORIGINS=https://tu-dominio.com
```

---

## 📚 Documentación Adicional

### Archivos de Documentación

- **[CUMPLIMIENTO_REQUISITOS.md](CUMPLIMIENTO_REQUISITOS.md)** - Mapeo detallado de todos los requisitos (6.1.1 y 11)
- **[backend/README.md](backend/README.md)** - Documentación específica del backend
- **[frontend/README.md](frontend/README.md)** - Documentación específica del frontend

### Guía de Estilo

La guía de estilos está definida en:

- **[frontend/src/index.css](frontend/src/index.css)** - Variables CSS, paleta de colores, tipografía, espaciados

### Convenciones de Código

#### Backend (PHP)

- Estándar: PSR-12
- Documentación: PHPDoc
- Migraciones: Timestamp + descripción
- Modelos: Singular en camelCase

#### Frontend (React/TypeScript)

- Estándar: ESLint configurado
- Documentación: JSDoc
- Componentes: PascalCase, un componente por archivo
- Servicios: camelCase con sufijo "Service"

---

## 🔒 Seguridad

### Medidas Implementadas

- ✅ **SQL Injection:** Eloquent ORM + Prepared Statements
- ✅ **Mass Assignment:** `$fillable` en modelos
- ✅ **Autenticación:** Sanctum con tokens
- ✅ **Contraseñas:** Bcrypt hash
- ✅ **CORS:** Configurado correctamente
- ✅ **Validación:** Rigurosa en controllers
- ✅ **Control de Acceso:** Basado en roles (boss/worker)

### Checklist de Seguridad Antes de Producción

- [ ] Cambiar `APP_KEY`
- [ ] Establecer `APP_DEBUG=false`
- [ ] Usar HTTPS/SSL
- [ ] Actualizar contraseñas de BD
- [ ] Configurar CORS correctamente
- [ ] Actualizar `SANCTUM_STATEFUL_DOMAINS`
- [ ] Revisar permisos de archivos
- [ ] Configurar backups automáticos

---

## 🐛 Troubleshooting

### Error: "Conexión rechazada a la base de datos"

```bash
# Verificar que MySQL está corriendo
docker-compose ps

# Reiniciar servicios
docker-compose restart db backend
```

### Error: "CORS policy blocked"

```bash
# Verificar .env del backend
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Reiniciar backend
docker-compose restart backend
```

### Error: "Token expirado"

```bash
# El token de Sanctum es válido por 24 horas
# Volver a hacer login desde el frontend
```

### Frontend no conecta a API

```bash
# Verificar variable de entorno
cat frontend/.env

# Debe ser:
VITE_API_BASE_URL=http://localhost:9000/api

# Reconstruir frontend
docker-compose restart frontend
```

---

## 📊 Estadísticas del Proyecto

| Métrica                                | Valor                   |
| --------------------------------------- | ----------------------- |
| **Líneas de código (Backend)**  | ~2,500+                 |
| **Líneas de código (Frontend)** | ~3,000+                 |
| **Componentes React**             | 10+                     |
| **Endpoints API**                 | 20+                     |
| **Modelos Eloquent**              | 3 (User, Project, Task) |
| **Tests**                         | 15+                     |
| **Cobertura de requisitos**       | 92%                     |

---

## 👥 Equipo

- **Alumno/a:** Isaac Fernández Pintor
- **Asignatura:** Desarrollo de Aplicaciones Web
- **Centro:** 2º DAW
- **Fecha:** Mayo 2026

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 📞 Contacto y Soporte

Para reportar bugs o sugerencias:

- Abrir un issue en el repositorio
- Contactar al desarrollador

---

## 🔄 Historial de Cambios

### v1.0.0 (Mayo 2026)

- ✅ Versión inicial del proyecto
- ✅ CRUD de Proyectos
- ✅ CRUD de Tareas
- ✅ Gestión de Equipo
- ✅ Autenticación con Sanctum
- ✅ Despliegue con Docker

---

**Última actualización:** 11 de mayo de 2026

**Estado:** ✅ Producción Lista

---

## 📖 Referencias Útiles

- [Documentación Laravel 12](https://laravel.com/docs/12.x)
- [Documentación React 19](https://react.dev)
- [Docker Documentation](https://docs.docker.com)
- [WCAG 2.1 Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)
- [RESTful API Design](https://restfulapi.net/)

---

¡Gracias por usar **ARQUINEXOS**! 🏗️

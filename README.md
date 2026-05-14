# GrantTrap - Gestión de Proyectos de Arquitectura

[![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20?logo=laravel&logoColor=white)](https://laravel.com) [![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=white)](https://react.dev) [![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)](https://www.docker.com)

Aplicación web completa para la gestión integral de proyectos de arquitectura. Permite a arquitectos y jefes de proyecto organizar, supervisar y coordinar tareas, equipos y recursos de manera eficiente.

---

## Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Ejecución](#-ejecución)
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

# Ejecutar migraciones
php artisan migrate

# Crear datos de prueba (opcional)
php artisan migrate:fresh --seed

# Iniciar servidor
php artisan serve --port=9000
```

#### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

---

## Ejecución

### Con Docker Compose

```bash
# Iniciar todos los servicios
docker-compose up -d

# Parar los servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v
```

### Credenciales de Prueba

```
- Boss : carlos@arquitectura.com / admin123
- Worker: laura@arquitectura.com /worker123
                miguel@arquitectura.com/worker123
                ana@arquitectura.com/worker123
                elena@arquitectura.com/worker123
                roberto@arquitectura.com/worker123
```

---

## API REST

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

## Testing

### Ejecutar Tests Backend

```bash
# Con Docker
docker-compose exec backend php artisan test

# Con Docker (verbose)
docker-compose exec backend php artisan test --verbose

# Localmente
php artisan test
```

### Ejecutar Test Específico

```bash
docker-compose exec backend php artisan test tests/Feature/ProjectTest.php
```

---

## Documentación Adicional

### Archivos de Documentación

- **[backend/README.md](backend/README.md)** - Documentación específica del backend
- **[frontend/README.md](frontend/README.md)** - Documentación específica del frontend

### Guía de Estilo

La guía de estilos está definida en:

- **[frontend/src/index.css](frontend/src/index.css)** - Variables CSS, paleta de colores, tipografía, espaciados

---



## Autor

- **Alumno/a:** Isaac Fernández Pintor
- **Asignatura:** Desarrollo de Aplicaciones Web
- **Centro:** 2º DAW
- **Fecha:** Mayo 2026

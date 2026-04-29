# GrantTrap - Backend API

**Sistema de Gestión de Proyectos y Tareas para Empresas de Arquitetcura**

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características](#características)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Base de Datos](#base-de-datos)
- [Autenticación](#autenticación)
- [Endpoints de la API](#endpoints-de-la-api)
- [Modelos y Relaciones](#modelos-y-relaciones)
- [Ejecución](#ejecución)
- [Testing](#testing)
- [Documentación API](#documentación-api)

---

## Descripción General

GrantTrap es una **API REST** construida con **Laravel 12** que permite a empresas de arquitectuera gestionar sus proyectos y tareas de forma eficiente.

El sistema implementa:

- Control de acceso basado en roles
- Autenticación con tokens Sanctum
- Relaciones complejas N:M entre usuarios y tareas
- Validación de datos robusto
- Manejo centralizado de errores

---

## Características

### Para Jefes:

- Crear, editar y eliminar proyectos
- Gestionar equipos de trabajadores
- Crear y asignar tareas a trabajadores
- Ver estado completo de todos los proyectos
- Control total del sistema

### Para Trabajadores:

- Ver tareas asignadas
- Actualizar prioridad de tareas
- Registrar progreso
- Ver detalles de proyectos
- Acceso limitado a información propia

---

## Estructura del Proyecto

```
backend/
├── app/
│   ├── Enums/                      # Enumeraciones
│   │   ├── ProjectStatus.php       # Estados: pending, in_progress, completed, cancelled
│   │   └── TaskPriority.php        # Prioridades: low, medium, high, urgent
│   │
│   ├── Http/
│   │   ├── Controllers/Api/        # Controladores de la API
│   │   │   ├── AuthController.php  # Autenticación (login, register, logout)
│   │   │   ├── ProjectController.php # Gestión de proyectos (CRUD)
│   │   │   ├── TaskController.php  # Gestión de tareas
│   │   │   ├── UserController.php  # Gestión de usuarios
│   │   │   └── TaskUserController.php # Relación N:M
│   │   └── Middleware/             # Middlewares (autenticación, CORS)
│   │
│   ├── Models/                     # Modelos Eloquent
│   │   ├── User.php               # Modelo de usuario (roles: boss, worker)
│   │   ├── Project.php            # Modelo de proyecto
│   │   └── Task.php               # Modelo de tarea
│   │
│   └── Providers/                 # Service Providers
│       └── AppServiceProvider.php
│
├── database/
│   ├── factories/                 # Factories para generar datos de prueba
│   │   ├── UserFactory.php
│   │   ├── ProjectFactory.php
│   │   └── TaskFactory.php
│   │
│   ├── migrations/                # Migraciones (creación de tablas)
│   │   ├── *_create_users_table.php
│   │   ├── *_create_projects_table.php
│   │   ├── *_create_tasks_table.php
│   │   └── *_create_task_users_table.php
│   │
│   └── seeders/                   # Seeders (inserción de datos iniciales)
│       └── DatabaseSeeder.php
│
├── routes/
│   ├── api.php                    # Rutas de la API
│   ├── web.php  
│   └── console.php  
│
├── config/
│   ├── app.php  
│   ├── database.php   
│   ├── cors.php   
│   └── sanctum.php  
│
├── storage/
│   └── logs/  
│
├── tests/                         # Tests automatizados
│   ├── Unit/
│   └── Feature/
│
├── .env.example     
├── artisan           
├── composer.json        
└── README.md              
```

---

## Base de Datos

### Tablas Principales

#### **users**

- `id` - Identificador único
- `name` - Nombre del usuario
- `email` - Email (único)
- `password` - Contraseña hasheada
- `role` - Rol: `boss` o `worker`
- `created_at, updated_at` - Timestamps

#### **projects**

- `id` - Identificador único
- `name` - Nombre del proyecto
- `type` - Tipo (Construcción, Reforma, etc.)
- `client_name` - Nombre del cliente
- `description` - Descripción
- `status` - Estado (ProjectStatus enum)
- `budget` - Presupuesto
- `start_date` - Fecha de inicio
- `end_date` - Fecha de finalización
- `address` - Ubicación/Dirección
- `created_at, updated_at` - Timestamps

#### **tasks**

- `id` - Identificador único
- `project_id` - FK a projects (N:1)
- `name` - Nombre de la tarea
- `description` - Descripción
- `status` - Estado de la tarea
- `priority` - Prioridad (TaskPriority enum)
- `start_date` - Fecha de inicio
- `end_date` - Fecha de finalización
- `created_at, updated_at` - Timestamps

#### **task_users** (Pivot Table - Relación N:M)

- `id` - Identificador único
- `task_id` - FK a tasks
- `user_id` - FK a users
- `role` - Rol del usuario en la tarea
- `created_at, updated_at` - Timestamps

### Diagrama de Relaciones

## Autenticación

### Sistema Sanctum

Laravel Sanctum proporciona autenticación sin estado (stateless) usando tokens.

#### Flujo de Autenticación:

```
1. Cliente envía email + password a POST /auth/login
   ↓
2. Servidor valida credenciales
   ↓
3. Servidor genera token único
   ↓
4. Cliente recibe token en JSON
   ↓
5. Cliente almacena token en localStorage
   ↓
6. Cliente incluye token en header: Authorization: Bearer <token>
   ↓
7. Servidor valida token en cada petición
```

#### Endpoints de Autenticación:

```
POST   /auth/register          Registrar nuevo usuario
POST   /auth/login            Iniciar sesión
POST   /auth/logout           Cerrar sesión
GET    /auth/me               Obtener datos del usuario actual
```

---

## Endpoints de la API

### 1. Autenticación (Públicos)

```bash
# Registro
POST /api/auth/register
Body: { name, email, password, role: "worker"|"boss" }
Response: { message, token, user }

# Login
POST /api/auth/login
Body: { email, password }
Response: { token, user }

# Logout (Protegido)
POST /api/auth/logout
Headers: Authorization: Bearer <token>
```

### 2. Proyectos (Protegidos)

```bash
# Listar proyectos
GET /api/projects
GET /api/projects?no_paginate=1           # Sin paginación

# Obtener proyecto por ID
GET /api/projects/:id

# Crear proyecto (Solo jefes)
POST /api/projects
Body: { name, type, client_name, status, start_date, ... }

# Actualizar proyecto (Solo jefes)
PUT /api/projects/:id
Body: { name, status, budget, ... }

# Eliminar proyecto (Solo jefes)
DELETE /api/projects/:id
```

### 3. Tareas (Protegidos)

```bash
# Listar todas las tareas
GET /api/tasks                            # Jefes: todas, Trabajadores: propias

# Listar mis tareas
GET /api/tasks/my-tasks

# Obtener tarea por ID
GET /api/tasks/:id

# Tareas de un proyecto
GET /api/projects/:projectId/tasks

# Crear tarea (Solo jefes)
POST /api/tasks
Body: { project_id, name, priority, start_date, user_ids, ... }

# Actualizar tarea
PUT /api/tasks/:id
# Jefes: todos los campos
# Trabajadores: solo priority

# Eliminar tarea (Solo jefes)
DELETE /api/tasks/:id
```

### 4. Usuarios (Protegidos)

```bash
# Obtener equipo (trabajadores subordinados)
GET /api/users/team               # Solo para jefes
```

---

## Modelos y Relaciones

### Modelo User

```php
/**
 * Relaciones:
 * - hasMany('tasks'): Tareas asignadas directamente
 * - belongsToMany('tasks', 'task_users'): Tareas en colaboración (N:M)
 * 
 * Métodos:
 * - isJefe(): Verifica si es administrador
 * - isWorker(): Verifica si es trabajador
 */
```

### Modelo Project

```php
/**
 * Relaciones:
 * - hasMany('tasks'): Todas las tareas del proyecto
 * 
 * Campos Cast:
 * - status -> ProjectStatus enum
 */
```

### Modelo Task

```php
/**
 * Relaciones:
 * - belongsTo('project'): Proyecto que contiene la tarea
 * - belongsToMany('users', 'task_users'): Usuarios asignados (N:M)
 * 
 * Campos Cast:
 * - priority -> TaskPriority enum
 */
```

---

## Ejecución

### Desarrollo Local

```bash
# Iniciar servidor de desarrollo
php artisan serve
# La API estará disponible en http://localhost:8000/api

# En otra terminal, ver logs en tiempo real
php artisan tinker

# Ejecutar migraciones
php artisan migrate

# Revertir a estado inicial con datos de prueba
php artisan migrate:fresh --seed

# Crear datos de prueba
php artisan db:seed
```

### Comandos Útiles

```bash
# Listar todas las rutas
php artisan route:list

# Limpiar caché
php artisan cache:clear
php artisan config:clear

# Generar documentación Swagger
php artisan l5-swagger:generate

# Ejecutar tinker (REPL interactivo)
php artisan tinker
```

---

## Testing

### Ejecutar Tests

```bash
# Tests unitarios
php artisan test --filter=Unit

# Tests funcionales
php artisan test --filter=Feature

# Todos los tests
php artisan test

# Con cobertura de código
php artisan test --coverage
```

### Crear Test

```bash
# Crear test unitario
php artisan make:test UserModelTest --unit

# Crear test funcional
php artisan make:test AuthControllerTest
```

---

## Enumeraciones

### ProjectStatus

```php
PENDING       = 'pending'         // No iniciado
IN_PROGRESS   = 'in_progress'     // En desarrollo
COMPLETED     = 'completed'       // Finalizado
CANCELLED     = 'cancelled'       // Cancelado
```

### TaskPriority

```php
LOW           = 'low'             // Baja
MEDIUM        = 'medium'          // Normal
HIGH          = 'high'            // Alta
URGENT        = 'urgent'          // Urgente
COMPLETED     = 'completed'       // Completada
```

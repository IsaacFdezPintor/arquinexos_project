# 🏗️ ARQUINEXOS - Backend API

**Sistema de Gestión de Proyectos y Tareas para Empresas de Construcción**

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
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

## 📝 Descripción General

ARQUINEXOS es una **API REST moderna** construida con **Laravel 12** que permite a empresas de construcción gestionar sus proyectos y tareas de forma eficiente.

El sistema implementa:
- ✅ Control de acceso basado en roles (RBAC)
- ✅ Autenticación con tokens Sanctum
- ✅ Relaciones complejas N:M entre usuarios y tareas
- ✅ Documentación automática con Swagger/OpenAPI
- ✅ Validación de datos robusto
- ✅ Manejo centralizado de errores

---

## ✨ Características

### Para Jefes/Administradores:
- 📊 Crear, editar y eliminar proyectos
- 👥 Gestionar equipos de trabajadores
- 📌 Crear y asignar tareas a trabajadores
- 📈 Ver estado completo de todos los proyectos
- 🔐 Control total del sistema

### Para Trabajadores:
- 📋 Ver tareas asignadas
- ✏️ Actualizar prioridad de tareas
- 🎯 Registrar progreso
- 👁️ Ver detalles de proyectos
- 🔒 Acceso limitado a información propia

---

## 🛠️ Requisitos Previos

- **PHP 8.2+** (versión mínima requerida)
- **Composer** (gestor de dependencias PHP)
- **MySQL 8.0+** o **SQLite** (para desarrollo)
- **Node.js 18+** (opcional, para assets)
- **Git**

### Verificar instalación:
```bash
php --version
composer --version
mysql --version
```

---

## 📦 Instalación

### 1. Clonar el repositorio
```bash
cd /ruta/del/proyecto
cd backend
```

### 2. Instalar dependencias PHP
```bash
composer install
```

### 3. Crear archivo de configuración
```bash
cp .env.example .env
```

### 4. Generar clave de aplicación
```bash
php artisan key:generate
```

### 5. Ejecutar migraciones y seeders
```bash
php artisan migrate:fresh --seed
```

---

## ⚙️ Configuración

### Variables de Entorno (.env)

Editar el archivo `.env` con tus datos:

```env
# Información de la Aplicación
APP_NAME=Arquinexos
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Base de Datos
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=arquinexos
DB_USERNAME=root
DB_PASSWORD=

# CORS (acceso desde frontend)
FRONTEND_URL=http://localhost:5173

# Mail (opcional)
MAIL_MAILER=log
MAIL_FROM_ADDRESS="no-reply@arquinexos.local"

# API Swagger
L5_SWAGGER_GENERATE_ALWAYS=false
```

---

## 📁 Estructura del Proyecto

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
│   ├── web.php                    # Rutas web (si aplica)
│   └── console.php                # Comandos de consola
│
├── config/
│   ├── app.php                    # Configuración general
│   ├── database.php               # Configuración de BD
│   ├── cors.php                   # Configuración CORS
│   └── sanctum.php                # Configuración de autenticación
│
├── storage/
│   ├── logs/                      # Archivos de log
│   └── api-docs/                  # Documentación Swagger generada
│
├── tests/                         # Tests automatizados
│   ├── Unit/
│   └── Feature/
│
├── .env.example                   # Plantilla de variables de entorno
├── artisan                        # CLI de Laravel
├── composer.json                  # Dependencias PHP
└── README.md                      # Este archivo
```

---

## 🗄️ Base de Datos

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

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id              │
│ name            │
│ email           │
│ role (boss/w)   │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         │ 1:N             │ N:M
         │                 │
┌────────▼────────┐   ┌────▼──────────┐      ┌──────────────┐
│   PROJECTS      │   │  TASK_USERS   │◄─────┤    TASKS     │
├─────────────────┤   ├───────────────┤      ├──────────────┤
│ id              │   │ id            │      │ id           │
│ name            │   │ task_id (FK)  │      │ project_id   │
│ client_name     │   │ user_id (FK)  │      │ name         │
│ budget          │   │ role          │      │ priority     │
│ status (enum)   │   └───────────────┘      │ status       │
└─────────────────┘                          └──────────────┘
```

---

## 🔐 Autenticación

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

## 🌐 Endpoints de la API

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

## 🏛️ Modelos y Relaciones

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

## ▶️ Ejecución

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

## 🧪 Testing

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

## 📖 Documentación API

### Swagger/OpenAPI

La documentación interactiva está disponible en:
```
http://localhost:8000/api/documentation
```

### Generar Documentación

```bash
php artisan l5-swagger:generate
```

### Comentarios PHPDoc

Todos los endpoints usan comentarios PHPDoc con anotaciones OpenAPI:

```php
/**
 * @OA\Get(
 *     path="/api/projects",
 *     summary="Obtener lista de proyectos",
 *     @OA\Response(response=200, description="Lista de proyectos")
 * )
 */
public function index() { ... }
```

---

## 🎯 Buenas Prácticas Implementadas

### ✅ Código Limpio
- Nombres descriptivos en variables, funciones, clases
- Métodos pequeños y enfocados
- Principio de responsabilidad única

### ✅ Documentación
- Comentarios PHPDoc en todo el código
- Explicación del "qué" y el "cómo"
- Ejemplos de uso

### ✅ Seguridad
- Validación de entrada robusta
- Protección contra inyección SQL (Eloquent)
- Autenticación y autorización basada en roles
- Hashing de contraseñas

### ✅ Rendimiento
- Carga anticipada de relaciones (eager loading)
- Paginación de resultados
- Uso de indices en BD

### ✅ Testing
- Tests unitarios
- Tests funcionales
- Coverage de código

---

## 📋 Enumeraciones

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

---

## 🚀 Despliegue en Producción

### Configuración

```bash
# Modo producción
APP_ENV=production
APP_DEBUG=false

# Caché
php artisan config:cache
php artisan route:cache

# Optimización
composer install --optimize-autoloader --no-dev
```

### Servidor Web

Usar **Nginx** o **Apache** con:
- DocumentRoot apuntando a `public/`
- PHP 8.2+
- MySQL 8.0+

---

## 🐛 Troubleshooting

### Error: "No application encryption key"
```bash
php artisan key:generate
```

### Error: "SQLSTATE[HY000]: General error"
```bash
php artisan migrate:fresh --seed
```

### Error: Token inválido (401)
- Verificar que el token se envía en el header correcto
- Verificar que el token no ha expirado
- Regenerar token con login

---

## 📞 Soporte y Contribuciones

Para reportar problemas o sugerencias, abrir un issue en el repositorio.

---

## 📄 Licencia

Este proyecto está bajo licencia MIT.

---

## 👨‍💻 Autor

Equipo de Desarrollo - ARQUINEXOS
Año: 2026

---

**Última actualización:** 29 de Abril de 2026
**Versión:** 1.0.0
**Framework:** Laravel 12 con Sanctum

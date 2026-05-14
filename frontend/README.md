GrantTrap - Frontend Application

**Interfaz de Usuario para la Gestión de Proyectos y Tareas en Arquitectura**

---

## Tabla de Contenidos

* [Descripción General](https://www.google.com/search?q=%23descripci%C3%B3n-general)
* [Tecnologías Utilizadas](https://www.google.com/search?q=%23tecnolog%C3%ADas-utilizadas)
* [Gestión de Estado y Autenticación](https://www.google.com/search?q=%23gesti%C3%B3n-de-estado-y-autenticaci%C3%B3n)
* [Rutas y Navegación](https://www.google.com/search?q=%23rutas-y-navegaci%C3%B3n)
* [Componentes Principales](https://www.google.com/search?q=%23componentes-principales)
* [Integración con la API](https://www.google.com/search?q=%23integraci%C3%B3n-con-la-api)
* [Diseño y Estilos](https://www.google.com/search?q=%23dise%C3%B1o-y-estilos)
* [Ejecución](https://www.google.com/search?q=%23ejecuci%C3%B3n)

---

## Descripción General

GrantTrap Frontend es una aplicación **SPA (Single Page Application)** construida con **React 18** y **Vite**. Esta aplicación consume la API de GrantTrap para ofrecer una experiencia fluida tanto a jefes de proyecto como a trabajadores.

La interfaz sigue principios de **arquitectura limpia**, separando la lógica de negocio (servicios y hooks) de la capa de presentación (componentes), garantizando una experiencia de usuario (UX) adaptada a las necesidades críticas de un estudio de arquitectura.

---

## Tecnologías Utilizadas

* **Framework:** React 18 + Vite
* **Lenguaje:** TypeScript (Tipado estricto para modelos de datos)
* **Estilos:** CSS Modules 
* **Navegación:** React Router
* **Cliente HTTP:** Axios (Configurado con interceptores)

---

## Gestión de Estado y Autenticación

### Flujo de Sesión

La aplicación utiliza **Laravel Sanctum** para una autenticación segura y sin estado:

* **Persistencia:** El token de acceso se almacena en `localStorage` o `sessionStorage` para mantener la sesión activa tras recargar.
* **Protección (Guards):** Implementación de componentes de ruta de alto orden (HOC) que redirigen al login si no se detecta un token válido.
* **Sincronización:** Al inicializar la app, se realiza una llamada automática a `/api/auth/me` para validar la integridad del token y cargar los permisos del usuario.

---

## Rutas y Navegación

### Rutas Públicas

* `/` - Página de Inicio (Landing/Presentación).
* `/login` - Acceso para usuarios registrados.
* `/register` - Registro de nuevos miembros del equipo.

### Rutas Privadas

* `/projects` - Listado general de proyectos activos.
* `/projects/new` - Formulario de creación de proyectos.
* `/projects/:id` - Panel detallado de un proyecto.
* `/projects/:id/edit` - Formulario de edición.
* `/tasks` - Vista global de tareas asignadas.
* `/projects/:id/tasks/new` - Creación de tareas vinculadas a un proyecto.
* `/projects/:id/tasks/:taskId/edit` - Edición de tareas existentes.
* `/team` - Directorio del equipo de trabajo.
* `*` - Página de error 404 (Not Found).

---

## Componentes Principales

| Componente              | Función                                                             |
| ----------------------- | -------------------------------------------------------------------- |
| **Button**        | Botón genérico con variantes de estilo.                            |
| **ConfirmDelete** | Modal de seguridad para confirmación de borrado.                    |
| **ProjectCard**   | Tarjeta visual con resumen de presupuesto y fechas.                  |
| **ProjectForm**   | Formulario dinámico para creación/edición de proyectos.           |
| **ProjectList**   | Contenedor con lógica de filtrado y mapeo de proyectos.             |
| **Spinner**       | Feedback visual para tiempos de carga de la API.                     |
| **StatusBadge**   | Indicador visual de color para estados (Pendiente, Terminado, etc.). |
| **TaskForm**      | Gestión de campos para tareas y asignación de usuarios.            |
| **TaskList**      | Vista de tareas agrupadas por proyecto o usuario.                    |
| **Toast**         | Notificaciones emergentes de éxito o error.                         |

---

## Integración con la API

El frontend está sincronizado con los recursos del backend mediante servicios dedicados:

### Autenticación

| Método  | Servicio                   | Endpoint API            |
| -------- | -------------------------- | ----------------------- |
| Login    | `authService.login()`    | `POST /auth/login`    |
| Registro | `authService.register()` | `POST /auth/register` |
| Perfil   | `authService.me()`       | `GET /auth/me`        |
| Logout   | `authService.logout()`   | `POST /auth/logout`   |

### Proyectos 

| Método | Servicio                    | Endpoint API                              |
| ------- | --------------------------- | ----------------------------------------- |
| Listar  | `projectService.getAll()` | `GET /projects`                         |
| Detalle | `projectService.get()`    | `GET /projects/{id}`                    |
| Crear   | `projectService.create()` | `POST /projects`                        |
| Editar  | `projectService.update()` | `POST /projects/{id}` (Method Spoofing) |
| Borrar  | `projectService.delete()` | `DELETE /projects/{id}`                 |

### Tareas

| Método       | Servicio                        | Endpoint API                 |
| ------------- | ------------------------------- | ---------------------------- |
| Listar Global | `taskService.getAll()`        | `GET /tasks`               |
| Por Proyecto  | `taskService.getByProjects()` | `GET /projects/{id}/tasks` |
| Detalle       | `taskService.get()`           | `GET /tasks/{id}`          |
| Borrar        | `taskService.delete()`        | `DELETE /tasks/{id}`       |

---

## Diseño y Estilos

### Sistema de Colores (Brand Guidelines)

Se utilizan variables CSS para mantener la consistencia en toda la interfaz:

```css
:root {
  /* Marca y Primarios */
  --color-primary: #0d9488;
  --color-primary-dark: #065f46;
  --color-primary-light: #d1fae5;
  --color-primary-bg: #f0fdfa;

  /* Semántica de Estados */
  --color-danger: #dc2626;
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-info: #2563eb;

  /* Superficies y Texto */
  --color-bg: #f9fafb;
  --color-surface: #ffffff;
  --color-text: #111827;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
}

```

### Responsividad

La aplicación utiliza un enfoque **Mobile-First**. El diseño se adapta automáticamente mediante Media Queries y Flexbox/Grid, permitiendo que los arquitectos gestionen tareas cómodamente desde una tablet o smartphone directamente en la zona de obra.

---

## Ejecución

1. **Instalar dependencias:** `npm install`
2. **Configurar variables de entorno:** Copiar .env.local y renormbrarlo a .env
3. **Iniciar desarrollo:** `npm run dev`

# PixelTrap — Gestión de Sesiones Fotográficas

**Isaac Fernández Pintor**

## Instalación

```bash
# 1. Clonar / descomprimir el proyecto
cd practica-final-sesiones

# 2. Instalar dependencias del frontend
npm install

# 3. Levantar el backend con Docker
docker compose up -d

# 4. Arrancar el frontend
npm run dev
```

El frontend estará en **http://localhost:5173** y el backend en **http://localhost:3000**.

---

## Usuarios de prueba

| Email                 | Contraseña    |
| --------------------- | -------------- |
| `usuario@gmail.com` | `usuario`    |
| admin                 | `admin.1234` |

---

## Variables de entorno

Crear un archivo `.env` (ya incluido) con:

```
VITE_API_URL=http://localhost:3000
```

---

## Checklist de requisitos

- [X] Aplicación SPA con React + TypeScript
- [X] Consumo de API REST con Axios
- [X] CRUD completo (crear, leer, actualizar, eliminar)
- [X] Autenticación JWT (login, registro, token en headers)
- [X] Rutas públicas (Home, Login, Registro)
- [X] Rutas privadas (Sesiones, Perfil)
- [X] Página 404 (ruta comodín `*`)
- [X] Context API para gestión de autenticación
- [X] Componentes reutilizables (Button, Input, Card, Modal, Toast, etc.)
- [X] Custom hooks (`useToast`)
- [X] Gestión de estados de carga (LoadingSpinner)
- [X] Gestión de errores (toasts de error, validaciones)
- [X] Modales de confirmación (eliminación)
- [X] Filtros y búsqueda
- [X] Diseño responsive
- [X] Navegación con React Router v7
- [X] Backend dockerizado

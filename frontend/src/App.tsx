import { Routes, Route } from "react-router-dom";
import "./App.css";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./routing/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProjectsPage from "./pages/ProjectsPage";
import SessionDetailPage from "./pages/ProjectDetailPage";
import ProjectFormPage from "./pages/ProjectFormPage";
import TaskFormPage from "./pages/TaskFormPage";
import TaskPage from "./pages/TaskPage";
import TeamPage from "./pages/TeamPage";
import NotFoundPage from "./pages/NotFoundPage";

/**
 * Componente Principal - App
 * 
 * Define la estructura de enrutamiento de la aplicación.
 * Organiza todas las rutas públicas y protegidas.
 * 
 * Estructura de rutas:
 * - Públicas: Home, Login, Register
 * - Protegidas: Proyectos, Tareas, Equipo
 * - Captura: 404 Not Found
 * 
 * @returns {JSX.Element} Componente raíz con todas las rutas
 */
export default function App(): JSX.Element {
  return (
    <Routes>
      {/* Layout principal que envolverá todas las rutas */}
      <Route element={<AppLayout />}>

        {/* ---- RUTAS PÚBLICAS (sin autenticación requerida) ---- */}
        
        {/* Página de inicio */}
        <Route path="/" element={<HomePage />} />
        
        {/* Página de inicio de sesión */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Página de registro */}
        <Route path="/register" element={<RegisterPage />} />

        {/* ---- RUTAS PROTEGIDAS (requieren autenticación) ---- */}
        
        {/* Lista de todos los proyectos */}
        <Route 
          path="/projects" 
          element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} 
        />
        
        {/* Lista de todas las tareas */}
        <Route 
          path="/tasks" 
          element={<ProtectedRoute><TaskPage /></ProtectedRoute>} 
        />
        
        {/* Crear nuevo proyecto */}
        <Route 
          path="/projects/new" 
          element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>} 
        />
        
        {/* Ver detalles de un proyecto específico */}
        <Route 
          path="/projects/:id" 
          element={<ProtectedRoute><SessionDetailPage /></ProtectedRoute>} 
        />
        
        {/* Editar un proyecto existente */}
        <Route 
          path="/projects/:id/edit" 
          element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>} 
        />
        
        {/* Crear nueva tarea para un proyecto */}
        <Route 
          path="/projects/:id/tasks/new" 
          element={<ProtectedRoute><TaskFormPage /></ProtectedRoute>} 
        />
        
        {/* Editar una tarea existente */}
        <Route 
          path="/projects/:id/tasks/:taskId/edit" 
          element={<ProtectedRoute><TaskFormPage /></ProtectedRoute>} 
        />
        
        {/* Ver equipo de usuarios */}
        <Route 
          path="/team" 
          element={<ProtectedRoute><TeamPage /></ProtectedRoute>} 
        />

        {/* ---- RUTA 404 (página no encontrada) ---- */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

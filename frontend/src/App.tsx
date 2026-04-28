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

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>

        {/* ---- RUTAS PÚBLICAS ---- */}
        <Route path="/" element={<HomePage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ---- RUTAS PROTEGIDAS ---- */}
        <Route path="/projects" element={<ProtectedRoute> <ProjectsPage />  </ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute> <TaskPage /> </ProtectedRoute>} />
        <Route path="/projects/new" element={ <ProtectedRoute > <ProjectFormPage /> </ProtectedRoute>} />
        <Route path="/projects/:id" element={ <ProtectedRoute> <SessionDetailPage /> </ProtectedRoute>} />
        <Route path="/projects/:id/edit" element={<ProtectedRoute > <ProjectFormPage /> </ProtectedRoute>} />
        <Route path="/projects/:id/tasks/new" element={<ProtectedRoute > <TaskFormPage /> </ProtectedRoute>} />
        <Route path="/projects/:id/tasks/:taskId/edit" element={<ProtectedRoute > <TaskFormPage /> </ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute> <TeamPage /> </ProtectedRoute>} />

        {/* ---- RUTA 404 ---- */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

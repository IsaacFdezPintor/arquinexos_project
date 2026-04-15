import { Routes, Route } from "react-router-dom";
import "./App.css";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./routing/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProyectsPage from "./pages/ProjectsPage";
import SessionDetailPage from "./pages/SessionDetailPage";
import ProjectCreatePage from "./pages/ProjectCreatePage";
import SessionEditPage from "./pages/SessionEditPage";
import TaskCreatePage from "./pages/TaskCreatePage";
import TaskEditPage from "./pages/TaskEditPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>

        {/* ---- RUTAS PÚBLICAS ---- */}
        <Route path="/" element={<HomePage />} /> {/* TODO Asignación de Pagina de Inicio */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ---- RUTAS PROTEGIDAS ---- */}
        <Route path="/projects" element={<ProtectedRoute> <ProyectsPage />  </ProtectedRoute>} />
        <Route path="/projects/new" element={ <ProtectedRoute> <ProjectCreatePage /> </ProtectedRoute>} />
        <Route path="/sessions/:id" element={ <ProtectedRoute> <SessionDetailPage /> </ProtectedRoute>} />
        <Route path="/sessions/:id/edit" element={<ProtectedRoute> <SessionEditPage /> </ProtectedRoute>} />
        <Route path="/sessions/:id/tasks/new" element={<ProtectedRoute> <TaskCreatePage /> </ProtectedRoute>} />
        <Route path="/sessions/:id/tasks/:taskId/edit" element={<ProtectedRoute> <TaskEditPage /> </ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute> <ProfilePage /> </ProtectedRoute>} />

        {/* ---- RUTA 404 ---- */}
        {/* "*" captura cualquier URL que no coincida con las anteriores */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

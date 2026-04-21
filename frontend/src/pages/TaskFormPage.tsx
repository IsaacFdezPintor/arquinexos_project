import { useState, useEffect } from "react";
import { useNavigate, useParams, Link, Navigate } from "react-router-dom";
import { taskService } from "../services/taskService.ts";
import type { Task } from "../types/Task.ts";
import TaskForm from "../components/TaskForm/TaskForm.tsx";
import { ToastContainer } from "../components/Toast/Toast.tsx";
import { useToast } from "../components/Toast/useToast.tsx";
import { useAuth } from "../auth/authContext.tsx";
import { ArrowLeft, ListTodo, Loader } from "lucide-react";

export default function TaskFormPage() {
  const { user, isJefe } = useAuth();
  const navigate = useNavigate();
  
  // id = projectId, taskId = opcional (solo para edición)
  const { id: projectId, taskId } = useParams<{ id: string; taskId: string }>();
  
  const [loading, setLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(!!taskId); // Solo carga si hay taskId
  const [task, setTask] = useState<Task | null>(null);

  const { toasts, addToast, removeToast } = useToast();

  // Determinar si estamos editando o creando
  const isEditMode = Boolean(taskId);
  const backUrl = `/projects/${projectId}`;

  // Protección de ruta
  if (user && !isJefe) {
    return <Navigate to="/projects" replace />;
  }

  // Cargar la tarea solo si es modo edición
  useEffect(() => {
    if (!isEditMode) return;
    
    setTaskLoading(true);
    taskService.get(Number(taskId))
      .then(setTask)
      .catch(() => addToast("Tarea no encontrada", "error"))
      .finally(() => setTaskLoading(false));
  }, [taskId, isEditMode]);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (isEditMode) {
        await taskService.update(data);
        addToast("Tarea actualizada correctamente", "success");
      } else {
        await taskService.create(data);
        addToast("Tarea creada correctamente", "success");
      }
      setTimeout(() => navigate(backUrl), 400);
    } catch (error: any) {
      console.error(`❌ Error al ${isEditMode ? 'actualizar' : 'crear'} tarea:`, error);
      
      let errorMessage = `Error al ${isEditMode ? 'actualizar' : 'crear'} la tarea`;
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).flat().join(", ");
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      addToast(errorMessage, "error");
      setLoading(false);
    }
  };

  // Errores de parámetros
  if (!projectId || (isEditMode && !taskId)) {
    return (
      <div className="session-form-page">
        <Link to="/projects" className="session-detail__back">
          <ArrowLeft size={18} /> Volver
        </Link>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1>Parámetros inválidos</h1>
          <p>No se puede procesar la tarea sin los identificadores necesarios.</p>
        </div>
      </div>
    );
  }

  // Estado de carga inicial (solo edición)
  if (isEditMode && taskLoading) {
    return (
      <div className="session-form-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <Loader size={48} className="spin" style={{ color: "var(--color-primary)" }} />
      </div>
    );
  }

  // Si es edición y no se encontró la tarea
  if (isEditMode && !task) {
    return (
      <div className="session-form-page">
        <Link to={backUrl} className="session-detail__back">
          <ArrowLeft size={18} /> Volver
        </Link>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1>Tarea no encontrada</h1>
          <p>La tarea que intentas editar no existe o no tienes acceso.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="session-form-page">
      <Link to={backUrl} className="session-detail__back">
        <ArrowLeft size={18} /> Volver
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
        <ListTodo size={32} style={{ color: "var(--color-primary)" }} />
        <h1 style={{ margin: 0 }}>{isEditMode ? "Editar Tarea" : "Nueva Tarea"}</h1>
        {loading && <Loader size={24} className="spin" style={{ color: "var(--color-primary)", marginLeft: "auto" }} />}
      </div>

      <TaskForm 
        addTask={!isEditMode ? handleSubmit : () => {}}  
        updateTask={isEditMode ? handleSubmit : () => {}}
        cancelUpdateTask={() => navigate(backUrl)} 
        taskSeleccionada={task}  
        projectId={Number(projectId)}
      />     

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
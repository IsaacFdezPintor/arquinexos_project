import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { taskService } from "../services/taskService.ts";
import type { Task } from "../types/Task.ts";
import TaskForm from "../components/TaskForm/TaskForm.tsx";
import { ToastContainer } from "../components/Toast/Toast.tsx";
import { useToast } from "../components/Toast/useToast.tsx";
import { ArrowLeft, ListTodo, Loader } from "lucide-react";

export default function TaskEditPage() {
  const navigate = useNavigate();
  const { id: projectId, taskId } = useParams<{ id: string; taskId: string }>();
  const [loading, setLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);

  const { toasts, addToast, removeToast } = useToast();

  // Cargar la tarea existente
  useEffect(() => {
    if (!taskId) return;
    setTaskLoading(true);
    taskService.get(Number(taskId))
      .then(setTask)
      .catch(() => addToast("Tarea no encontrada", "error"))
      .finally(() => setTaskLoading(false));
  }, [taskId]);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await taskService.update(data);
      addToast("Tarea actualizada correctamente", "success");
      setTimeout(() => navigate(`/sessions/${projectId}`), 400);
    } catch (error: any) {
      console.error("❌ Error al actualizar tarea:", error);
      
      let errorMessage = "Error al actualizar la tarea";
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      addToast(errorMessage, "error");
      setLoading(false);
    }
  };

  if (!projectId || !taskId) {
    return (
      <div className="session-form-page">
        <Link to="/sessions" className="session-detail__back">
          <ArrowLeft size={18} /> Volver
        </Link>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          marginTop: "2rem",
          padding: "2rem",
        }}>
          <h1>Parámetros inválidos</h1>
          <p>No se puede editar la tarea sin proyecto.</p>
        </div>
      </div>
    );
  }

  if (taskLoading) {
    return (
      <div className="session-form-page">
        <Link to={`/sessions/${projectId}`} className="session-detail__back">
          <ArrowLeft size={18} /> Volver
        </Link>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          minHeight: "400px"
        }}>
          <Loader size={48} style={{ 
            color: "var(--color-primary)", 
            animation: "spin 1s linear infinite"
          }} />
          <p>Cargando tarea...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="session-form-page">
        <Link to={`/sessions/${projectId}`} className="session-detail__back">
          <ArrowLeft size={18} /> Volver
        </Link>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          marginTop: "2rem",
          padding: "2rem",
        }}>
          <h1>Tarea no encontrada</h1>
          <p>La tarea que intentas editar no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="session-form-page">
      <Link to={`/sessions/${projectId}`} className="session-detail__back">
        <ArrowLeft size={18} /> Volver
      </Link>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "2rem"
      }}>
        <ListTodo size={32} style={{ color: "var(--color-primary)" }} />
        <h1 style={{ margin: 0 }}>Editar Tarea</h1>
        {loading && (
          <Loader size={24} style={{ 
            color: "var(--color-primary)",
            animation: "spin 1s linear infinite",
            marginLeft: "auto"
          }} />
        )}
      </div>
      <TaskForm 
        addTask={() => {}}  
        updateTask={handleSubmit}
        peticionEnProgreso={loading}  
        cancelUpdateTask={() => navigate(`/sessions/${projectId}`)} 
        taskSeleccionada={task}  
        projectId={Number(projectId)}
      />     
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

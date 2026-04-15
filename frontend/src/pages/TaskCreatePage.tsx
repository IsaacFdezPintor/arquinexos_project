import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { taskService } from "../services/taskService.ts";
import TaskForm from "../components/TaskForm/TaskForm.tsx";
import { ToastContainer } from "../components/Toast/Toast.tsx";
import { useToast } from "../components/Toast/useToast.tsx";
import { ArrowLeft, ListTodo, Loader } from "lucide-react";

export default function TaskCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  const { toasts, addToast, removeToast } = useToast();

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await taskService.create(data);
      addToast("Tarea creada correctamente", "success");
      setTimeout(() => navigate(`/sessions/${id}`), 400);
    } catch (error: any) {
      console.error("❌ Error al crear tarea:", error);
      
      let errorMessage = "Error al crear la tarea";
      
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

  const projectId = Number(id);

  if (!id) {
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
          <p>No se puede crear la tarea sin proyecto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="session-form-page">
      <Link to={`/sessions/${id}`} className="session-detail__back">
        <ArrowLeft size={18} /> Volver
      </Link>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "2rem"
      }}>
        <ListTodo size={32} style={{ color: "var(--color-primary)" }} />
        <h1 style={{ margin: 0 }}>Nueva Tarea</h1>
        {loading && (
          <Loader size={24} style={{ 
            color: "var(--color-primary)",
            animation: "spin 1s linear infinite",
            marginLeft: "auto"
          }} />
        )}
      </div>
      <TaskForm 
        addTask={handleSubmit}  
        peticionEnProgreso={loading}  
        cancelUpdateTask={() => navigate(`/sessions/${id}`)} 
        taskSeleccionada={null}  
        updateTask={() => {}} 
        projectId={projectId}
      />     
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
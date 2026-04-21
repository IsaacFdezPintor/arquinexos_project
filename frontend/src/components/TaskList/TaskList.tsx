import { useEffect, useState } from "react";
import type { Task } from "../../types/Task";
import { taskService } from "../../services/taskService";
import { CheckCircle2, Edit2, Loader, User, Calendar, Inbox, AlertCircle,MessageSquare } from "lucide-react";
import "./TaskList.css";

type TaskListProps = {
  projectId?: number;
  userId?: number;
  onTaskDeleted?: () => void;
  onTaskEdit?: (taskId: number) => void;
  canManage?: boolean;
};



export default function TaskList({ projectId, userId, onTaskDeleted, onTaskEdit, canManage = false }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, [projectId, userId]);

  const loadTasks = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = projectId
        ? await taskService.getByProject(projectId)
        : await taskService.getAll();

      const filtered = userId
        ? data.filter((task) => Number(task.assigned_user_id) === Number(userId))
        : data;

      setTasks(filtered);
    } catch {
      setErrorMessage("No se pudieron cargar las tareas. Intentalo de nuevo.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (taskId: number | undefined) => {
    if (!taskId) return;
    setErrorMessage(null);
    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      onTaskDeleted?.();
    } catch {
      setErrorMessage("No se pudo completar la tarea.");
    }
  };

  if (loading) {
    return (
      <div className="task-list task-list--loading">
        <Loader size={24} style={{ animation: "spin 1s linear infinite" }} />
        <p>Cargando tareas...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list task-list--empty">
        <div className="empty-state-container">
          <Inbox size={40} className="empty-state-icon" />
          <h3>No hay tareas disponibles</h3>
          <p>
            {projectId 
              ? "Este proyecto aún no tiene tareas asignadas." 
              : "Actualmente no tienes tareas pendientes en tu lista." } (${tasks.length})
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      {errorMessage && (
        <div className="task-list task-list--error">
          <p><AlertCircle size={18} style={{ display: "inline", marginRight: "0.35rem" }} /> {errorMessage}</p>
        </div>
      )}

      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          
          <div className="task-item__content">
            <h4 className="task-item__name">{task.name}</h4>
            <div className="task-item__meta">
              {task.assigned_user_name && (
                <span className="task-item__assigned"><User size={14} style={{ display: "inline", marginRight: "0.25rem" }} /> {task.assigned_user_name}</span>
              )}
              {task.description && (
                <span className="task-item__description"><MessageSquare size={14} style={{ display: "inline", marginRight: "0.25rem" }} />{task.description}</span>
              )}
              {task.start_date && (
                <span className="task-item__date"><Calendar size={14} style={{ display: "inline", marginRight: "0.25rem" }} /> {new Date(task.start_date).toLocaleDateString("es-ES")}</span>
              )}
            </div>
          </div>

          <div className="task-item__actions">
            {canManage && (
              <button
                className="task-item__action-btn"
                onClick={() => onTaskEdit?.(task.id!)}
                title="Editar"
              >
                <Edit2 size={16} />
              </button>
            )}
            <button
              className="task-item__action-btn task-item__action-btn--complete"
              onClick={() => handleComplete(task.id)}
              title="Completar tarea"
            >
              <CheckCircle2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

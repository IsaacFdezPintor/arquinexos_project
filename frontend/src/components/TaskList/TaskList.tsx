import { useEffect, useState } from "react";
import type { Task } from "../../types/Task";
import { taskService } from "../../services/taskService";
import { CheckCircle, AlertCircle, Clock, Trash2, Edit2, Loader, User, Calendar, Inbox } from "lucide-react";
import "./TaskList.css";

type TaskListProps = {
  projectId: number;
  onTaskDeleted?: () => void;
  onTaskEdit?: (taskId: number) => void;
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  "pendiente": <Clock size={16} />,
  "en_progreso": <Loader size={16} style={{ animation: "spin 1s linear infinite" }} />,
  "completada": <CheckCircle size={16} />,
  "cancelada": <AlertCircle size={16} />,
};

const STATUS_COLORS: Record<string, string> = {
  "pendiente": "var(--color-warning)",
  "en_progreso": "var(--color-primary)",
  "completada": "var(--color-success)",
  "cancelada": "var(--color-error)",
};

export default function TaskList({ projectId, onTaskDeleted, onTaskEdit }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getByProject(projectId);
      setTasks(data);
    } catch (error) {
      console.error("❌ Error al cargar tareas:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId: number | undefined) => {
    if (!taskId) return;
    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      onTaskDeleted?.();
    } catch (error) {
      console.error("❌ Error al eliminar tarea:", error);
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
        <p><Inbox size={20} style={{ display: "inline" }} /> No hay tareas en este proyecto</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          <div className="task-item__status">
            <span style={{ color: STATUS_COLORS[task.status] }}>
              {STATUS_ICONS[task.status]}
            </span>
          </div>
          
          <div className="task-item__content">
            <h4 className="task-item__name">{task.name}</h4>
            <div className="task-item__meta">
              {task.assigned_user_name && (
                <span className="task-item__assigned"><User size={14} style={{ display: "inline", marginRight: "0.25rem" }} /> {task.assigned_user_name}</span>
              )}
              {task.start_date && (
                <span className="task-item__date"><Calendar size={14} style={{ display: "inline", marginRight: "0.25rem" }} /> {new Date(task.start_date).toLocaleDateString("es-ES")}</span>
              )}
            </div>
          </div>

          <div className="task-item__actions">
            <button 
              className="task-item__action-btn"
              onClick={() => onTaskEdit?.(task.id!)}
              title="Editar"
            >
              <Edit2 size={16} />
            </button>
            <button 
              className="task-item__action-btn task-item__action-btn--danger"
              onClick={() => handleDelete(task.id)}
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

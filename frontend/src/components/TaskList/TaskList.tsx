import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Toast/useToast";
import type { Task } from "../../types/Task";
import { taskService } from "../../services/taskService";
import { Trash2, Edit2, User, Calendar, Inbox, AlertCircle, MessageSquare, X, Info } from "lucide-react";
import Button from "../Button/Button";
import "./TaskList.css";

type TaskListProps = {
  projectId?: number;
  userId?: number;
  priority?: string;
  onTaskDeleted?: () => void;
  onTaskEdit?: (taskId: number) => void;
  canManage?: boolean;
  showAllTeamTasks?: boolean;
};

const PRIORITY_MAP = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
  completed: "Completado"
} as const;

const getPriorityLabel = (priority: string): string => {
  return PRIORITY_MAP[priority as keyof typeof PRIORITY_MAP] || priority;
};

export default function TaskList({ projectId, userId, priority = "", onTaskDeleted, onTaskEdit, canManage = false, showAllTeamTasks = false }: TaskListProps) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, [projectId, userId, priority, showAllTeamTasks]);

  const loadTasks = async () => {
    setErrorMessage(null);
    try {
      const data = projectId
        ? await taskService.getByProject(projectId)
        : await taskService.getAll();

      let filtered = (userId && !showAllTeamTasks)
        ? data.filter((task) => task.users?.some((u: any) => Number(u.id) === Number(userId)))
        : data;

      // Si no hay filtro de prioridad, mostrar todas MENOS las completadas
      if (priority === "") {
        filtered = filtered.filter((task) => task.priority !== "completed");
      } else if (priority && priority !== "") {
        // Si hay filtro de prioridad específico, aplicarlo
        filtered = filtered.filter((task) => task.priority === priority);
      }

      setTasks(filtered);
    } catch {
      setErrorMessage("No se pudieron cargar las tareas. Intentalo de nuevo.");
      setTasks([]);
    } 
  };

  const handleComplete = async (taskId: number | undefined) => {
    if (!taskId) return;
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) return;
      
      // Cambiar prioridad a "completed"
      const updatedTask = { ...taskToUpdate, priority: "completed" as const };
      await taskService.update(updatedTask);
      
      // Si estamos en la vista "Todos", filtrar la tarea completada
      // Si estamos en otra vista (como "Completada"), mantenerla
      if (priority === "") {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      } else {
        setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      }
      
      addToast("Tarea marcada como completada", "info");
      setSelectedTask(null);
    } catch (err) {
      addToast("Error al completar la tarea", "error");
    }
  };

  const handleDelete = async (taskId: number | undefined) => {
    if (!taskId) return;
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      onTaskDeleted?.();
      addToast("Tarea eliminada", "success");
      setSelectedTask(null);
    } catch (err) {
      addToast("Error al eliminar la tarea", "error");
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="task-list task-list--empty">
        <div className="empty-state-container">
          <Inbox size={40} className="empty-state-icon" />
          <h3>No hay tareas disponibles</h3>
          <p>{projectId ? "Este proyecto aún no tiene tareas asignadas." : "No tienes tareas pendientes."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      {errorMessage && (
        <div className="task-list--error">
          <p><AlertCircle size={18} /> {errorMessage}</p>
        </div>
      )}

      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          <div className="task-item__content">
            <h4 className="task-item__name">{task.name}</h4>
            <div className="task-item__meta">
              {(task.users?.length ?? 0) > 0 ? (
                <span className="task-item__assigned">
                  <User size={14} /> {task.users?.map(u => u.name).join(", ")}
                </span>
              ) : task.assigned_user_name && (
                <span className="task-item__assigned"><User size={14} /> {task.assigned_user_name}</span>
              )}
              {task.description && <span className="task-item__description"><MessageSquare size={14} /> {task.description}</span>}
              {task.start_date && <span className="task-item__date"><Calendar size={14} /> {new Date(task.start_date).toLocaleDateString("es-ES")}</span>}
              {task.priority && <span className="task-item__priority"><AlertCircle size={14} /> {getPriorityLabel(task.priority)}</span>}
              {task.project?.name && <span className="task-item__priority"><AlertCircle size={14} /> {task.project.name}</span>}

            </div>
          </div>

          <div className="task-item__actions">
            {canManage && onTaskEdit && (
              <button className="task-item__action-btn" onClick={(e) => { e.stopPropagation(); onTaskEdit(task.id!); }} title="Editar">
                <Edit2 size={16} />
              </button>
            )}
            {canManage && task.priority === "completed" && (
              <button className="task-item__action-btn" onClick={(e) => { e.stopPropagation(); handleDelete(task.id!); }} title="Eliminar">
                <Trash2 size={16} />
              </button>
            )}
            <button className="task-item__action-btn " onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }} title="Información">
              <Info size={16} />
            </button>
          </div>
        </div>
      ))}

     {selectedTask && (
<div className="task-modal-overlay" onClick={() => setSelectedTask(null)}>
<div className="task-modal" onClick={(e) => e.stopPropagation()}>
<div className="task-modal__header">
<h2 className="task-modal__title">{selectedTask.name}</h2>
<button
className="task-modal__close"
onClick={() => setSelectedTask(null)}
title="Cerrar"
>
<X size={24} />
</button>
</div>

<div className="task-modal__content">
{selectedTask.description && (
<div className="task-modal__section">
<h3 className="task-modal__section-title">Descripción</h3>
<p className="task-modal__text">{selectedTask.description}</p>
</div>
)}

<div className="task-modal__section">
<h3 className="task-modal__section-title">Prioridad</h3>
<span className="task-modal__priority">{getPriorityLabel(selectedTask.priority)}</span>
</div>

{selectedTask.users && selectedTask.users.length > 0 && (
<div className="task-modal__section">
<h3 className="task-modal__section-title">Asignado a</h3>
<div className="task-modal__users">
{selectedTask.users.map((user) => (
<div key={user.id} className="task-modal__user">
<User size={16} />
<span>{user.name}</span>
<span className="task-modal__user-email">{user.email}</span>
</div>
))}
</div>
</div>
)}

{selectedTask.start_date && (
<div className="task-modal__section">
<h3 className="task-modal__section-title">Fecha de inicio</h3>
<p className="task-modal__text">
<Calendar size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
{new Date(selectedTask.start_date).toLocaleDateString("es-ES")}
</p>
</div>
)}

{selectedTask.end_date && (
<div className="task-modal__section">
<h3 className="task-modal__section-title">Fecha de finalización</h3>
<p className="task-modal__text">
<Calendar size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
{new Date(selectedTask.end_date).toLocaleDateString("es-ES")}
</p>
</div>
)}

</div>

<div className="task-modal__footer">
<Button
text="Ir al proyecto"
style="gris"
onClick={() => {
if (selectedTask?.project) {
navigate(`/projects/${selectedTask.project.id}`);
setSelectedTask(null);
}
}}
/>
<Button
text="Completar tarea"
style="verde"
onClick={() => {
handleComplete(selectedTask.id);
setSelectedTask(null);
}}
/>
</div>
</div>
</div>
)}
</div>
);
}

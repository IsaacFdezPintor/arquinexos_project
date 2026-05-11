import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Toast/useToast";
import type { Task } from "../../types/Task";
import { taskService } from "../../services/taskService";
import { Trash2, Edit2, User, Calendar, Inbox, AlertCircle, MessageSquare, X, Info } from "lucide-react";
import Button from "../Button/Button";
import "./TaskList.css";

/**
 * Propiedades para el componente TaskList.
 */
type TaskListProps = {
  /** ID opcional para filtrar tareas de un proyecto específico. */
  projectId?: number;
  /** ID opcional para filtrar tareas asignadas a un usuario concreto. */
  userId?: number;
  /** Filtro de prioridad . Si está vacío, oculta las completadas. */
  priority?: string;
  /** Callback ejecutado tras eliminar una tarea con éxito. */
  onTaskDeleted?: () => void;
  /** Callback para abrir el formulario de edición de una tarea. */
  onTaskEdit?: (task: Task) => void;
  /** Define si el usuario actual tiene permisos para editar o borrar. */
  canManage?: boolean;
  /** Si es true, ignora el filtro de userId y muestra todas las del equipo. */
  showAllTeamTasks?: boolean;
};

/**
 * Mapeo de identificadores de prioridad a sus nombres.
 */
const PRIORITY_MAP = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
  completed: "Completado"
} as const;

/**
 * Helper para obtener la etiqueta de prioridad formateada.
 * @param {string} priority - Valor técnico de la prioridad.
 * @returns {string} Etiqueta para mostrar en la interfaz.
 */
const getPriorityLabel = (priority: string): string => {
  return PRIORITY_MAP[priority as keyof typeof PRIORITY_MAP] || priority;
};

/**
 * Componente que renderiza una lista de tareas con capacidades de filtrado.
 *  
 * @param {TaskListProps} props - Propiedades del componente.
 * @returns {JSX.Element} Lista de tareas o estado vacío.
 */
export default function TaskList({ 
  projectId, 
  userId, 
  priority = "", 
  onTaskDeleted, 
  onTaskEdit, 
  canManage = false, 
  showAllTeamTasks = false 
}: TaskListProps) {
  
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  // --- Estados locales ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  /**
   * Efecto que recarga las tareas cada vez que cambian los filtros principales.
   */
  useEffect(() => {
    loadTasks();
  }, [projectId, userId, priority, showAllTeamTasks]);

  /**
   * Obtiene las tareas del servicio y aplica la lógica de filtrado en cliente.
   * @returns {Promise<void>}
   */
  const loadTasks = async () => {
    setErrorMessage(null);
    try {
      const data = projectId
        ? await taskService.getByProject(projectId)
        : await taskService.getAll();

      // Filtro por Usuario
      let filtered = (userId && !showAllTeamTasks)
        ? data.filter((task) => task.users?.some((u: any) => Number(u.id) === Number(userId)))
        : data;

      // Lógica de Prioridad:
      // Si no hay filtro, ocultamos las completadas por defecto.
      if (priority === "") {
        filtered = filtered.filter((task) => task.priority !== "completed");
      } else if (priority && priority !== "") {
        filtered = filtered.filter((task) => task.priority === priority);
      }

      setTasks(filtered);
    } catch {
      setErrorMessage("No se pudieron cargar las tareas. Intentalo de nuevo.");
      setTasks([]);
    } 
  };

  /**
   * Marca una tarea como completada en el backend y actualiza la lista local.
   * @param {number | undefined} taskId - ID de la tarea a completar.
   */
  const handleComplete = async (taskId: number | undefined) => {
    if (!taskId) return;
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) return;
      
      const updatedTask = { ...taskToUpdate, priority: "completed" as const };
      await taskService.update(updatedTask);
      
      // Si la vista actual excluye completadas, la quitamos de la lista
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

  /**
   * Elimina una tarea definitivamente.
   * @param {number | undefined} taskId - ID de la tarea a eliminar.
   */
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

  // --- Renderizado de Estado Vacío ---
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

      {/* Renderizado de la lista de tareas */}
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          <div className="task-item__content">
            <h4 className="task-item__name">{task.name}</h4>
            <div className="task-item__meta">
              {/* Asignatarios */}
              <span className="task-item__assigned">
                <User size={14} /> {task.users?.map(u => u.name).join(", ") || task.assigned_user_name}
              </span>
              
              {/* Metadatos secundarios */}
              {task.description && <span className="task-item__description"><MessageSquare size={14} /> {task.description}</span>}
              {task.start_date && <span className="task-item__date"><Calendar size={14} /> {new Date(task.start_date).toLocaleDateString("es-ES")}</span>}
              <span className="task-item__priority"><AlertCircle size={14} /> {getPriorityLabel(task.priority)}</span>
            </div>
          </div>

          <div className="task-item__actions">
            {canManage && onTaskEdit && (
              <button className="task-item__action-btn" onClick={() => onTaskEdit(task)} title="Editar">
                <Edit2 size={16} />
              </button>
            )}
            {canManage && task.priority === "completed" && (
              <button className="task-item__action-btn" onClick={() => handleDelete(task.id!)} title="Eliminar">
                <Trash2 size={16} />
              </button>
            )}
            <button className="task-item__action-btn" onClick={() => setSelectedTask(task)} title="Información">
              <Info size={16} />
            </button>
          </div>
        </div>
      ))}

      {/* --- Modal de Detalles --- */}
      {selectedTask && (
        <div className="task-modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="task-modal__header">
              <h2 className="task-modal__title">{selectedTask.name}</h2>
              <button className="task-modal__close" onClick={() => setSelectedTask(null)}><X size={24} /></button>
            </div>

            <div className="task-modal__content">
              {/* Descripción */}
              {selectedTask.description && (
                <div className="task-modal__section">
                  <h3 className="task-modal__section-title">Descripción</h3>
                  <p className="task-modal__description">{selectedTask.description}</p>
                </div>
              )}

              {/* Prioridad */}
              <div className="task-modal__section">
                <h3 className="task-modal__section-title">Prioridad</h3>
                <div className="task-modal__priority">
                  <AlertCircle size={16} /> {getPriorityLabel(selectedTask.priority)}
                </div>
              </div>

              {/* Fechas */}
              <div className="task-modal__section">
                <h3 className="task-modal__section-title">Fechas</h3>
                <div className="task-modal__dates">
                  {selectedTask.start_date && (
                    <div className="task-modal__date-item">
                      <span className="task-modal__date-label">Inicio:</span>
                      <span>{new Date(selectedTask.start_date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                  )}
                  {selectedTask.end_date && (
                    <div className="task-modal__date-item">
                      <span className="task-modal__date-label">Vencimiento:</span>
                      <span>{new Date(selectedTask.end_date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Proyecto */}
              {selectedTask.project && (
                <div className="task-modal__section">
                  <h3 className="task-modal__section-title">Proyecto</h3>
                  <div className="task-modal__project">
                    <span>{selectedTask.project.name}</span>
                    {selectedTask.project.type && <span className="task-modal__type-badge">{selectedTask.project.type}</span>}
                  </div>
                </div>
              )}

              {/* Asignado a */}
              <div className="task-modal__section">
                <h3 className="task-modal__section-title">Asignado a</h3>
                <div className="task-modal__users">
                  {selectedTask.users && selectedTask.users.length > 0 ? (
                    selectedTask.users.map((user) => (
                      <div key={user.id} className="task-modal__user">
                        <User size={16} /> <span>{user.name}</span>
                      </div>
                    ))
                  ) : (
                    <span className="task-modal__no-users">Sin asignar</span>
                  )}
                </div>
              </div>
            </div>

            <div className="task-modal__footer">
              <Button text="Ir al proyecto" style="gris" onClick={() => navigate(`/projects/${selectedTask.project?.id}`)} />
              <Button text="Completar tarea" style="verde" onClick={() => handleComplete(selectedTask.id)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
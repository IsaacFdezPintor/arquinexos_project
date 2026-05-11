import { useState, useEffect } from "react";
import type { Task, TaskPriority } from "../../types/Task";
import type { User } from "../../types/Auth";
import Button from "../Button/Button";
import { userService } from "../../services/userService";
import { FileText, CheckCircle, Calendar, MessageSquare, User as UserIcon } from "lucide-react";
import "./TaskForm.css";

/**
 * Propiedades para el componente TaskForm.
 */
type TaskFormProps = {
  /** Callback para añadir una nueva tarea. */
  addTask: (data: Task) => void;
  /** Callback para actualizar una tarea existente. */
  updateTask: (task: Task) => void;
  /** Callback para cancelar la operación y cerrar el formulario. */
  cancelUpdateTask: () => void;
  /** La tarea a editar, o null si se está creando una nueva. */
  taskSeleccionada: Task | null;
  /** ID del proyecto al que pertenece la tarea  */
  projectId?: number;
};

/**
 * Opciones de prioridad con sus respectivas etiquetas legibles.
 */
const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Medio" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

/**
 * Formulario especializado en la gestión de tareas.
* 
 * @param {TaskFormProps} props - Propiedades del componente.
 * @returns {JSX.Element} El formulario de tareas renderizado.
 */
export default function TaskForm({
  addTask,
  taskSeleccionada,
  updateTask,
  cancelUpdateTask,
  projectId,
}: TaskFormProps) {
  // --- Estados del Formulario ---
  const [name, setName] = useState(taskSeleccionada?.name ?? "");
  const [priority, setPriority] = useState<TaskPriority>(taskSeleccionada?.priority ?? "low");
  const [startDate, setStartDate] = useState(taskSeleccionada?.start_date ?? "");
  const [endDate, setEndDate] = useState(taskSeleccionada?.end_date ?? "");
  const [description, setDescription] = useState(taskSeleccionada?.description ?? "");
  const [usersError, setUsersError] = useState<string | null>(null);
  
  // --- Estados para Gestión de Usuarios ---
  const [assignedUserIds, setAssignedUserIds] = useState<number[]>(
    taskSeleccionada?.users?.map(u => u.id) || (taskSeleccionada?.assigned_user_id ? [taskSeleccionada.assigned_user_id] : [])
  );
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  /**
   * Efecto de carga inicial: Obtiene la lista global de usuarios para el selector.
   */
  useEffect(() => {
    userService.getAll()
      .then(data => setUsers(data))
      .catch(() => {
        setUsersError("No se pudieron cargar los usuarios.");
        setUsers([]);
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  /**
   * Maneja el cambio en el selector múltiple de usuarios.
   * 
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Evento de cambio del select.
   */
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
    setAssignedUserIds(selectedOptions);
  };

  /**
   * Procesa el envío del formulario, diferenciando entre creación y actualización.
   * Valida campos obligatorios antes de disparar los callbacks.
   */
  function handleSubmit() {
    if (name.trim().length > 0 && projectId && startDate && endDate) {
      const baseTask = {
        name: name.trim(),
        priority,
        start_date: startDate,
        end_date: endDate,
        description: description || undefined,
        user_ids: assignedUserIds, // IDs para sincronización en la tabla pivote
      };

      if (taskSeleccionada != null) {
        updateTask({ ...taskSeleccionada, ...baseTask });
      } else {
        addTask({ ...baseTask, project_id: projectId } as Task);
      }
    }
  }

  return (
    <form className="task-form" onSubmit={(e) => e.preventDefault()}>
      <fieldset className="form-fieldset">
        <legend>Datos principales de la tarea</legend>
        <p className="form-help">Rellena los datos obligatorios para crear o editar la tarea.</p>

        <div className="form-grid">
          {/* Campo: Nombre */}
          <div className="form-group">
            <label className="form-label"><FileText size={16} /> Nombre de la Tarea</label>
            <input
              type="text"
              placeholder="Ej: Fundar cimientos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Campo: Prioridad */}
          <div className="form-group">
            <label className="form-label"><CheckCircle size={16} /> Prioridad</label>
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value as TaskPriority)} 
              className="form-select" 
              required
            >
              {PRIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Campos de Fecha */}
          <div className="form-group">
            <label className="form-label"><Calendar size={16} /> Fecha de Inicio</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label"><Calendar size={16} /> Fecha de Fin</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-input" required />
          </div>

          {/* Selector Múltiple de Usuarios */}
          <div className="form-group form-group--full">
            <label className="form-label"><UserIcon size={16} /> Asignar a Usuarios (múltiples)</label>
            <select 
              multiple
              value={assignedUserIds.map(String)}
              onChange={handleUserChange}
              className="form-select form-select--multiple"
              disabled={loadingUsers || users.length === 0}
              size={Math.min(5, users.length + 1)}
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
            <p className="form-help">Selecciona múltiples usuarios usando Ctrl/Cmd + Click</p>
          </div>
        </div>
      </fieldset>

      <fieldset className="form-fieldset">
        <legend>Descripción y notas</legend>
        <div className="form-group form-group--full">
          <label className="form-label"><MessageSquare size={16} /> Descripción</label>
          <textarea
            rows={4}
            placeholder="Detalles adicionales..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
          />
        </div>
      </fieldset>

      <div className="form-actions">
        <Button text={taskSeleccionada ? "Guardar cambios" : "Crear tarea"} onClick={handleSubmit} style="verde" />
        <Button text="Cancelar" onClick={cancelUpdateTask} style="gris" />
      </div>
    </form>
  );
}
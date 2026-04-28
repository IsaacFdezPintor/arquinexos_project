import { useState, useEffect } from "react";
import type { Task, TaskPriority } from "../../types/Task";
import type { User } from "../../types/Auth";
import Button from "../Button/Button";
import { userService } from "../../services/userService";
import { FileText, CheckCircle, Calendar,MessageSquare, User as UserIcon } from "lucide-react";
import "./TaskForm.css";

type TaskFormProps = {
  addTask: (data: Task) => void;
  updateTask: (task: Task) => void;
  cancelUpdateTask: () => void;
  taskSeleccionada: Task | null;
  projectId?: number;
};

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Medio" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },];

export default function TaskForm({
  addTask,
  taskSeleccionada,
  updateTask,
  cancelUpdateTask,
  projectId,
}: TaskFormProps) {
  const [name, setName] = useState(taskSeleccionada?.name ?? "");
  const [priority, setPriority] = useState<TaskPriority>(taskSeleccionada?.priority ?? "low");
  const [startDate, setStartDate] = useState(taskSeleccionada?.start_date ?? "");
  const [endDate, setEndDate] = useState(taskSeleccionada?.end_date ?? "");
  const [assignedUserIds, setAssignedUserIds] = useState<number[]>(
    taskSeleccionada?.users?.map(u => u.id) || (taskSeleccionada?.assigned_user_id ? [taskSeleccionada.assigned_user_id] : [])
  );
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [description, setDescription] = useState(taskSeleccionada?.description ?? "");

  // Cargar lista de usuarios al montar el componente
  useEffect(() => {
    setUsersError(null);
    userService.getAll()
      .then(data => {
        setUsers(data);
      })
      .catch(() => {
        setUsersError("No se pudieron cargar los usuarios.");
        setUsers([]);
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
    setAssignedUserIds(selectedOptions);
  };

  function handleSubmit() {
    if (name.trim().length > 0 && projectId && startDate) {

      if (taskSeleccionada != null) {
        const tarea: any = {
          ...taskSeleccionada,
          name,
          priority,
          start_date: startDate,
          end_date: endDate,
          description: description || undefined,
          user_ids: assignedUserIds, // Para la relación N:M
        };
        updateTask(tarea);
      } else {
        const tarea: any = {
          project_id: projectId,
          name: name.trim(),
          priority,
          start_date: startDate,
          end_date: endDate,
          description: description || undefined,
          user_ids: assignedUserIds, // Para la relación N:M
        };
        addTask(tarea);
      }
    }
  }

  return (
    <form
      className="task-form"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <fieldset className="form-fieldset">
        <legend>Datos principales de la tarea</legend>
        <p className="form-help">Rellena los datos obligatorios para crear o editar la tarea.</p>

        <div className="form-grid">
        {/* Nombre de la Tarea */}
        <div className="form-group">
          <label className="form-label">
            <FileText size={16} /> Nombre de la Tarea
          </label>
          <input
            type="text"
            placeholder="Ej: Fundar cimientos"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            className="form-input"
            required
          />
        </div>

        {/* Estado */}
        <div className="form-group">
          <label className="form-label">
            <CheckCircle size={16} /> Prioridad
          </label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value as TaskPriority)} 
            className="form-select" 
            required
          >
            {PRIORITY_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Fecha de Inicio */}
        <div className="form-group">
          <label className="form-label">
            <Calendar size={16} /> Fecha de Inicio
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            autoComplete="off"
            className="form-input"
            required
          />
        </div>

        {/* Fecha de Fin */}
        <div className="form-group">
          <label className="form-label">
            <Calendar size={16} /> Fecha de Fin
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            autoComplete="off"
            className="form-input"
          />
        </div>

        {/* Usuarios Asignados (Multi-select) */}
        <div className="form-group form-group--full">
          <label className="form-label">
            <UserIcon size={16} /> Asignar a Usuarios (múltiples)
          </label>
          <select 
            multiple
            value={assignedUserIds.map(String)}
            onChange={handleUserChange}
            className="form-select form-select--multiple"
            disabled={loadingUsers || users.length === 0}
            size={Math.min(5, users.length + 1)}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
<p className="form-help">            Selecciona múltiples usuarios usando Ctrl/Cmd + Click
          </p>
          {usersError && !loadingUsers && (
            <small style={{ color: "var(--color-error)", marginTop: "0.25rem", display: "block" }}>
              {usersError}
            </small>
          )}
          {!usersError && users.length === 0 && !loadingUsers && (
<p className="form-help">              No se encontraron usuarios. Verifica que el servidor esté funcionando.
            </p>
          )}
        </div>
        </div>
      </fieldset>

      <fieldset className="form-fieldset">
        <legend>Descripcion y notas</legend>
        <div className="form-group form-group--full">
          <label className="form-label"> <MessageSquare size={16} /> Descripción
          </label>
          <textarea
            rows={4}
            placeholder="Detalles adicionales sobre el proyecto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
          />
        </div>
      </fieldset>

      <div className="form-actions">
        <Button
          text={taskSeleccionada ? "Guardar cambios" : "Crear tarea"}
          onClick={handleSubmit}
          style="verde"
          />

        <Button
          text="Cancelar"
          onClick={cancelUpdateTask}
          style="gris"
        />
      </div>
    </form>
  );
}

import { useState, useEffect } from "react";
import type { Task, TaskStatus } from "../../types/Task";
import type { User } from "../../types/User";
import Button from "../Button/Button";
import { userService } from "../../services/userService";
import { FileText, CheckCircle, Calendar, User as UserIcon } from "lucide-react";
import "./TaskForm.css";

type TaskFormProps = {
  addTask: (data: Task) => void;
  updateTask: (task: Task) => void;
  cancelUpdateTask: () => void;
  peticionEnProgreso: boolean;
  taskSeleccionada: Task | null;
  projectId?: number;
};

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en_progreso", label: "En Progreso" },
  { value: "completada", label: "Completada" },
  { value: "cancelada", label: "Cancelada" },
];

export default function TaskForm({
  addTask,
  peticionEnProgreso,
  taskSeleccionada,
  updateTask,
  cancelUpdateTask,
  projectId,
}: TaskFormProps) {
  const [name, setName] = useState(taskSeleccionada?.name ?? "");
  const [status, setStatus] = useState<TaskStatus>(taskSeleccionada?.status ?? "pendiente");
  const [startDate, setStartDate] = useState(taskSeleccionada?.start_date ?? "");
  const [endDate, setEndDate] = useState(taskSeleccionada?.end_date ?? "");
  const [assignedUserId, setAssignedUserId] = useState(taskSeleccionada?.assigned_user_id?.toString() ?? "");
  const [assignedUserName, setAssignedUserName] = useState(taskSeleccionada?.assigned_user_name ?? "");
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Cargar lista de usuarios al montar el componente
  useEffect(() => {
    userService.getAll()
      .then(data => {
        console.log("✅ Usuarios cargados:", data);
        setUsers(data);
      })
      .catch(err => {
        console.error("❌ Error al cargar usuarios:", err);
        setUsers([]);
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setAssignedUserId(userId);
    
    // Buscar el usuario seleccionado y guardar su nombre
    const selectedUser = users.find(u => u.id.toString() === userId);
    if (selectedUser) {
      setAssignedUserName(selectedUser.name);
    }
  };

  function handleSubmit() {
    if (name.trim().length > 0 && projectId && startDate) {
      if (taskSeleccionada != null) {
        const tarea: Task = {
          ...taskSeleccionada,
          name,
          status,
          start_date: startDate,
          end_date: endDate,
          assigned_user_id: assignedUserId ? Number(assignedUserId) : undefined,
          assigned_user_name: assignedUserName,
        };
        updateTask(tarea);
      } else {
        const tarea: Task = {
          project_id: projectId,
          name: name.trim(),
          status,
          start_date: startDate,
          end_date: endDate,
          assigned_user_id: assignedUserId ? Number(assignedUserId) : undefined,
          assigned_user_name: assignedUserName,
        };
        addTask(tarea);
        setName("");
      }
    }
  }

  return (
    <form
      className="task-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
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
            <CheckCircle size={16} /> Estado
          </label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value as TaskStatus)} 
            className="form-select" 
            required
          >
            {STATUS_OPTIONS.map((s) => (
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

        {/* Usuario Asignado */}
        <div className="form-group">
          <label className="form-label">
            <UserIcon size={16} /> Asignar a Usuario
          </label>
          <select 
            value={assignedUserId} 
            onChange={handleUserChange}
            className="form-select"
            disabled={loadingUsers || users.length === 0}
          >
            <option value="">
              {loadingUsers ? "Cargando usuarios..." : users.length === 0 ? "No hay usuarios disponibles" : "Seleccionar usuario"}
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          {users.length === 0 && !loadingUsers && (
            <small style={{ color: "var(--color-error)", marginTop: "0.25rem", display: "block" }}>
              ⚠️ No se encontraron usuarios. Verifica que el servidor esté funcionando.
            </small>
          )}
        </div>
      </div>

      <div className="form-actions">
        <Button
          texto={taskSeleccionada ? "Guardar cambios" : "Crear tarea"}
          onClick={handleSubmit}
          estilo="verde"
          deshabilitar={peticionEnProgreso}
        />

        <Button
          texto="Cancelar"
          onClick={cancelUpdateTask}
          estilo="gris"
          deshabilitar={peticionEnProgreso}
        />
      </div>
    </form>
  );
}

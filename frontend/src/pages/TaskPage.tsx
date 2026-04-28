import { useState } from "react"; // 1. Importar useState
import { useAuth } from "../auth/authContext";
import { ClipboardList, FolderKanban, AlertCircle, Zap, Ban ,CheckCircle} from "lucide-react";
import TaskList from "../components/TaskList/TaskList";

function TaskPage() {
  const { user } = useAuth();
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [showTeamTasks, setShowTeamTasks] = useState<boolean>(false);
  

  if (!user) return null;

  return (
    <div className="projects-page">
      <div className="projects-page__header">
        <div className="projects-page__title-section">
          <ClipboardList size={32} className="projects-page__icon" />
          <div>
        <h1 style={{ margin: 0 }}>{showTeamTasks ? "Tareas del Equipo" : "Mis Tareas"}</h1>
          </div>
        </div>
      </div>

      <div className="projects-page__content">
         <nav className="navbar__links">
  {/* Botón: EQUIPO (solo para jefes) */}
  {user.role === "boss" && (
    <button
      type="button"
      className={`navbar__link ${showTeamTasks ? "navbar__link--active" : ""}`}
      onClick={() => {
        setShowTeamTasks(!showTeamTasks);
        setPriorityFilter("");
      }}
      title="Ver todas las tareas del equipo"
    >
      <FolderKanban size={16} /> Equipo
    </button>
  )}

  {/* Botón: TODOS */}
  {!showTeamTasks && (
    <button
      type="button"
      className={`navbar__link ${priorityFilter === "" ? "navbar__link--active" : ""}`}
      onClick={() => setPriorityFilter("")}
    >
      <FolderKanban size={16} /> Todos
    </button>
  )}

  {/* Botones de prioridad (solo si no está en vista de equipo) */}
  {!showTeamTasks && (
    <>
      {/* Botón: BAJA */}
      <button
        type="button"
        className={`navbar__link ${priorityFilter === "low" ? "navbar__link--active" : ""}`}
        onClick={() => setPriorityFilter("low")}
      >
        <Ban size={16} /> Baja
      </button>

      {/* Botón: MEDIA */}
      <button
        type="button"
        className={`navbar__link ${priorityFilter === "medium" ? "navbar__link--active" : ""}`}
        onClick={() => setPriorityFilter("medium")}
      >
        <AlertCircle size={16} /> Media
      </button>

      {/* Botón: ALTA */}
      <button
        type="button"
        className={`navbar__link ${priorityFilter === "high" ? "navbar__link--active" : ""}`}
        onClick={() => setPriorityFilter("high")}
      >
        <AlertCircle size={16} /> Alta
      </button>

      {/* Botón: URGENTE */}
      <button
        type="button"
        className={`navbar__link ${priorityFilter === "urgent" ? "navbar__link--active" : ""}`}
        onClick={() => setPriorityFilter("urgent")}
      >
        <Zap size={16} /> Urgente
      </button>

      {/* Botón: COMPLETADA */}
    
    </>
  )}
  <button
        type="button"
        className={`navbar__link ${priorityFilter === "completed" ? "navbar__link--active" : ""}`}
        onClick={() => setPriorityFilter("completed")}
      >
        <CheckCircle size={16} /> Completada
      </button>
</nav>


        {/* Filtro por prioridad de tareas */}
        <TaskList 
          userId={showTeamTasks ? undefined : user.id} 
          canManage={user.role === "boss"} 
          priority={priorityFilter}
          showAllTeamTasks={showTeamTasks}
        />
      </div>
    </div>
  );
}

export default TaskPage;
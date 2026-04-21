import { useAuth } from "../auth/authContext";
import { ClipboardList } from "lucide-react";
import TaskList from "../components/TaskList/TaskList";

function TaskPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="projects-page">
      <div className="projects-page__header">
        <div className="projects-page__title-section">
          <ClipboardList size={32} className="projects-page__icon" />
          <div>
            <h1>Mis Tareas</h1>
          </div>
        </div>
      </div>

      <div className="projects-page__content">
        {/* Llamamos a TaskList pasando el ID del usuario actual (sea jefe o no) */}
        <TaskList userId={user.id} canManage={user.role === "jefe"} />
      </div>
    </div>
  );
}

export default TaskPage;
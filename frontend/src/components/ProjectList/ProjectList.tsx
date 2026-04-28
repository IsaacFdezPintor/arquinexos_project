import type { Project } from "../../types/Project";
import ProjectCard from "../ProjectCard/ProjectCard";
import "./ProjectList.css";

type ProjectListProps = {
  projects: Project[];
  deletingId: number | null;
  onDelete: (project: Project) => void;
  onEdit: (project: Project) => void;
  canManage?: boolean;
};

function ProjectList({
  projects,
  deletingId,
  onDelete,
  onEdit,
  canManage = false,
}: ProjectListProps) {

  if (!projects.length) {
    return (
      <div className="project-list-empty">
        <p>No hay proyectos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="project-grid">
      {projects.map((p) => (
        <ProjectCard
          key={p.id}
          project={p}
          onDelete={onDelete}
          onEdit={onEdit}
          deleting={deletingId === p.id}
          canManage={canManage}
        />
      ))}
    </div>
  );
}
export default ProjectList;

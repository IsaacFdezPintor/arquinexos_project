import type { GrantTrap } from "../../types/Project";
import ProjectCard from "../ProjectCard/ProjectCard";
import "./ProjectList.css";

type ProjectListProps = {
  projects: GrantTrap[];
  loading: boolean;
  deletingId: number | null;
  onDelete: (project: GrantTrap) => void;
  onEdit: (project: GrantTrap) => void;
};

export default function ProjectList({
  projects,
  loading,
  deletingId,
  onDelete,
  onEdit,
}: ProjectListProps) {
  if (loading) {
    return (
      <div className="project-list-container">
        <p>Cargando ....</p>
      </div>
    );
  }

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
        />
      ))}
    </div>
  );
}

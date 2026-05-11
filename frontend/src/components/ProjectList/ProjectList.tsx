import type { Project } from "../../types/Project";
import ProjectCard from "../ProjectCard/ProjectCard";
import "./ProjectList.css";

/**
 * Definición de las propiedades para el componente ProjectList.
 */
type ProjectListProps = {
  /** Array de objetos tipo Project que se van a renderizar. */
  projects: Project[];
  /** El ID del proyecto que está siendo eliminado actualmente . */
  deletingId: number | null;
  /** Función callback que se propaga desde el padre para gestionar la eliminación. */
  onDelete: (project: Project) => void;
  /** Función callback que se propaga desde el padre para gestionar la edición. */
  onEdit: (project: Project) => void;
  /** Permiso booleano para mostrar u ocultar acciones administrativas en las tarjetas. */
  canManage?: boolean;
};

/**
 * Componente que renderiza una lista de proyectos 
 * 
 * @param {ProjectListProps} props - Propiedades del componente.
 * @param {Project[]} props.projects - Colección de proyectos.
 * @param {number | null} props.deletingId - ID en proceso de borrado.
 * @param {Function} props.onDelete - Callback de borrado.
 * @param {Function} props.onEdit - Callback de edición.
 * @param {boolean} [props.canManage=false] - Indica si el usuario tiene permisos de gestión.
 * 
 * @returns {JSX.Element} Un grid de tarjetas de proyecto o un mensaje de lista vacía.
 */
function ProjectList({
  projects,
  deletingId,
  onDelete,
  onEdit,
  canManage = false,
}: ProjectListProps) {

  /**
   * Si el array está vacío, devolvemos un estado visual informativo en lugar de un contenedor vacío.
   */
  if (!projects.length) {
    return (
      <div className="project-list-empty">
        <p>No hay proyectos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="project-grid">
      {/* 
        Mapeo de Proyectos:
        Es fundamental usar p.id como 'key' para que React optimice el re-renderizado
        cuando la lista cambie (filtros, borrados, etc.).
      */}
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
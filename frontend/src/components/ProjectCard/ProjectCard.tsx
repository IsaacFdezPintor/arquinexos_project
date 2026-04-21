import { useNavigate } from "react-router-dom";
import type { Project } from "../../types/Project";
import StatusBadge from "../StatusBadge/StatusBadge";
import Button from "../Button/Button";
import { User, Folder, Calendar, MapPin, Eye, Edit2, Trash2 } from "lucide-react";

type ProjectCardProps = {
  project: Project;
  onDelete: (project: Project) => void;
  onEdit: (project: Project) => void;
  deleting?: boolean;
  canManage?: boolean;
};

// Formatear fecha 
function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// Formatear precio
function formatPrice(price: number): string {
  return price.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

function ProjectCard({ project, onDelete, onEdit, canManage = false }: ProjectCardProps) {
  
  const navigate = useNavigate();

  return (
    <div className="scard">
      <div className="scard-header"> <StatusBadge status={project.status} /> </div>

      <div className="scard-body">
        <h3 className="scard-title" onClick={() => navigate(`/projects/${project.id}`)} > {project.name} </h3>

        <p className="scard-client"><User size={16} style={{display: 'inline', marginRight: '6px'}} /> {project.client_name}</p>

        <div className="scard-meta">
          <span className="category-tag"><Folder size={14} style={{display: 'inline', marginRight: '4px'}} /> {project.type}</span>
          <span className="scard-date"><Calendar size={14} style={{display: 'inline', marginRight: '4px'}} /> {formatDate(project.start_date)}</span>
        </div>

        {project.address && (
          <p className="scard-location"><MapPin size={16} style={{display: 'inline', marginRight: '6px'}} /> {project.address}</p>
        )}

        <div className="scard-footer">
          <span className="scard-price"> {formatPrice(project.budget || 0)}</span>
          <div className="scard-actions">
            <Button text={<><Eye size={14} /> Ver</>} onClick={() => navigate(`/projects/${project.id}`)} style="verde" />
            {canManage && (
              <>
                <Button text={<><Edit2 size={14} /> Editar</>} onClick={() => onEdit(project)} style="gris" />
                <Button text={<><Trash2 size={14} /> Eliminar</>} onClick={() => onDelete(project)} style="rojo"/>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
 export default ProjectCard;
import { useNavigate } from "react-router-dom";
import type { Project } from "../../types/Project";
import StatusBadge from "../StatusBadge/StatusBadge";
import Button from "../Button/Button";
import { User, Folder, Calendar, MapPin, Eye, Edit2, Trash2 } from "lucide-react";
import "./ProjectCard.css";

/**
 * Definición de las propiedades para el componente ProjectCard.
 */
type ProjectCardProps = {
  /** Objeto que contiene toda la información del proyecto a mostrar. */
  project: Project;
  /** Función que se dispara al pulsar el botón de eliminar. */
  onDelete: (project: Project) => void;
  /** Función que se dispara al pulsar el botón de editar. */
  onEdit: (project: Project) => void;
  /** Estado opcional para indicar si el proyecto está en proceso de borrado. */
  deleting?: boolean;
  /** Determina si se muestran los botones de Editar/Eliminar. Por defecto es false. */
  canManage?: boolean;
};

/**
 * Convierte una cadena de fecha ISO en un formato legible en español.
 * 
 * @param {string} iso - Fecha en formato ISO string.
 * @returns {string} Fecha formateada .
 */
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

/**
 * Formatea un número como moneda Euro .
 * 
 * @param {number} price - El valor numérico del presupuesto.
 * @returns {string} Precio formateado con el símbolo de moneda.
 */
function formatPrice(price: number): string {
  return price.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

/**
 * Componente de tarjeta para visualizar un resumen de un proyecto.
 * Incluye metadatos como cliente, tipo, fecha y presupuesto, además de acciones de navegación y gestión.
 * 
 * @param {ProjectCardProps} props - Propiedades del componente.
 * @param {Project} props.project - Datos del proyecto.
 * @param {Function} props.onDelete - Callback para eliminación.
 * @param {Function} props.onEdit - Callback para edición.
 * @param {boolean} [props.canManage=false] - Permiso para mostrar acciones de administrador.
 * 
 * @returns {JSX.Element} Una tarjeta interactiva con la información del proyecto.
 */
function ProjectCard({ project, onDelete, onEdit, canManage = false }: ProjectCardProps) {
  
  const navigate = useNavigate();

  return (
    <div className="scard">
      <div className="scard-header"> 
        <StatusBadge status={project.status} /> 
      </div>
      
      <div className="scard-body">
        <h3 className="scard-title">{project.name}</h3>
        
        <p className="scard-client">
          <User size={16} style={{display: 'inline', marginRight: '6px'}} /> 
          {project.client_name}
        </p>

        <div className="scard-meta">
          <span className="category-tag">
            <Folder size={14} style={{display: 'inline', marginRight: '4px'}} /> 
            {project.type}
          </span>
          <span className="scard-date">
            <Calendar size={14} style={{display: 'inline', marginRight: '4px'}} /> 
            {formatDate(project.start_date)}
          </span>
        </div>

        {project.address && (
          <p className="scard-location">
            <MapPin size={16} style={{display: 'inline', marginRight: '6px'}} /> 
            {project.address}
          </p>
        )}

        <div className="scard-footer">
          <span className="scard-price"> {formatPrice(project.budget || 0)}</span>
          
          <div className="scard-actions">
            <Button 
              text={<><Eye size={14} /> Ver</>} 
              onClick={() => navigate(`/projects/${project.id}`)} 
              style="verde" 
            />
            
            {canManage && (
              <>
                <Button 
                  text={<><Edit2 size={14} /> Editar</>} 
                  onClick={() => onEdit(project)} 
                  style="gris" 
                />
                <Button 
                  text={<><Trash2 size={14} /> Eliminar</>} 
                  onClick={() => onDelete(project)} 
                  style="rojo"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
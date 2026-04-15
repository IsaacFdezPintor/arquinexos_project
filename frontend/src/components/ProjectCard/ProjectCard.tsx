// =============================================
// SessionCard.tsx — Tarjeta de una sesión fotográfica
// =============================================

import { useNavigate } from "react-router-dom";
import type { PhotoSession } from "../../types/Project";
import StatusBadge from "../StatusBadge/StatusBadge";
import Button from "../Button/Button";
import { Image, User, Folder, Calendar, MapPin, DollarSign, Eye, Edit2, Trash2 } from "lucide-react";

type SessionCardProps = {
  project: PhotoSession;
  onDelete: (session: PhotoSession) => void;
  onEdit: (session: PhotoSession) => void;
  deleting?: boolean;
};

// ---- Funciones auxiliares ----
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

function formatPrice(price: number): string {
  return price.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

// ---- Componente principal ----
export default function ProjectCard({
  project,
  onDelete,
  onEdit,
}: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <div className="scard">
      {/* Insignia de estado */}
      <div className="scard-header">
        <StatusBadge status={project.status} />
      </div>

      {/* Cuerpo de la tarjeta */}
      <div className="scard-body">
        <h3
          className="scard-title"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
           {project.name}
        </h3>

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
            <Button texto={<><Eye size={14} /> Ver</>} onClick={() => navigate(`/projects/${project.id}`)} estilo="verde" />
            <Button texto={<><Edit2 size={14} /> Editar</>} onClick={() => onEdit(project)} estilo="gris" />
            <Button texto={<><Trash2 size={14} /> Eliminar</>} onClick={() => onDelete(project)} estilo="rojo"/>
          </div>
        </div>
      </div>
    </div>
  );
}

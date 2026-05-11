import type { ProjectStatus } from "../../types/Project";
import { Clock, CheckCircle, CheckCircle2, XCircle } from "lucide-react";
import './StatusBadge.css';

/**
 * Configuración centralizada para los estados del proyecto.
 */
const STATUS_CONFIG: Record<ProjectStatus, { label: string; className: string; Icon: React.ReactNode }> = {
  pending:   { label: "Pendiente",   className: "badge--pending",   Icon: <Clock size={12} /> },
  in_progress:  { label: "En Proceso",  className: "badge--in_progress", Icon: <CheckCircle size={12} /> },
  completed:  { label: "Completada",  className: "badge--completed", Icon: <CheckCircle2 size={12} /> },
  cancelled:   { label: "Cancelada",   className: "badge--cancelled", Icon: <XCircle size={12} /> },
};

/**
 * Definición de las propiedades  para el componente StatusBadge.
 */
type StatusBadgeProps = {
  status: ProjectStatus;
};

/**
 * Componente que renderiza una insignia  visual para indicar el estado de un proyecto.
 * 
 * @param {StatusBadgeProps} props - Propiedades del componente.
 * @param {ProjectStatus} props.status - Estado actual del recurso.
 * 
 * @returns {JSX.Element} Un elemento <span> estilizado con icono y texto.
 */
export default function StatusBadge({ status }: StatusBadgeProps) {
  /**
   * Obtiene la configuración del estado. 
   */
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <span className={`badge ${cfg.className}`}>
      {cfg.Icon}
      <span className="badge-text">{cfg.label}</span>
    </span>
  );
}
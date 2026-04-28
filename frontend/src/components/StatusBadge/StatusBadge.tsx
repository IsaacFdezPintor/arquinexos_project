// =============================================
// StatusBadge.tsx — Insignia de estado con color
// =============================================

import type { ProjectStatus } from "../../types/Project";
import { Clock, CheckCircle, CheckCircle2, XCircle } from "lucide-react";
import './StatusBadge.css';

// Configuración de cada estado: texto, clase CSS e icono
const STATUS_CONFIG: Record<ProjectStatus, { label: string; className: string; Icon: React.ReactNode }> = {
  pending:   { label: "Pendiente",   className: "badge--pending",   Icon: <Clock size={12} /> },
  in_progress:  { label: "En Proceso",  className: "badge--in_progress", Icon: <CheckCircle size={12} /> },
  completed:  { label: "Completada",  className: "badge--completed", Icon: <CheckCircle2 size={12} /> },
  cancelled:   { label: "Cancelada",   className: "badge--cancelled", Icon: <XCircle size={12} /> },
};

// Props del componente
type StatusBadgeProps = {
  status: ProjectStatus;
};

export default function StatusBadge({status}: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <span className={`badge ${cfg.className}`}>
      {cfg.Icon}
      <span>{cfg.label}</span>
    </span>
  );
}

// =============================================
// StatusBadge.tsx — Insignia de estado con color
// =============================================

import type { SessionStatus } from "../../types/Project";
import { Clock, CheckCircle, CheckCircle2, XCircle } from "lucide-react";
import './StatusBadge.css';

// Configuración de cada estado: texto, clase CSS e icono
const STATUS_CONFIG: Record<SessionStatus, { label: string; className: string; Icon: React.ReactNode }> = {
  pendiente:   { label: "Pendiente",   className: "badge--pending",   Icon: <Clock size={12} /> },
  confirmada:  { label: "Confirmada",  className: "badge--confirmed", Icon: <CheckCircle size={12} /> },
  completada:  { label: "Completada",  className: "badge--completed", Icon: <CheckCircle2 size={12} /> },
  cancelada:   { label: "Cancelada",   className: "badge--cancelled", Icon: <XCircle size={12} /> },
};

// Props del componente
type StatusBadgeProps = {
  status: SessionStatus;
};

export default function StatusBadge({status}: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pendiente;

  return (
    <span className={`badge ${cfg.className}`}>
      {cfg.Icon}
      <span>{cfg.label}</span>
    </span>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { sessionService } from "../services/projectService";
import type { PhotoSession } from "../types/Project";
import type { Task } from "../types/Task";
import StatusBadge from "../components/StatusBadge/StatusBadge";
import TaskList from "../components/TaskList/TaskList";
import Button from "../components/Button/Button";
import { ToastContainer } from "../components/Toast/Toast";
import { useToast } from "../components/Toast/useToast";
import { User, Folder, Calendar, MapPin, DollarSign, FileText, ArrowLeft, Edit2, Plus, CheckCircle } from "lucide-react";
import "./SessionDetailPage.css";

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<PhotoSession | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const handleTaskEdit = (taskId: number) => {
    navigate(`/sessions/${id}/tasks/${taskId}/edit`);
  };

  useEffect(() => {
    if (!id) return;
    sessionService.get(Number(id))
      .then(setSession)
      .catch(() => addToast("Proyecto no encontrado", "error"))
  }, [id]);

  if (!session) {
    return (
      <div className="session-detail session-detail--empty">
        <h2>Proyecto no encontrado</h2>
        <Link to="/sessions">
          <Button texto={<><ArrowLeft size={16} /> Volver</>} onClick={() => {}} estilo="gris" />
        </Link>
      </div>
    );
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
  };

  return (
    <div className="session-detail">
      <div className="session-detail__header">
        <Link to="/sessions" className="session-detail__back">
          <ArrowLeft size={18} /> Volver a proyectos
        </Link>
        <div className="session-detail__title-section">
          <h1 className="session-detail__title">{session.name}</h1>
          <StatusBadge status={session.status} />
        </div>
        <Button 
          texto={<><Edit2 size={14} /> Editar</>} 
          onClick={() => navigate(`/sessions/${session.id}/edit`)}
          estilo="verde" 
        />
      </div>

      <div className="session-detail__body">
        <div className="session-detail__info-grid">
          <div className="info-card">
            <div className="info-card__icon">
              <User size={20} />
            </div>
            <div className="info-card__content">
              <span className="info-card__label">Cliente</span>
              <span className="info-card__value">{session.client_name}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card__icon">
              <Folder size={20} />
            </div>
            <div className="info-card__content">
              <span className="info-card__label">Tipo</span>
              <span className="info-card__value">{session.type}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card__icon">
              <Calendar size={20} />
            </div>
            <div className="info-card__content">
              <span className="info-card__label">Inicio</span>
              <span className="info-card__value">{formatDate(session.start_date)}</span>
            </div>
          </div>

          {session.end_date && (
            <div className="info-card">
              <div className="info-card__icon">
                <Calendar size={20} />
              </div>
              <div className="info-card__content">
                <span className="info-card__label">Fin</span>
                <span className="info-card__value">{formatDate(session.end_date)}</span>
              </div>
            </div>
          )}

          <div className="info-card">
            <div className="info-card__icon">
              <DollarSign size={20} />
            </div>
            <div className="info-card__content">
              <span className="info-card__label">Presupuesto</span>
              <span className="info-card__value info-card__value--primary">{formatPrice(session.budget || 0)}</span>
            </div>
          </div>

          {session.address && (
            <div className="info-card">
              <div className="info-card__icon">
                <MapPin size={20} />
              </div>
              <div className="info-card__content">
                <span className="info-card__label">Ubicación</span>
                <span className="info-card__value">{session.address}</span>
              </div>
            </div>
          )}
        </div>

        {session.description && (
          <div className="session-detail__description">
            <div className="description-header">
              <FileText size={20} />
              <h3>Descripción</h3>
            </div>
            <p>{session.description}</p>
          </div>
        )}
      </div>

      <div className="session-detail__header">
        <div className="session-detail__title-section">
          <h1 className="session-detail__title"><CheckCircle size={28} style={{ color: "var(--color-primary)" }} /> Tareas</h1>
        </div>
        <Button 
          texto={<><Plus size={16} /> Añadir Tarea</>} 
          onClick={() => navigate(`/sessions/${session.id}/tasks/new`)}
          estilo="verde" 
        />
      </div>

      <div className="session-detail__tasks">
        <TaskList projectId={session.id} onTaskEdit={handleTaskEdit} />
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>

  );
}
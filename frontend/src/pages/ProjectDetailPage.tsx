import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ProjectService } from "../services/projectService";
import type { Project } from "../types/Project";
import StatusBadge from "../components/StatusBadge/StatusBadge";
import TaskList from "../components/TaskList/TaskList";
import Button from "../components/Button/Button";
import { ToastContainer } from "../components/Toast/Toast";
import { useToast } from "../components/Toast/useToast";
import { useAuth } from "../auth/authContext";
import { User, Folder, Calendar, MapPin, DollarSign, FileText, ArrowLeft, Edit2, Plus, CheckCircle,  } from "lucide-react";

/**
 * Vista de Detalle del Proyecto.
 * 
 */
function ProjectDetailPage() {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  /** Determina si el usuario actual tiene permisos de administrador */
  const canManageTasksAndProject = user?.role === "boss";
  
  const [project, setProject] = useState<Project | null>(null);
  const { toasts, addToast, removeToast } = useToast();
  
  /** Estado para alternar entre ver tareas personales o todas las tareas del equipo */
  const [showTeamTasks, setShowTeamTasks] = useState<boolean>(false);

  /**
   * Redirige al formulario de edición de una tarea.
   * @param {Task} task - Objeto de la tarea a editar.
   */
  const handleTaskEdit = (task: any) => {
    navigate(`/projects/${id}/tasks/${task.id}/edit`);
  };

  /**
   * Efecto para cargar los datos del proyecto al montar el componente.
   */
  useEffect(() => {
    if (!id) return;
    ProjectService.get(Number(id))
      .then(setProject)
      .catch(() => addToast("Proyecto no encontrado", "error"))
  }, [id]);

  /** Renderizado de estado de error si el proyecto no existe o falló la carga */
  if (!project) {
    return (
      <div className="session-detail session-detail--empty">
        <h2>Proyecto no encontrado</h2>
          <Button text={<><ArrowLeft size={16} /> Volver</>} onClick={() => navigate("/projects")} style="gris" />
      </div>
    );
  }

  /**
   * Formatea fechas ISO a un formato local legible.
   * @param {string} iso - Fecha en formato ISO.
   */
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("es-ES", {
        day: "numeric", month: "long", year: "numeric",
      });
    } catch { return iso; }
  };

  /**
   * Formatea valores numéricos a moneda EUR.
   * @param {number} price - Cantidad numérica.
   */
  const formatPrice = (price: number) => {
    return price.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
  };

  /** USO DE API Externa */
  const googleMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(project.address || "")}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  return (
    <div className="session-detail">
      <div className="session-detail__header">
        <Link to="/projects" className="session-detail__back">
          <ArrowLeft size={18} /> Volver a proyectos
        </Link>
        <div className="session-detail__title-section">
          <h1 className="session-detail__title">{project.name}</h1>
          <StatusBadge status={project.status} />
        </div>
        {canManageTasksAndProject && (
          <Button 
            text={<><Edit2 size={14} /> Editar</>} 
            onClick={() => navigate(`/projects/${project.id}/edit`, { state: { project } })}     
            style="verde" 
          />
        )}
      </div>

      <div className="session-detail__body">
        <div className="session-detail__info-grid">
          <div className="info-card">
            <div className="info-card__icon"><User size={20} /></div>
            <div className="info-card__content">
              <span className="info-card__label">Cliente</span>
              <span className="info-card__value">{project.client_name}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card__icon"><Folder size={20} /></div>
            <div className="info-card__content">
              <span className="info-card__label">Tipo</span>
              <span className="info-card__value">{project.type}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card__icon"><Calendar size={20} /></div>
            <div className="info-card__content">
              <span className="info-card__label">Inicio</span>
              <span className="info-card__value">{formatDate(project.start_date)}</span>
            </div>
          </div>

                  <div className="info-card">
            <div className="info-card__icon"><Calendar size={20} /></div>
            <div className="info-card__content">
              <span className="info-card__label">Final</span>
              <span className="info-card__value">{formatDate(project.end_date)}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card__icon"><DollarSign size={20} /></div>
            <div className="info-card__content">
              <span className="info-card__label">Presupuesto</span>
              <span className="info-card__value info-card__value--primary">{formatPrice(project.budget || 0)}</span>
            </div>
          </div>

          {project.address && (
            <div className="info-card">
              <div className="info-card__icon"><MapPin size={20} /></div>
              <div className="info-card__content">
                <span className="info-card__label">Ubicación</span>
                <span className="info-card__value">{project.address}</span>
              </div>
            </div>
          )}

          {project.address && (
            <div className="info-card" 
              style={{ 
                gridColumn: 'span 2', 
                height: 'auto', 
                minHeight: '300px', 
                padding: '0', 
                overflow: 'hidden',
                display: 'flex'
              }}
            >
              <iframe
                width="100%"
                height="300%"
                src={googleMapsUrl}
                title="Ubicación"
                style={{ border: 0, flex: 1, minHeight: '300px' }}
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>

        {project.description && (
          <div className="session-detail__description">
            <div className="description-header">
              <FileText size={20} />
              <h3>Descripción</h3>
            </div>
            <p>{project.description}</p>
          </div>
        )}
      </div>

      <div className="session-detail__header">
        <div className="session-detail__title-section">
          <h1 className="session-detail__title">
            <CheckCircle size={28} style={{ color: "var(--color-primary)" }} /> Tareas
          </h1>
        </div>
        
        {canManageTasksAndProject && (
          <>
            <Button 
              text={<><Plus size={16} /> Añadir Tarea</>} 
              onClick={() => navigate(`/projects/${project.id}/tasks/new`)}
              style="verde" 
            />
            <Button
              text={<><Folder size={16} /> {showTeamTasks ? "Ver mis tareas" : "Ver tareas del equipo"}</>}
              onClick={() => setShowTeamTasks(!showTeamTasks)}
              style="gris"
            />
          </>
        )}
      </div>

      <div className="session-detail__tasks">
        {project?.id && (
          <TaskList 
            projectId={project.id} 
            userId={!showTeamTasks && user ? user.id : undefined}
            canManage={canManageTasksAndProject}
            onTaskEdit={handleTaskEdit}           
            showAllTeamTasks={showTeamTasks}
          />
        )}
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default ProjectDetailPage;
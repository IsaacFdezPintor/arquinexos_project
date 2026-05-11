import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectService } from "../services/projectService";
import type { Project } from "../types/Project";
import ProjectList from "../components/ProjectList/ProjectList";
import LoadingSpinner from "../components/Spinner/LoadingSpinner";
import ConfirmDelete from "../components/ConfirmDelete/ConfirmDelete";
import Button from "../components/Button/Button";
import { ToastContainer } from "../components/Toast/Toast";
import { useToast } from "../components/Toast/useToast";
import { useAuth } from "../auth/authContext";
import { Plus, Briefcase, ClipboardList, ListChecks, Ban, FolderKanban } from "lucide-react";

/**
 * Vista principal de proyectos.
 * Gestiona el listado, filtrado por estado, paginación y eliminación de proyectos.
 */
export default function ProjectsPage() {
  const { user } = useAuth();
  const canManageProjects = user?.role === "boss";

  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toasts, addToast, removeToast } = useToast();
  
  // Estados para el control de la paginación de la API
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  /**
   * Carga los proyectos desde el servicio llamando a la API de Laravel.
   * @param {number} page - Número de página a cargar.
   */
  const loadProjects = async (page: number = 1) => {
    setLoading(true);
    try {
      // Simulamos un pequeño retraso 
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      const response = await ProjectService.getAll(page);
      setProjects(response.data); 
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
    } catch {
      addToast("Error al cargar los proyectos", "error");
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial al montar el componente
  useEffect(() => { 
    loadProjects();
  }, []);

  // Recarga cuando el usuario cambia de página
  useEffect(() => {
    loadProjects(currentPage);
  }, [currentPage]);

  /**
   * Prepara un proyecto para ser eliminado abriendo el modal de confirmación.
   */
  const handleDeleteClick = (project: Project) => {
    setDeleteTarget(project);
  };

  /**
   * Navega a la página de edición pasando el objeto del proyecto en el state.
   */
  const handleEdit = (project: Project) => {
    navigate(`/projects/${project.id}/edit`, { state: { project } });
  };

  /**
   * Ejecuta la petición de borrado tras confirmar en el modal.
   */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    
    setDeletingId(deleteTarget.id);
    
    try {
      await ProjectService.delete(deleteTarget.id);
      // Filtramos localmente para actualizar la UI sin recargar todo
      setProjects((prev) => prev.filter((t) => t.id != deleteTarget.id));
      addToast(`Proyecto «${deleteTarget.name}» eliminado correctamente`, "success");
      setDeleteTarget(null);
    } catch {
      addToast("Error al eliminar el proyecto", "error");
    } finally {
      setDeletingId(null);
    }
  };

  /**
   * Filtrado en el lado del cliente basado en el estado seleccionado en la navbar.
   */
  const filteredProjects = statusFilter
    ? projects.filter((p) => p.status === statusFilter)
    : projects;

  return (
    <div className="projects-page">
      <div className="projects-page__header">
        <div className="projects-page__title-section">
          <Briefcase size={32} className="projects-page__icon" />
          <div>
            <h1>Mis Proyectos</h1>
            <p className="projects-page__subtitle">
              {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        {/* Solo los jefes pueden crear proyectos */}
        {canManageProjects && (
            <Button text={<><Plus size={16} /> Nuevo Proyecto</>} onClick={() => navigate('/projects/new')} style="verde" />
        )}
      </div>

      {/* Navbar de filtrado por estados */}
      <nav className="navbar__links">
        <button
          type="button"
          className={`navbar__link ${statusFilter === "" ? "navbar__link--active" : ""}`}
          onClick={() => setStatusFilter("")}
        >
          <FolderKanban size={16} /> Todos
        </button>

        <button
          type="button"
          className={`navbar__link ${statusFilter === "pending" ? "navbar__link--active" : ""}`}
          onClick={() => setStatusFilter("pending")}
        >
          <ClipboardList size={16} /> Pendiente
        </button>

        <button
          type="button"
          className={`navbar__link ${statusFilter === "in_progress" ? "navbar__link--active" : ""}`}
          onClick={() => setStatusFilter("in_progress")}
        >
          <ListChecks size={16} /> En Proceso
        </button>

        <button
          type="button"
          className={`navbar__link ${statusFilter === "completed" ? "navbar__link--active" : ""}`}
          onClick={() => setStatusFilter("completed")}
        >
          <Briefcase size={16} /> Completado
        </button>

        <button
          type="button"
          className={`navbar__link ${statusFilter === "cancelled" ? "navbar__link--active" : ""}`}
          onClick={() => setStatusFilter("cancelled")}
        >
          <Ban size={16} /> Cancelado
        </button>
      </nav>

      {/* Renderizado condicional: Spinner o Lista */}
      {loading ? (
        <LoadingSpinner message="Cargando proyectos..." />
      ) : (
        <ProjectList
          projects={filteredProjects}
          deletingId={deletingId}
          onDelete={handleDeleteClick}
          onEdit={handleEdit}
          canManage={canManageProjects}
        />
      )}

      {/* Modal de confirmación de borrado */}
      {deleteTarget && (
        <div className="modal-overlay">
          <ConfirmDelete
            title={deleteTarget.name}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
          />
        </div>
      )}

      {/* Controles de paginación inferiores */}
      <div className="pagination-controls" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        <Button text="Anterior" onClick={() => setCurrentPage(prev => prev - 1)} style="gris" />

        <span style={{ alignSelf: 'center' }}>
          Página <strong>{currentPage}</strong> de {lastPage}
        </span>

        <Button text="Siguiente" onClick={() => setCurrentPage(prev => prev + 1)} style="gris" />
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProjectService } from "../services/projectService";
import type { Project } from "../types/Project";
import ProjectList from "../components/ProjectList/ProjectList";
import LoadingSpinner from "../components/Spinner/LoadingSpinner";
import ConfirmDelete from "../components/ConfirmDelete/ConfirmDelete";
import Button from "../components/Button/Button";
import { ToastContainer } from "../components/Toast/Toast";
import { useToast } from "../components/Toast/useToast";
import { useAuth } from "../auth/authContext";
import { Plus, Briefcase } from "lucide-react";

export default function ProjectsPage() {
  const { user } = useAuth();
  const canManageProjects = user?.role === "jefe";

  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toasts, addToast, removeToast } = useToast();


  // Cargar los proyectos al montar el componente
  useEffect(() => { loadProjects();} , []);


//Peticion a Laravel para obtener los proyectos del usuario autenticado
  const loadProjects = async () => {
    setLoading(true); // Mostramos el loader mientras cargamos los proyectos,
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulamos un retraso de 2 segundos para mostrar el loader
      const data = await ProjectService.getAll(); // GET /projects → obtiene la lista de proyectos usamos await para esperara a que llegue todos lo datos
      // El await hace que no Tu código intenta "comerse" el ticket del pedido, la aplicación se confunde y sale un error porque esperaba proyectos y recibió un papel que dice "llegaré pronto".
      setProjects(data); // Guardamos los proyectos en el estado para mostrarlos 
    } catch {
      addToast("Error al cargar los proyectos", "error");
    } finally {
      setLoading(false); // Falle o no se oculta el loader
    }
  };

  // Seelciona el proyecto a eliminar y muestra el modal de confirmación
  const handleDeleteClick = (project: Project) => {
    setDeleteTarget(project);
  };

  // Selleciona al proyecto a editar y navega a la página de edición
  const handleEdit = (project: Project) => {
    navigate(`/projects/${project.id}/edit`, { state: { project } });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    else{
    setDeletingId(deleteTarget.id);
  }
    try {
      await ProjectService.delete(deleteTarget.id);
      setProjects((prev) => prev.filter((t) => t.id != deleteTarget.id));
      addToast(`Proyecto «${deleteTarget.name}» eliminado`, "success");
      setDeleteTarget(null);
    } catch {
      addToast("Error al eliminar el proyecto", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="projects-page">
      <div className="projects-page__header">
        <div className="projects-page__title-section">
          <Briefcase size={32} className="projects-page__icon" />
          <div>
            <h1>Mis Proyectos</h1>
            <p className="projects-page__subtitle">{projects.length} proyecto{projects.length !== 1 ? 's' : ''}</p>

          </div>
        </div>
        {canManageProjects && (
          <Link to="/projects/new">
            <Button text={<><Plus size={16} /> Nuevo Proyecto</>} style="verde" />
          </Link>
        )}
      </div>


      {loading ? (
        <LoadingSpinner message="Cargando proyectos..." />
      ) : (
        <ProjectList
          projects={projects}
          loading={loading}
          deletingId={deletingId}
          onDelete={handleDeleteClick}
          onEdit={handleEdit}
          canManage={canManageProjects}
        />
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
            <div className="modal-header">
              <h2>Confirmar eliminación</h2>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <div className="modal-body">
              <ConfirmDelete
                title={deleteTarget.name}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
              />
            </div>
          </div>
      )}

    

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}


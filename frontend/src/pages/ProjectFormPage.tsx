import { Navigate, useNavigate, useLocation, Link } from "react-router-dom";
import { ProjectService } from "../services/projectService.ts";
import { ToastContainer } from "../components/Toast/Toast.tsx";
import { useToast } from "../components/Toast/useToast.tsx";
import { useAuth } from "../auth/authContext.tsx";
import { ArrowLeft, FolderKanban } from "lucide-react";
import ProjectForm from "../components/ProjectForm/ProjectForm.tsx";

/**
 * ProjectFormPage: Página encargada de la creación y edición de proyectos.
 */
function ProjectFormPage() {
  const { user, isJefe } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  /** 
   * Recupera el proyecto del estado de la ruta si existe .
   * Si es null, el formulario se comporta en modo creación.
   */
  const selectedProject = location.state?.project || null;
  const isEditMode = Boolean(selectedProject);

  /**
   * Guardia de Seguridad:
   * Si el usuario no tiene permisos de jefe, se le redirige automáticamente
   * fuera de esta página para evitar accesos no autorizados a la gestión.
   */
  if (user && !isJefe) {
    return <Navigate to="/projects" replace />;
  }

  /**
   * Manejador unificado para el envío del formulario.
   * Decide si llamar a `update` o `create` en el servicio según la existencia de `selectedProject`.
   * 
   * @param {any} data - Los datos recolectados por el componente ProjectForm.
   */
  const handleSubmit = async (data: any) => {
    try {
      if (selectedProject) {
        // LÓGICA DE ACTUALIZAR: Se requiere el ID y los nuevos datos
        await ProjectService.update(selectedProject.id, data);
        addToast("Proyecto actualizado!", "success");
      } else {
        // LÓGICA DE CREAR: Se envían los datos para un nuevo registro
        await ProjectService.create(data);
        addToast("Proyecto creado!", "success");
      }
      
      // Pequeño retardo para permitir que el usuario vea el Toast de éxito
      setTimeout(() => navigate("/projects"), 400);
    } catch (error) {
      addToast("Error al procesar la solicitud", "error");
    }
  };

  return (
    <div className="session-form-page">
      {/* Navegación de retorno */}
      <Link to={"/projects"} className="session-detail__back">
        <ArrowLeft size={18} /> Volver
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
        <FolderKanban size={32} style={{ color: "var(--color-primary)" }} />
        <h1 style={{ margin: 0 }}>
          {isEditMode ? "Editar Proyecto" : "Nuevo Proyecto"}
        </h1>
      </div>

      {/* 
          Formulario de Proyecto:
          Se le pasan los manejadores y el proyecto seleccionado.
          El formulario interno se encarga de pre-rellenar los campos si hay datos.
      */}
      <ProjectForm 
        addProject={handleSubmit}  
        updateProject={handleSubmit}
        cancelUpdateProject={() => navigate("/projects")} 
        selectedProject={selectedProject}  
      />  

      {/* Contenedor para mostrar alertas de éxito o error */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default ProjectFormPage;
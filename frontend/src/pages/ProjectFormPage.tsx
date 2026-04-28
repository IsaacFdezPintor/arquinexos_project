import { useState } from "react";
import { Navigate, useNavigate ,useLocation, Link } from "react-router-dom";
import { ProjectService } from "../services/projectService.ts";
import { ToastContainer } from "../components/Toast/Toast.tsx";
import { useToast } from "../components/Toast/useToast.tsx";
import { useAuth } from "../auth/authContext.tsx";
import { ArrowLeft, FolderKanban } from "lucide-react";
import ProjectForm from "../components/ProjectForm/ProjectForm.tsx";


function ProjectFormPage() {
  const { user , isJefe } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const selectedProject = location.state?.project || null;
  const isEditMode = Boolean(selectedProject);


  if (user && !isJefe) {
    return <Navigate to="/projects" replace />;
  }

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (selectedProject) {
        // LÓGICA DE ACTUALIZAR
        await ProjectService.update(selectedProject.id, data);
        addToast("Proyecto actualizado!", "success");
      } else {
        // LÓGICA DE CREAR
        await ProjectService.create(data);
        addToast("Proyecto creado!", "success");
      }
      setTimeout(() => navigate("/projects"), 400);
    } catch (error) {
      addToast("Error al procesar la solicitud", "error");
      setLoading(false);
    }
  };

  return (
    <div className="session-form-page">
      <Link to={"/projects"} className="session-detail__back">
        <ArrowLeft size={18} /> Volver
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
        <FolderKanban size={32} style={{ color: "var(--color-primary)" }} />
        <h1 style={{ margin: 0 }}>{isEditMode ? "Editar Proyecto" : "Nuevo Proyecto"}</h1>
        </div>
      <ProjectForm 
        addProject={handleSubmit}  
        updateProject={handleSubmit}
        peticionEnProgreso={loading}  
        cancelUpdateProject={() => navigate("/projects")} 
        selectedProject={selectedProject}  
      />  

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default ProjectFormPage;
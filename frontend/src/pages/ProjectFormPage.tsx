import { useState } from "react";
import { useNavigate ,useLocation } from "react-router-dom";
import { ProjectService } from "../services/projectService.ts";
import SessionForm from "../components/ProjectForm/ProjectForm.tsx";
import { ToastContainer } from "../components/Toast/Toast.tsx";
import { useToast } from "../components/Toast/useToast.tsx";


function ProjectFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const selectedProject = location.state?.project || null;

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
      <div className="session-form-page__header">
      </div>
      <SessionForm 
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
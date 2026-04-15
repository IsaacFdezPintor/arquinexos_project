import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sessionService } from "../services/projectService.ts";
import SessionForm from "../components/SessionForm/SessionForm.tsx";
import { ToastContainer } from "../components/Toast/Toast.tsx";
import { useToast } from "../components/Toast/useToast.tsx";

export default function SessionCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { toasts, addToast, removeToast } = useToast();

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await sessionService.create(data);
      addToast("Proyecto creado correctamente", "success");
      setTimeout(() => navigate("/sessions"), 400);
    } catch {
      addToast("Error al crear el proyecto", "error");
      setLoading(false);
    }
  };

  return (
    <div className="session-form-page">
      <div className="session-form-page__header">
        <h1> Nuevo Proyecto</h1>
      </div>
      <SessionForm 
        addSession={handleSubmit}  
        peticionEnProgreso={loading}  
        cancelUpdateSession={() => navigate("/sessions")} 
        sessionSeleccionada={null}  
        updateSession={() => {}} 
      />     
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
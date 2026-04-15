import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { sessionService } from "../services/projectService";
import type { PhotoSession } from "../types/Project";
import SessionForm from "../components/SessionForm/SessionForm";
import { ToastContainer } from "../components/Toast/Toast";
import { useToast } from "../components/Toast/useToast";
import { ArrowLeft, Edit2, AlertCircle, Loader } from "lucide-react";

export default function SessionEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ---- Estado ----
  const [session, setSession] = useState<PhotoSession | null>(null); // Datos cargados
  const [loading, setLoading] = useState(true);             // ¿Cargando?
  const [saving, setSaving] = useState(false);              // ¿Guardando cambios?
  const { toasts, addToast, removeToast } = useToast();

  // useEffect: cargar la sesión al montar el componente
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // GET /sessions/:id → obtener datos actuales
    sessionService.get(Number(id))
      .then(setSession)
      .catch(() => addToast("Sesión no encontrada", "error"))
      .finally(() => setLoading(false))
  }, [id]);

  // handleSubmit: se ejecuta al enviar el formulario de edición
  // TODO Edición de un elemento existente (PUT o PATCH).
  const handleSubmit = async (data: PhotoSession) => {
    if (!id) return;
    setSaving(true);
    try {
      // PUT /sessions/:id → actualiza la sesión en el servidor
      await sessionService.update(data);
      addToast("Sesión actualizada correctamente", "success");
      // Navegamos al detalle de la sesión después de 400ms
      setTimeout(() => navigate("/sessions"), 400);
    } catch {
      addToast("Error al actualizar la sesión", "error");
      setSaving(false);
    }
  };

  // Si la sesión no existe (error al cargar)
  if (!loading && !session) {
    return (
      <div className="session-form-page">
        <Link to="/sessions" className="session-detail__back">
          <ArrowLeft size={18} /> Volver
        </Link>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          marginTop: "2rem",
          padding: "2rem",
          backgroundColor: "var(--color-error-light)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-error-border)"
        }}>
          <AlertCircle size={48} style={{ color: "var(--color-error)" }} />
          <h1 style={{ margin: 0 }}>Sesión no encontrada</h1>
          <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>La sesión que buscas no existe o ha sido eliminada.</p>
        </div>
      </div>
    );
  }

  // Si está cargando
  if (loading) {
    return (
      <div className="session-form-page">
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          minHeight: "400px"
        }}>
          <Loader size={48} style={{ 
            color: "var(--color-primary)", 
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ color: "var(--color-text-secondary)" }}>Cargando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="session-form-page">
      <Link to={`/sessions/${id}`} className="session-detail__back">
        <ArrowLeft size={18} /> Volver
      </Link>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "2rem"
      }}>
        <Edit2 size={32} style={{ color: "var(--color-primary)" }} />
        <h1 style={{ margin: 0 }}>Editar {session?.name || "Sesión"}</h1>
        {saving && (
          <Loader size={24} style={{ 
            color: "var(--color-primary)",
            animation: "spin 1s linear infinite",
            marginLeft: "auto"
          }} />
        )}
      </div>
      {/* SessionForm CON initialData = modo edición (precarga los valores) */}
      <SessionForm sessionSeleccionada={session} updateSession={handleSubmit} peticionEnProgreso={saving} cancelUpdateSession={() => navigate(`/sessions/${id}`)} addSession={() => {}} 
      />
      {/* TODO Toasts */} {/*Son esas pequeñas notificaciones que aparecen en una esquina y desaparecen solas.*/}
      <ToastContainer toasts={toasts} removeToast={removeToast} /> 
    </div>
  );
}

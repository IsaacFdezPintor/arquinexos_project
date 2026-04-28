import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import type { User } from "../types/Auth";
import { Users, Mail, Shield, Calendar, Link, Plus } from "lucide-react";
import Button from "../components/Button/Button";
import ConfirmDelete from "../components/ConfirmDelete/ConfirmDelete";
import { ToastContainer } from "../components/Toast/Toast";
import { useToast } from "../components/Toast/useToast";
import LoadingSpinner from "../components/Spinner/LoadingSpinner"; 
import { useNavigate } from "react-router-dom";

function formatDate(iso?: string): string {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const { toasts, addToast, removeToast } = useToast();
  const navigation = useNavigate();

  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = await userService.getAll();
      setUsers(data);
    } catch {
      addToast("Error al cargar los usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setDeleteTarget(user);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      await userService.delete(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      addToast("Usuario eliminado correctamente", "success");
    } catch {
      addToast("Error al eliminar usuario", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (

<div className="projects-page">
      <div className="projects-page__header">
        <div className="projects-page__title-section">
          <Users size={32} className="projects-page__icon" />
          <div>
            <h1>Mi Equipo</h1>
            <p className="projects-page__subtitle">{users.length} usuario{users.length !== 1 ? 's' : ''}</p>

          </div>
          
        </div>
            <Button text={<><Plus size={16} /> Añadir miembro al equipo</>} onClick={() => navigation("/register")} style="verde" />
      </div>


      {loading ? (
        <LoadingSpinner message="Cargando Equipo ..." />
      ) : (
        <div className="team-page__grid">
          {users.map((user) => {
            const role = user.role?.toLowerCase() === "b" ? "boss" : "worker";

            return (
              <article key={user.id} className="team-card">
                <div className="team-card__top">
                  <div className="team-card__avatar">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h2 className="team-card__name">{user.name}</h2>
                    <p className="team-card__id">ID #{user.id}</p>
                  </div>
                </div>

                <div className="team-card__row">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>

                <div className="team-card__row">
                  <Shield size={16} />
                  <span className={`team-card__role team-card__role--${role}`}>
                    {role === "boss" ? "Jefe" : "Worker"}
                  </span>
                </div>

                <div className="team-card__row">
                  <Calendar size={16} />
                  <span>Alta: {formatDate(user.created_at)}</span>
                </div>

                <div className="team-card__actions">
                  <Button
                    text="Eliminar"
                    style="rojo"
                    onClick={() => handleDeleteClick(user)}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay">
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
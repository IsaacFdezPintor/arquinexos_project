import { useAuth } from "../auth/authContext";
import { User, Mail, Key } from "lucide-react";
import "./ProfilePage.css";

export default function ProfilePage() {
  // Extraemos el usuario del contexto
  const { user } = useAuth();

  // Seguridad: si no hay usuario, no renderizamos nada
  // (en teoría ProtectedRoute impide llegar aquí sin estar logueado)
  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase() || "U"}</div>
          </div>
          <div className="profile-header-text">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-role">Usuario del sistema</p>
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <div className="profile-info-icon">
              <Mail size={20} />
            </div>
            <div className="profile-info-content">
              <span className="profile-info-label">Correo Electrónico</span>
              <span className="profile-info-value">{user.email}</span>
            </div>
          </div>

          <div className="profile-info-item">
            <div className="profile-info-icon">
              <Key size={20} />
            </div>
            <div className="profile-info-content">
              <span className="profile-info-label">ROL</span>
              <span className="profile-info-value">{user.role}</span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

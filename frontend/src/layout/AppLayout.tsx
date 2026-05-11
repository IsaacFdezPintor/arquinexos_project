import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import Button from "../components/Button/Button";
import { useEffect } from "react";
import { LogOut, Briefcase, Users, ClipboardList, Lock } from "lucide-react";

/**
 * Componente de diseño principal de la aplicación.
 * 
 * @returns {JSX.Element} La estructura envolvente de la aplicación.
 */
export default function AppLayout() {
  /**
   * Datos de autenticación consumidos desde el AuthContext.
   */
  const { isAuthenticated, user, logout, isJefe } = useAuth();
  const navigate = useNavigate();

  /**
   * Ejecuta el proceso de cierre de sesión y redirige al usuario a la pantalla de login.
   * 
   * @returns {void}
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /**
   * Efecto para establecer el título de la pestaña del navegador al montar la aplicación.
   */
  useEffect(() => {
    document.title = "GrantTrap — Gestión de Proyectos De Arquitectura";
  }, []);

  return (
    <div className="app-layout">
      {/* Barra de Navegación Principal */}
      <header className="navbar">
        <div className="navbar__inner">
          <NavLink to="/" className="navbar__brand">
            GrantTrap
          </NavLink>

          <nav className="navbar__links">
            {/* Enlaces protegidos: Solo visibles si el usuario está autenticado */}
            {isAuthenticated && (
              <>
                <NavLink to="/projects" className="navbar__link">
                  <Briefcase size={16} />
                  Proyectos
                </NavLink>

                <NavLink to="/tasks" className="navbar__link">
                  <ClipboardList size={16} />
                  Tareas
                </NavLink>
              </>
            )}

            {/* Enlace administrativo: Solo visible para usuarios jefes */}
            {isAuthenticated && isJefe && (
              <NavLink to="/team" className="navbar__link">
                <Users size={16} />
                Equipo
              </NavLink>
            )}
          </nav>

          <div className="navbar__actions">
            {isAuthenticated ? (
              <>
                {/* Información del perfil del usuario */}
                <div className="user-profile">
                  <div className="user-avatar">
                    {/* Genera un avatar con la inicial del nombre */}
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="user-name">{user?.name}</span>
                </div>
                
                <Button 
                  text={<><LogOut size={14} /> Salir</>} 
                  onClick={handleLogout} 
                  style="rojo" 
                />
              </>
            ) : (
              /* Enlace de acceso para usuarios no identificados */
              <NavLink to="/login" className="navbar__link navbar__link--login">
                <Lock size={16} />
                Iniciar sesión
              </NavLink>
            )}
          </div>
        </div>
      </header>

      {/* 
        Contenedor dinámico: 
        Aquí es donde React Router inyectará los componentes de las rutas hijas (children).
      */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Pie de página */}
      <footer className="footer">
        <p>©2026 GrantTrap — Gestión de Tareas de Proyectos De Arquitectura - Isaac Fernández Pintor </p>
      </footer>
    </div>
  );
}
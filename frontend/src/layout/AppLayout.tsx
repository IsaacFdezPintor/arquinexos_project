import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import Button from "../components/Button/Button";
import { useEffect } from "react";
import { LogOut, Home, Lock, Briefcase, Users , ClipboardList} from "lucide-react";

export default function AppLayout() {
  const { isAuthenticated, user, logout, isJefe } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    document.title = "GrantTrap — Gestión de Proyectos Arquitectónicos";
  }, []);

  return (
    <div className="app-layout">
      <header className="navbar">
        <div className="navbar__inner">
          <NavLink to="/" className="navbar__brand">
            GrantTrap
          </NavLink>

          <nav className="navbar__links">
         
            {/* 2. Proyectos: Aparece siempre que esté autenticado */}
            {isAuthenticated && (
              <NavLink to="/projects" className="navbar__link">
                <Briefcase size={16} />
                Proyectos
              </NavLink>
            )}

            {/* 3. Tareas: Aparece siempre que esté autenticado */}
            {isAuthenticated && (
              <NavLink to="/tasks" className="navbar__link">
                <ClipboardList size={16} />
                Tareas
              </NavLink>
            )}

            {/* 4. Equipo: Solo si es Jefe */}
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
                <div className="user-profile">
                  <div className="user-avatar">
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
              <>
                <NavLink to="/login" className="navbar__link navbar__link--login">
                  <Lock size={16} />
                  Iniciar sesión
                </NavLink>
                
              </>
            )}

          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} GrantTrap — Gestión de Tareas de Proyectos Arquitectónicos</p>
      </footer>
    </div>
  );
}
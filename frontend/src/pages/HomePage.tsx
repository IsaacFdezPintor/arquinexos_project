import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import Button from "../components/Button/Button";
import { CalendarDays, Link2, Users, BarChart3 } from "lucide-react";

export default function HomePage() {

  //Verificar si el usuario está autenticado para mostrar opciones personalizadas
  const { user } = useAuth();
  // Redirigir a las paginas 
  const navigate = useNavigate();

  return (
    <div className="home">
        <div className="home__badge">Organizador de tareas</div>
        <h1 className="home__title">
          Planifica tus proyectos con un{" "}
          <span className="home__highlight">organizador de tareas</span>
        </h1>
        <p className="home__subtitle">
          Visualiza, organiza y haz seguimiento de todas tus tareas. Plazos, dependencias y estado en un
          solo lugar.
        </p>

        <div className="home__actions">
          {/* Mostrar botón de "Ver mis proyectos" si el usuario está autenticado, de lo contrario mostrar opciones de registro e inicio de sesión */}
          {user ? (
            <Button text="Ver mis proyectos" onClick={() => navigate("/projects")} style="verde"/>
          ) : (
            <>
              <Button text="Iniciar sesión" onClick={() => navigate("/login")} style="gris" />
            </>
          )}
        </div>

  
  
    <section className="features">
        <div className="feature-card">
          <CalendarDays className="feature-card__icon-svg" />
          <h3 className="feature-card__title">Vista tareas</h3>
          <p className="feature-card__desc">
            Visualiza tus tareas en dependencia de tu proyecto.
          </p>
        </div>
        <div className="feature-card">
          <Link2 className="feature-card__icon-svg" />
          <h3 className="feature-card__title">Prioridad</h3>
          <p className="feature-card__desc">
            Asigna tus tareas mas urgentes.
          </p>
        </div>
        <div className="feature-card">
          <Users className="feature-card__icon-svg" />
          <h3 className="feature-card__title">Equipo</h3>
          <p className="feature-card__desc">
            Asigna tareas a miembros del equipo y controla el progreso individual.
          </p>
        </div>
        <div className="feature-card">
          <BarChart3 className="feature-card__icon-svg" />
          <h3 className="feature-card__title">Estados</h3>
          <p className="feature-card__desc">
            Marca tareas como pendiente, en progreso, completada o bloqueada.
          </p>
        </div>
      </section>

    </div>
  );
}
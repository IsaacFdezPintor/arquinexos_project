import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import Button from "../components/Button/Button";
import { CalendarDays, Link2, Users, BarChart3 } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* ====== HERO ====== */}
      <section className="hero">
        <div className="hero__badge">Organizador de tareas</div>
        <h1 className="hero__title">
          Planifica tus proyectos con un{" "}
          <span className="hero__highlight">diagrama de Gantt</span>
        </h1>
        <p className="hero__subtitle">
          Visualiza, organiza y haz seguimiento de todas tus tareas en una
          línea de tiempo interactiva. Plazos, dependencias y estado en un
          solo lugar.
        </p>

        <div className="hero__actions">
          {user ? (
            <Button
              texto="Ver mis proyectos"
              onClick={() => navigate("/sessions")}
              estilo="verde"
            />
          ) : (
            <>
              <Button
                texto="Crear cuenta gratis"
                onClick={() => navigate("/register")}
                estilo="verde"
              />
              <Button
                texto="Iniciar sesión"
                onClick={() => navigate("/login")}
                estilo="gris"
              />
            </>
          )}
        </div>
      </section>

      {/* ====== GANTT PREVIEW (decorativo) ====== */}
      <section className="gantt-preview">
        <div className="gantt-preview__header">
          <span>Tarea</span>
          <span>Lun</span>
          <span>Mar</span>
          <span>Mié</span>
          <span>Jue</span>
          <span>Vie</span>
        </div>

        {[
          { label: "Diseño UI", start: 0, width: 2, color: "#4ade80" },
          { label: "Desarrollo", start: 1, width: 3, color: "#60a5fa" },
          { label: "Testing",    start: 3, width: 1, color: "#f97316" },
          { label: "Despliegue", start: 4, width: 1, color: "#a78bfa" },
        ].map((task) => (
          <div className="gantt-preview__row" key={task.label}>
            <span className="gantt-preview__label">{task.label}</span>
            <div className="gantt-preview__track">
              <div
                className="gantt-preview__bar"
                style={{
                  marginLeft: `calc(${task.start} * 20%)`,
                  width: `calc(${task.width} * 20%)`,
                  backgroundColor: task.color,
                }}
              />
            </div>
          </div>
        ))}
      </section>

    <section className="features">
        <div className="feature-card">
          <CalendarDays className="feature-card__icon-svg" />
          <h3 className="feature-card__title">Vista Gantt</h3>
          <p className="feature-card__desc">
            Visualiza tus tareas en una línea de tiempo clara y ordenada por fechas.
          </p>
        </div>
        <div className="feature-card">
          <Link2 className="feature-card__icon-svg" />
          <h3 className="feature-card__title">Dependencias</h3>
          <p className="feature-card__desc">
            Conecta tareas entre sí para gestionar bloqueos y prioridades.
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
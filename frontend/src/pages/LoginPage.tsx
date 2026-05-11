import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { Mail, Lock } from "lucide-react";
import Button from "../components/Button/Button";

/**
 * Componente LoginPage: Gestiona el acceso de usuarios a la aplicación.
 * 
 * 
 * @returns {JSX.Element} El formulario de inicio de sesión.
 */
export default function LoginPage() {
  /** Hook de autenticación para acceder al estado global y la función de login. */
  const { isAuthenticated, login } = useAuth();
  
  // --- Estados locales del formulario ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  /**
   * Guardia de Navegación:
   * Si el usuario ya está autenticado, evitamos que vea el login 
   * y lo enviamos directamente a la vista de proyectos.
   */
  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }

  /**
   * Procesa el envío del formulario.
   * Llama al servicio de autenticación y, en caso de éxito, actualiza 
   * el contexto global y redirige al usuario.
   * 
   * @async
   * @returns {Promise<void>}
   */
  async function handleSubmit() {
    setError(null);
    setLoading(true);

    try {
      const session = await AuthService.login(email.trim(), password);
      login(session);
      navigate("/projects", { replace: true });
    } catch {
      setError("Datos incorrectos o API no disponible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault(); 
          handleSubmit();
        }}
      >
        <div className="auth-form__header">
          <h2> Iniciar sesión</h2>
          <p>Accede a tu cuenta de GrantTrap</p>
        </div>

        {/* Mensaje de Error Condicional */}
        {error && (
          <div className="auth-form__alert auth-form__alert--error">
            <p className="auth-form__error-text">{error}</p>
          </div>
        )}

        <fieldset className="auth-form__fieldset">
          <legend>Datos de acceso</legend>
          <p className="auth-form__help">Introduce tu correo y contraseña para entrar.</p>

          {/* Grupo: Email */}
          <div className="auth-form__group">
            <label htmlFor="email" className="auth-form__label">
              <Mail size={16} /> Email
            </label>
            <input
              id="email"
              type="email"
              className="auth-form__input"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          {/* Grupo: Contraseña */}
          <div className="auth-form__group">
            <label htmlFor="password" className="auth-form__label">
              <Lock size={16} /> Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="auth-form__input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </fieldset>

        {/* Botón de acción con feedback de carga */}
        <Button
          text={loading ? "Cargando..." : "Entrar"}
          onClick={handleSubmit}
          style="verde"
        />
      </form>
    </div>
  );
}
import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { AuthService } from "../services/authService";
import { Mail, Lock } from "lucide-react";
import Button from "../components/Button/Button";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }

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

        {error && (
          <div className="auth-form__alert auth-form__alert--error">
            <p className="auth-form__error-text">{error}</p>
          </div>
        )}

        <fieldset className="auth-form__fieldset">
          <legend>Datos de acceso</legend>
          <p className="auth-form__help">Introduce tu correo y contrasena para entrar.</p>

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

        <Button
          text={loading ? "Cargando..." : "Entrar"}
          onClick={handleSubmit}
          style="verde"
        />

        
      </form>
    </div>
  );
}
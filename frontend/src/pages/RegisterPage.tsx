import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import { AuthService } from "../services/authService";
import { isAxiosError } from "axios";
import { Mail, Lock, User, Shield, ArrowLeft } from "lucide-react";
import Button from "../components/Button/Button";

const authService = AuthService;

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("worker");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Completa todos los campos");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setLoading(true);
    
    try {
      const res = await authService.register(email, password, name, role);
      login({ token: res.token, user: res.user });
      navigate("/projects");
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 422) {
        setError("Error de validación: " + (err.response.data.message || "Revisa los datos ingresados"));
      } else {
        setError("Error de conexión. Inténtalo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
     
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
          <Link to="/team" className="session-detail__back">
          <ArrowLeft size={18} /> Volver
        </Link>
        <div className="auth-form__header">
          <h2> Crear cuenta</h2>
          <p >Únete a GrantTrap y gestiona tus proyectos </p>
        </div>

        {error && (
          <div className="auth-form__alert auth-form__alert--error">
            <p className="auth-form__error-text">{error}</p>
          </div>
        )}

        <fieldset className="auth-form__fieldset">
          <legend>Datos de registro</legend>
          <p className="auth-form__help">Completa el formulario para crear una cuenta.</p>

          <div className="auth-form__group">
            <label htmlFor="name" className="auth-form__label">
              <User size={16} /> Nombre
            </label>
            <input
              id="name"
              type="text"
              className="auth-form__input"
              placeholder="Tu nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              required
            />
          </div>

          <div className="auth-form__group">
            <label htmlFor="role" className="auth-form__label">
              <Shield size={16} /> Rol
            </label>
            <select
              id="role"
              className="auth-form__select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="worker">Trabajador</option>
              <option value="boss">Jefe</option>
            </select>
          </div>

          <div className="auth-form__group">
            <label htmlFor="password" className="auth-form__label">
              <Lock size={16} /> Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="auth-form__input"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </fieldset>

        

        {/* Botón Submit */}
        

        {/* Botón Submit */}
        <Button
          text={loading ? "Creando..." : "Crear cuenta"}
          onClick={handleSubmit}
          style="verde"
        />

      </form>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import { AuthService } from "../services/authService";
import { isAxiosError } from "axios";
import { UserPlus, Mail, Lock, User, Shield } from "lucide-react";
import Button from "../components/Button/Button";

const authService = AuthService;

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("trabajador");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Completa todos los campos");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.register(email, password, name, role);
      login({ token: res.token, user: res.user });
      navigate("/sessions");
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) {
        setError("Ya existe una cuenta con ese email");
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
        <div className="auth-form__header">
          <h2> Crear cuenta</h2>
          <p >Únete a StudioSnap y gestiona tus sesiones</p>
        </div>

        {error && (
          <div className="auth-form__alert auth-form__alert--error">
            <p className="auth-form__error-text">{error}</p>
          </div>
        )}

        {/* Input Nombre */}
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

        {/* Input Email */}
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

        {/* Selector de Rol */}
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
            <option value="trabajador">Trabajador</option>
            <option value="jefe">Jefe</option>
          </select>
        </div>

        {/* Input Contraseña */}
        <div className="auth-form__group">
          <label htmlFor="password" className="auth-form__label">
            <Lock size={16} /> Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="auth-form__input"
            placeholder="Mínimo 4 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* Input Contraseña */}
        <div className="auth-form__group">
          <label htmlFor="password" className="auth-form__label">
            <Lock size={16} /> Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="auth-form__input"
            placeholder="Mínimo 4 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Input Confirmar Contraseña */}
        <div className="auth-form__group">
          <label htmlFor="confirm" className="auth-form__label">
            <Lock size={16} /> Confirmar contraseña
          </label>
          <input
            id="confirm"
            type="password"
            className="auth-form__input"
            placeholder="Repite tu contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        {/* Botón Submit */}
        

        {/* Botón Submit */}
        <Button
          texto={loading ? "Creando..." : "Crear cuenta"}
          onClick={handleSubmit}
          estilo="verde"
          deshabilitar={loading}
        />

        <p className="auth-form__footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
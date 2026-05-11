import Button from "../components/Button/Button";
import { useNavigate } from "react-router-dom";

/**
 * Componente NotFoundPage: Página de error 404 personalizada.
 * 
 * 
 * @returns {JSX.Element} Un mensaje de error amigable con opción de retorno.
 */
export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="not-found-page">
      {/* El código de estado como impacto visual principal */}
      <h1 className="not-found-page__code">404</h1>
      
      <h2 className="not-found-page__title">Página no encontrada</h2>
      
      <p className="not-found-page__text">
        La página que buscas no existe o ha sido movida.
      </p>

        <Button 
          text="Volver al inicio" 
          onClick={() => navigate("/")} 
          style="verde" 
        />
    </div>
  );
}
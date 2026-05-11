import './LoadingSpinner.css';

/**
 * Interfaz que define las propiedades para el componente LoadingSpinner.
 */
interface LoadingSpinnerProps {
  /** 
   * Mensaje opcional que se muestra debajo del indicador visual.
   */
  message?: string;
}

/**
 * Componente que muestra un indicador de carga (spinner) con un mensaje personalizable.
 * 
 * @param {LoadingSpinnerProps} props - Propiedades del componente.
 * @param {string} [props.message] - Texto informativo para el usuario.
 * 
 * @returns {JSX.Element} Un contenedor con el spinner y el mensaje de espera.
 */
const LoadingSpinner = ({ message }: LoadingSpinnerProps) => {
  return (
    <div className="loader">
      <p className="spinner-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
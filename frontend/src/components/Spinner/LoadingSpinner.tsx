import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string; // Mensaje opcional para mostrar debajo del spinner
}

const LoadingSpinner = ({ message = "Cargando sesiones..." }: LoadingSpinnerProps) => {
  return (
      <div className="loader">
      <p className="spinner-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
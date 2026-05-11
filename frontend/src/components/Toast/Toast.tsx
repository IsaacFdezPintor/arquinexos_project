import { useEffect } from "react";
import './Toast.css';
import { X, Check, Info } from 'lucide-react';

/**
 * Tipos de notificaciones permitidas por el sistema.
 */
export type ToastType = "success" | "error" | "info";

/**
 * Estructura de datos de un mensaje Toast.
 */
export type ToastMessage = { 
  /** Identificador único para la gestión del stack. */
  id: number; 
  /** Contenido textual de la notificación. */
  text: string; 
  /** Categoría visual y de comportamiento. */
  type: ToastType 
};

/**
 * Propiedades para el contenedor de notificaciones.
 */
interface ToastContainerProps {
  /** Lista de mensajes activos actualmente. */
  toasts: ToastMessage[];
  /** Callback para eliminar un mensaje por su ID. */
  removeToast: (id: number) => void;
}

/**
 * Componente que gestiona el apilamiento (stack) de notificaciones en la pantalla.
 * Suele posicionarse de forma fija (fixed) en una esquina de la interfaz.
 * 
 * @param {ToastContainerProps} props - Propiedades del contenedor.
 * @returns {JSX.Element} El stack de mensajes renderizado.
 */
export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

/**
 * Componente que representa una notificación individual con auto-cierre.
 * 
 * @param {Object} props - Propiedades del ítem.
 * @param {ToastMessage} props.toast - Datos de la notificación.
 * @param {() => void} props.onClose - Función para cerrar el toast.
 * 
 * @returns {JSX.Element} El elemento visual del Toast.
 */
function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  /**
   * Ciclo de vida: Configura un temporizador para cerrar el Toast automáticamente.
   * La duración varía según el tipo para permitir al usuario leer mensajes críticos.
   */
  useEffect(() => {
    // Éxitos: 6 segundos 
    // Otros: 3 segundos
    const duration = toast.type === "success" ? 6000 : 3000;
    
    const timer = setTimeout(onClose, duration);
    
    return () => clearTimeout(timer);
  }, [onClose, toast.type]);

  /**
   * Diccionario de iconos según el tipo de notificación.
   */
  const icons: Record<ToastType, React.ReactNode> = { 
    success: <Check size={24} color="black" />, 
    error: <X size={24} color="black" />, 
    info: <Info size={24} color="black" /> 
  };

  return (
    <div 
      className={`toast toast--${toast.type}`} 
      onClick={onClose}
      role="alert" 
    >
      <span className="toast-icon">{icons[toast.type]}</span>
      <span className="toast-text">{toast.text}</span>
    </div>
  );
}
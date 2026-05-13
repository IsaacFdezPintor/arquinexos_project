import './Button.css'; 
import type { ReactNode } from 'react';

/**
 * Interfaz que define las propiedades aceptadas por el componente Button.
 */
interface ButtonProps {
  /** Texto que se mostrarán dentro del botón. */
  text: string | ReactNode;
  /** Función  que se ejecuta al hacer clic en el botón. */
  onClick: () => void;
  /** Variante visual del botón que determina su clase CSS. Por defecto es 'verde'. */
  style?: 'verde' | 'rojo' | 'gris';
}

/**
 * Un componente de botón
 * @param {ButtonProps} props - Las propiedades del botón.
 * @param {string | ReactNode} props.text - El contenido a renderizar dentro del botón.
 * @param {() => void} [props.onClick] - Función que se ejecuta al hacer clic en el botón.
 * @param {'verde' | 'rojo' | 'gris'} [props.style='verde'] - La variante de estilo del botón
 * 
 * @returns {JSX.Element} El elemento del botón renderizado
 */
function Button ({ text, onClick, style = 'verde' }: ButtonProps) {  
  return (
    <button 
      className={`custom-btn btn-${style}`} 
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
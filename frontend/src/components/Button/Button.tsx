import './Button.css'; 
import type { ReactNode } from 'react';

/**
 * Interfaz que define las propiedades aceptadas por el componente Button.
 */
interface ButtonProps {
  /** Texto o elementos React que se mostrarán dentro del botón. */
  text: string | ReactNode;
  /** Función opcional que se ejecuta al hacer clic en el botón. */
  onClick?: () => void;
  /** Variante visual del botón que determina su clase CSS. Por defecto es 'verde'. */
  style?: 'verde' | 'rojo' | 'gris'; 
}

/**
 * Un componente de botón
 * @param {ButtonProps} props - Las propiedades del botón.
 * @param {string | ReactNode} props.text - El contenido a renderizar dentro del botón.
 * @param {() => void} [props.onClick] - Mael clic.
 * @param {'verde' | 'rojo' | 'gris'} [props.style='verde'] - El esquema dnejador de eventos para e color del botón.
 * 
 * @returns {JSX.Element} El elemento del botón renderizado con clases dinámicas.
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
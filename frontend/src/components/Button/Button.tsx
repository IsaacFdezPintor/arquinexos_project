import './Button.css'; 
import type { ReactNode } from 'react';

interface ButtonProps {
  text: string | ReactNode;
  onClick?: () => void;
  style?: 'verde' | 'rojo' | 'gris'; 
}

export default function Button ({ text, onClick, style = 'verde' }: ButtonProps) {  
  return (
    <button 
      className={`custom-btn btn-${style}`} 
      onClick={onClick}
    >
      {text}
    </button>
  );
};
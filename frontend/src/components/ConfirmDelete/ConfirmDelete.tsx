import Button from "../Button/Button";
import './ConfirmDelete.css';

/**
 * Definición de las propiedades para el componente ConfirmDelete.
 */
type ConfirmDeleteProps = {
  /** El nombre del elemento que se va a eliminar  */
  title: string;              
  /** Función callback que se ejecuta cuando el usuario confirma la eliminación. */
  onConfirm: () => void;     
  /** Función callback que se ejecuta cuando el usuario decide abortar la acción. */
  onCancel: () => void;      
};

/**
 * Model para confirmar la eliminación de un elemento.
 * Muestra un mensaje de advertencia preventivo y botones de acción contrastados.
 * 
 * @param {ConfirmDeleteProps} props - Propiedades del componente.
 * @param {string} props.title - Nombre del objeto a borrar para dar contexto al usuario.
 * @param {() => void} props.onConfirm - Función que dispara la lógica de borrado .
 * @param {() => void} props.onCancel - Función que cierra el modal.
 * 
 * @returns {JSX.Element} Un fragmento de interfaz con advertencia y acciones de confirmación.
 */
function ConfirmDelete({
  title,
  onConfirm,
  onCancel,
}: ConfirmDeleteProps) {
  return (
    <div className="confirm-delete">

      {/* Mensaje de advertencia */}
      <p className="confirm-delete__text">
        ¿Estás seguro de que quieres eliminar {" "}
        <strong>«{title}»</strong>? Esta acción no se puede deshacer.
      </p>

      {/* Botones de acción*/}
      <div className="confirm-delete__actions">
        <Button text="Cancelar" onClick={onCancel} style="gris" />
        <Button text="Eliminar" onClick={onConfirm} style="rojo" />
      </div>
    </div>
  );
}

export default ConfirmDelete;
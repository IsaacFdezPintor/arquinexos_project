import Button from "../Button/Button";
import './ConfirmDelete.css';

type ConfirmDeleteProps = {
  title: string;              
  onConfirm: () => void;     
  onCancel: () => void;      
};

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

      {/* Botones de acción */}
      <div className="confirm-delete__actions">
        <Button text="Cancelar" onClick={onCancel} style="gris" / >
        <Button text="Eliminar" onClick={onConfirm} style="rojo" />
      </div>
    </div>
  );
}

export default ConfirmDelete;

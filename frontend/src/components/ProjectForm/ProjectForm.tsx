import { useState } from "react";
import type { Project, ProjectStatus } from "../../types/Project";
import Button from "../Button/Button";
import { FileText, User, Calendar, MapPin, Euro, CheckCircle, MessageSquare, Zap } from "lucide-react";
import "./ProjectForm.css";

/**
 * Definición de las propiedades para el componente ProjectForm.
 */
type ProjectFormProps = {
  /** Función para enviar los datos de un nuevo proyecto al backend. */
  addProject: (data: any) => void;
  /** Función para enviar los datos actualizados de un proyecto existente. */
  updateProject: (project: Project) => void;
  /** Función para cerrar el formulario o limpiar la selección actual. */
  cancelUpdateProject: () => void;
  /** El proyecto seleccionado para editar, o null si se está creando uno nuevo. */
  selectedProject: Project | null;
};

/**
 * Constante que define las opciones disponibles para el selector de estado.
 */
const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "in_progress", label: "En Progreso" },
  { value: "completed", label: "Completada" },
  { value: "cancelled", label: "Cancelada" },
];

/**
 * Componente de formulario para la creación y edición de proyectos.
 * 
 * @param {ProjectFormProps} props - Propiedades del componente.
 * @param {Function} props.addProject - Callback de creación.
 * @param {Project | null} props.selectedProject - Proyecto a editar.
 * @param {Function} props.updateProject - Callback de actualización.
 * @param {Function} props.cancelUpdateProject - Callback de cancelación.
 * 
 * @returns {JSX.Element} Un formulario estructurado con validación integrada.
 */
 function ProjectForm({ addProject , selectedProject, updateProject, cancelUpdateProject}: ProjectFormProps) {

  // Estados locales del formulario, inicializados con datos del proyecto seleccionado si existe
  const [name, setName] = useState(selectedProject?.name ?? "");
  const [type, setType] = useState(selectedProject?.type ?? "Edificación");
  const [clientName, setClientName] = useState(selectedProject?.client_name ?? "");
  const [status, setStatus] = useState<ProjectStatus>(selectedProject?.status ?? "pending");
  const [budget, setBudget] = useState((selectedProject?.budget ?? 0).toString());
  const [startDate, setStartDate] = useState(selectedProject?.start_date ?? "");
  const [endDate, setEndDate] = useState(selectedProject?.end_date ?? "");
  const [address, setAddress] = useState(selectedProject?.address ?? "");
  const [description, setDescription] = useState(selectedProject?.description ?? "");

  /**
   * Maneja el envío del formulario.
   * Realiza una validación básica de campos obligatorios y construye el objeto de datos.
   * 
   * @param {React.FormEvent} e - Evento de envío del formulario.
   * @returns {void}
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validación de seguridad básica
    if (name.trim().length > 0 && clientName.trim().length > 0) {
     const projectData: any = {
        name,
        type,
        client_name: clientName,
        status,
        budget: parseFloat(budget) || 0,
        start_date: startDate,
        end_date: endDate,
        address,
        description,
      };

      if (selectedProject?.id) {
        projectData.id = selectedProject.id;
    }

      // Decidimos si llamar a la función de crear o actualizar
      if (selectedProject != null) {
        updateProject(projectData as Project);
      } else {
        addProject(projectData);
      }
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <fieldset className="form-fieldset">
        <legend>Datos principales del proyecto</legend>
        <p className="form-help">Rellena los datos obligatorios para crear o editar el proyecto.</p>

        <div className="form-grid">
          {/* Campo: Nombre del Proyecto */}
          <div className="form-group">
            <label className="form-label">
              <FileText size={16} /> Nombre del Proyecto *
            </label>
            <input
              type="text"
              placeholder="Ej: Vivienda unifamiliar en Madrid"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Campo: Tipo de Proyecto (Select) */}
          <div className="form-group">
            <label className="form-label"> 
              <Zap size={16} /> Tipo de Proyecto *
            </label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)} 
              className="form-select" 
              required
            >
              <option value="Edificación">Edificación</option>
              <option value="Urbanismo">Urbanismo</option>
            </select>
          </div>

          {/* Campo: Cliente */}
          <div className="form-group">
            <label className="form-label"> <User size={16} /> Nombre del Cliente *
            </label>
            <input
              type="text"
              placeholder="Ej: María García"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Campo: Estado (Mapeo de STATUS_OPTIONS) */}
          <div className="form-group">
            <label className="form-label"> <CheckCircle size={16} /> Estado *
            </label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value as ProjectStatus)} 
              className="form-select" 
              required
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Campo: Presupuesto */}
          <div className="form-group">
            <label className="form-label">
              <Euro size={16} /> Presupuesto
            </label>
            <div className="budget-input-wrapper">
              <input
                type="text"
                placeholder="0,00"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="form-input budget-field"
              />
            </div>
          </div>

          {/* Campos de Fecha e Iconografía de Dirección... */}
          <div className="form-group">
            <label className="form-label"> <Calendar size={16} /> Fecha de Inicio *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label"><Calendar size={16} /> Fecha de Fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label"> <MapPin size={16} /> Dirección
            </label>
            <input
              type="text"
              placeholder="Dirección del proyecto"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Área de Texto: Descripción  */}
          <div className="form-group form-group--full">
            <label className="form-label"> <MessageSquare size={16} /> Descripción
            </label>
            <textarea
              rows={4}
              placeholder="Detalles adicionales sobre el proyecto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>
        </div>
      </fieldset>

      <div className="form-actions">
        <Button text={selectedProject ? "Actualizar Proyecto" : "Crear Proyecto"} onClick={() => {}} style="verde" /> 
        <Button
          text="Cancelar"
          onClick={cancelUpdateProject}
          style="gris"
        />
      </div>
    </form>
  );
}

export default ProjectForm;
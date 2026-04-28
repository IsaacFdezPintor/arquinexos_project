import { useState } from "react";
import type { Project, ProjectStatus } from "../../types/Project";
import Button from "../Button/Button";
import { FileText, User, Calendar, MapPin, Euro, CheckCircle, MessageSquare, Zap } from "lucide-react";
import "./ProjectForm.css";

type ProjectFormProps = {
  addProject: (data: any ) => void;
  updateProject: (project: Project) => void;
  cancelUpdateProject: () => void;
  peticionEnProgreso: boolean;
  selectedProject: Project | null;
};


const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "in_progress", label: "En Progreso" },
  { value: "completed", label: "Completada" },
  { value: "cancelled", label: "Cancelada" },
];

 function ProjectForm({ addProject , selectedProject, updateProject,cancelUpdateProject}: ProjectFormProps) {

  const [name, setName] = useState(selectedProject?.name ?? "");
  const [type, setType] = useState(selectedProject?.type ?? "Edificación");
  const [clientName, setClientName] = useState(selectedProject?.client_name ?? "");
  const [status, setStatus] = useState<ProjectStatus>(selectedProject?.status ?? "pending");
  const [budget, setBudget] = useState((selectedProject?.budget ?? 0).toString());
  const [startDate, setStartDate] = useState(selectedProject?.start_date ?? "");
  const [endDate, setEndDate] = useState(selectedProject?.end_date ?? "");
  const [address, setAddress] = useState(selectedProject?.address ?? "");
  const [description, setDescription] = useState(selectedProject?.description ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length > 0 && clientName.trim().length > 0) {
      const projectData = {
        id: selectedProject?.id,
        name,
        type,
        client_name: clientName,
        status,
        budget: parseFloat(budget) || 0,
        start_date: startDate,
        end_date: endDate,
        address,
        description,
        created_at: selectedProject?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

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
        {/* Nombre de la Tarea */}
        <div className="form-group">
          <label className="form-label">
              <FileText size={16} /> Nombre del Proyecto
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

          {/* Tipo de Proyecto */}
          <div className="form-group">
            <label className="form-label"> 
              <Zap size={16} /> Tipo de Proyecto
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

          {/* Cliente */}
          <div className="form-group">
            <label className="form-label"> <User size={16} /> Nombre del Cliente
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

          {/* Estado */}
          <div className="form-group">
            <label className="form-label"> <CheckCircle size={16} /> Estado
            </label>
            <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} className="form-select" required>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

{/* Presupuesto Estilo Profesional */}
<div className="form-group">
  <label className="form-label">
    <Euro size={16} /> Presupuesto
  </label>
  <div className="budget-input-wrapper">
    <input
      type="text"
      placeholder="0,00"
      value={budget} // Aquí budget puede ser un string inicialmente
      onChange={(e) => {setBudget(e.target.value);}} // Permite que el usuario escriba libremente
      className="form-input budget-field"
    />
  </div>
</div>

          {/* Fecha de Inicio */}
          <div className="form-group">
            <label className="form-label"> <Calendar size={16} /> Fecha de Inicio
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Fecha de Fin */}
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

          {/* Dirección */}
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

          
        {/* Descripción */}
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
        {/* Imagen eliminada */}
        </div>
        </div>

        </fieldset>

        <div className="form-actions">
          <button type="submit" className="custom-btn btn-verde"> {selectedProject ? "Actualizar Proyecto" : "Crear Proyecto"}</button>
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
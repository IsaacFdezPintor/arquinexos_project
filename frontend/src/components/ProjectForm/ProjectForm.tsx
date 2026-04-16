import { useEffect, useState } from "react";
import type { GrantTrap, ProjectStatus } from "../../types/Project";
import Button from "../Button/Button";
import { FileText, User, Calendar, MapPin, DollarSign, CheckCircle, MessageSquare, Zap, Link, ArrowLeft } from "lucide-react";
import "./ProjectForm.css";

type ProjectFormProps = {
  addProject: (data: any ) => void;
  updateProject: (project: GrantTrap) => void;
  cancelUpdateProject: () => void;
  peticionEnProgreso: boolean;
  selectedProject: GrantTrap | null;
};


const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "completada", label: "Completada" },
  { value: "cancelada", label: "Cancelada" },
];

 function ProjectForm({ addProject , selectedProject, updateProject,cancelUpdateProject}: ProjectFormProps) {

  const [name, setName] = useState(selectedProject?.name ?? "");
  const [type, setType] = useState(selectedProject?.type ?? "Edificación");
  const [clientName, setClientName] = useState(selectedProject?.client_name ?? "");
  const [status, setStatus] = useState<ProjectStatus>(selectedProject?.status ?? "pendiente");
  const [budget, setBudget] = useState(selectedProject?.budget ?? 0);
  const [startDate, setStartDate] = useState(selectedProject?.start_date ?? "");
  const [endDate, setEndDate] = useState(selectedProject?.end_date ?? "");
  const [address, setAddress] = useState(selectedProject?.address ?? "");
  const [description, setDescription] = useState(selectedProject?.description ?? "");

  
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length > 0 && clientName.trim().length > 0) {
      if (selectedProject != null) {
        const newProyecto: GrantTrap = {
          ...selectedProject,
          name,
          type,
          client_name: clientName,
          status,
          budget,
          start_date: startDate,
          end_date: endDate,
          address,
          description,
        };
        updateProject(newProyecto);
      } else {
        const newProyecto = {
          name: name.trim(),
          type,
          client_name: clientName.trim(),
          status,
          budget,
          start_date: startDate,
          end_date: endDate,
          address,
          description,
        };
        addProject(newProyecto);
      }
    }
  }

  return (
    <>
      <h2>{selectedProject ? `Editar proyecto: ${selectedProject.name}` : "Agregar nuevo proyecto"}</h2>
      <form className="session-form" onSubmit={handleSubmit} >
        <Link to="/projects" className="session-detail__back">
          <ArrowLeft size={18} /> Volver a proyectos
        </Link>
        <div className="form-grid">
          {/* Nombre del Proyecto */}
          <div className="form-group">
            <label className="form-label"> <FileText size={16} /> Nombre del Proyecto
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
            <label className="form-label"> <Zap size={16} /> Tipo de Proyecto
            </label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="form-select" required>
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

          {/* Presupuesto */}
          <div className="form-group">
            <label className="form-label"> <DollarSign size={16} /> Presupuesto
            </label>
            <input
              type="number"
              placeholder="Presupuesto (€)"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="form-input"
            />
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
        </div>

        <div className="form-actions">
          <button type="submit"> {selectedProject ? "Actualizar Proyecto" : "Crear Proyecto"}</button>
          <Button
            text="Cancelar"
            onClick={cancelUpdateProject}
            style="gris"
          />
        </div>
        </div>
      </form>
    </>
  );
}

export default ProjectForm;
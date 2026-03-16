import { useState } from "react";
import type { PhotoSession, SessionStatus } from "../../types/Session";
import Button from "../Button/Button";
import { FileText, User, List, Calendar, MapPin, DollarSign, CheckCircle, MessageSquare, Zap, MapIcon } from "lucide-react";
import "./SessionForm.css";

type SessionFormProps = {
  addSession: (data: any ) => void;
  updateSession: (session: PhotoSession) => void;
  cancelUpdateSession: () => void;
  peticionEnProgreso: boolean;
  sessionSeleccionada: PhotoSession | null;
};

const PROJECT_TYPES = [
  "Edificación","Urbanismo"
];

const STATUS_OPTIONS: { value: SessionStatus; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en_progreso", label: "En Progreso" },
  { value: "completada", label: "Completada" },
  { value: "cancelada", label: "Cancelada" },
];

export default function SessionForm({
  addSession,
  peticionEnProgreso,
  sessionSeleccionada,
  updateSession,
  cancelUpdateSession,
}: SessionFormProps) {
  const [name, setName] = useState(sessionSeleccionada?.title ?? "");
  const [type, setType] = useState(sessionSeleccionada?.category ?? PROJECT_TYPES[0]);
  const [clientName, setClientName] = useState(sessionSeleccionada?.client ?? "");
  const [status, setStatus] = useState<SessionStatus>(sessionSeleccionada?.status ?? "pendiente");
  const [budget, setBudget] = useState(sessionSeleccionada?.price ?? 0);
  const [startDate, setStartDate] = useState(sessionSeleccionada?.date ?? "");
  const [endDate, setEndDate] = useState(sessionSeleccionada?.location ?? "");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState(sessionSeleccionada?.notes ?? "");

  function handleSubmit() {
    if (name.trim().length > 0 && clientName.trim().length > 0) {
      if (sessionSeleccionada != null) {
        const nuevoProyecto: PhotoSession = {
          ...sessionSeleccionada,
          title: name,
          category: type,
          client: clientName,
          status,
          price: budget,
          date: startDate,
          location: address,
          notes: description,
        };
        updateSession(nuevoProyecto);
      } else {
        const nuevoProyecto = {
          name: name.trim(),
          type,
          client_name: clientName.trim(),
          status,
          budget,
          start_date: startDate,
          end_date: endDate,
          address,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          description,
        };
        addSession(nuevoProyecto);
        setName("");
        setClientName("");
      }
    }
  }

  return (
    <form
      className="session-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="form-grid">
        {/* Nombre del Proyecto */}
        <div className="form-group">
          <label className="form-label">
            <FileText size={16} /> Nombre del Proyecto
          </label>
          <input
            type="text"
            placeholder="Ej: Renovación Centro Comercial"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            className="form-input"
            required
          />
        </div>

        {/* Tipo de Proyecto */}
        <div className="form-group">
          <label className="form-label">
            <Zap size={16} /> Tipo de Proyecto
          </label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="form-select" required>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Cliente */}
        <div className="form-group">
          <label className="form-label">
            <User size={16} /> Nombre del Cliente
          </label>
          <input
            type="text"
            placeholder="Ej: María García"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            autoComplete="off"
            className="form-input"
            required
          />
        </div>

        {/* Estado */}
        <div className="form-group">
          <label className="form-label">
            <CheckCircle size={16} /> Estado
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value as SessionStatus)} className="form-select" required>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Presupuesto */}
        <div className="form-group">
          <label className="form-label">
            <DollarSign size={16} /> Presupuesto
          </label>
          <input
            type="string"
            placeholder="Presupuesto (€)"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            autoComplete="off"
            className="form-input"
            step="0.01"
          />
        </div>

        {/* Fecha de Inicio */}
        <div className="form-group">
          <label className="form-label">
            <Calendar size={16} /> Fecha de Inicio
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            autoComplete="off"
            className="form-input"
            required
          />
        </div>

        {/* Fecha de Fin */}
        <div className="form-group">
          <label className="form-label">
            <Calendar size={16} /> Fecha de Fin
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            autoComplete="off"
            className="form-input"
          />
        </div>

        {/* Dirección */}
        <div className="form-group">
          <label className="form-label">
            <MapPin size={16} /> Dirección
          </label>
          <input
            type="text"
            placeholder="Dirección del proyecto"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="off"
            className="form-input"
          />
        </div>

        {/* Latitud */}
        <div className="form-group">
          <label className="form-label">
            <MapIcon size={16} /> Latitud
          </label>
          <input
            type="number"
            placeholder="Latitud"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            autoComplete="off"
            className="form-input"
            step="0.00000001"
          />
        </div>

        {/* Longitud */}
        <div className="form-group">
          <label className="form-label">
            <MapIcon size={16} /> Longitud
          </label>
          <input
            type="number"
            placeholder="Longitud"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            autoComplete="off"
            className="form-input"
            step="0.00000001"
          />
        </div>
      </div>

      {/* Descripción */}
      <div className="form-group form-group--full">
        <label className="form-label">
          <MessageSquare size={16} /> Descripción
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
        <Button
          texto={sessionSeleccionada ? "Guardar cambios" : "Crear proyecto"}
          onClick={handleSubmit}
          estilo="verde"
          deshabilitar={peticionEnProgreso}
        />

        <Button
          texto="Cancelar"
          onClick={cancelUpdateSession}
          estilo="gris"
          deshabilitar={peticionEnProgreso}
        />
      </div>
    </form>
  );
}
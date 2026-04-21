export type ProjectStatus = "pendiente" | "confirmada" | "completada" | "cancelada";

export type Project = {
  id: number;
  name: string;              // Nombre del proyecto
  type: string;              // Tipo de proyecto
  client_name: string;       // Nombre del cliente
  description?: string;      // Descripción
  status: ProjectStatus;     // Estado
  budget?: number;           // Presupuesto
  start_date: string;        // Fecha de inicio
  end_date?: string;         // Fecha de fin
  address?: string;          // Dirección
  created_at?: string;
  updated_at?: string;
};
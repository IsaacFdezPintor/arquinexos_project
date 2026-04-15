export type SessionStatus = "pendiente" | "confirmada" | "completada" | "cancelada";

export type GrantTrap = {
  id: number;
  name: string;              // Nombre del proyecto
  type: string;              // Tipo de proyecto
  client_name: string;       // Nombre del cliente
  description?: string;      // Descripción
  status: SessionStatus;     // Estado
  budget?: number;           // Presupuesto
  start_date: string;        // Fecha de inicio
  end_date?: string;         // Fecha de fin
  address?: string;          // Dirección
  latitude?: number;         // Latitud
  longitude?: number;        // Longitud
  created_at?: string;
  updated_at?: string;
};
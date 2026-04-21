export type TaskPriority = "baja" | "media" | "alta" | "urgente";

export interface Task {
  id?: number;
  project_id: number;
  assigned_user_id?: number;
  name: string;
  description?: string;
  priority: TaskPriority;
  assigned_user_name?: string;
  start_date: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

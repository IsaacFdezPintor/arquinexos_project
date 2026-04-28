export type TaskPriority = "low" | "medium" | "high" | "urgent" | "completed";

export interface TaskUser {
  id: number;
  name: string;
  email: string;
    created_at?: string;
    updated_at?: string;
}

export interface Project {
  id: number;
  name: string;
}

export interface Task {
  id?: number;
  project?: Project;
  assigned_user_id?: number;
  name: string;
  description?: string;
  priority: TaskPriority;
  assigned_user_name?: string;
  assigned_user_email?: string;
  start_date: string;
  end_date?: string;
  users?: TaskUser[];  // Relación N:M
  created_at?: string;
  updated_at?: string;
}

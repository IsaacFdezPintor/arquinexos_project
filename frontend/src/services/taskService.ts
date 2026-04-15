import type { Task } from "../types/Task";
import { http } from "./http";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (API_BASE_URL === undefined) {
  throw new Error("No está definida la URL de la API");
}

const API_URL = API_BASE_URL + "/tasks";

export const taskService = {
  // get(id) — Obtiene UNA tarea por su ID
  get(id: number): Promise<Task> {
    return http.get<Task>(API_URL + "/" + id).then(response => response.data);
  },

  // getAll() — Obtiene TODAS las tareas
  getAll(): Promise<Task[]> {
    return http.get(API_URL).then(response => {
      const tasks = Array.isArray(response.data) ? response.data : response.data.data;
      return tasks || [];
    });
  },

  // getByProject(projectId) — Obtiene tareas de un proyecto específico
  getByProject(projectId: number): Promise<Task[]> {
    return http.get(`${API_BASE_URL}/projects/${projectId}/tasks`).then(response => {
      const tasks = Array.isArray(response.data) ? response.data : response.data.data;
      return tasks || [];
    });
  },

  // delete(id) — Elimina una tarea por su ID
  delete(id: number): Promise<void> {
    return http.delete<void>(API_URL + "/" + id).then(() => {});
  },

  // create(data) — Crea una nueva tarea
  create(data: Task): Promise<Task> {
    return http.post<Task>(API_URL, data).then(response => response.data);
  },

  // update(task) — Actualiza una tarea existente
  update(task: Task): Promise<Task> {
    return http.patch<Task>(API_URL + "/" + task.id, task).then(response => response.data);
  },
};

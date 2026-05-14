import type { Task } from "../types/Task";
import { http } from "./http";

/**
 * URL base de la API de tareas.
 * Se obtiene de las variables de entorno (.env)
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (API_BASE_URL === undefined) {
  throw new Error("No está definida la URL de la API");
}

const API_URL = API_BASE_URL + "/tasks";

/**
 * Servicio de Gestión de Tareas
 * 
 * Proporciona métodos CRUD y de relación N:M para tareas.
 * Maneja:
 * - Operaciones CRUD básicas de tareas
 * - Relaciones de usuarios con tareas
 * - Consultas filtradas por proyecto
 * 
 * @module taskService
 */
export const taskService = {
  /**
   * Obtiene una tarea específica por su ID.
   * 
   * @param {number} id - ID de la tarea a obtener
   * @returns {Promise<Task>} Promesa que resuelve con los datos de la tarea
   * 
   * @example
   * const task = await taskService.get(1);
   */
  get(id: number): Promise<Task> {
    return http
      .get<Task>(API_URL + "/" + id)
      .then((response) => response.data);
  },

  /**
   * Obtiene todas las tareas disponibles.
   * 
   * @returns {Promise<Task[]>} Promesa que resuelve con array de tareas
   * 
   * @example
   * const tasks = await taskService.getAll();
   */
  /**
   * Obtiene todas las tareas paginadas.
   * @param {number} page - Página a cargar
   * @param {object} params - Otros filtros opcionales
   * @returns {Promise<any>} Objeto con tareas y paginación
   */
  getAll(): Promise<Task[]> {
    return http.get(API_URL).then((response) => {
      const tasks = Array.isArray(response.data)
        ? response.data
        : response.data.data;
      return tasks || [];
    });
  },
  /**
   * Obtiene todas las tareas de un proyecto específico.
   * 
   * @param {number} projectId - ID del proyecto
   * @returns {Promise<Task[]>} Promesa que resuelve con tareas del proyecto
   * 
   * @example
   * const projectTasks = await taskService.getByProject(1);
   */
  getByProject(projectId: number): Promise<Task[]> {
    return http
      .get(`${API_BASE_URL}/projects/${projectId}/tasks`)
      .then((response) => {
        const tasks = Array.isArray(response.data)
          ? response.data
          : response.data.data;
        return tasks || [];
      });
  },

  /**
   * Elimina una tarea existente.
   * 
   * Solo los jefes pueden eliminar tareas.
   * 
   * @param {number} id - ID de la tarea a eliminar
   * @returns {Promise<void>} Promesa que resuelve cuando se completa
   * 
   * @example
   * await taskService.delete(1);
   */
  delete(id: number): Promise<void> {
    return http
      .delete<void>(API_URL + "/" + id)
      .then(() => {});
  },

  /**
   * Crea una nueva tarea.
   * 
   * Solo los jefes pueden crear tareas.
   * 
   * @param {Task} data - Datos de la tarea a crear
   * @returns {Promise<Task>} Promesa que resuelve con la tarea creada
   * 
   * @example
   * const newTask = await taskService.create({...taskData});
   */
  create(data: Task): Promise<Task> {
    return http
      .post<Task>(API_URL, data)
      .then((response) => response.data);
  },

  /**
   * Actualiza una tarea existente.
   * 
   * @param {Task} task - Datos actualizados de la tarea
   * @returns {Promise<Task>} Promesa que resuelve con la tarea actualizada
   * 
   * @example
   * const updated = await taskService.update(updatedTask);
   */
  update(task: Task): Promise<Task> {
    return http
      .patch<Task>(API_URL + "/" + task.id, task)
      .then((response) => response.data);
  },
};

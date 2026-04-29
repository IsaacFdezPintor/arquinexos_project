import type { Project } from "../types/Project";
import { http } from "./http";

/**
 * URL base de la API de proyectos.
 * Se obtiene de las variables de entorno (.env)
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

// Comprobación de seguridad: si la variable no está definida,
// lanzamos un error claro en lugar de dejar que la app falle silenciosamente
if (API_BASE_URL === undefined) {
  throw new Error("No está definida la URL de la API");
}

const API_URL = API_BASE_URL + "/projects";

/**
 * Servicio de Gestión de Proyectos
 * 
 * Proporciona métodos CRUD (Create, Read, Update, Delete) para proyectos.
 * Realiza peticiones HTTP a la API de proyectos.
 * 
 * Métodos:
 * - get(id): Obtiene un proyecto específico
 * - getAll(): Obtiene todos los proyectos
 * - delete(id): Elimina un proyecto
 * - create(data): Crea un nuevo proyecto
 * - update(id, data): Actualiza un proyecto existente
 * 
 * @module ProjectService
 */
export const ProjectService = {
  /**
   * Obtiene un proyecto específico por su ID.
   * 
   * Realiza una petición GET a /api/projects/{id}
   * y retorna los datos del proyecto.
   * 
   * @param {number} id - ID del proyecto a obtener
   * 
   * @returns {Promise<Project>} Promesa que resuelve con los datos del proyecto
   * 
   * @throws {AxiosError} Si el proyecto no existe (404) o no hay acceso
   * 
   * @example
   * const project = await ProjectService.get(1);
   * console.log(project.name); // Nombre del proyecto
   */
  get(id: number): Promise<Project> {
    return http
      .get<Project>(API_URL + "/" + id)
      .then((response) => response.data);
  },

  /**
   * Obtiene todos los proyectos del usuario autenticado.
   * 
   * Realiza una petición GET a /api/projects
   * Retorna un array con todos los proyectos disponibles.
   * 
   * @returns {Promise<Project[]>} Promesa que resuelve con array de proyectos
   * 
   * @throws {AxiosError} Si no hay autenticación
   * 
   * @example
   * const projects = await ProjectService.getAll();
   * console.log(projects.length); // Número de proyectos
   */
  getAll(): Promise<Project[]> {
    return http.get(API_URL).then((response) => {
      // Manejo flexible de formato de respuesta paginada o directa
      const projects = Array.isArray(response.data)
        ? response.data
        : response.data.data;
      return projects || [];
    });
  },

  /**
   * Elimina un proyecto existente.
   * 
   * Realiza una petición DELETE a /api/projects/{id}
   * Solo los jefes pueden eliminar proyectos.
   * 
   * @param {number} id - ID del proyecto a eliminar
   * 
   * @returns {Promise<void>} Promesa que resuelve cuando se completa
   * 
   * @throws {AxiosError} Si no existe (404), no hay autorización (403) o no hay acceso
   * 
   * @example
   * await ProjectService.delete(1);
   * console.log('Proyecto eliminado');
   */
  delete(id: number): Promise<void> {
    return http
      .delete<void>(API_URL + "/" + id)
      .then(() => {});
  },

  /**
   * Crea un nuevo proyecto.
   * 
   * Realiza una petición POST a /api/projects con multipart/form-data.
   * Solo los jefes pueden crear proyectos.
   * 
   * Datos que acepta:
   * - name: Nombre del proyecto (required)
   * - type: Tipo de proyecto (required)
   * - client_name: Nombre del cliente (required)
   * - description: Descripción (optional)
   * - status: Estado (pending, in_progress, completed, cancelled)
   * - budget: Presupuesto (optional)
   * - start_date: Fecha de inicio (required)
   * - end_date: Fecha de fin (optional)
   * - address: Dirección (optional)
   * 
   * @param {any} data - Datos del proyecto a crear (FormData u objeto)
   * 
   * @returns {Promise<Project>} Promesa que resuelve con el proyecto creado
   * 
   * @throws {AxiosError} Si hay validación inválida (422), no hay autorización (403)
   * 
   * @example
   * const newProject = await ProjectService.create({
   *   name: 'Mi Proyecto',
   *   type: 'Software',
   *   client_name: 'Cliente ABC',
   *   start_date: '2026-05-01'
   * });
   */
  create(data: any): Promise<Project> {
    return http
      .post<Project>(API_URL, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data);
  },

  /**
   * Actualiza un proyecto existente.
   * 
   * Realiza una petición POST (como PATCH) a /api/projects/{id}
   * con multipart/form-data. Solo los jefes pueden actualizar proyectos.
   * 
   * Los mismos campos que en create() pueden ser actualizados.
   * 
   * @param {number} id - ID del proyecto a actualizar
   * @param {any} data - Datos del proyecto a actualizar (FormData u objeto)
   * 
   * @returns {Promise<Project>} Promesa que resuelve con el proyecto actualizado
   * 
   * @throws {AxiosError} Si no existe (404), validación inválida (422),
   *                      o no hay autorización (403)
   * 
   * @example
   * const updated = await ProjectService.update(1, {
   *   name: 'Nuevo Nombre',
   *   status: 'in_progress'
   * });
   */
  update(id: number, data: any): Promise<Project> {
    return http
      .post<Project>(`${API_URL}/${id}?_method=PATCH`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data);
  },
};

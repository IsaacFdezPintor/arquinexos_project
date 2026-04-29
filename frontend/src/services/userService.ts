import type { User } from "../types/Auth";
import { http } from "./http";

/**
 * URL base de la API de usuarios.
 * Se obtiene de las variables de entorno (.env)
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (API_BASE_URL === undefined) {
  throw new Error("No está definida la URL de la API");
}

const API_URL = API_BASE_URL + "/users";

/**
 * Servicio de Gestión de Usuarios
 * 
 * Proporciona métodos para consultar información de usuarios.
 * Permite:
 * - Obtener todos los usuarios
 * - Obtener un usuario específico por ID
 * - Eliminar un usuario
 * 
 * @module userService
 */
export const userService = {
  /**
   * Obtiene todos los usuarios del sistema.
   * 
   * @returns {Promise<User[]>} Promesa que resuelve con array de todos los usuarios
   * 
   * @example
   * const users = await userService.getAll();
   * console.log(users.length); // Total de usuarios
   */
  getAll(): Promise<User[]> {
    return http.get(API_URL).then((response) => {
      // Manejo flexible de formato paginado o directo
      const users = Array.isArray(response.data)
        ? response.data
        : response.data.data;
      return users || [];
    });
  },

  /**
   * Obtiene un usuario específico por su ID.
   * 
   * @param {number} id - ID del usuario a obtener
   * 
   * @returns {Promise<User>} Promesa que resuelve con los datos del usuario
   * 
   * @example
   * const user = await userService.get(1);
   * console.log(user.name); // Nombre del usuario
   */
  get(id: number): Promise<User> {
    return http
      .get<User>(`${API_URL}/${id}`)
      .then((response) => response.data);
  },

  /**
   * Elimina un usuario del sistema.
   * 
   * Solo los administradores pueden eliminar usuarios.
   * 
   * @param {number} id - ID del usuario a eliminar
   * 
   * @returns {Promise<void>} Promesa que resuelve cuando se completa
   * 
   * @example
   * await userService.delete(1);
   * console.log('Usuario eliminado');
   */
  delete(id: number): Promise<void> {
    return http
      .delete(`${API_URL}/${id}`)
      .then(() => undefined);
  },
};

import { isAxiosError } from "axios";
import { http } from "./http";
import type { AuthResponse } from "../types/Auth";

/**
 * Servicio de Autenticación
 * 
 * Proporciona métodos para:
 * - Iniciar sesión
 * - Registrar nuevos usuarios
 * - Obtener datos del usuario autenticado
 * - Cerrar sesión
 * - Detectar errores de autenticación
 * 
 * @module AuthService
 */
export const AuthService = {
  /**
   * Inicia sesión con email y contraseña.
   * 
   * Realiza una petición POST a /auth/login y retorna el token
   * y datos del usuario si las credenciales son correctas.
   * 
   * @param {string} email - Email del usuario (debe ser válido)
   * @param {string} password - Contraseña del usuario
   * 
   * @returns {Promise<AuthResponse>} Promesa que resuelve con:
   *                                  - token: Token de acceso
   *                                  - user: Datos del usuario autenticado
   * 
   * @throws {AxiosError} Si las credenciales son incorrectas
   * 
   * @example
   * const response = await AuthService.login('user@example.com', 'password123');
   * console.log(response.token); // Token de acceso
   */
  login(email: string, password: string): Promise<AuthResponse> {
    return http
      .post<AuthResponse>("/auth/login", { email, password })
      .then((r) => r.data);
  },

  /**
   * Obtiene el usuario autenticado actualmente.
   * 
   * Realiza una petición GET a /auth/me usando el token de la sesión.
   * Requiere autenticación previa.
   * 
   * @returns {Promise<AuthResponse>} Promesa que resuelve con los datos del usuario
   * 
   * @throws {AxiosError} Si no hay autenticación o token expirado
   * 
   * @example
   * const user = await AuthService.me();
   * console.log(user.name); // Nombre del usuario
   */
  me(): Promise<AuthResponse> {
    return http.get("/auth/me").then((r) => r.data);
  },

  /**
   * Registra un nuevo usuario en el sistema.
   * 
   * Realiza una petición POST a /auth/register con los datos del usuario.
   * El usuario se crea con el rol especificado ('worker' por defecto).
   * 
   * @param {string} email - Email del usuario (debe ser único)
   * @param {string} password - Contraseña (mínimo 8 caracteres)
   * @param {string} name - Nombre completo del usuario
   * @param {string} [role='worker'] - Rol del usuario: 'worker' o 'boss'
   * 
   * @returns {Promise<AuthResponse>} Promesa que resuelve con:
   *                                  - message: Mensaje de confirmación
   *                                  - token: Token de acceso inmediato
   *                                  - user: Datos del usuario registrado
   * 
   * @throws {AxiosError} Si el email ya existe o datos son inválidos
   * 
   * @example
   * const response = await AuthService.register(
   *   'newuser@example.com',
   *   'password123',
   *   'John Doe',
   *   'worker'
   * );
   */
  async register(
    email: string,
    password: string,
    name: string,
    role: string = "worker"
  ): Promise<AuthResponse> {
    const response = await http.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    return response.data;
  },

  /**
   * Cierra la sesión del usuario actual.
   * 
   * Realiza una petición POST a /auth/logout que revoca el token actual.
   * Requiere autenticación previa.
   * 
   * @returns {Promise<any>} Promesa que resuelve con mensaje de confirmación
   * 
   * @throws {AxiosError} Si no hay autenticación o token expirado
   * 
   * @example
   * await AuthService.logout();
   * console.log('Sesión cerrada');
   */
  logout(): Promise<any> {
    return http.post("/auth/logout").then((r) => r.data);
  },

  /**
   * Verifica si un error es un error de Axios.
   * 
   * Utiliza la función isAxiosError de axios para detectar
   * si un error proviene de una petición HTTP.
   * 
   * @type {Function}
   * 
   * @example
   * try {
   *   await AuthService.login('user@example.com', 'wrong');
   * } catch (error) {
   *   if (AuthService.isAuthError(error)) {
   *     console.log('Error de autenticación');
   *   }
   * }
   */
  isAuthError: isAxiosError,
};
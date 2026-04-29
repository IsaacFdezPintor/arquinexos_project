import axios, { AxiosInstance } from "axios";
import { authStorage } from "../auth/authStorage";
import type { AuthSession } from "../types/Auth";

/**
 * URL base de la API REST.
 * Se obtiene de las variables de entorno (.env)
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

/**
 * Instancia de Axios configurada para la API REST.
 * 
 * Axios es una librería HTTP que facilita:
 * - Realizar peticiones HTTP (GET, POST, PUT, DELETE, etc.)
 * - Interceptar peticiones y respuestas
 * - Manejar errores de forma centralizada
 * - Automáticamente serializar/deserializar JSON
 * 
 * @type {AxiosInstance}
 */
export const http: AxiosInstance = axios.create({
    baseURL: API_BASE_URL
});

/**
 * Interceptor de peticiones.
 * 
 * Se ejecuta antes de enviar cada petición al servidor.
 * Añade el token de autenticación en el header Authorization si existe.
 * 
 * @param {AxiosConfig} config Configuración de la petición
 * @returns {AxiosConfig} Configuración modificada con el token
 */
http.interceptors.request.use((config) => {
    // Obtener la sesión del almacenamiento local
    const session: AuthSession | null = authStorage.get();
    
    // Si existe token, añadirlo al header Authorization
    if (session?.token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${session.token}`;
    }
    
    return config;
});

/**
 * Interceptor de respuestas.
 * 
 * Se ejecuta cuando se recibe la respuesta del servidor.
 * Si es un error 401 (No autorizado), limpia la sesión y redirige a login.
 * 
 * @param {AxiosResponse} response Respuesta exitosa del servidor
 * @param {AxiosError} error Error en la petición o respuesta
 * @returns {Promise} Promesa resuelta o rechazada
 */
http.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si es error 401 (No autorizado/Token expirado)
        if (error.response?.status === 401) {
            // Limpiar almacenamiento de sesión
            authStorage.clear();
            // Redirigir a página de login
            window.location.assign("/login");
        }
        
        return Promise.reject(error);
    }
);
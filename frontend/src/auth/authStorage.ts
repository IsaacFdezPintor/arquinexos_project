import type { AuthSession } from "../types/Auth";

/**
 * Nombre de la clave utilizada para persistir la sesión en el almacenamiento local.
 */
const CLAVE = "auth_session";

/**
 * Objeto para gestionar la persistencia de la sesión de autenticación en el `localStorage` del navegador.
 */
export const authStorage = {
    /**
     * Recupera y parsea la sesión almacenada.
     * 
     * @returns {AuthSession | null} Devuelve el objeto de sesión si existe y es válido, 
     * de lo contrario retorna null.
     */
    get(): AuthSession | null {
        const datosBrutos = localStorage.getItem(CLAVE);
        if (!datosBrutos) return null;
        try {
            // Intentamos convertir el string JSON en un objeto tipado
            return JSON.parse(datosBrutos) as AuthSession;
        } catch {
            // Si el JSON está corrupto, devolvemos null
            return null;
        }
    },

    /**
     * Persiste los datos de la sesión en el almacenamiento local.
     * 
     * @param {AuthSession} session - El objeto de sesión a guardar.
     * @returns {void}
     */
    set(session: AuthSession): void {
        localStorage.setItem(CLAVE, JSON.stringify(session));
    },

    /**
     * Elimina por completo la información de sesión del almacenamiento local.
     * 
     * @returns {void}
     */
    clear(): void {
        localStorage.removeItem(CLAVE);
    }
}
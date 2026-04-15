import type { GrantTrap } from "../types/Project";
import { http } from "./http";

// Leemos la URL base de la API desde las variables de entorno (.env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

// Comprobación de seguridad: si la variable no está definida,
// lanzamos un error claro en vez de dejar que la app falle silenciosamente.
if (API_BASE_URL === undefined) {
  throw new Error("No está definida la URL de la API");
}

const API_URL = API_BASE_URL + "/projects";

// Exportamos un objeto con los 5 métodos CRUD
export const ProjectService = {

   // get(id) — Obtiene UNA sesión por su ID.
get(id: number): Promise<GrantTrap> {
  return http.get<GrantTrap>(API_URL + "/" + id).then(response => response.data);
},

  // getAll() — Obtiene TODAS las sesiones del usuario autenticado.
  getAll(): Promise<GrantTrap[]> {
        return http.get(API_URL).then(response => {
          // Laravel devuelve datos paginados con estructura { data: [...] }
          // Extraemos el array de proyectos del objeto paginado
          const projects = Array.isArray(response.data) ? response.data : response.data.data;
          return projects || [];
        });
  },

   // delete(id) — Elimina una sesión por su ID.
  delete(id: number): Promise<void> {
        return http.delete<void>(API_URL + "/" + id).then(() => {})
  },

// create(data) — Crea una nueva sesión fotográfica.
create(data: { title: string; completed?: boolean }): Promise<GrantTrap> {
  return http.post<GrantTrap>(API_URL, data).then(response => response.data);
},

  // update(session) — Actualiza una sesión existente.
  update(session: GrantTrap): Promise<GrantTrap> {
    // PUT /sessions/42 con los datos actualizados en el body
        return http.patch<GrantTrap>((API_URL + "/" + session.id),session).then(response => response.data)
  },
};

// Alias para compatibilidad con otros archivos
export const sessionService = ProjectService;

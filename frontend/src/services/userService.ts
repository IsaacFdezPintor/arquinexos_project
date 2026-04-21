import type { User } from "../types/Auth";
import { http } from "./http";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (API_BASE_URL === undefined) {
  throw new Error("No está definida la URL de la API");
}

const API_URL = API_BASE_URL + "/users";

export const userService = {
  
  // getAll() — Obtiene TODAS las usuarios
   getAll(): Promise<User[]> {
     return http.get(API_URL).then(response => {
       const users = Array.isArray(response.data) ? response.data : response.data.data;
       return users || [];
     });
   },

  // get(id) — Obtiene UN usuario por su ID
  get(id: number): Promise<User> {
    return http.get<User>(`${API_URL}/${id}`).then(response => response.data);
  },

  // delete(id) — Elimina un usuario por su ID
  delete(id: number): Promise<void> {
    return http.delete(`${API_URL}/${id}`).then(() => undefined);
  },
};

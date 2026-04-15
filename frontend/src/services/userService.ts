import type { User } from "../types/User";
import { http } from "./http";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (API_BASE_URL === undefined) {
  throw new Error("No está definida la URL de la API");
}

const API_URL = API_BASE_URL + "/users";

export const userService = {
  // getAll() — Obtiene TODOS los usuarios (sin paginar)
  getAll(): Promise<User[]> {
    return http.get(`${API_URL}?no_paginate=1`).then(response => {
      // El endpoint devuelve un array directo cuando usamos no_paginate
      const users = Array.isArray(response.data) ? response.data : response.data.data || [];
      return users;
    }).catch(err => {
      console.error("Error al obtener usuarios:", err);
      return [];
    });
  },

  // get(id) — Obtiene UN usuario por su ID
  get(id: number): Promise<User> {
    return http.get<User>(`${API_URL}/${id}`).then(response => response.data);
  },
};

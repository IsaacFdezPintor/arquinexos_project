import { isAxiosError } from "axios";
import { http } from "./http";
import type { AuthResponse } from "../types/Auth";

export const AuthService = {
  login(email: string, password: string) {
    return http
      .post<AuthResponse>("/auth/login", { email, password })
      .then((r) => r.data);
  },

  me() {
    return http.get("/auth/me").then((r) => r.data);
  },

async register(email: string, password: string, name: string, role: string = "worker") {
  const response = await http.post("/auth/register", {
    name,
    email,
    password,
    role,
  });
  return response.data;
},

  logout() {
    return http.post("/auth/logout").then((r) => r.data);
  },

  isAuthError: isAxiosError,
};
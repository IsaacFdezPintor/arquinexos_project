import { isAxiosError } from "axios";
import apiClient from "./apiClient";
import type { AuthResponse } from "../types/Auth";

export const AuthService = {
  login(email: string, password: string) {
    return apiClient
      .post<AuthResponse>("/auth/login", { email, password })
      .then((r) => r.data);
  },

  me() {
    return apiClient.get("/auth/me").then((r) => r.data);
  },

async register(email: string, password: string, name: string, role: string = "trabajador") {
  const response = await apiClient.post("/auth/register", {
    name,
    email,
    password,
    password_confirmation: password,
    role,
  });
  return response.data;
},

  logout() {
    return apiClient.post("/auth/logout").then((r) => r.data);
  },

  isAuthError: isAxiosError,
};
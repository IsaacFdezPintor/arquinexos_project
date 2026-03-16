import axios from "axios";
import { authStorage } from "../auth/authStorage";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor de request
apiClient.interceptors.request.use((config) => {
  const session = authStorage.get();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// Interceptor de response (opcional pero recomendado)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { apiClient };
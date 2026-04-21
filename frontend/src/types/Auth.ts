export interface User {
  id: number;
  name: string;
  email: string;
  role: "trabajador" | "jefe";
  created_at?: string; 
  updated_at?: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

// Usamos un alias para AuthResponse para mayor claridad semántica
export type AuthResponse = AuthSession;
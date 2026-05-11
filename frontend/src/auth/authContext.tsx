import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthSession, User } from "../types/Auth";
import { authStorage } from "./authStorage";
import { AuthService } from "../services/authService";

/**
 * Tipo que define la estructura del contexto de autenticación.
 */
type AuthContextValue = {
    user: User | null;
    isAuthenticated: boolean;
    isJefe: boolean;
    login: (session: AuthSession) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Proveedor de contexto que envuelve la aplicación para gestionar el estado global de auth.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto.
 * @returns {JSX.Element} El componente Provider de React.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const initial: AuthSession | null = authStorage.get();

    const [user, setUser] = useState<User | null>(initial?.user ?? null)
    const [token, setToken] = useState<string | null>(initial?.token ?? null)

    /**
     * Sincroniza el estado local con los cambios realizados en el almacenamiento local.
     * Útil para detectar cierres de sesión en otras pestañas.
     * 
     * @returns {void}
     */
    function syncFromStorage(): void {
        const session: AuthSession | null = authStorage.get();
        setUser(session?.user ?? null)
        setToken(session?.token ?? null)
    }

    /**
     * Inicia la sesión del usuario guardando los datos en el storage y el estado.
     * 
     * @param {AuthSession} session - Objeto que contiene el usuario y el token JWT.
     * @returns {void}
     */
    function login(session: AuthSession): void {
        authStorage.set(session);
        setUser(session.user);
        setToken(session.token);
    }

    /**
     * Cierra la sesión del usuario de forma local y remota.
     * Limpia el almacenamiento y reinicia el estado a null.
     * 
     * @returns {void}
     */
     function logout(): void {
        AuthService.logout().catch(() => {}); 
        authStorage.clear();
        setUser(null);
        setToken(null);
    }

    /**
     * Memoriza el valor del contexto para evitar recreaciones de objeto innecesarias.
     */
   const value = useMemo<AuthContextValue>(() => {
    return {
        user,
        isAuthenticated: Boolean(user),
        isJefe: user?.role?.toLowerCase() === "boss",
        login,
        logout
    };
}, [user, token])

    useEffect(() => {
        window.addEventListener("storage", syncFromStorage);
        return () => window.removeEventListener("storage", syncFromStorage);
    }, []);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook personalizado para acceder a las funciones y estado de autenticación.
 * 
 * @throws {Error} Si se utiliza fuera de un componente envuelto por AuthProvider.
 * @returns {AuthContextValue} Objeto con el estado de sesión y métodos login/logout.
 */
export function useAuth(): AuthContextValue {
    const contexto = useContext(AuthContext);
    if (!contexto) throw new Error("useAuth debe usarse dentro de <AuthProvider />");
    return contexto;
}
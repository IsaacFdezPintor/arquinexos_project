import { useCallback, useRef, useState } from "react";
import type { ToastMessage, ToastType } from "./Toast";

/**
 * Tipo que define el objeto devuelto por el hook useToast.
 */
type UseToastResult = {
    /** Array de notificaciones activas actualmente en el estado. */
    toasts: ToastMessage[];
    /** 
     * Función para registrar una nueva notificación.
     * @param {string} text - El mensaje a mostrar al usuario.
     * @param {ToastType} [type="info"] - El estilo visual.
     */
    addToast: (text: string, type?: ToastType) => void;
    /** 
     * Función para eliminar una notificación específica.
     * @param {number} id - El identificador único de la notificación a remover.
     */
    removeToast: (id: number) => void;
};

/**
 * Hook personalizado para gestionar el estado de un sistema de notificaciones..
 * 
 * @returns {UseToastResult} Funciones y estado para controlar los mensajes de feedback.
 */
export function useToast(): UseToastResult {
    // Estado principal que almacena el stack de notificaciones
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    /**
     * Referencia persistente para generar IDs únicos.
     * Usamos useRef en lugar de un estado para que el incremento del ID 
     * no provoque renders innecesarios.
     */
    const nextIdRef = useRef(1);

    /**
     * Elimina un Toast del stack basado en su ID.
     * Se usa useCallback para evitar que la función se recree en cada render,
     * optimizando el rendimiento de los componentes hijos que la consumen.
     * 
     * @param {number} id - ID del mensaje a filtrar.
     */
    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    /**
     * Crea una nueva notificación y la añade al final del stack.
     * 
     * @param {string} text - Texto informativo.
     * @param {ToastType} [type="info"] - Gravedad o tipo del mensaje.
     */
    const addToast = useCallback((text: string, type: ToastType = "info") => {
        const id = nextIdRef.current++;
        setToasts((prev) => [...prev, { id, text, type }]);
    }, []);

    return { toasts, addToast, removeToast };
}
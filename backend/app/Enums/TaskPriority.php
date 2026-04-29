<?php

namespace App\Enums;

/**
 * Enum TaskPriority - Niveles de Prioridad de Tarea
 * 
 * Define los niveles de prioridad que pueden asignarse a las tareas.
 * La prioridad ayuda a determinar el orden de ejecución y la urgencia.
 * 
 * Valores:
 * - LOW: Baja prioridad - puede esperar
 * - MEDIUM: Prioridad normal - debe completarse según el planning
 * - HIGH: Alta prioridad - requiere atención prioritaria
 * - URGENT: Urgente - requiere atención inmediata
 * - COMPLETED: Tarea completada
 * 
 */
enum TaskPriority: string
{

    case LOW = 'low';
    case MEDIUM = 'medium';
    case HIGH = 'high';
    case URGENT = 'urgent';
    case COMPLETED = 'completed';
}
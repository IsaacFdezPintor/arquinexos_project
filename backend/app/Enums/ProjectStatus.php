<?php

namespace App\Enums;

/**
 * Enum ProjectStatus - Estados del Proyecto
 * 
 * Define los estados posibles que puede tener un proyecto durante su ciclo de vida.
 * Cada proyecto debe estar en uno de estos estados en todo momento.
 * 
 * Valores:
 * - PENDING: Proyecto creado pero aún no iniciado
 * - IN_PROGRESS: Proyecto actualmente en desarrollo
 * - COMPLETED: Proyecto finalizado exitosamente
 * - CANCELLED: Proyecto cancelado o suspendido
 * 
 */
enum ProjectStatus: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
}
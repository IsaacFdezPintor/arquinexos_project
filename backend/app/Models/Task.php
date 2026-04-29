<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Modelo Task - Gestión de Tareas
 * 
 * Representa una tarea dentro de un proyecto. Almacena información de tareas
 * incluyendo nombre, descripción, estado, prioridad y fechas.
 * 
 * Las tareas pertenecen a un proyecto y pueden tener múltiples usuarios
 * asignados. El estado y prioridad se gestionan mediante enums.
 * 
 * Prioridades: low, medium, high, urgent, completed
 * 
 * @package App\Models
 * @author Equipo de Desarrollo
 * @version 1.0
 */
class Task extends Model
{
    use HasFactory;

    /**
     * Campos que pueden ser asignados de forma masiva.
     * 
     * Solo estos campos pueden ser asignados cuando se usa Task::create()
     * o Task::update(). Esto protege contra vulnerabilidades de mass assignment.
     * 
     * @var array
     */
    protected $fillable = [
        'project_id',
        'name',
        'description',
        'priority',
        'start_date',
        'end_date',
    ];

    /**
     * Define conversiones de tipos de atributos.
     * El campo 'priority' se castea automáticamente a enum TaskPriority.
     * 
     * @var array
     */
    protected $casts = [
        'priority' => \App\Enums\TaskPriority::class,
    ];

    /**
     * Obtiene el proyecto al que pertenece esta tarea.
     * 
     * Relación muchos a uno: Muchas tareas pertenecen a un proyecto.
     * La relación se establece mediante la llave externa 'project_id'.
     * 
     * @return BelongsTo El proyecto propietario de esta tarea
     */
    public function project(): BelongsTo
    {
        // Retorna el proyecto donde project_id coincide con este registro
        return $this->belongsTo(Project::class);
    }

    /**
     * Obtiene los usuarios asignados a esta tarea (relación N:M).
     * 
     * Una tarea puede tener múltiples usuarios, y un usuario puede estar
     * en múltiples tareas. La tabla 'task_users' es la tabla pivote.
     * 
     * Incluye información adicional:
     * - 'role': Rol del usuario en esta tarea (developer, reviewer, etc)
     * - timestamps: Fechas de creación y última actualización
     * 
     * @return BelongsToMany Colección de usuarios asignados a la tarea
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'task_users')
            ->withPivot('role')      // Incluye el rol de la tabla pivote
            ->withTimestamps();      // Incluye timestamps de auditoría
    }

}
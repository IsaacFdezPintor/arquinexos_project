<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Clase Task
 * Representa una tarea dentro del sistema. Gestiona la relación con proyectos, 
 * fases y usuarios asignados.
 */
class Task extends Model
{
    use HasFactory;

      /**
     * @var array $fillable Definición de campos aptos para asignación masiva.
     * Se incluyen por seguridad para evitar ataques de inyección de datos.
     */
  protected $fillable = [
    'project_id', 
    'name', 
    'description',
    'status', 
    'priority', 
    'start_date', 
    'end_date',
];

    protected $casts = [
    'priority' => \App\Enums\TaskPriority::class,
];


    /**
     * Define la relación con el modelo Project.
     * * @return BelongsTo Relación de muchos a uno con Project.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Relación N:M: Una tarea puede tener múltiples usuarios asignados.
     * Un usuario puede trabajar en múltiples tareas.
     * @return BelongsToMany Lista de usuarios asignados a la tarea
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'task_users')
            ->withPivot('role')
            ->withTimestamps();
    }

}
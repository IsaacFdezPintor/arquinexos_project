<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modelo Project - Gestión de Proyectos
 * 
 * Representa un proyecto dentro del sistema. Almacena información completa
 * del proyecto incluyendo nombre, cliente, presupuesto, fechas y estado.
 * 
 * Un proyecto puede tener múltiples tareas que se distribuyen entre usuarios.
 * El estado se gestiona mediante el enum ProjectStatus (pending, in_progress,
 * completed, cancelled).
 * 
 */
class Project extends Model
{
    use HasFactory;

    /**
     * Campos que pueden ser asignados de forma masiva.
     * 
     * Solo estos campos pueden ser asignados cuando se usa Project::create()
     * o Project::update(). Esto protege contra ataques de mass assignment.
     * 
     * @var array
     */
    protected $fillable = [
        'name',
        'type',
        'client_name',
        'status',
        'budget',
        'start_date',
        'end_date',
        'address',
        'description'
    ];

    /**
     * El campo 'status' se castea automáticamente a enum ProjectStatus.
     * @var array
     */
    protected $casts = [
        'status' => \App\Enums\ProjectStatus::class,
    ];

    /**
     * Obtiene todas las tareas asociadas a este proyecto.
     * 
     * Relación uno a muchos: Un proyecto puede tener múltiples tareas.
     * Las tareas están relacionadas mediante la llave externa 'project_id'.
     * 
     * @return HasMany Colección de todas las tareas del proyecto
     */
    public function tasks(): HasMany
    {
        // Retorna todas las tareas donde project_id coincide con este proyecto
        return $this->hasMany(Task::class);
    }

}
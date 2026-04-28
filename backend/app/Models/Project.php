<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modelo Project
 * 
 * Representa un proyecto dentro del sistema.
 * Un proyecto puede tener varias fases, tareas y registros de tiempo.
 * Este modelo se encarga de gestionar la información almacenada
 * en la tabla "projects" de la base de datos.
 */
class Project extends Model
{
    use HasFactory;

    /**
     * Campos que se pueden asignar de forma masiva (Mass Assignment).
     * 
     * Laravel solo permitirá guardar en la base de datos los campos
     * definidos en este array cuando se utilice Project::create().
     * Esto ayuda a evitar problemas de seguridad.
     *
     * @var array
     */
protected $fillable = [
    'name', 'type', 'client_name', 'status', 
    'budget', 'start_date', 'end_date', 'address', 'description'
];
protected $casts = [
    'status' => \App\Enums\ProjectStatus::class,
];

    /**
     * Relación: Un proyecto tiene muchas tareas.
     * @return HasMany Lista de tareas del proyecto
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

}
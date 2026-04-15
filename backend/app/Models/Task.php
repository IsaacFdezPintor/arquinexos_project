<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        'project_id', 'assigned_user_id', 'name', 'description',
        'status', 'priority', 'assigned_user_email', 'assigned_user_name',
        'estimated_hours', 'start_date', 'end_date',
    ];

    /**
     * Define la relación con el modelo User asignado.
     * * @return Relación de muchos a uno con User, devuelve el usuario responsable de la tarea.
     */
    public function assignedUser(): BelongsTo
    {
        // Se utiliza la clave foránea 'assigned_user_id' para identificar al usuario responsable.
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    /**
     * Define la relación con el modelo Project.
     * * @return BelongsTo Relación de muchos a uno con Project.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

}
<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Clase User
 * * Representa a los usuarios del sistema (Jefes o Trabajadores).
 * Gestiona la autenticación, roles y relaciones con tareas y habilidades.
 */
class User extends Authenticatable
{
    /**
     * HasApiTokens: Permite la autenticación mediante tokens para la API REST.
     * HasFactory: Facilita la creación de modelos para pruebas (Testing).
     */
    use HasApiTokens, HasFactory;

    /**
     * @var array $fillable Definición de campos aptos para asignación masiva.
     * Se incluyen por seguridad para evitar ataques de inyección de datos.
     */
    protected $fillable = ['name', 'email', 'password', 'role'];

    /**
     * Obtiene las tareas asignadas al usuario.
     * * @return  Relación de uno a muchos con Task.
     */
    public function tasks(): HasMany
    {
        // Conecta al usuario con sus tareas usando el campo 'assigned_user_id'.
        return $this->hasMany(Task::class, 'assigned_user_id');
    }

    /**
     * Relación N:M: Un usuario puede trabajar en múltiples tareas.
     * Una tarea puede tener múltiples usuarios asignados.
     * @return BelongsToMany Lista de tareas en las que trabaja el usuario
     */
    public function assignedTasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'task_users')
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * Verifica si el usuario posee el rol de administrador/jefe.
     * * @return bool True si el rol es 'jefe', false en caso contrario.
     */
    public function isJefe(): bool
    {
        // Compara el atributo role del modelo con la cadena 'jefe'.
        return $this->role === 'boss';
    }

    /**
     * Verifica si el usuario es un empleado 
     * * @return bool True si el rol es 'trabajador', false en caso contrario.
     */
    public function isWorker(): bool
    {
        // Verifica si la cadena coincide exactamente con 'trabajador'.
        return $this->role === 'worker';
    }
}
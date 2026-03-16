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
     * Relación: Un usuario puede trabajar en muchos proyectos (N:M).
     * Un proyecto puede tener muchos usuarios asignados.
     * @return BelongsToMany Lista de proyectos en los que trabaja el usuario
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_users');
    }

    /**
     * Verifica si el usuario posee el rol de administrador/jefe.
     * * @return bool True si el rol es 'jefe', false en caso contrario.
     */
    public function isJefe(): bool
    {
        // Compara el atributo role del modelo con la cadena 'jefe'.
        return $this->role === 'jefe';
    }

    /**
     * Verifica si el usuario es un empleado 
     * * @return bool True si el rol es 'trabajador', false en caso contrario.
     */
    public function isWorker(): bool
    {
        // Verifica si la cadena coincide exactamente con 'trabajador'.
        return $this->role === 'trabajador';
    }
}
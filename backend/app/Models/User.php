<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Modelo User - Gestión de Usuarios del Sistema
 * 
 * Representa a los usuarios del sistema que pueden tener dos roles:
 * - 'boss': Jefe con permisos elevados
 * - 'worker': Trabajador con permisos limitados
 * 
 * Gestiona autenticación mediante tokens Sanctum, roles y relaciones
 * con tareas. Cada usuario puede tener múltiples tareas asignadas.
 * 
 */
class User extends Authenticatable
{
    /**
     * - HasApiTokens: Permite autenticación sin estado mediante tokens Sanctum
     * - HasFactory: Facilita la creación de usuarios para tests y seeders
     */
    use HasApiTokens, HasFactory;

    /**
     * Campos que pueden ser asignados 
     * Protege contra ataques de inyección de datos no autorizados.
     * 
     * @var array
     */
    protected $fillable = ['name', 'email', 'password', 'role'];

    /**
     * Obtiene todas las tareas asignadas directamente al usuario.
     * 
     * Relación uno a muchos: un usuario puede tener múltiples tareas
     * donde es el responsable directo (assigned_user_id).
     * 
     * @return HasMany Colección de tareas asignadas al usuario
     */
    public function tasks(): HasMany
    {
        // Conecta al usuario con sus tareas usando el campo 'assigned_user_id'
        return $this->hasMany(Task::class, 'assigned_user_id');
    }

    /**
     * Obtiene las tareas en las que el usuario colabora (relación N:M).
     * 
     * Un usuario puede trabajar en múltiples tareas, y una tarea puede tener
     * múltiples usuarios. La tabla 'task_users' gestiona esta relación.
     * Incluye el rol del usuario en cada tarea mediante withPivot('role').
     * 
     * @return BelongsToMany Colección de tareas en que colabora el usuario
     */
    public function assignedTasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'task_users')
            ->withPivot('role')      // Incluye rol del usuario en la tarea
            ->withTimestamps();      // Incluye fechas de creación y actualización
    }

    /**
     * Verifica si el usuario tiene rol de administrador/jefe.
     * 
     * Los jefes tienen permisos elevados como crear, actualizar y eliminar
     * proyectos. Los trabajadores tienen acceso limitado.
     * 
     * @return bool true si el rol es 'boss', false en caso contrario
     */
    public function isJefe(): bool
    {
        // Compara el atributo 'role' con la cadena literal 'boss'
        return $this->role === 'boss';
    }

    /**
     * Verifica si el usuario tiene rol de trabajador.
     * 
     * Los trabajadores pueden ver y actualizar solo sus tareas asignadas.
     * No pueden crear proyectos ni gestionar otros usuarios.
     * 
     * @return bool true si el rol es 'worker', false en caso contrario
     */
    public function isWorker(): bool
    {
        // Verifica si la cadena coincide exactamente con 'worker'
        return $this->role === 'worker';
    }
}
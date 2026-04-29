<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Factoría UserFactory - Generación de Usuarios de Prueba
 * * Esta clase se encarga de crear registros para la tabla de usuarios.
 */
class UserFactory extends Factory
{
    /**
     * Almacena la contraseña cifrada para ser reutilizada por la factoría.

     * * @var string|null
     */
    protected static ?string $password;

    /**
     * * Crea un perfil de usuario completo y listo para iniciar sesión
     * * @return array<string, mixed> Atributos del usuario para la base de datos.
     */
    public function definition(): array
    {
        return [
            // Genera un nombre completo aleatorio
            'name' => fake()->name(),
            
            // Genera un correo único y seguro para pruebas
            'email' => fake()->unique()->safeEmail(),
            
            // Asigna la contraseña 'password' cifrada (la genera una sola vez)
            'password' => static::$password ??= Hash::make('password'),
            
            // Establece el rol de trabajador como valor predeterminado
            'role' => 'worker',
            
            // Genera una cadena aleatoria para la funcionalidad de "recordar sesión"
            'remember_token' => Str::random(10),
        ];
    }
}
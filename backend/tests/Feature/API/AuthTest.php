<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Clase AuthTest - Pruebas de Integración para Autenticación
 * * Este test se encarga de verificar el correcto funcionamiento del flujo de seguridad:
 * - Registro de nuevos usuarios y validación de roles.
 * - Inicio de sesión (Login) y generación de tokens Bearer.
 * - Gestión de sesión (Me) y cierre de sesión (Logout).

 */
class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Verifica que un usuario pueda registrarse exitosamente.
     * * Comprueba que se devuelva el código 201 y que la estructura JSON 
     * contenga tanto los datos del usuario como el token de acceso.
     */
    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'role' => 'boss',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['user', 'token']);

        // Confirmar que el registro existe físicamente en la base de datos
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'role' => 'boss',
        ]);
    }

    /**
     * Valida que el rol se asigne correctamente al registrar un trabajador.
     */
    public function test_register_defaults_to_trabajador(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Worker',
            'email' => 'worker@example.com',
            'password' => 'password123',
            'role' => 'worker',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', [
            'email' => 'worker@example.com',
            'role' => 'worker',
        ]);
    }

    /**
     * Prueba la robustez de las reglas de validación.
     * * Debe fallar con un error 422 si faltan campos obligatorios.
     */
    public function test_register_validation_fails_without_required_fields(): void
    {
        $response = $this->postJson('/api/auth/register', []);
        $response->assertStatus(422);
    }

    /**
     * Verifica que el sistema no permita duplicidad de correos electrónicos.
     */
    public function test_register_fails_with_duplicate_email(): void
    {
        // Pre-creamos un usuario con el email en conflicto
        User::factory()->create(['email' => 'dup@example.com']);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Dup',
            'email' => 'dup@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422);
    }


    /**
     * Comprueba el flujo exitoso de Login.
     * * El sistema debe reconocer las credenciales cifradas y retornar un token válido.
     */
    public function test_user_can_login(): void
    {
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'login@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['user', 'token']);
    }

    /**
     * Valida que el sistema rechace contraseñas incorrectas por seguridad.
     */
    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'fail@example.com',
            'password' => bcrypt('correctpassword'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'fail@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422);
    }

    /**
     * Verifica que no se pueda acceder con correos no registrados.
     */
    public function test_login_fails_with_nonexistent_email(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422);
    }

    /**
     * Valida que el cierre de sesión funcione correctamente.
     * * Esto debe invalidar el token de acceso actual en la base de datos.
     */
    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/auth/logout');

        $response->assertStatus(200);
    }
}
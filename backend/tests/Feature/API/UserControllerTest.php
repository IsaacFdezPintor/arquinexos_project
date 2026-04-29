<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Clase UserControllerTest - Pruebas para la Gestión de Usuarios
 * * Este test valida el control de acceso y las operaciones CRUD sobre los usuarios.
 */
class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $jefe;
    protected $trabajador;

    /**
     * Configuración del entorno de prueba.
     * * Inicializa los actores principales para testear la lógica de autorización (RBAC).
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->jefe = User::factory()->create(['role' => 'boss']);
        $this->trabajador = User::factory()->create(['role' => 'worker']);
    }

    /**
     * Verifica que un Jefe pueda listar a todos los usuarios.
     * * Comprueba que la respuesta siga el estándar de API Resources de Laravel.
     */
    public function test_can_list_users(): void
    {
        $response = $this->actingAs($this->jefe, 'sanctum')
            ->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }


    /**
     * Verifica que un Jefe pueda dar de alta a nuevos empleados.
     */
    public function test_jefe_can_create_user(): void
    {
        $response = $this->actingAs($this->jefe, 'sanctum')
            ->postJson('/api/users', [
                'name' => 'Nuevo Empleado',
                'email' => 'new@example.com',
                'password' => 'password123',
                'role' => 'worker',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'new@example.com']);
    }




    /**
     * Verifica que el Jefe pueda eliminar a un usuario del sistema.
     */
    public function test_jefe_can_delete_user(): void
    {
        $userParaBorrar = User::factory()->create(['role' => 'worker']);
        
        $response = $this->actingAs($this->jefe, 'sanctum')
            ->deleteJson("/api/users/{$userParaBorrar->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $userParaBorrar->id]);
    }

    /**
     * Asegura que las rutas de usuario sean privadas.
     * * Si no hay token, el sistema debe responder con 401 Unauthorized.
     */
    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/users');

        $response->assertStatus(401);
    }
}
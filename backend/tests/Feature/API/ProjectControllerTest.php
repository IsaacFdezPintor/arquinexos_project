<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Clase ProjectControllerTest - Pruebas de Integración para Proyectos
 * * Este test verifica el ciclo de vida completo  de los proyectos y 
 * asegura que las reglas de autorización funcionen correctamente
 */
class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $jefe;
    protected $trabajador;

    /**
     * Configuración inicial para cada prueba.
     * * Prepara los perfiles de usuario necesarios para testear la lógica de permisos.
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Creamos usuarios con roles específicos usando la factoría
        $this->jefe = User::factory()->create(['role' => 'boss']);
        $this->trabajador = User::factory()->create(['role' => 'worker']);
    }

    /**
     * Verifica que el Jefe pueda obtener la lista de proyectos.
     * * Comprueba que el formato de respuesta siga la estructura de Recursos de Laravel (data).
     */
    public function test_jefe_can_list_projects(): void
    {
        Project::factory()->count(2)->create();

        $response = $this->actingAs($this->jefe, 'sanctum')
            ->getJson('/api/projects');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    /**
     * Verifica que un Jefe pueda dar de alta nuevos proyectos.
     * * Valida que el código de estado sea 201 (Created).
     */
    public function test_jefe_can_create_project(): void
    {
        $response = $this->actingAs($this->jefe, 'sanctum')
            ->postJson('/api/projects', [
                'name' => 'Proyecto de Prueba',
                'type' => 'edificacion',
                'client_name' => 'Cliente Ficticio',
                'status' => 'pending',
                'start_date' => '2026-04-01',
            ]);

        $response->assertStatus(201);
        
        // Confirmamos que el dato se guardó realmente
        $this->assertDatabaseHas('projects', ['name' => 'Proyecto de Prueba']);
    }

    /**
     * Prueba de Seguridad: Un trabajador no debe poder crear proyectos.
     * * El sistema debe responder con un 403 (Forbidden) debido a la política de acceso.
     */
    public function test_trabajador_cannot_create_project(): void
    {
        $response = $this->actingAs($this->trabajador, 'sanctum')
            ->postJson('/api/projects', [
                'name' => 'Intento Fallido',
                'type' => 'urbanismo',
                'client_name' => 'Cliente',
                'status' => 'pending',
                'start_date' => '2026-04-01',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Verifica la visualización de un proyecto específico 
     */
    public function test_can_view_project(): void
    {
        $project = Project::factory()->create();

        $response = $this->actingAs($this->jefe, 'sanctum')
            ->getJson("/api/projects/{$project->id}");

        $response->assertStatus(200)
            ->assertJsonPath('name', $project->name);
    }

    /**
     * Verifica que el Jefe pueda modificar datos de un proyecto existente.
     */
    public function test_jefe_can_update_project(): void
    {
        $project = Project::factory()->create(['name' => 'Original']);

        $response = $this->actingAs($this->jefe, 'sanctum')
            ->putJson("/api/projects/{$project->id}", [
                'name' => 'Nombre Actualizado',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('projects', ['name' => 'Nombre Actualizado']);
    }

    /**
     * Verifica la eliminación física de un proyecto.
     */
    public function test_jefe_can_delete_project(): void
    {
        $project = Project::factory()->create();

        $response = $this->actingAs($this->jefe, 'sanctum')
            ->deleteJson("/api/projects/{$project->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    /**
     * Asegura que el acceso sea denegado si no hay una sesión activa.
     * * El middleware Sanctum debe devolver 401 
     */
    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/projects');

        $response->assertStatus(401);
    }
}
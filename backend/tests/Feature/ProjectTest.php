<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /**
     * Test obtener lista de proyectos
     */
    public function test_get_projects(): void
    {
        Project::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
                         ->getJson('/api/projects');

        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    }

    /**
     * Test crear nuevo proyecto
     */
    public function test_create_project(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
                         ->postJson('/api/projects', [
                             'name' => 'New Project',
                             'description' => 'Test project',
                             'status' => 'active',
                         ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['id', 'name', 'description', 'status']);
        
        $this->assertDatabaseHas('projects', ['name' => 'New Project']);
    }

    /**
     * Test actualizar proyecto
     */
    public function test_update_project(): void
    {
        $project = Project::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
                         ->putJson("/api/projects/{$project->id}", [
                             'name' => 'Updated Project',
                             'status' => 'completed',
                         ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('projects', ['id' => $project->id, 'name' => 'Updated Project']);
    }

    /**
     * Test eliminar proyecto
     */
    public function test_delete_project(): void
    {
        $project = Project::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
                         ->deleteJson("/api/projects/{$project->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    /**
     * Test sin autenticación no puede acceder
     */
    public function test_unauthorized_cannot_access_projects(): void
    {
        $response = $this->getJson('/api/projects');

        $response->assertStatus(401);
    }
}

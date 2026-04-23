<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $jefe;
    protected $trabajador;

    protected function setUp(): void
    {
        parent::setUp();
        $this->jefe = User::factory()->create(['role' => 'boss']);
        $this->trabajador = User::factory()->create(['role' => 'worker']);
    }

    public function test_jefe_can_list_projects(): void
    {
        Project::factory()->count(2)->create();
        $response = $this->actingAs($this->jefe)->getJson('/api/projects');
        $response->assertStatus(200)->assertJsonStructure(['data']);
    }

    public function test_jefe_can_create_project(): void
    {
        $response = $this->actingAs($this->jefe)->postJson('/api/projects', [
            'name' => 'Test',
            'type' => 'Software',
            'client_name' => 'Client',
            'status' => 'pending',
            'start_date' => '2026-04-01',
        ]);
        $response->assertStatus(201);
    }

    public function test_trabajador_cannot_create_project(): void
    {
        $response = $this->actingAs($this->trabajador)->postJson('/api/projects', [
            'name' => 'Test',
            'type' => 'Software',
            'client_name' => 'Client',
            'status' => 'pending',
            'start_date' => '2026-04-01',
        ]);
        $response->assertStatus(403);
    }

    public function test_can_view_project(): void
    {
        $project = Project::factory()->create();
        $response = $this->actingAs($this->jefe)->getJson("/api/projects/{$project->id}");
        $response->assertStatus(200);
    }

    public function test_jefe_can_update_project(): void
    {
        $project = Project::factory()->create();
        $response = $this->actingAs($this->jefe)->putJson("/api/projects/{$project->id}", [
            'name' => 'Updated',
        ]);
        $response->assertStatus(200);
    }

    public function test_jefe_can_delete_project(): void
    {
        $project = Project::factory()->create();
        $response = $this->actingAs($this->jefe)->deleteJson("/api/projects/{$project->id}");
        $response->assertStatus(200);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/projects');
        $response->assertStatus(401);
    }
}

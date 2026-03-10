<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    private function jefeUser(): User
    {
        return User::factory()->create(['role' => 'jefe']);
    }

    private function workerUser(): User
    {
        return User::factory()->create(['role' => 'trabajador']);
    }

    // ==================== INDEX (con paginacion) ====================

    public function test_can_list_projects_paginated(): void
    {
        $user = $this->jefeUser();
        Project::factory()->count(20)->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/projects');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'current_page',
                'data',
                'per_page',
                'total',
            ]);

        $this->assertCount(15, $response->json('data'));
        $this->assertEquals(20, $response->json('total'));
    }

    public function test_can_list_projects_without_pagination(): void
    {
        $user = $this->jefeUser();
        Project::factory()->count(20)->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/projects?no_paginate=true');

        $response->assertStatus(200);
        $this->assertCount(20, $response->json());
    }

    public function test_unauthenticated_cannot_list_projects(): void
    {
        $response = $this->getJson('/api/projects');
        $response->assertStatus(401);
    }

    // ==================== STORE ====================

    public function test_can_create_project(): void
    {
        $user = $this->jefeUser();

        $data = [
            'name' => 'Edificio Centro',
            'type' => 'comercial',
            'client_name' => 'Corp SA',
            'status' => 'active',
            'budget' => 150000.50,
            'start_date' => '2026-03-01',
            'end_date' => '2026-12-31',
            'address' => 'Calle Mayor 10',
            'description' => 'Proyecto de oficinas',
        ];

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/projects', $data);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Edificio Centro']);

        $this->assertDatabaseHas('projects', ['name' => 'Edificio Centro']);
    }

    public function test_create_project_validation_fails_missing_required(): void
    {
        $user = $this->jefeUser();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/projects', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'type', 'client_name', 'status', 'start_date']);
    }

    // ==================== SHOW ====================

    public function test_can_show_project(): void
    {
        $user = $this->jefeUser();
        $project = Project::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/projects/{$project->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $project->id]);
    }

    public function test_show_nonexistent_project_returns_404(): void
    {
        $user = $this->jefeUser();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/projects/9999');

        $response->assertStatus(404);
    }

    // ==================== UPDATE ====================

    public function test_can_update_project(): void
    {
        $user = $this->jefeUser();
        $project = Project::factory()->create(['name' => 'Antiguo']);

        $response = $this->actingAs($user, 'sanctum')
            ->putJson("/api/projects/{$project->id}", [
                'name' => 'Nuevo Nombre',
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Nuevo Nombre']);

        $this->assertDatabaseHas('projects', ['id' => $project->id, 'name' => 'Nuevo Nombre']);
    }

    // ==================== DESTROY ====================

    public function test_can_delete_project(): void
    {
        $user = $this->jefeUser();
        $project = Project::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/projects/{$project->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }
}
<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\Phase;
use App\Models\Skill;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ResourceControllerTest extends TestCase
{
    use RefreshDatabase;

    private function authUser(): User
    {
        return User::factory()->create(['role' => 'jefe']);
    }

    // ==================== PHASES ====================

    public function test_can_list_phases_paginated(): void
    {
        $user = $this->authUser();
        $project = Project::factory()->create();
        Phase::factory()->count(20)->create(['project_id' => $project->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/phases');

        $response->assertStatus(200)
            ->assertJsonStructure(['current_page', 'data', 'per_page', 'total']);
    }

    public function test_can_create_phase(): void
    {
        $user = $this->authUser();
        $project = Project::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/phases', [
                'project_id' => $project->id,
                'name' => 'Fase Diseño',
                'status' => 'pending',
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Fase Diseño']);
    }

    public function test_phase_validation_fails(): void
    {
        $user = $this->authUser();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/phases', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['project_id', 'name', 'status']);
    }

    public function test_can_update_phase(): void
    {
        $user = $this->authUser();
        $phase = Phase::factory()->create(['name' => 'Vieja']);

        $response = $this->actingAs($user, 'sanctum')
            ->putJson("/api/phases/{$phase->id}", ['name' => 'Nueva']);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Nueva']);
    }

    public function test_can_delete_phase(): void
    {
        $user = $this->authUser();
        $phase = Phase::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/phases/{$phase->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('phases', ['id' => $phase->id]);
    }

    // ==================== SKILLS ====================

    public function test_can_list_skills_paginated(): void
    {
        $user = $this->authUser();
        Skill::factory()->count(5)->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/skills');

        $response->assertStatus(200)
            ->assertJsonStructure(['current_page', 'data', 'total']);
    }

    public function test_can_create_skill(): void
    {
        $user = $this->authUser();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/skills', [
                'name' => 'AutoCAD',
                'description' => 'Diseño técnico',
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'AutoCAD']);
    }

    public function test_skill_name_must_be_unique(): void
    {
        $user = $this->authUser();
        Skill::factory()->create(['name' => 'Revit']);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/skills', ['name' => 'Revit']);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_can_delete_skill(): void
    {
        $user = $this->authUser();
        $skill = Skill::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/skills/{$skill->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('skills', ['id' => $skill->id]);
    }

    // ==================== USERS ====================

    public function test_can_list_users_paginated(): void
    {
        $user = $this->authUser();
        User::factory()->count(5)->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure(['current_page', 'data', 'total']);
    }

    public function test_can_get_team_workers(): void
    {
        $jefe = $this->authUser();
        User::factory()->count(3)->create(['role' => 'trabajador']);
        User::factory()->create(['role' => 'jefe']);

        $response = $this->actingAs($jefe, 'sanctum')
            ->getJson('/api/users/team');

        $response->assertStatus(200);
        // Solo trabajadores (3 creados + posiblemente más según seed)
        $this->assertGreaterThanOrEqual(3, count($response->json()));
    }
}

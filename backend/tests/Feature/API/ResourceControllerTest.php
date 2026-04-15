<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ResourceControllerTest extends TestCase
{
    use RefreshDatabase;

    private function authUser(): User
    {
        return User::factory()->create(['role' => 'jefe']);
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
        $this->assertGreaterThanOrEqual(3, count($response->json()));
    }
}

<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ResourceControllerTest extends TestCase
{
    use RefreshDatabase;

    private function authUser(): User
    {
        return User::factory()->create(['role' => 'jefe']);
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
        User::factory()->count(3)->create(['role' => 'worker']);
        User::factory()->create(['role' => 'boss']);

        $response = $this->actingAs($jefe, 'sanctum')
            ->getJson('/api/users/team');

        $response->assertStatus(200);
        $this->assertGreaterThanOrEqual(3, count($response->json()));
    }
}

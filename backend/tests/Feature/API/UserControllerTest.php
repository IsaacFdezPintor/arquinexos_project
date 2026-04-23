<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserControllerTest extends TestCase
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

    public function test_can_list_users(): void
    {
        $response = $this->actingAs($this->jefe)->getJson('/api/users');
        $response->assertStatus(200)->assertJsonStructure(['data']);
    }

    public function test_jefe_can_view_team(): void
    {
        $response = $this->actingAs($this->jefe)->getJson('/api/users/team');
        $response->assertStatus(200);
    }

    public function test_trabajador_cannot_view_team(): void
    {
        $response = $this->actingAs($this->trabajador)->getJson('/api/users/team');
        $response->assertStatus(403);
    }

    public function test_jefe_can_create_user(): void
    {
        $response = $this->actingAs($this->jefe)->postJson('/api/users', [
            'name' => 'New User',
            'email' => 'new@example.com',
            'password' => 'password123',
            'role' => 'worker',
        ]);
        $response->assertStatus(201);
    }

    public function test_can_view_user(): void
    {
        $response = $this->actingAs($this->jefe)->getJson("/api/users/{$this->trabajador->id}");
        $response->assertStatus(200);
    }

    public function test_can_update_user(): void
    {
        $response = $this->actingAs($this->jefe)->putJson("/api/users/{$this->trabajador->id}", [
            'name' => 'Updated',
        ]);
        $response->assertStatus(200);
    }

    public function test_jefe_can_delete_user(): void
    {
        $user = User::factory()->create(['role' => 'worker']);
        $response = $this->actingAs($this->jefe)->deleteJson("/api/users/{$user->id}");
        $response->assertStatus(200);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/users');
        $response->assertStatus(401);
    }
}

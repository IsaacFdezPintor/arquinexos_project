<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProjectUserTest extends TestCase
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

    // ==================== INDEX ====================

    public function test_can_list_users_in_project(): void
    {
        $jefe = $this->jefeUser();
        $project = Project::factory()->create();
        $users = User::factory()->count(3)->create();

        // Asignar usuarios al proyecto
        foreach ($users as $user) {
            $project->users()->attach($user->id, ['role' => 'member']);
        }

        $response = $this->actingAs($jefe, 'sanctum')
            ->getJson("/api/projects/{$project->id}/users");

        $response->assertStatus(200);
        $this->assertCount(3, $response->json());
    }

    public function test_empty_users_list_in_project(): void
    {
        $jefe = $this->jefeUser();
        $project = Project::factory()->create();

        $response = $this->actingAs($jefe, 'sanctum')
            ->getJson("/api/projects/{$project->id}/users");

        $response->assertStatus(200);
        $this->assertCount(0, $response->json());
    }

    // ==================== STORE ====================

    public function test_jefe_can_assign_user_to_project(): void
    {
        $jefe = $this->jefeUser();
        $project = Project::factory()->create();
        $user = $this->workerUser();

        $response = $this->actingAs($jefe, 'sanctum')
            ->postJson("/api/projects/{$project->id}/users", [
                'user_id' => $user->id,
                'role' => 'leader',
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['user_id' => $user->id, 'role' => 'leader']);

        $this->assertTrue($project->users()->where('user_id', $user->id)->exists());
    }

    public function test_worker_cannot_assign_user_to_project(): void
    {
        $worker = $this->workerUser();
        $project = Project::factory()->create();
        $user = $this->workerUser();

        $response = $this->actingAs($worker, 'sanctum')
            ->postJson("/api/projects/{$project->id}/users", [
                'user_id' => $user->id,
                'role' => 'member',
            ]);

        $response->assertStatus(403);
    }

    public function test_cannot_assign_duplicate_user(): void
    {
        $jefe = $this->jefeUser();
        $project = Project::factory()->create();
        $user = $this->workerUser();

        // Primer intento
        $this->actingAs($jefe, 'sanctum')
            ->postJson("/api/projects/{$project->id}/users", [
                'user_id' => $user->id,
                'role' => 'member',
            ]);

        // Segundo intento (debe fallar)
        $response = $this->actingAs($jefe, 'sanctum')
            ->postJson("/api/projects/{$project->id}/users", [
                'user_id' => $user->id,
                'role' => 'leader',
            ]);

        $response->assertStatus(422);
    }

    public function test_default_role_is_member(): void
    {
        $jefe = $this->jefeUser();
        $project = Project::factory()->create();
        $user = $this->workerUser();

        $response = $this->actingAs($jefe, 'sanctum')
            ->postJson("/api/projects/{$project->id}/users", [
                'user_id' => $user->id,
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['role' => 'member']);
    }

    // ==================== UPDATE ====================

    public function test_jefe_can_update_user_role(): void
    {
        $jefe = $this->jefeUser();
        $project = Project::factory()->create();
        $user = $this->workerUser();

        // Asignar usuario primero
        $project->users()->attach($user->id, ['role' => 'member']);

        $response = $this->actingAs($jefe, 'sanctum')
            ->putJson("/api/projects/{$project->id}/users/{$user->id}", [
                'role' => 'reviewer',
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['role' => 'reviewer']);

        // Verificar que los datos se guardaron en la base de datos
        $this->assertDatabaseHas('project_users', [
            'project_id' => $project->id,
            'user_id' => $user->id,
            'role' => 'reviewer',
        ]);
    }

    public function test_worker_cannot_update_user_role(): void
    {
        $worker = $this->workerUser();
        $project = Project::factory()->create();
        $user = $this->workerUser();

        $project->users()->attach($user->id, ['role' => 'member']);

        $response = $this->actingAs($worker, 'sanctum')
            ->putJson("/api/projects/{$project->id}/users/{$user->id}", [
                'role' => 'leader',
            ]);

        $response->assertStatus(403);
    }

    // ==================== DESTROY ====================

    public function test_jefe_can_unassign_user_from_project(): void
    {
        $jefe = $this->jefeUser();
        $project = Project::factory()->create();
        $user = $this->workerUser();

        $project->users()->attach($user->id, ['role' => 'member']);

        $response = $this->actingAs($jefe, 'sanctum')
            ->deleteJson("/api/projects/{$project->id}/users/{$user->id}");

        $response->assertStatus(200);
        $this->assertFalse($project->users()->where('user_id', $user->id)->exists());
    }

    public function test_worker_cannot_unassign_user(): void
    {
        $worker = $this->workerUser();
        $project = Project::factory()->create();
        $user = $this->workerUser();

        $project->users()->attach($user->id, ['role' => 'member']);

        $response = $this->actingAs($worker, 'sanctum')
            ->deleteJson("/api/projects/{$project->id}/users/{$user->id}");

        $response->assertStatus(403);
    }

    public function test_cannot_unassign_user_not_in_project(): void
    {
        $jefe = $this->jefeUser();
        $project = Project::factory()->create();
        $user = $this->workerUser();

        $response = $this->actingAs($jefe, 'sanctum')
            ->deleteJson("/api/projects/{$project->id}/users/{$user->id}");

        $response->assertStatus(404);
    }
}

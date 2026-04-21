<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TaskControllerTest extends TestCase
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

    public function test_can_list_tasks_paginated(): void
    {
        $user = $this->jefeUser();
        $project = Project::factory()->create();
        Task::factory()->count(20)->create(['project_id' => $project->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/tasks');

        $response->assertStatus(200)
            ->assertJsonStructure(['current_page', 'data', 'per_page', 'total']);

        $this->assertEquals(20, $response->json('total'));
    }

    public function test_can_list_tasks_without_pagination(): void
    {
        $user = $this->jefeUser();
        $project = Project::factory()->create();
        Task::factory()->count(5)->create(['project_id' => $project->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/tasks?no_paginate=true');

        $response->assertStatus(200);
        $this->assertCount(5, $response->json());
    }

    public function test_unauthenticated_cannot_list_tasks(): void
    {
        $response = $this->getJson('/api/tasks');
        $response->assertStatus(401);
    }

    // ==================== STORE ====================

    public function test_jefe_can_create_task(): void
    {
        $jefe = $this->jefeUser();
        $project = Project::factory()->create();

        $data = [
            'project_id' => $project->id,
            'name' => 'Tarea de Prueba',
            'status' => 'pendiente',
            'priority' => 'alta',
            'description' => 'Desc test',
        ];

        $response = $this->actingAs($jefe, 'sanctum')
            ->postJson('/api/tasks', $data);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Tarea de Prueba']);

        $this->assertDatabaseHas('tasks', ['name' => 'Tarea de Prueba']);
    }

    public function test_worker_cannot_create_task(): void
    {
        $worker = $this->workerUser();
        $project = Project::factory()->create();

        $response = $this->actingAs($worker, 'sanctum')
            ->postJson('/api/tasks', [
                'project_id' => $project->id,
                'name' => 'Intento',
                'status' => 'pendiente',
                'priority' => 'media',
            ]);

        $response->assertStatus(403);
    }

    public function test_create_task_validation_fails(): void
    {
        $jefe = $this->jefeUser();

        $response = $this->actingAs($jefe, 'sanctum')
            ->postJson('/api/tasks', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['project_id', 'name', 'status', 'priority']);
    }

    // ==================== SHOW ====================

    public function test_can_show_task(): void
    {
        $user = $this->jefeUser();
        $task = Task::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $task->id]);
    }

    // ==================== UPDATE ====================

    public function test_jefe_can_update_task(): void
    {
        $jefe = $this->jefeUser();
        $task = Task::factory()->create(['name' => 'Antigua']);

        $response = $this->actingAs($jefe, 'sanctum')
            ->putJson("/api/tasks/{$task->id}", [
                'name' => 'Actualizada',
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Actualizada']);
    }

    public function test_worker_cannot_update_task(): void
    {
        $worker = $this->workerUser();
        $task = Task::factory()->create();

        $response = $this->actingAs($worker, 'sanctum')
            ->putJson("/api/tasks/{$task->id}", ['name' => 'Hack']);

        $response->assertStatus(403);
    }

    // ==================== DESTROY ====================

    public function test_jefe_can_delete_task(): void
    {
        $jefe = $this->jefeUser();
        $task = Task::factory()->create();

        $response = $this->actingAs($jefe, 'sanctum')
            ->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_worker_can_delete_own_task(): void
    {
        $worker = $this->workerUser();
        $task = Task::factory()->create(['assigned_user_id' => $worker->id]);

        $response = $this->actingAs($worker, 'sanctum')
            ->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_worker_cannot_delete_other_worker_task(): void
    {
        $worker = $this->workerUser();
        $otherWorker = $this->workerUser();
        $task = Task::factory()->create(['assigned_user_id' => $otherWorker->id]);

        $response = $this->actingAs($worker, 'sanctum')
            ->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(403);
    }

    // ==================== MY-TASKS ====================

    public function test_worker_can_get_my_tasks(): void
    {
        $worker = $this->workerUser();
        $project = Project::factory()->create();
        Task::factory()->count(3)->create([
            'project_id' => $project->id,
            'assigned_user_id' => $worker->id,
        ]);
        // Tarea de otro user
        Task::factory()->create(['project_id' => $project->id]);

        $response = $this->actingAs($worker, 'sanctum')
            ->getJson('/api/tasks/my-tasks');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json());
    }
}

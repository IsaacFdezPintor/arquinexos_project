<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $jefe;
    protected $trabajador;
    protected $project;

    protected function setUp(): void
    {
        parent::setUp();
        $this->jefe = User::factory()->create(['role' => 'boss']);
        $this->trabajador = User::factory()->create(['role' => 'worker']);
        $this->project = Project::factory()->create();
    }

    public function test_can_list_tasks(): void
    {
        Task::factory()->count(2)->for($this->project)->create();
        $response = $this->actingAs($this->jefe)->getJson('/api/tasks');
        $response->assertStatus(200)->assertJsonStructure(['data']);
    }

    public function test_jefe_can_create_task(): void
    {
        $response = $this->actingAs($this->jefe)->postJson('/api/tasks', [
            'project_id' => $this->project->id,
            'name' => 'Test Task',
            'priority' => 'medium',
        ]);
        $response->assertStatus(201);
    }

    public function test_trabajador_cannot_create_task(): void
    {
        $response = $this->actingAs($this->trabajador)->postJson('/api/tasks', [
            'project_id' => $this->project->id,
            'name' => 'Test',
            'priority' => 'medium',
        ]);
        $response->assertStatus(403);
    }

    public function test_can_view_task(): void
    {
        $task = Task::factory()->for($this->project)->create();
        $response = $this->actingAs($this->jefe)->getJson("/api/tasks/{$task->id}");
        $response->assertStatus(200);
    }

    public function test_jefe_can_update_task(): void
    {
        $task = Task::factory()->for($this->project)->create();
        $response = $this->actingAs($this->jefe)->putJson("/api/tasks/{$task->id}", [
            'project_id' => $this->project->id,
            'name' => 'Updated',
        ]);
        $response->assertStatus(200);
    }

    public function test_jefe_can_delete_task(): void
    {
        $task = Task::factory()->for($this->project)->create();
        $response = $this->actingAs($this->jefe)->deleteJson("/api/tasks/{$task->id}");
        $response->assertStatus(200);
    }

    public function test_prevent_overlapping_dates(): void
    {
        Task::factory()->for($this->project)->create([
            'assigned_user_id' => $this->trabajador->id,
            'start_date' => '2026-04-01',
            'end_date' => '2026-04-10',
        ]);

        $response = $this->actingAs($this->jefe)->postJson('/api/tasks', [
            'project_id' => $this->project->id,
            'name' => 'Overlapping',
            'assigned_user_id' => $this->trabajador->id,
            'start_date' => '2026-04-05',
            'end_date' => '2026-04-15',
        ]);

        $response->assertStatus(422);
    }

    public function test_trabajador_can_view_own_tasks(): void
    {
        Task::factory()->for($this->project)->create([
            'assigned_user_id' => $this->trabajador->id,
        ]);

        $response = $this->actingAs($this->trabajador)->getJson('/api/tasks/my-tasks');
        $response->assertStatus(200);
    }
}

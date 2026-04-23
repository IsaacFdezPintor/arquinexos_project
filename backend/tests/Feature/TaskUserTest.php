<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_assign_user_to_task()
    {
        $jefe = User::factory()->create(['role' => 'boss']);
        $worker = User::factory()->create(['role' => 'worker']);
        $project = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $project->id]);

        $response = $this->actingAs($jefe)->postJson("/api/tasks/{$task->id}/users", [
            'user_id' => $worker->id,
            'role' => 'assigned'
        ]);

        $response->assertStatus(201);
        $this->assertTrue($task->users()->where('user_id', $worker->id)->exists());
    }

    public function test_cannot_assign_same_user_twice()
    {
        $jefe = User::factory()->create(['role' => 'boss']);
        $worker = User::factory()->create(['role' => 'worker']);
        $project = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $project->id]);

        $task->users()->attach($worker->id, ['role' => 'Worker']);

        $response = $this->actingAs($jefe)->postJson("/api/tasks/{$task->id}/users", [
            'user_id' => $worker->id,
            'role' => 'Worker'
        ]);

        $response->assertStatus(422);
    }

    public function test_get_task_users()
    {
        $jefe = User::factory()->create(['role' => 'boss']);
        $worker1 = User::factory()->create(['role' => 'worker']);
        $worker2 = User::factory()->create(['role' => 'worker']);
        $project = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $project->id]);

        $task->users()->attach([$worker1->id, $worker2->id]);

        $response = $this->actingAs($jefe)->getJson("/api/tasks/{$task->id}/users");

        $response->assertStatus(200);
        $response->assertJsonPath('count', 2);
    }

    public function test_update_user_role_in_task()
    {
        $jefe = User::factory()->create(['role' => 'boss']);
        $worker = User::factory()->create(['role' => 'worker']);
        $project = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $project->id]);

        $task->users()->attach($worker->id, ['role' => 'Worker']);

        $response = $this->actingAs($jefe)->putJson("/api/tasks/{$task->id}/users/{$worker->id}", [
            'role' => 'Boss'
        ]);

        $response->assertStatus(200);
        $this->assertEquals('Boss', $task->users()->find($worker->id)->pivot->role);
    }

    public function test_unassign_user_from_task()
    {
        $jefe = User::factory()->create(['role' => 'boss']);
        $worker = User::factory()->create(['role' => 'worker']);
        $project = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $project->id]);

        $task->users()->attach($worker->id, ['role' => 'Worker']);

        $response = $this->actingAs($jefe)->deleteJson("/api/tasks/{$task->id}/users/{$worker->id}");

        $response->assertStatus(200);
        $this->assertFalse($task->users()->where('user_id', $worker->id)->exists());
    }

    public function test_user_can_see_their_assigned_tasks()
    {
        $worker = User::factory()->create(['role' => 'worker']);
        $project = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $project->id]);

        $task->users()->attach($worker->id, ['role' => 'Worker']);

        $assignedTasks = $worker->assignedTasks()->get();

        $this->assertCount(1, $assignedTasks);
        $this->assertEquals($task->id, $assignedTasks[0]->id);
    }
}

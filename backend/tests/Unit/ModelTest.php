<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ModelTest extends TestCase
{
    use RefreshDatabase;

    // ==================== USER MODEL ====================

    public function test_user_is_jefe(): void
    {
        $user = User::factory()->create(['role' => 'boss']);
        $this->assertTrue($user->isJefe());
        $this->assertFalse($user->isWorker());
    }

    public function test_user_is_worker(): void
    {
        $user = User::factory()->create(['role' => 'worker']);
        $this->assertTrue($user->isWorker());
        $this->assertFalse($user->isJefe());
    }

    public function test_user_has_many_tasks(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();
        Task::factory()->count(3)->create([
            'project_id' => $project->id,
            'assigned_user_id' => $user->id,
        ]);

        $this->assertCount(3, $user->tasks);
    }

    // ==================== PROJECT MODEL ====================

    public function test_project_has_many_tasks(): void
    {
        $project = Project::factory()->create();
        Task::factory()->count(4)->create(['project_id' => $project->id]);

        $this->assertCount(4, $project->tasks);
    }

    // ==================== TASK MODEL ====================

    public function test_task_belongs_to_project(): void
    {
        $project = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $project->id]);

        $this->assertEquals($project->id, $task->project->id);
    }

    public function test_task_belongs_to_assigned_user(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['assigned_user_id' => $user->id]);

        $this->assertEquals($user->id, $task->assignedUser->id);
    }

    // ==================== FACTORY SMOKE TESTS ====================

    public function test_project_factory_creates_valid_model(): void
    {
        $project = Project::factory()->create();
        $this->assertDatabaseHas('projects', ['id' => $project->id]);
    }

    public function test_task_factory_creates_valid_model(): void
    {
        $task = Task::factory()->create();
        $this->assertDatabaseHas('tasks', ['id' => $task->id]);
    }
}

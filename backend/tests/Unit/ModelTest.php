<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use App\Models\Skill;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ModelTest extends TestCase
{
    use RefreshDatabase;

    // ==================== USER MODEL ====================

    public function test_user_is_jefe(): void
    {
        $user = User::factory()->create(['role' => 'jefe']);
        $this->assertTrue($user->isJefe());
        $this->assertFalse($user->isWorker());
    }

    public function test_user_is_worker(): void
    {
        $user = User::factory()->create(['role' => 'trabajador']);
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

    public function test_user_has_many_time_logs(): void
    {
        $user = User::factory()->create();
        $this->assertCount(0, $user->timeLogs);
    }

    public function test_user_belongs_to_many_skills(): void
    {
        $user = User::factory()->create();
        $skill = Skill::factory()->create();
        $user->skills()->attach($skill->id, ['proficiency_level' => 'avanzado']);

        $this->assertCount(1, $user->fresh()->skills);
        $this->assertEquals('avanzado', $user->skills->first()->pivot->proficiency_level);
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

    // ==================== SKILL MODEL ====================

    public function test_skill_belongs_to_many_users(): void
    {
        $skill = Skill::factory()->create();
        $users = User::factory()->count(3)->create();
        foreach ($users as $user) {
            $user->skills()->attach($skill->id);
        }

        $this->assertCount(3, $skill->fresh()->users);
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

    public function test_skill_factory_creates_valid_model(): void
    {
        $skill = Skill::factory()->create();
        $this->assertDatabaseHas('skills', ['id' => $skill->id]);
    }
}

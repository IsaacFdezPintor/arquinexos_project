<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ModelsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test relación User -> Projects
     */
    public function test_user_has_many_projects(): void
    {
        $user = User::factory()->create();
        $projects = Project::factory()->count(3)->create(['user_id' => $user->id]);

        $this->assertCount(3, $user->projects);
        $this->assertTrue($user->projects->contains($projects[0]));
    }

    /**
     * Test relación Project -> Tasks
     */
    public function test_project_has_many_tasks(): void
    {
        $project = Project::factory()->create();
        $tasks = Task::factory()->count(5)->create(['project_id' => $project->id]);

        $this->assertCount(5, $project->tasks);
        $this->assertTrue($project->tasks->contains($tasks[0]));
    }

    /**
     * Test relación Task -> Users (N:M)
     */
    public function test_task_has_many_users(): void
    {
        $task = Task::factory()->create();
        $users = User::factory()->count(3)->create();
        
        $task->users()->attach($users);

        $this->assertCount(3, $task->users);
        $this->assertTrue($task->users->contains($users[0]));
    }

    /**
     * Test relación User -> Tasks (N:M)
     */
    public function test_user_has_many_tasks_through_pivot(): void
    {
        $user = User::factory()->create();
        $tasks = Task::factory()->count(2)->create();
        
        $user->tasks()->attach($tasks);

        $this->assertCount(2, $user->tasks);
    }

    /**
     * Test atributos de User
     */
    public function test_user_has_correct_attributes(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->assertEquals('Test User', $user->name);
        $this->assertEquals('test@example.com', $user->email);
        $this->assertTrue(hash_equals($user->password, bcrypt('password')));
    }

    /**
     * Test atributos de Project
     */
    public function test_project_has_correct_attributes(): void
    {
        $project = Project::factory()->create([
            'name' => 'Test Project',
            'status' => 'active',
        ]);

        $this->assertEquals('Test Project', $project->name);
        $this->assertEquals('active', $project->status);
    }

    /**
     * Test atributos de Task
     */
    public function test_task_has_correct_attributes(): void
    {
        $task = Task::factory()->create([
            'title' => 'Test Task',
            'priority' => 'high',
        ]);

        $this->assertEquals('Test Task', $task->title);
        $this->assertEquals('high', $task->priority);
    }
}

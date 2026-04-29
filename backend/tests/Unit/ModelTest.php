<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Clase ModelTest - Pruebas Unitarias de Modelos y Relaciones
 * * Estas pruebas verifican que los modelo de la aplicación
 
 */
class ModelTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Verifica los métodos de comprobación de rol para el Jefe.
     */
    public function test_user_is_jefe(): void
    {
        $user = User::factory()->create(['role' => 'boss']);
        
        $this->assertTrue($user->isJefe(), 'El método isJefe() debería retornar true para el rol boss');
        $this->assertFalse($user->isWorker(), 'El método isWorker() debería retornar false para el rol boss');
    }

    /**
     * Verifica los métodos de comprobación de rol para el Trabajador.
     */
    public function test_user_is_worker(): void
    {
        $user = User::factory()->create(['role' => 'worker']);
        
        $this->assertTrue($user->isWorker());
        $this->assertFalse($user->isJefe());
    }

    /**
     * Valida la relación One-to-Many entre Usuario y Tareas.
     * * Comprueba que el modelo User pueda recuperar su colección de tareas asignadas.
     */
    public function test_user_has_many_tasks(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();
        
        // Creamos 3 tareas vinculadas a este usuario
        Task::factory()->count(3)->create([
            'project_id' => $project->id,
            'assigned_user_id' => $user->id,
        ]);

        $this->assertCount(3, $user->tasks);
        $this->assertInstanceOf(Task::class, $user->tasks->first());
    }


    /**
     * Valida la relación One-to-Many entre Proyecto y Tareas.
     * * Asegura que al eliminar o consultar un proyecto, sus tareas estén vinculadas.
     */
    public function test_project_has_many_tasks(): void
    {
        $project = Project::factory()->create();
        Task::factory()->count(4)->create(['project_id' => $project->id]);

        $this->assertCount(4, $project->tasks);
    }

   
    /**
     * Verifica la relación inversa BelongsTo con Proyecto.
     */
    public function test_task_belongs_to_project(): void
    {
        $project = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $project->id]);

        $this->assertEquals($project->id, $task->project->id);
    }

    /**
     * Verifica la relación inversa BelongsTo con el Usuario Asignado.
     */
    public function test_task_belongs_to_assigned_user(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['assigned_user_id' => $user->id]);

        $this->assertNotNull($task->assignedUser);
        $this->assertEquals($user->id, $task->assignedUser->id);
    }

    
    /**
     * Smoke Test: Asegura que la factoría de proyectos genera registros válidos.
     */
    public function test_project_factory_creates_valid_model(): void
    {
        $project = Project::factory()->create();
        $this->assertDatabaseHas('projects', ['id' => $project->id]);
    }

    /**
     * Smoke Test: Asegura que la factoría de tareas genera registros válidos.
     */
    public function test_task_factory_creates_valid_model(): void
    {
        $task = Task::factory()->create();
        $this->assertDatabaseHas('tasks', ['id' => $task->id]);
    }
}
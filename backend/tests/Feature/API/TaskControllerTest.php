<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

/**
 * Clase TaskControllerTest - Pruebas de Integración para Tareas (Configuración Manual)
 * * Este test valida el ciclo de vida completo de las tareas, la autorización basada en roles (RBAC)
 * y reglas de negocio complejas. 
 * * A diferencia de otros tests, utiliza instanciación manual (sin Factories) 
 * para garantizar un entorno predecible y aislar posibles errores de definición.
 */
class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $jefe;
    protected $trabajador;
    protected $project;

    /**
     * Configuración inicial del entorno de pruebas.
     * * Crea de forma explícita los perfiles de usuario y un proyecto maestro.
     * Al evitar el uso de Factories, nos aseguramos de que no haya fallos por
     * relaciones anidadas faltantes o problemas de consumo de memoria.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // 1. Creación del perfil Administrador (Jefe)
        $this->jefe = User::create([
            'name' => 'Jefe de Prueba',
            'email' => 'jefe@test.com',
            'password' => Hash::make('password123'),
            'role' => 'boss',
        ]);

        // 2. Creación del perfil Subordinado (Trabajador)
        $this->trabajador = User::create([
            'name' => 'Trabajador de Prueba',
            'email' => 'worker@test.com',
            'password' => Hash::make('password123'),
            'role' => 'worker',
        ]);

        // 3. Creación de un Proyecto Maestro
        $this->project = Project::create([
            'name'        => 'Proyecto Manual',
            'type'        => 'Obra Nueva',
            'client_name' => 'Juan Pérez',
            'description' => 'Descripción fija para evitar errores de memoria',
            'status'      => 'pending',
            'budget'      => 10000,
            'start_date'  => '2026-01-01',
            'end_date'    => '2026-12-31',
            'address'     => 'Calle Inventada 123'
        ]);
    }

    /**
     * Verifica que un usuario con privilegios pueda obtener el listado de tareas.
     */
    public function test_can_list_tasks(): void
    {
        // Generación de tarea manual vinculada al proyecto maestro
        Task::create([
            'project_id' => $this->project->id,
            'name' => 'Tarea 1',
            'status' => 'pending',
            'priority' => 'low',
            'start_date' => '2026-02-01',
        ]);

        $response = $this->actingAs($this->jefe, 'sanctum')
            ->getJson('/api/tasks');

        $response->assertStatus(200);
    }

    /**
     * Valida la creación de una tarea pasando explícitamente los campos obligatorios.
     */
    public function test_jefe_can_create_task(): void
    {
        $response = $this->actingAs($this->jefe, 'sanctum')
            ->postJson('/api/tasks', [
                'project_id' => $this->project->id,
                'name' => 'Nueva Tarea de Diseño',
                'priority' => 'medium',
                'status' => 'pending',
                'start_date' => '2026-03-01',
                'end_date' => '2026-03-05', // Rango de fechas bien definido
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('tasks', ['name' => 'Nueva Tarea de Diseño']);
    }

    /**
     * Prueba de Seguridad: Bloqueo de creación de tareas para perfiles no autorizados.
     */
    public function test_trabajador_cannot_create_task(): void
    {
        $response = $this->actingAs($this->trabajador, 'sanctum')
            ->postJson('/api/tasks', [
                'project_id' => $this->project->id,
                'name' => 'Intento de creación',
                'priority' => 'medium',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Comprueba la lectura de un recurso específico (Show).
     */
    public function test_can_view_task(): void
    {
        $task = Task::create([
            'project_id' => $this->project->id,
            'name' => 'Tarea a ver',
            'status' => 'pending',
            'priority' => 'high',
            'start_date' => '2026-02-10',
        ]);

        $response = $this->actingAs($this->jefe, 'sanctum')
            ->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(200);
    }

    /**
     * Valida la modificación de parámetros de una tarea existente.
     */
    public function test_jefe_can_update_task(): void
    {
        $task = Task::create([
            'project_id' => $this->project->id,
            'name' => 'Tarea Original',
            'status' => 'pending',
            'priority' => 'low',
            'start_date' => '2026-02-15',
        ]);

        $response = $this->actingAs($this->jefe, 'sanctum')
            ->putJson("/api/tasks/{$task->id}", [
                'project_id' => $this->project->id,
                'name' => 'Tarea Actualizada',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', ['name' => 'Tarea Actualizada']);
    }

    /**
     * Verifica la correcta eliminación de tareas.
     */
    public function test_jefe_can_delete_task(): void
    {
        $task = Task::create([
            'project_id' => $this->project->id,
            'name' => 'Tarea a borrar',
            'status' => 'pending',
            'priority' => 'low',
            'start_date' => '2026-02-20',
        ]);

        $response = $this->actingAs($this->jefe, 'sanctum')
            ->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    /**
     * Prueba de Lógica de Negocio: Prevención de Solapamiento
     * * Valida que el Request/Controlador intercepte y rechace (422) la creación de 
     * una tarea si un trabajador involucrado ya está ocupado en ese mismo rango de fechas.
     */
    public function test_prevent_overlapping_dates(): void
    {
        // 1. Instanciamos una tarea y la asignamos físicamente en la tabla pivote
        Task::create([
            'project_id' => $this->project->id,
            'name' => 'Tarea 1',
            'status' => 'pending',
            'priority' => 'medium',
            'start_date' => '2026-04-01',
            'end_date' => '2026-04-10',
        ])->users()->attach($this->trabajador->id); // Vinculación esencial N:M

        // 2. Intentamos crear una nueva tarea que colisiona en fechas (05-15 de abril)
        $response = $this->actingAs($this->jefe, 'sanctum')
            ->postJson('/api/tasks', [
                'project_id' => $this->project->id,
                'name' => 'Tarea en Conflicto',
                'user_ids' => [$this->trabajador->id], // Declaramos a quién va dirigida
                'start_date' => '2026-04-05',
                'end_date' => '2026-04-15',
                'status' => 'pending',
                'priority' => 'medium',
            ]);

        // 3. Afirmamos que el sistema detecta el solapamiento
        $response->assertStatus(422);
    }
}
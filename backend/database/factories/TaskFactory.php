<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factoría TaskFactory - Generación de Tareas de Prueba
 * * Esta clase se encarga de crear registros ficticios para la tabla de tareas.
 */
class TaskFactory extends Factory
{
    /**
     * El nombre del modelo correspondiente a esta factoría.
     * * @var string
     */
    protected $model = Task::class;

    /**
     * Define el estado por defecto de una tarea.
     * * Genera una estructura de datos coherente para una tarea individual.
     * * @return array<string, mixed> Atributos de la tarea para la base de datos.
     */
    public function definition(): array
    {
        return [
            // Crea y asocia automáticamente un Proyecto mediante su propia factoría
            'project_id' => Project::factory(),
            
            // Genera un título de tarea realista de hasta 40 caracteres
            'name' => fake()->realText(40), 
            
            // Genera un bloque de texto descriptivo opcional (máximo 150 caracteres)
            'description' => fake()->optional()->realText(150),
            
            // Asigna un nivel de prioridad o estado de finalización aleatorio
            'priority' => fake()->randomElement(['low', 'medium', 'high', 'urgent', 'completed']),
            
            // Genera fechas de inicio y fin para simular el periodo de ejecución
            'start_date' => fake()->date(),
            'end_date' => fake()->date(),
        ];
    }
}
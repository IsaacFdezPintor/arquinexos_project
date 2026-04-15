<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'assigned_user_id' => null,
            'name' => fake()->sentence(4),
            'description' => fake()->optional()->paragraph(),
            'status' => fake()->randomElement(['pendiente', 'en_progreso', 'completada']),
            'priority' => fake()->randomElement(['alta', 'media', 'baja']),
            'assigned_user_email' => null,
            'assigned_user_name' => null,
            'estimated_hours' => fake()->optional()->numberBetween(1, 100),
            'start_date' => fake()->optional()->date(),
            'end_date' => fake()->optional()->date(),
        ];
    }
}

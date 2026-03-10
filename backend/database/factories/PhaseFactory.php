<?php

namespace Database\Factories;

use App\Models\Phase;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Phase>
 */
class PhaseFactory extends Factory
{
    protected $model = Phase::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'name' => fake()->sentence(3),
            'description' => fake()->optional()->paragraph(),
            'status' => fake()->randomElement(['pending', 'in_progress', 'completed']),
            'estimated_hours' => fake()->optional()->numberBetween(10, 200),
            'hourly_rate' => fake()->optional()->randomFloat(2, 20, 100),
            'order' => fake()->optional()->numberBetween(1, 10),
            'start_date' => fake()->optional()->date(),
            'end_date' => fake()->optional()->date(),
        ];
    }
}

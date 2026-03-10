<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'name' => fake()->sentence(3),
            'type' => fake()->randomElement(['residencial', 'comercial', 'industrial', 'reforma']),
            'client_name' => fake()->company(),
            'status' => fake()->randomElement(['active', 'completed', 'on_hold']),
            'budget' => fake()->randomFloat(2, 10000, 500000),
            'start_date' => fake()->date(),
            'end_date' => fake()->optional()->date(),
            'address' => fake()->optional()->address(),
            'description' => fake()->optional()->paragraph(),
        ];
    }
}

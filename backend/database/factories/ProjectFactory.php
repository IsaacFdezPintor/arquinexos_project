<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factoría ProjectFactory - Generación de Datos de Prueba
 * * Esta clase permite automatizar la creación de registros para la tabla de proyectos.
 */
class ProjectFactory extends Factory
{
    /**
     * El nombre del modelo correspondiente a esta factoría.
     * * @var string
     */
    protected $model = Project::class;

    /**
     * Define el estado base de un proyecto.
     * * @return array<string, mixed> Estructura de atributos para la persistencia.
     */
    public function definition(): array
    {
        return [
            // Genera un nombre de proyecto con texto real limitado a 30 caracteres
            'name' => fake()->realText(30), 
            
            // Categoriza el proyecto entre opciones específicas de obra pública/privada
            'type' => fake()->randomElement(['edificación', 'urbanismo']),
            
            // Genera el nombre de una empresa u organización cliente
            'client_name' => fake()->company(),
            
            // Define el estado actual del flujo de vida del proyecto
            'status' => fake()->randomElement(['pending', 'in_progress', 'completed']),
            
            // Genera un presupuesto financiero entre 10,000 y 500,000 con dos decimales
            'budget' => fake()->randomFloat(2, 10000, 500000),
            
            // Asigna una fecha de inicio aleatoria
            'start_date' => fake()->date(),
            
            // Genera una fecha de finalización que puede ser nula (optional)
            'end_date' => fake()->optional()->date(),
            
            // Genera una dirección física completa y realista
            'address' => fake()->address(),
            
            // Genera una descripción detallada de hasta 200 caracteres (opcional)
            'description' => fake()->optional()->realText(200),
        ];
    }
}
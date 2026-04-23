<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ==========================================
        // USUARIOS
        // ==========================================
        $jefe = User::create([
            'name' => 'Carlos Martínez',
            'email' => 'carlos@arquitectura.com',
            'password' => Hash::make('admin123'),
            'role' => 'boss',
        ]);

        $worker1 = User::create(['name' => 'Laura García', 'email' => 'laura@arquitectura.com', 'password' => Hash::make('worker123'), 'role' => 'worker']);
        $worker2 = User::create(['name' => 'Miguel Torres', 'email' => 'miguel@arquitectura.com', 'password' => Hash::make('worker123'), 'role' => 'worker']);
        $worker3 = User::create(['name' => 'Ana Ruiz', 'email' => 'ana@arquitectura.com', 'password' => Hash::make('worker123'), 'role' => 'worker']);
        $worker4 = User::create(['name' => 'Pedro Sánchez', 'email' => 'pedro@arquitectura.com', 'password' => Hash::make('worker123'), 'role' => 'worker']);

        // ==========================================
        // PROYECTO 1
        // ==========================================
        $p1 = Project::create([
            'name' => 'Vivienda Unifamiliar Los Olivos',
            'type' => 'edificacion',
            'client_name' => 'María López Hernández',
            'status' => 'in_progress',
            'budget' => 185000,
            'start_date' => '2026-01-15',
            'end_date' => '2026-08-30',
        ]);

        // Tarea compartida por Laura y Miguel
        Task::create([
            'project_id' => $p1->id, 
            'name' => 'Levantamiento topográfico', 
            'priority' => 'high', 
            'start_date' => '2026-01-15', 'end_date' => '2026-01-22'
        ])->users()->attach([$worker1->id, $worker2->id]);

        // Tarea solo para el Jefe
        Task::create([
            'project_id' => $p1->id, 
            'name' => 'Cálculo estructural', 
            'priority' => 'high', 
            'start_date' => '2026-02-16', 'end_date' => '2026-03-05'
        ])->users()->attach($jefe->id);

        // ==========================================
        // PROYECTO 2
        // ==========================================
        $p2 = Project::create([
            'name' => 'Reforma Restaurante La Terraza',
            'type' => 'edificacion',
            'client_name' => 'Grupo Hostelero del Sur S.L.',
            'status' => 'in_progress',
            'budget' => 95000,
            'start_date' => '2026-02-01',
            'end_date' => '2026-05-15',
        ]);

        // Tarea para casi todos (Ana, Pedro y el Jefe)
        Task::create([
            'project_id' => $p2->id, 
            'name' => 'Diseño interior', 
            'priority' => 'high', 
            'start_date' => '2026-02-10', 'end_date' => '2026-02-28'
        ])->users()->attach([$worker3->id, $worker4->id, $jefe->id]);

        // ... puedes añadir más siguiendo este patrón
    }
}
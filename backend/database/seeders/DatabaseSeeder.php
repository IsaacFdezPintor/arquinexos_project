<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder DatabaseSeeder - Orquestador de Datos del Sistema
 * * Esta clase se encarga de poblar la base de datos con un entorno de trabajo completo.
 **/
class DatabaseSeeder extends Seeder
{
    /**
     * Ejecuta el proceso de sembrado de datos.
     * * @return void
     */
    public function run(): void
    {
        
        // El Jefe es el usuario administrador principal del sistema
        $jefe = User::updateOrCreate(['email' => 'carlos@arquitectura.com'], [
            'name' => 'Carlos Martínez',
            'password' => Hash::make('admin123'),
            'role' => 'boss',
        ]);

        // Equipo base con credenciales fijas para facilitar el login en desarrollo
        $worker1 = User::create(['name' => 'Laura García', 'email' => 'laura@arquitectura.com', 'password' => Hash::make('worker123'), 'role' => 'worker']);
        $worker2 = User::create(['name' => 'Miguel Torres', 'email' => 'miguel@arquitectura.com', 'password' => Hash::make('worker123'), 'role' => 'worker']);
        $worker3 = User::create(['name' => 'Ana Ruiz', 'email' => 'ana@arquitectura.com', 'password' => Hash::make('worker123'), 'role' => 'worker']);
        $worker4 = User::create(['name' => 'Pedro Sánchez', 'email' => 'pedro@arquitectura.com', 'password' => Hash::make('worker123'), 'role' => 'worker']);
        $worker5 = User::create(['name' => 'Elena Belmonte', 'email' => 'elena@arquitectura.com', 'password' => Hash::make('worker123'), 'role' => 'worker']);
        $worker6 = User::create(['name' => 'Roberto Cano', 'email' => 'roberto@arquitectura.com', 'password' => Hash::make('worker123'), 'role' => 'worker']);
        $manualWorkers = collect([$worker1, $worker2, $worker3, $worker4, $worker5, $worker6]);

        // Generación de 10 usuarios adicionales para simular una empresa más grande
        $factoryWorkers = User::factory(10)->create(['role' => 'worker']);

        // Unificación de todo el personal en una sola colección para asignaciones dinámicas
        $allStaff = $manualWorkers->concat($factoryWorkers)->push($jefe);

        
       // PROYECTO 1: Vivienda Unifamiliar
$p1 = Project::create([
'name' => 'Vivienda Unifamiliar Los Olivos', 'type' => 'edificacion', 'client_name' => 'María López Hernández',
'status' => 'in_progress', 'budget' => 185000, 'address' => 'C. Ramon y Cajal, 10-24, 14830 Espejo, Córdoba', 'start_date' => '2026-01-15', 'end_date' => '2026-08-30',
]);
Task::create(['project_id' => $p1->id, 'name' => 'Levantamiento topográfico', 'priority' => 'high', 'start_date' => '2026-01-15', 'end_date' => '2026-01-22'])->users()->attach([$worker1->id, $worker2->id]);
Task::create(['project_id' => $p1->id, 'name' => 'Cálculo estructural', 'priority' => 'high', 'start_date' => '2026-02-16', 'end_date' => '2026-03-05'])->users()->attach($jefe->id);
Task::create(['project_id' => $p1->id, 'name' => 'Instalaciones fontanería', 'priority' => 'low', 'start_date' => '2026-04-01', 'end_date' => '2026-04-15'])->users()->attach($worker5->id);
Task::create(['project_id' => $p1->id, 'name' => 'Cimentación', 'priority' => 'urgent', 'start_date' => '2026-01-25', 'end_date' => '2026-02-10'])->users()->attach([$worker1->id, $worker6->id]);
Task::create(['project_id' => $p1->id, 'name' => 'Levantamiento de muros', 'priority' => 'high', 'start_date' => '2026-02-15', 'end_date' => '2026-03-20'])->users()->attach([$worker2->id, $worker4->id]);
Task::create(['project_id' => $p1->id, 'name' => 'Instalación eléctrica', 'priority' => 'medium', 'start_date' => '2026-03-25', 'end_date' => '2026-04-10'])->users()->attach($worker3->id);
Task::create(['project_id' => $p1->id, 'name' => 'Cubierta y tejado', 'priority' => 'high', 'start_date' => '2026-04-20', 'end_date' => '2026-05-15'])->users()->attach([$worker1->id, $worker5->id]);
Task::create(['project_id' => $p1->id, 'name' => 'Acabados interiores', 'priority' => 'medium', 'start_date' => '2026-05-20', 'end_date' => '2026-06-30'])->users()->attach([$worker3->id, $worker4->id]);
Task::create(['project_id' => $p1->id, 'name' => 'Pintura y decoración', 'priority' => 'low', 'start_date' => '2026-07-01', 'end_date' => '2026-07-20'])->users()->attach($worker2->id);
Task::create(['project_id' => $p1->id, 'name' => 'Revisión final', 'priority' => 'medium', 'start_date' => '2026-08-15', 'end_date' => '2026-08-25'])->users()->attach($jefe->id);
Task::create(['project_id' => $p1->id, 'name' => 'Clausurado del proyecto', 'priority' => 'low', 'start_date' => '2026-08-26', 'end_date' => '2026-08-30'])->users()->attach($jefe->id);

// PROYECTO 2: Reforma Restaurante
$p2 = Project::create([
'name' => 'Reforma Restaurante La Terraza', 'type' => 'rehabilitacion', 'client_name' => 'Grupo Hostelero del Sur S.L.',
'status' => 'in_progress', 'budget' => 95000, 'address' => 'P.º de los Olivos, 37005 Salamanca, España', 'start_date' => '2026-02-01', 'end_date' => '2026-05-15',
]);
Task::create(['project_id' => $p2->id, 'name' => 'Diseño interior', 'priority' => 'high', 'start_date' => '2026-02-10', 'end_date' => '2026-02-28'])->users()->attach([$worker3->id, $worker4->id, $jefe->id]);
Task::create(['project_id' => $p2->id, 'name' => 'Licencia de apertura', 'priority' => 'medium', 'start_date' => '2026-03-01', 'end_date' => '2026-03-20'])->users()->attach($worker1->id);
Task::create(['project_id' => $p2->id, 'name' => 'Demolición de tabiques', 'priority' => 'urgent', 'start_date' => '2026-02-01', 'end_date' => '2026-02-08'])->users()->attach([$worker2->id, $worker5->id]);
Task::create(['project_id' => $p2->id, 'name' => 'Instalación cocina profesional', 'priority' => 'high', 'start_date' => '2026-03-25', 'end_date' => '2026-04-10'])->users()->attach([$worker4->id, $worker6->id]);
Task::create(['project_id' => $p2->id, 'name' => 'Pavimentos', 'priority' => 'medium', 'start_date' => '2026-03-15', 'end_date' => '2026-04-05'])->users()->attach($worker1->id);
Task::create(['project_id' => $p2->id, 'name' => 'Revestimientos de paredes', 'priority' => 'medium', 'start_date' => '2026-04-08', 'end_date' => '2026-04-25'])->users()->attach([$worker3->id, $worker5->id]);
Task::create(['project_id' => $p2->id, 'name' => 'Iluminación y electricidad', 'priority' => 'high', 'start_date' => '2026-04-01', 'end_date' => '2026-04-20'])->users()->attach($worker2->id);
Task::create(['project_id' => $p2->id, 'name' => 'Montaje de mobiliario', 'priority' => 'medium', 'start_date' => '2026-04-26', 'end_date' => '2026-05-05'])->users()->attach([$worker4->id, $worker1->id]);
Task::create(['project_id' => $p2->id, 'name' => 'Pruebas de seguridad', 'priority' => 'high', 'start_date' => '2026-05-06', 'end_date' => '2026-05-10'])->users()->attach($jefe->id);
Task::create(['project_id' => $p2->id, 'name' => 'Apertura y entrega', 'priority' => 'urgent', 'start_date' => '2026-05-11', 'end_date' => '2026-05-15'])->users()->attach($jefe->id);

// PROYECTO 3: Urbanización
$p3 = Project::create([
'name' => 'Urbanización El Mirador', 'type' => 'urbanismo', 'client_name' => 'Ayuntamiento de Pozuelo',
'status' => 'pending', 'budget' => 450000, 'address' => 'C. del Río, 123, 41001 Sevilla, España', 'start_date' => '2026-06-01', 'end_date' => '2027-02-28',
]);
Task::create(['project_id' => $p3->id, 'name' => 'Estudio de impacto ambiental', 'priority' => 'medium', 'start_date' => '2026-06-05', 'end_date' => '2026-07-10'])->users()->attach([$worker2->id, $worker6->id]);
Task::create(['project_id' => $p3->id, 'name' => 'Trazado de viales', 'priority' => 'high', 'start_date' => '2026-07-15', 'end_date' => '2026-08-30'])->users()->attach($worker4->id);
Task::create(['project_id' => $p3->id, 'name' => 'Estudio de suelos', 'priority' => 'high', 'start_date' => '2026-06-01', 'end_date' => '2026-06-20'])->users()->attach([$worker1->id, $worker5->id]);
Task::create(['project_id' => $p3->id, 'name' => 'Levantamiento catastral', 'priority' => 'medium', 'start_date' => '2026-06-10', 'end_date' => '2026-06-25'])->users()->attach($worker3->id);
Task::create(['project_id' => $p3->id, 'name' => 'Estudio de viabilidad', 'priority' => 'high', 'start_date' => '2026-06-15', 'end_date' => '2026-07-05'])->users()->attach($jefe->id);
Task::create(['project_id' => $p3->id, 'name' => 'Diseño de espacios verdes', 'priority' => 'medium', 'start_date' => '2026-07-20', 'end_date' => '2026-08-10'])->users()->attach([$worker2->id, $worker4->id]);
Task::create(['project_id' => $p3->id, 'name' => 'Infraestructura de servicios', 'priority' => 'high', 'start_date' => '2026-08-15', 'end_date' => '2026-09-20'])->users()->attach([$worker1->id, $worker6->id]);
Task::create(['project_id' => $p3->id, 'name' => 'Presupuesto y financiación', 'priority' => 'medium', 'start_date' => '2026-06-01', 'end_date' => '2026-07-15'])->users()->attach($jefe->id);
Task::create(['project_id' => $p3->id, 'name' => 'Aprobaciones municipales', 'priority' => 'urgent', 'start_date' => '2026-08-01', 'end_date' => '2026-09-01'])->users()->attach($jefe->id);
Task::create(['project_id' => $p3->id, 'name' => 'Adjudicación de obras', 'priority' => 'high', 'start_date' => '2026-09-05', 'end_date' => '2026-10-01'])->users()->attach($jefe->id);

// PROYECTO 4: Auditorio Municipal
$p4 = Project::create([
'name' => 'Auditorio Municipal San Juan', 'type' => 'edificacion', 'client_name' => 'Fundación Cultural',
'status' => 'completed', 'budget' => 1200000, 'address' => 'Parque Empresarial Sur, N-432, 18015, Granada', 'start_date' => '2025-01-10', 'end_date' => '2025-12-20',
]);
Task::create(['project_id' => $p4->id, 'name' => 'Acústica de sala', 'priority' => 'high', 'start_date' => '2025-06-01', 'end_date' => '2025-07-01'])->users()->attach($worker3->id);
Task::create(['project_id' => $p4->id, 'name' => 'Entrega de llaves', 'priority' => 'low', 'start_date' => '2025-12-15', 'end_date' => '2025-12-20'])->users()->attach($jefe->id);
Task::create(['project_id' => $p4->id, 'name' => 'Diseño arquitectónico', 'priority' => 'high', 'start_date' => '2025-01-10', 'end_date' => '2025-02-28'])->users()->attach($jefe->id);
Task::create(['project_id' => $p4->id, 'name' => 'Cimentación', 'priority' => 'urgent', 'start_date' => '2025-03-01', 'end_date' => '2025-04-01'])->users()->attach([$worker1->id, $worker2->id, $worker5->id]);
Task::create(['project_id' => $p4->id, 'name' => 'Estructura metálica', 'priority' => 'high', 'start_date' => '2025-04-05', 'end_date' => '2025-05-15'])->users()->attach([$worker2->id, $worker4->id]);
Task::create(['project_id' => $p4->id, 'name' => 'Cubiertas y cerramientos', 'priority' => 'high', 'start_date' => '2025-05-20', 'end_date' => '2025-06-20'])->users()->attach([$worker1->id, $worker6->id]);
Task::create(['project_id' => $p4->id, 'name' => 'Instalaciones técnicas', 'priority' => 'high', 'start_date' => '2025-06-25', 'end_date' => '2025-07-30'])->users()->attach([$worker3->id, $worker4->id]);
Task::create(['project_id' => $p4->id, 'name' => 'Acabados interiores', 'priority' => 'medium', 'start_date' => '2025-08-01', 'end_date' => '2025-09-15'])->users()->attach([$worker1->id, $worker3->id]);
Task::create(['project_id' => $p4->id, 'name' => 'Instalación de butacas', 'priority' => 'medium', 'start_date' => '2025-09-20', 'end_date' => '2025-10-10'])->users()->attach($worker5->id);
Task::create(['project_id' => $p4->id, 'name' => 'Pruebas de sistemas', 'priority' => 'high', 'start_date' => '2025-10-15', 'end_date' => '2025-11-10'])->users()->attach($jefe->id);
Task::create(['project_id' => $p4->id, 'name' => 'Certificaciones finales', 'priority' => 'urgent', 'start_date' => '2025-11-15', 'end_date' => '2025-12-10'])->users()->attach($jefe->id);

// PROYECTO 5: Nave Industrial
$p5 = Project::create([
'name' => 'Nave Logística Amazon', 'type' => 'industrial', 'client_name' => 'Inversiones Logísticas S.A.',
'status' => 'pending', 'budget' => 890000, 'start_date' => '2026-03-10', 'end_date' => '2026-11-15',
]);
Task::create(['project_id' => $p5->id, 'name' => 'Cimentación especial', 'priority' => 'high', 'start_date' => '2026-03-15', 'end_date' => '2026-04-10'])->users()->attach([$worker2->id, $worker5->id]);
Task::create(['project_id' => $p5->id, 'name' => 'Diseño industrial', 'priority' => 'high', 'start_date' => '2026-03-10', 'end_date' => '2026-03-25'])->users()->attach($jefe->id);
Task::create(['project_id' => $p5->id, 'name' => 'Estudio de cargas', 'priority' => 'urgent', 'start_date' => '2026-03-12', 'end_date' => '2026-03-20'])->users()->attach([$worker1->id, $worker6->id]);
Task::create(['project_id' => $p5->id, 'name' => 'Estructura de acero', 'priority' => 'high', 'start_date' => '2026-04-15', 'end_date' => '2026-05-30'])->users()->attach([$worker2->id, $worker4->id, $worker5->id]);
Task::create(['project_id' => $p5->id, 'name' => 'Cubierta industrial', 'priority' => 'high', 'start_date' => '2026-06-01', 'end_date' => '2026-06-25'])->users()->attach([$worker1->id, $worker3->id]);
Task::create(['project_id' => $p5->id, 'name' => 'Puertas y accesos', 'priority' => 'medium', 'start_date' => '2026-06-28', 'end_date' => '2026-07-15'])->users()->attach($worker6->id);
Task::create(['project_id' => $p5->id, 'name' => 'Sistema de climatización', 'priority' => 'high', 'start_date' => '2026-07-20', 'end_date' => '2026-08-20'])->users()->attach([$worker4->id, $worker5->id]);
Task::create(['project_id' => $p5->id, 'name' => 'Instalación eléctrica', 'priority' => 'high', 'start_date' => '2026-07-25', 'end_date' => '2026-08-25'])->users()->attach($worker2->id);
Task::create(['project_id' => $p5->id, 'name' => 'Red de tuberías', 'priority' => 'medium', 'start_date' => '2026-08-26', 'end_date' => '2026-09-15'])->users()->attach([$worker3->id, $worker6->id]);
Task::create(['project_id' => $p5->id, 'name' => 'Sistema de seguridad', 'priority' => 'high', 'start_date' => '2026-09-16', 'end_date' => '2026-10-10'])->users()->attach($worker1->id);
Task::create(['project_id' => $p5->id, 'name' => 'Pruebas de funcionamiento', 'priority' => 'urgent', 'start_date' => '2026-10-15', 'end_date' => '2026-11-05'])->users()->attach($jefe->id);


        /**
         * En esta fase se generan 15 proyectos adicionales. 
         * Se utiliza un bucle manual en lugar de métodos encadenados de Factory para:
         * 1. Garantizar que el 'status' y 'priority' no choquen con Enums estrictos.
         * 2. Asegurar que cada Tarea tenga una relación real en la tabla pivote con usuarios del Staff.
         */
        for ($i = 1; $i <= 15; $i++) {
            // Creación del proyecto con estado controlado
            $project = Project::factory()->create([
                'status' => 'pending' 
            ]);

            if ($project) {
                // Para cada proyecto, generamos un set de 6 tareas
                for ($j = 1; $j <= 6; $j++) {
                    $task = Task::factory()->create([
                        'project_id' => $project->id,
                        'priority' => 'medium' 
                    ]);

                    // Selección aleatoria de 1 a 3 usuarios del personal disponible
                    $randomUsers = $allStaff->random(rand(1, 3))->pluck('id');
                    
                    // Sincronización con la tabla pivote task_user
                    $task->users()->attach($randomUsers);
                }
            }
        }
    }
}
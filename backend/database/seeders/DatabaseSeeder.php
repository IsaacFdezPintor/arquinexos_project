<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use App\Models\Phase;
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
            'role' => 'jefe',
        ]);

        $worker1 = User::create([
            'name' => 'Laura García',
            'email' => 'laura@arquitectura.com',
            'password' => Hash::make('worker123'),
            'role' => 'trabajador',
        ]);

        $worker2 = User::create([
            'name' => 'Miguel Torres',
            'email' => 'miguel@arquitectura.com',
            'password' => Hash::make('worker123'),
            'role' => 'trabajador',
        ]);

        $worker3 = User::create([
            'name' => 'Ana Ruiz',
            'email' => 'ana@arquitectura.com',
            'password' => Hash::make('worker123'),
            'role' => 'trabajador',
        ]);

        $worker4 = User::create([
            'name' => 'Pedro Sánchez',
            'email' => 'pedro@arquitectura.com',
            'password' => Hash::make('worker123'),
            'role' => 'trabajador',
        ]);

        // ==========================================
        // PROYECTO 1: Vivienda unifamiliar
        // ==========================================
        $p1 = Project::create([
            'name' => 'Vivienda Unifamiliar Los Olivos',
            'type' => 'edificacion',
            'client_name' => 'María López Hernández',
            'status' => 'en_curso',
            'budget' => 185000,
            'start_date' => '2026-01-15',
            'end_date' => '2026-08-30',
            'address' => 'C/ Los Olivos 14, Málaga',
            'description' => 'Vivienda unifamiliar de 2 plantas con jardín y piscina. Superficie construida: 220 m².',
        ]);

        $p1f1 = Phase::create([
            'project_id' => $p1->id,
            'name' => 'Proyecto Básico',
            'status' => 'finalizado',
            'estimated_hours' => 80,
            'hourly_rate' => 45,
            'order' => 1,
            'start_date' => '2026-01-15',
            'end_date' => '2026-02-15',
        ]);

        $p1f2 = Phase::create([
            'project_id' => $p1->id,
            'name' => 'Proyecto de Ejecución',
            'status' => 'en_curso',
            'estimated_hours' => 120,
            'hourly_rate' => 50,
            'order' => 2,
            'start_date' => '2026-02-16',
            'end_date' => '2026-04-15',
        ]);

        $p1f3 = Phase::create([
            'project_id' => $p1->id,
            'name' => 'Dirección de Obra',
            'status' => 'pendiente',
            'estimated_hours' => 200,
            'hourly_rate' => 40,
            'order' => 3,
            'start_date' => '2026-04-16',
            'end_date' => '2026-08-30',
        ]);

        // =====================================================================
        // TAREAS — SIN SOLAPAMIENTOS POR TRABAJADOR
        // Cada trabajador solo tiene UNA tarea a la vez (fechas secuenciales)
        //
        // Laura  (w1): ene15-22 → ene23-feb5 → feb10-feb28 → mar6-mar25 → abr16-may20 → may21-jun20
        // Miguel (w2): feb1-10 → feb16-mar5 → mar9-mar25 → abr1-15 → may1-jun10
        // Ana    (w3): ene20-feb3 → feb4-feb15 → feb21-mar15 → abr10-may1 → may5-jun20 → jun21-jul20
        // Pedro  (w4): feb5-18 → feb19-mar8 → mar9-mar25 → mar26-abr10 → abr11-abr25 → jun1-jul10
        // =====================================================================

        // --- P1 Fase 1: Proyecto Básico (completadas) ---
        // Laura: 15 ene → 22 ene
        Task::create([
            'project_id' => $p1->id, 'phase_id' => $p1f1->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Levantamiento topográfico',
            'description' => 'Medición y estudio del terreno existente.',
            'status' => 'completada', 'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'estimated_hours' => 16, 'start_date' => '2026-01-15', 'end_date' => '2026-01-22',
        ]);
        // Laura: 23 ene → 5 feb
        Task::create([
            'project_id' => $p1->id, 'phase_id' => $p1f1->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Planos de distribución',
            'description' => 'Diseño de la distribución interior de la vivienda.',
            'status' => 'completada', 'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'estimated_hours' => 24, 'start_date' => '2026-01-23', 'end_date' => '2026-02-05',
        ]);
        // Miguel: 1 feb → 10 feb
        Task::create([
            'project_id' => $p1->id, 'phase_id' => $p1f1->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Memoria descriptiva',
            'description' => 'Redacción de la memoria del proyecto básico.',
            'status' => 'completada', 'priority' => 'media',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'estimated_hours' => 20, 'start_date' => '2026-02-01', 'end_date' => '2026-02-10',
        ]);
        // Ana: 20 ene → 3 feb
        Task::create([
            'project_id' => $p1->id, 'phase_id' => $p1f1->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Renders 3D fachada',
            'description' => 'Visualización 3D del exterior de la vivienda.',
            'status' => 'completada', 'priority' => 'media',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'estimated_hours' => 20, 'start_date' => '2026-01-20', 'end_date' => '2026-02-03',
        ]);

        // --- P1 Fase 2: Proyecto de Ejecución (en curso) ---
        // Miguel: 16 feb → 5 mar
        Task::create([
            'project_id' => $p1->id, 'phase_id' => $p1f2->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Cálculo estructural',
            'description' => 'Dimensionamiento de cimentación, pilares y forjados.',
            'status' => 'completada', 'priority' => 'alta',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'estimated_hours' => 30, 'start_date' => '2026-02-16', 'end_date' => '2026-03-05',
        ]);
        // Laura: 6 mar → 25 mar
        Task::create([
            'project_id' => $p1->id, 'phase_id' => $p1f2->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Instalaciones eléctricas',
            'description' => 'Diseño de la instalación eléctrica completa.',
            'status' => 'pendiente', 'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'estimated_hours' => 25, 'start_date' => '2026-03-06', 'end_date' => '2026-03-25',
        ]);
        // Ana: 21 feb → 15 mar
        Task::create([
            'project_id' => $p1->id, 'phase_id' => $p1f2->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Instalaciones de fontanería',
            'description' => 'Diseño de la red de agua fría, caliente y saneamiento.',
            'status' => 'en_curso', 'priority' => 'alta',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'estimated_hours' => 20, 'start_date' => '2026-02-21', 'end_date' => '2026-03-15',
        ]);
        // Pedro: 26 mar → 10 abr
        Task::create([
            'project_id' => $p1->id, 'phase_id' => $p1f2->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Planos de detalle constructivo',
            'description' => 'Detalles constructivos de encuentros y soluciones especiales.',
            'status' => 'pendiente', 'priority' => 'media',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'estimated_hours' => 30, 'start_date' => '2026-03-26', 'end_date' => '2026-04-10',
        ]);
        // Pedro: 11 abr → 25 abr
        Task::create([
            'project_id' => $p1->id, 'phase_id' => $p1f2->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Mediciones y presupuesto',
            'description' => 'Mediciones de todas las partidas y presupuesto de ejecución.',
            'status' => 'pendiente', 'priority' => 'media',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'estimated_hours' => 15, 'start_date' => '2026-04-11', 'end_date' => '2026-04-25',
        ]);

        // --- P1 Fase 3: Dirección de Obra ---
        // Laura: 16 abr → 20 may
        Task::create([
            'project_id' => $p1->id, 'phase_id' => $p1f3->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Supervisión de cimentación',
            'status' => 'pendiente', 'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'estimated_hours' => 40, 'start_date' => '2026-04-16', 'end_date' => '2026-05-20',
        ]);
        // Miguel: 1 may → 10 jun
        Task::create([
            'project_id' => $p1->id, 'phase_id' => $p1f3->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Control de calidad materiales',
            'status' => 'pendiente', 'priority' => 'alta',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'estimated_hours' => 50, 'start_date' => '2026-05-01', 'end_date' => '2026-06-10',
        ]);
        // Ana: 5 may → 20 jun
        Task::create([
            'project_id' => $p1->id, 'phase_id' => $p1f3->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Certificaciones mensuales',
            'status' => 'pendiente', 'priority' => 'media',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'estimated_hours' => 30, 'start_date' => '2026-05-05', 'end_date' => '2026-06-20',
        ]);

        // ==========================================
        // PROYECTO 2: Reforma local comercial
        // ==========================================
        $p2 = Project::create([
            'name' => 'Reforma Restaurante La Terraza',
            'type' => 'edificacion',
            'client_name' => 'Grupo Hostelero del Sur S.L.',
            'status' => 'en_curso',
            'budget' => 95000,
            'start_date' => '2026-02-01',
            'end_date' => '2026-05-15',
            'address' => 'Av. Constitución 32, Sevilla',
            'description' => 'Reforma integral de local comercial para uso de restaurante. 180 m² en planta baja.',
        ]);

        $p2f1 = Phase::create([
            'project_id' => $p2->id,
            'name' => 'Estudio Previo y Licencias',
            'status' => 'finalizado',
            'estimated_hours' => 40,
            'hourly_rate' => 50,
            'order' => 1,
            'start_date' => '2026-02-01',
            'end_date' => '2026-02-20',
        ]);

        $p2f2 = Phase::create([
            'project_id' => $p2->id,
            'name' => 'Proyecto Técnico',
            'status' => 'en_curso',
            'estimated_hours' => 60,
            'hourly_rate' => 50,
            'order' => 2,
            'start_date' => '2026-02-21',
            'end_date' => '2026-03-30',
        ]);

        $p2f3 = Phase::create([
            'project_id' => $p2->id,
            'name' => 'Ejecución de Obra',
            'status' => 'pendiente',
            'estimated_hours' => 100,
            'hourly_rate' => 40,
            'order' => 3,
            'start_date' => '2026-04-01',
            'end_date' => '2026-05-15',
        ]);

        // --- P2 Fase 1 (completadas) ---
        // Ana: 4 feb → 15 feb
        Task::create([
            'project_id' => $p2->id, 'phase_id' => $p2f1->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Informe estado actual',
            'status' => 'completada', 'priority' => 'alta',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'estimated_hours' => 12, 'start_date' => '2026-02-04', 'end_date' => '2026-02-15',
        ]);
        // Pedro: 5 feb → 18 feb
        Task::create([
            'project_id' => $p2->id, 'phase_id' => $p2f1->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Gestión licencia de actividad',
            'status' => 'completada', 'priority' => 'alta',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'estimated_hours' => 15, 'start_date' => '2026-02-05', 'end_date' => '2026-02-18',
        ]);
        // Ana: 16 feb → 20 feb
        Task::create([
            'project_id' => $p2->id, 'phase_id' => $p2f1->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Estudio acústico',
            'status' => 'completada', 'priority' => 'media',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'estimated_hours' => 13, 'start_date' => '2026-02-16', 'end_date' => '2026-02-20',
        ]);

        // --- P2 Fase 2 (en curso) ---
        // Laura: 10 feb → 28 feb
        Task::create([
            'project_id' => $p2->id, 'phase_id' => $p2f2->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Diseño interior del restaurante',
            'description' => 'Distribución de salón, cocina, baños y terraza cubierta.',
            'status' => 'en_curso', 'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'estimated_hours' => 20, 'start_date' => '2026-02-10', 'end_date' => '2026-02-28',
        ]);
        // Miguel: 9 mar → 25 mar
        Task::create([
            'project_id' => $p2->id, 'phase_id' => $p2f2->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Proyecto de climatización',
            'status' => 'pendiente', 'priority' => 'alta',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'estimated_hours' => 15, 'start_date' => '2026-03-09', 'end_date' => '2026-03-25',
        ]);
        // Pedro: 9 mar → 25 mar
        Task::create([
            'project_id' => $p2->id, 'phase_id' => $p2f2->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Protección contra incendios',
            'status' => 'pendiente', 'priority' => 'alta',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'estimated_hours' => 15, 'start_date' => '2026-03-09', 'end_date' => '2026-03-25',
        ]);
        // Laura: 26 mar → 10 abr
        Task::create([
            'project_id' => $p2->id, 'phase_id' => $p2f2->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Plano de evacuación',
            'status' => 'pendiente', 'priority' => 'media',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'estimated_hours' => 10, 'start_date' => '2026-03-26', 'end_date' => '2026-04-10',
        ]);

        // --- P2 Fase 3 ---
        // Miguel: 1 abr → 15 abr
        Task::create([
            'project_id' => $p2->id, 'phase_id' => $p2f3->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Demoliciones y retirada de escombros',
            'status' => 'pendiente', 'priority' => 'alta',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'estimated_hours' => 20, 'start_date' => '2026-04-01', 'end_date' => '2026-04-15',
        ]);
        // Ana: 10 abr → 1 may
        Task::create([
            'project_id' => $p2->id, 'phase_id' => $p2f3->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Instalación de cocina industrial',
            'status' => 'pendiente', 'priority' => 'alta',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'estimated_hours' => 30, 'start_date' => '2026-04-10', 'end_date' => '2026-05-01',
        ]);
        // Pedro: 26 abr → 12 may
        Task::create([
            'project_id' => $p2->id, 'phase_id' => $p2f3->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Acabados y mobiliario',
            'status' => 'pendiente', 'priority' => 'media',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'estimated_hours' => 25, 'start_date' => '2026-04-26', 'end_date' => '2026-05-12',
        ]);

        // ==========================================
        // PROYECTO 3: Urbanización
        // ==========================================
        $p3 = Project::create([
            'name' => 'Urbanización Parque del Río',
            'type' => 'urbanismo',
            'client_name' => 'Ayuntamiento de Ronda',
            'status' => 'planificacion',
            'budget' => 320000,
            'start_date' => '2026-03-01',
            'end_date' => '2026-12-31',
            'address' => 'Sector Sur-3, Ronda, Málaga',
            'description' => 'Proyecto de urbanización de 12 parcelas residenciales con viales, zonas verdes y servicios urbanos.',
        ]);

        $p3f1 = Phase::create([
            'project_id' => $p3->id,
            'name' => 'Estudio de Detalle',
            'status' => 'en_curso',
            'estimated_hours' => 60,
            'hourly_rate' => 55,
            'order' => 1,
            'start_date' => '2026-03-01',
            'end_date' => '2026-04-15',
        ]);

        $p3f2 = Phase::create([
            'project_id' => $p3->id,
            'name' => 'Proyecto de Urbanización',
            'status' => 'pendiente',
            'estimated_hours' => 150,
            'hourly_rate' => 50,
            'order' => 2,
            'start_date' => '2026-04-16',
            'end_date' => '2026-07-31',
        ]);

        $p3f3 = Phase::create([
            'project_id' => $p3->id,
            'name' => 'Dirección de Obra Urbanización',
            'status' => 'pendiente',
            'estimated_hours' => 180,
            'hourly_rate' => 45,
            'order' => 3,
            'start_date' => '2026-08-01',
            'end_date' => '2026-12-31',
        ]);

        // --- P3 Fase 1 ---
        // Miguel: 16 abr → 30 abr
        Task::create([
            'project_id' => $p3->id, 'phase_id' => $p3f1->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Estudio geotécnico',
            'description' => 'Análisis del terreno y capacidad portante del suelo.',
            'status' => 'pendiente', 'priority' => 'alta',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'estimated_hours' => 20, 'start_date' => '2026-04-16', 'end_date' => '2026-04-30',
        ]);
        // Pedro: 19 feb → 8 mar
        Task::create([
            'project_id' => $p3->id, 'phase_id' => $p3f1->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Plano topográfico actualizado',
            'status' => 'en_curso', 'priority' => 'alta',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'estimated_hours' => 15, 'start_date' => '2026-02-19', 'end_date' => '2026-03-08',
        ]);
        // Ana: 16 mar → 9 abr
        Task::create([
            'project_id' => $p3->id, 'phase_id' => $p3f1->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Estudio de impacto ambiental',
            'status' => 'pendiente', 'priority' => 'media',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'estimated_hours' => 25, 'start_date' => '2026-03-16', 'end_date' => '2026-04-09',
        ]);

        // --- P3 Fase 2 ---
        // Laura: 21 may → 20 jun
        Task::create([
            'project_id' => $p3->id, 'phase_id' => $p3f2->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Trazado de viales',
            'status' => 'pendiente', 'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'estimated_hours' => 30, 'start_date' => '2026-05-21', 'end_date' => '2026-06-20',
        ]);
        // Miguel: 15 jun → 25 jul
        Task::create([
            'project_id' => $p3->id, 'phase_id' => $p3f2->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Red de saneamiento y pluviales',
            'status' => 'pendiente', 'priority' => 'alta',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'estimated_hours' => 35, 'start_date' => '2026-06-15', 'end_date' => '2026-07-25',
        ]);
        // Ana: 21 jun → 20 jul
        Task::create([
            'project_id' => $p3->id, 'phase_id' => $p3f2->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Red de abastecimiento de agua',
            'status' => 'pendiente', 'priority' => 'alta',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'estimated_hours' => 25, 'start_date' => '2026-06-21', 'end_date' => '2026-07-20',
        ]);
        // Pedro: 1 jun → 10 jul
        Task::create([
            'project_id' => $p3->id, 'phase_id' => $p3f2->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Alumbrado público y canalización eléctrica',
            'status' => 'pendiente', 'priority' => 'media',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'estimated_hours' => 30, 'start_date' => '2026-06-01', 'end_date' => '2026-07-10',
        ]);
        // Ana: 21 jul → 15 ago
        Task::create([
            'project_id' => $p3->id, 'phase_id' => $p3f2->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Diseño de zonas verdes',
            'status' => 'pendiente', 'priority' => 'baja',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'estimated_hours' => 20, 'start_date' => '2026-07-21', 'end_date' => '2026-08-15',
        ]);

        // ==========================================
        // PROYECTO 4: Edificio residencial (finalizado)
        // ==========================================
        $p4 = Project::create([
            'name' => 'Edificio Residencial Alameda',
            'type' => 'edificacion',
            'client_name' => 'Promociones Alameda S.A.',
            'status' => 'finalizado',
            'budget' => 450000,
            'start_date' => '2025-03-01',
            'end_date' => '2025-12-20',
            'address' => 'C/ Alameda Principal 56, Málaga',
            'description' => 'Edificio de 4 plantas con 8 viviendas, garaje subterráneo y local comercial en planta baja.',
        ]);

        $p4f1 = Phase::create([
            'project_id' => $p4->id,
            'name' => 'Anteproyecto',
            'status' => 'finalizado',
            'estimated_hours' => 100,
            'hourly_rate' => 55,
            'order' => 1,
            'start_date' => '2025-03-01',
            'end_date' => '2025-05-01',
        ]);

        $p4f2 = Phase::create([
            'project_id' => $p4->id,
            'name' => 'Proyecto de Ejecución',
            'status' => 'finalizado',
            'estimated_hours' => 180,
            'hourly_rate' => 50,
            'order' => 2,
            'start_date' => '2025-05-02',
            'end_date' => '2025-08-30',
        ]);

        // P4 (todas completadas — proyecto pasado, sin solapamientos)
        // Laura: 1 mar → 25 mar 2025
        Task::create([
            'project_id' => $p4->id, 'phase_id' => $p4f1->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Estudio de viabilidad',
            'status' => 'completada', 'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'estimated_hours' => 30, 'start_date' => '2025-03-01', 'end_date' => '2025-03-25',
        ]);
        // Ana: 20 mar → 20 abr 2025
        Task::create([
            'project_id' => $p4->id, 'phase_id' => $p4f1->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Diseño volumétrico',
            'status' => 'completada', 'priority' => 'alta',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'estimated_hours' => 40, 'start_date' => '2025-03-20', 'end_date' => '2025-04-20',
        ]);
        // Miguel: 10 abr → 1 may 2025
        Task::create([
            'project_id' => $p4->id, 'phase_id' => $p4f1->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Presupuesto estimativo',
            'status' => 'completada', 'priority' => 'media',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'estimated_hours' => 30, 'start_date' => '2025-04-10', 'end_date' => '2025-05-01',
        ]);
        // Laura: 2 may → 15 jun 2025
        Task::create([
            'project_id' => $p4->id, 'phase_id' => $p4f2->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Planos de estructura',
            'status' => 'completada', 'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'estimated_hours' => 50, 'start_date' => '2025-05-02', 'end_date' => '2025-06-15',
        ]);
        // Pedro: 1 jun → 30 jul 2025
        Task::create([
            'project_id' => $p4->id, 'phase_id' => $p4f2->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Instalaciones completas',
            'status' => 'completada', 'priority' => 'alta',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'estimated_hours' => 60, 'start_date' => '2025-06-01', 'end_date' => '2025-07-30',
        ]);
        // Miguel: 1 jul → 15 ago 2025
        Task::create([
            'project_id' => $p4->id, 'phase_id' => $p4f2->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Estudio de seguridad y salud',
            'status' => 'completada', 'priority' => 'alta',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'estimated_hours' => 40, 'start_date' => '2025-07-01', 'end_date' => '2025-08-15',
        ]);
        // Ana: 1 ago → 30 ago 2025
        Task::create([
            'project_id' => $p4->id, 'phase_id' => $p4f2->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Renders comerciales',
            'status' => 'completada', 'priority' => 'baja',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'estimated_hours' => 30, 'start_date' => '2025-08-01', 'end_date' => '2025-08-30',
        ]);
    }
}

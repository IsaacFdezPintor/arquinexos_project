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

        Task::create([
            'project_id' => $p1->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Levantamiento topográfico',
            'description' => 'Medición y estudio del terreno existente.',
            'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'start_date' => '2026-01-15', 'end_date' => '2026-01-22',
        ]);

        Task::create([
            'project_id' => $p1->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Planos de distribución',
            'description' => 'Diseño de la distribución interior de la vivienda.',
            'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'start_date' => '2026-01-23', 'end_date' => '2026-02-05',
        ]);

        Task::create([
            'project_id' => $p1->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Memoria descriptiva',
            'description' => 'Redacción de la memoria del proyecto básico.',
            'priority' => 'media',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'start_date' => '2026-02-01', 'end_date' => '2026-02-10',
        ]);

        Task::create([
            'project_id' => $p1->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Renders 3D fachada',
            'description' => 'Visualización 3D del exterior de la vivienda.',
            'priority' => 'media',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'start_date' => '2026-01-20', 'end_date' => '2026-02-03',
        ]);

        Task::create([
            'project_id' => $p1->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Cálculo estructural',
            'description' => 'Dimensionamiento de cimentación, pilares y forjados.',
            'priority' => 'alta',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'start_date' => '2026-02-16', 'end_date' => '2026-03-05',
        ]);

        Task::create([
            'project_id' => $p1->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Instalaciones eléctricas',
            'description' => 'Diseño de la instalación eléctrica completa.',
            'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'start_date' => '2026-03-06', 'end_date' => '2026-03-25',
        ]);

        Task::create([
            'project_id' => $p1->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Instalaciones de fontanería',
            'description' => 'Diseño de la red de agua fría, caliente y saneamiento.',
            'priority' => 'alta',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'start_date' => '2026-02-21', 'end_date' => '2026-03-15',
        ]);

        Task::create([
            'project_id' => $p1->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Planos de detalle constructivo',
            'description' => 'Detalles constructivos de encuentros y soluciones especiales.',
            'priority' => 'media',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'start_date' => '2026-03-26', 'end_date' => '2026-04-10',
        ]);

        Task::create([
            'project_id' => $p1->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Mediciones y presupuesto',
            'description' => 'Mediciones de todas las partidas y presupuesto de ejecución.',
            'priority' => 'media',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'start_date' => '2026-04-11', 'end_date' => '2026-04-25',
        ]);

        Task::create([
            'project_id' => $p1->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Supervisión de cimentación',
            'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'start_date' => '2026-04-16', 'end_date' => '2026-05-20',
        ]);

        Task::create([
            'project_id' => $p1->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Control de calidad materiales',
            'priority' => 'alta',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'start_date' => '2026-05-01', 'end_date' => '2026-06-10',
        ]);

        Task::create([
            'project_id' => $p1->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Certificaciones mensuales',
            'priority' => 'media',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'start_date' => '2026-05-05', 'end_date' => '2026-06-20',
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

        Task::create([
            'project_id' => $p2->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Informe estado actual',
            'priority' => 'alta',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'start_date' => '2026-02-04', 'end_date' => '2026-02-15',
        ]);

        Task::create([
            'project_id' => $p2->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Gestión licencia de actividad',
            'priority' => 'alta',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'start_date' => '2026-02-05', 'end_date' => '2026-02-18',
        ]);

        Task::create([
            'project_id' => $p2->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Estudio acústico',
            'priority' => 'media',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'start_date' => '2026-02-16', 'end_date' => '2026-02-20',
        ]);

        Task::create([
            'project_id' => $p2->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Diseño interior del restaurante',
            'description' => 'Distribución de salón, cocina, baños y terraza cubierta.',
            'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'start_date' => '2026-02-10', 'end_date' => '2026-02-28',
        ]);

        Task::create([
            'project_id' => $p2->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Proyecto de climatización',
            'priority' => 'alta',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'start_date' => '2026-03-09', 'end_date' => '2026-03-25',
        ]);

        Task::create([
            'project_id' => $p2->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Protección contra incendios',
            'priority' => 'alta',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'start_date' => '2026-03-09', 'end_date' => '2026-03-25',
        ]);

        Task::create([
            'project_id' => $p2->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Plano de evacuación',
            'priority' => 'media',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'start_date' => '2026-03-26', 'end_date' => '2026-04-10',
        ]);

        Task::create([
            'project_id' => $p2->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Demoliciones y retirada de escombros',
            'priority' => 'alta',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'start_date' => '2026-04-01', 'end_date' => '2026-04-15',
        ]);

        Task::create([
            'project_id' => $p2->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Instalación de cocina industrial',
            'priority' => 'alta',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'start_date' => '2026-04-10', 'end_date' => '2026-05-01',
        ]);

        Task::create([
            'project_id' => $p2->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Acabados y mobiliario',
            'priority' => 'media',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'start_date' => '2026-04-26', 'end_date' => '2026-05-12',
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

        Task::create([
            'project_id' => $p3->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Estudio geotécnico',
            'description' => 'Análisis del terreno y capacidad portante del suelo.',
            'priority' => 'alta',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'start_date' => '2026-04-16', 'end_date' => '2026-04-30',
        ]);

        Task::create([
            'project_id' => $p3->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Plano topográfico actualizado',
            'priority' => 'alta',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'start_date' => '2026-02-19', 'end_date' => '2026-03-08',
        ]);

        Task::create([
            'project_id' => $p3->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Estudio de impacto ambiental',
            'priority' => 'media',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'start_date' => '2026-03-16', 'end_date' => '2026-04-09',
        ]);

        Task::create([
            'project_id' => $p3->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Trazado de viales',
            'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'start_date' => '2026-05-21', 'end_date' => '2026-06-20',
        ]);

        Task::create([
            'project_id' => $p3->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Red de saneamiento y pluviales',
            'priority' => 'alta',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'start_date' => '2026-06-15', 'end_date' => '2026-07-25',
        ]);

        Task::create([
            'project_id' => $p3->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Red de abastecimiento de agua',
            'priority' => 'alta',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'start_date' => '2026-06-21', 'end_date' => '2026-07-20',
        ]);

        Task::create([
            'project_id' => $p3->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Alumbrado público y canalización eléctrica',
            'priority' => 'media',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'start_date' => '2026-06-01', 'end_date' => '2026-07-10',
        ]);

        Task::create([
            'project_id' => $p3->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Diseño de zonas verdes',
            'priority' => 'baja',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'start_date' => '2026-07-21', 'end_date' => '2026-08-15',
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

        Task::create([
            'project_id' => $p4->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Estudio de viabilidad',
            'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'start_date' => '2025-03-01', 'end_date' => '2025-03-25',
        ]);

        Task::create([
            'project_id' => $p4->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Diseño volumétrico',
            'priority' => 'alta',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'start_date' => '2025-03-20', 'end_date' => '2025-04-20',
        ]);

        Task::create([
            'project_id' => $p4->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Presupuesto estimativo',
            'priority' => 'media',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'start_date' => '2025-04-10', 'end_date' => '2025-05-01',
        ]);

        Task::create([
            'project_id' => $p4->id,
            'assigned_user_id' => $worker1->id,
            'name' => 'Planos de estructura',
            'priority' => 'alta',
            'assigned_user_email' => $worker1->email, 'assigned_user_name' => $worker1->name,
            'start_date' => '2025-05-02', 'end_date' => '2025-06-15',
        ]);

        Task::create([
            'project_id' => $p4->id,
            'assigned_user_id' => $worker4->id,
            'name' => 'Instalaciones completas',
            'priority' => 'alta',
            'assigned_user_email' => $worker4->email, 'assigned_user_name' => $worker4->name,
            'start_date' => '2025-06-01', 'end_date' => '2025-07-30',
        ]);

        Task::create([
            'project_id' => $p4->id,
            'assigned_user_id' => $worker2->id,
            'name' => 'Estudio de seguridad y salud',
            'assigned_user_email' => $worker2->email, 'assigned_user_name' => $worker2->name,
            'start_date' => '2025-07-01', 'end_date' => '2025-08-15',
        ]);

        Task::create([
            'project_id' => $p4->id,
            'assigned_user_id' => $worker3->id,
            'name' => 'Renders comerciales',
            'priority' => 'baja',
            'assigned_user_email' => $worker3->email, 'assigned_user_name' => $worker3->name,
            'start_date' => '2025-08-01', 'end_date' => '2025-08-30',
        ]);
    }
}
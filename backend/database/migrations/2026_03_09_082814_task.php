<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Esta función crea la tabla 'tasks' (tareas) en la base de datos.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id(); // Identificador único de la tarea

            // RELACIONES (Claves Foráneas):
            // Conecta con la tabla de proyectos. Si se borra el proyecto, se borran sus tareas (cascadeOnDelete).
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();

            // Conecta con el usuario asignado. Si se borra el usuario, la tarea queda sin asignar (nullOnDelete).
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();

            // DATOS BÁSICOS:
            $table->string('name'); // Título de la tarea
            $table->text('description')->nullable(); // Descripción larga (puede estar vacía)
            $table->string('priority')->nullable(); // Prioridad: Ej. "Baja", "Media", "Alta"

            // DATOS DEL TRABAJADOR (Opcionales - REDUNDANTES, se mantienen por compatibilidad):
            $table->string('assigned_user_email')->nullable(); // Guardamos el email del responsable
            $table->string('assigned_user_name')->nullable();  // Guardamos el nombre del responsable

            // PLANIFICACIÓN:
            $table->date('start_date')->nullable(); // Fecha de inicio
            $table->date('end_date')->nullable();   // Fecha de entrega tope

            $table->timestamps(); // Crea automáticamente 'created_at' y 'updated_at'
        });
    }

    /**
     * Esta función borra la tabla si queremos resetear la base de datos.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('tasks')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('role', ['worker', 'boss'])->default('worker'); // Rol del usuario en la tarea
            $table->timestamps();
            $table->unique(['task_id', 'user_id']); // Una persona solo puede asignarse a una tarea una sola vez
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_users');
    }
};

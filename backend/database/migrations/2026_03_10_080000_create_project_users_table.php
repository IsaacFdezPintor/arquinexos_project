<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('project_users', function (Blueprint $table) {
            $table->id();
            
            // Claves foráneas a projects y users
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            
            // Rol opcional del usuario dentro del proyecto
            $table->string('role')->nullable()->default('member'); // member, leader, reviewer, etc.
            
            $table->timestamps();
            
            // Clave única: Un usuario solo puede estar una vez en cada proyecto
            $table->unique(['project_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_users');
    }
};

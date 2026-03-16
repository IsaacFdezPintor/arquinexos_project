<?php

use Illuminate\Support\Facades\Route;
// Aquí llamamos a los "Controladores" (los que ejecutan las órdenes)
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ProjectUserController;
use App\Http\Controllers\Api\PhaseController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskSubmissionController;
use App\Http\Controllers\Api\TimeLogController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;

// --- RUTAS PÚBLICAS (Cualquiera puede entrar) ---
// Para registrarse y para entrar (Login)
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

// --- RUTAS PROTEGIDAS (Solo si tienes la "llave" o Token) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Saber quién soy yo ahora mismo y cerrar sesión
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);
    
    // Ver a todos los empleados de mi equipo (Normalmente solo el Jefe)
    Route::get('users/team', [UserController::class, 'team']);
    
    // Ver solo MIS tareas (Si soy trabajador)
    Route::get('tasks/my-tasks', [TaskController::class, 'myTasks']);
    
    // Estas son "Súper Rutas" (apiResource). 
    // Laravel crea automáticamente 5 rutas: Ver todos, Crear uno, Ver uno solo, Editar y Borrar.
    /* Route::apiResource('projects', ProjectController::class);       // Gestión de proyectos
    Route::apiResource('phases', PhaseController::class);           // Gestión de fases
    Route::apiResource('tasks', TaskController::class);             // Gestión de tareas
    Route::apiResource('task-submissions', TaskSubmissionController::class); // Entregas de tareas
    Route::apiResource('time-logs', TimeLogController::class);       // Fichajes de tiempo
    Route::apiResource('skills', SkillController::class);           // Habilidades
    Route::apiResource('users', UserController::class);             // Gestión de usuarios
    */
    // Rutas para gestionar usuarios en proyectos (Relación N:M)
    Route::get('projects/{project}/users', [ProjectUserController::class, 'index']);        // Ver usuarios del proyecto
    Route::post('projects/{project}/users', [ProjectUserController::class, 'store']);       // Asignar usuario al proyecto
    Route::delete('projects/{project}/users/{user}', [ProjectUserController::class, 'destroy']); // Desasignar usuario
    Route::put('projects/{project}/users/{user}', [ProjectUserController::class, 'update']);    // Actualizar rol del usuario
});

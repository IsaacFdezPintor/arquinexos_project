<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskUserController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;

/**
 * Definición de Rutas de la API - Sistema Arquinexos
 * * Este archivo define los puntos de entrada (endpoints) para la comunicación
 * entre el frontend y el backend.
 */

// =====================================================================
// 1. RUTAS PÚBLICAS (Sin Autenticación)
// =====================================================================

// Registro de nuevos usuarios y obtención de Token inicial (Login)
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

// =====================================================================
// 2. RUTAS PROTEGIDAS (Requieren Token Sanctum)
// =====================================================================

Route::middleware('auth:sanctum')->group(function () {
    
    /**
     * Gestión de Sesión y Perfil
     * * Permite al cliente consultar sus propios datos o invalidar el token actual.
     */
    Route::post('auth/logout', [AuthController::class, 'logout']);
    
    /**
     * Gestión de Usuarios y Equipo
     * * 'team': Recupera la lista de trabajadores subordinados (Lógica exclusiva de Jefe).
     */
    Route::get('users/team', [UserController::class, 'team']);
    
    /**
     * Gestión Específica de Tareas
     * * 'my-tasks': Filtra tareas asignadas directamente al usuario autenticado.
     * * 'getByProject': Lista las tareas pertenecientes a un proyecto ID específico.
     */
    Route::get('tasks/my-tasks', [TaskController::class, 'myTasks']);
    Route::get('projects/{project}/tasks', [TaskController::class, 'getByProject']);
    
    /**
     * Controladores de Recurso (CRUD Automático)
     * * Generan las rutas estándar: index, store, show, update, destroy.
     */
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('users', UserController::class);
    
    /**
     * Gestión de Relaciones Task-User 
     * * Define los endpoints para la asignación y desasignación de personal a tareas.
     * * Permite el control granular de quién trabaja en qué tarea específica.
     */
    Route::get('tasks/{task}/users', [TaskUserController::class, 'index']);      
    Route::post('tasks/{task}/users', [TaskUserController::class, 'store']);        
    Route::put('tasks/{task}/users/{user}', [TaskUserController::class, 'update']);   
    Route::delete('tasks/{task}/users/{user}', [TaskUserController::class, 'destroy']); 
});
<?php

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="Arquinexos API",
 *     description="API REST para la gestión de proyectos y tareas de arquitectura",
 *     contact={
 *         "name": "Isaac Fernández Pintor",
 *         "email": "contact@arquinexos.local"
 *     },
 *     license={
 *         "name": "MIT"
 *     }
 * )
 */

/**
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Servidor de desarrollo"
 * )
 */

/**
 * @OA\SecurityScheme(
 *     type="http",
 *     name="sanctum",
 *     in="header",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     securityScheme="sanctum",
 *     description="Token de autenticación Laravel Sanctum"
 * )
 */

use Illuminate\Support\Facades\Route;
// Aquí llamamos a los "Controladores" (los que ejecutan las órdenes)
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskUserController;
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
    
    // Tareas de un proyecto específico
    Route::get('projects/{project}/tasks', [TaskController::class, 'getByProject']);
    
    // Estas son "Súper Rutas" (apiResource). 
    // Laravel crea automáticamente 5 rutas: Ver todos, Crear uno, Ver uno solo, Editar y Borrar.
    Route::apiResource('projects', ProjectController::class);       // Gestión de proyectos
    Route::apiResource('tasks', TaskController::class);             // Gestión de tareas
    Route::apiResource('users', UserController::class);             // Gestión de usuarios
    
    // Rutas para gestionar usuarios en tareas (Relación N:M)
    Route::get('tasks/{task}/users', [TaskUserController::class, 'index']);           // Ver usuarios de una tarea
    Route::post('tasks/{task}/users', [TaskUserController::class, 'store']);          // Asignar usuario a tarea
    Route::put('tasks/{task}/users/{user}', [TaskUserController::class, 'update']);   // Actualizar rol del usuario
    Route::delete('tasks/{task}/users/{user}', [TaskUserController::class, 'destroy']); // Desasignar usuario
});

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * Controlador encargado de gestionar las tareas del sistema.
 * 
 * Permite listar tareas, ver tareas asignadas a un usuario,
 * crear nuevas tareas, ver una tarea concreta y eliminar tareas.
 */
class TaskController extends Controller
{

    /**
     * Listar todas las tareas con paginación opcional.
     * 
     * @param Request $request Petición HTTP
     * @return \Illuminate\Http\JsonResponse Listado de tareas
     */
    public function index(Request $request)
    {
        $query = Task::with(['assignedUser', 'phase', 'project']);

        if ($request->query('no_paginate')) {
            return response()->json($query->get(), 200);
        }

        return response()->json($query->paginate(15), 200);
    }

    /**
     * Obtener solo las tareas asignadas al usuario autenticado.
     * 
     * @param Request $request Petición HTTP
     * @return \Illuminate\Http\JsonResponse Tareas del usuario
     */
    public function myTasks(Request $request)
    {
        $user = $request->user();
        
        $tasks = Task::where('assigned_user_id', $user->id)
            ->with(['phase', 'project'])
            ->get();

        return response()->json($tasks, 200);
    }

    /**
     * Crear una nueva tarea.
     * 
     * Solo los usuarios con rol de "jefe" pueden crear tareas.
     * También se valida que los datos sean correctos y que el
     * trabajador no tenga tareas que se solapen en las fechas.
     *
     * @param Request $request Datos enviados desde el cliente
     * @return \Illuminate\Http\JsonResponse Tarea creada o error
     */
    public function store(Request $request)
    {
        // Obtener el usuario autenticado
        $user = $request->user();

        // Verificar si el usuario está autenticado
        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Verificar que el usuario tenga rol de jefe
        if (!$user->isJefe()) {
            return response()->json(['error' => 'Solo los jefes pueden crear tareas'], 403);
        }

        // VALIDACIÓN DE DATOS
        // Se comprueba que los datos recibidos cumplen las reglas necesarias
        $validated = $request->validate([
            'project_id' => ['required', 'exists:projects,id'],
            'phase_id' => ['nullable', 'exists:phases,id'],
            'assigned_user_id' => ['nullable', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string'],
            'priority' => ['required', 'string'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);

        // LÓGICA DE NEGOCIO
        // Se comprueba que el trabajador no tenga otra tarea en el mismo rango de fechas
        if (isset($validated['assigned_user_id']) && isset($validated['start_date']) && isset($validated['end_date'])) {

            // Se busca si existe una tarea que se solape con las fechas indicadas
            $overlap = Task::where('assigned_user_id', $validated['assigned_user_id'])
                ->where('status', '!=', 'completada')
                ->where('start_date', '<=', $validated['end_date'])
                ->where('end_date', '>=', $validated['start_date'])
                ->first();

            // Si existe una tarea en esas fechas se devuelve un error
            if ($overlap) {
                return response()->json([
                    'error' => 'Este trabajador ya está ocupado con la tarea: ' . $overlap->name
                ], 422);
            }
        }

        // CREACIÓN DE LA TAREA EN LA BASE DE DATOS
        $task = Task::create($validated);

        // Se devuelve la tarea creada junto con sus relaciones
        return response()->json(
            $task->load(['assignedUser', 'project', 'phase']),
            201
        );
    }

    /**
     * Mostrar una tarea específica.
     * 
     * Devuelve la información completa de una tarea,
     * incluyendo sus relaciones con proyecto, fase,
     * usuario asignado y registros de tiempo.
     *
     * @param Task $task Tarea solicitada
     * @return \Illuminate\Http\JsonResponse Información de la tarea
     */
    public function show(Task $task)
    {
        return response()->json(
            $task->load(['project', 'phase', 'assignedUser', 'timeLogs']),
            200
        );
    }

    /**
     * Eliminar una tarea.
     * 
     * Solo los usuarios con rol de jefe pueden eliminar tareas.
     *
     * @param Request $request Petición HTTP del usuario autenticado
     * @param Task $task Tarea que se desea eliminar
     * @return \Illuminate\Http\JsonResponse Mensaje de confirmación
     */
    public function destroy(Request $request, Task $task)
    {
        // Verificar que el usuario tenga permisos de jefe
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'Acceso denegado'], 403);
        }

        // Eliminación de la tarea de la base de datos
        $task->delete();

        return response()->json(['message' => 'Tarea eliminada'], 200);
    }
}
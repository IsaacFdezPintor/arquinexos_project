<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * Controlador TaskController - Gestión de Tareas
 * * Este controlador centraliza la lógica de las tareas del sistema.
 * Implementa un sistema de permisos basado en roles:
 * - Jefes: Control total sobre cualquier tarea y asignación de personal.
 * - Trabajadores: Acceso restringido únicamente a tareas donde figuran como asignados.
 * */
class TaskController extends Controller
{
    /**
     * Obtiene la lista de tareas filtrada por el rol del usuario.
     * * Los jefes acceden al catálogo completo, mientras que los trabajadores
     * ven una lista filtrada mediante una relación de base de datos.
     * * @param Request $request Petición que puede incluir:
     * * @return \Illuminate\Http\JsonResponse Listado de tareas con sus relaciones (proyecto y usuarios).
     */
    public function index(Request $request)
    {
        $query = Task::with(['project', 'users']);
        $user = $request->user();

        // Aplicar filtro de seguridad: los trabajadores solo ven lo suyo
        if ($user->role === 'worker') {
            $query->whereHas('users', function($q) use ($user) {
                $q->where('users.id', $user->id);
            });
        }

        // Determinar si se devuelve el set de datos completo o paginado
        if ($request->query('no_paginate')) {
            return response()->json($query->get(), 200);
        }

        return response()->json($query->paginate(15), 200);
    }
/**
     * Creación de Tareas con Validación de Disponibilidad (N:M)
     * * Este método es crítico: No solo guarda datos, sino que actúa como validador de agenda.
     * * @param Request $request Datos de la tarea y array de user_ids.
     * @return \Illuminate\Http\JsonResponse
     */
   public function store(Request $request)
{
    $user = $request->user();

    if (!$user || !$user->isJefe()) {
        return response()->json(['error' => 'No autorizado'], 403);
    }

    $validated = $request->validate([
        'project_id' => ['required', 'exists:projects,id'],
        'user_ids'   => ['nullable', 'array'],
        'user_ids.*' => ['exists:users,id'],
        'name'       => ['required', 'string', 'max:255'],
        'start_date' => ['required', 'date'],
        'end_date'   => ['required', 'date', 'after_or_equal:start_date'],
        'status'     => ['nullable', 'string'],
        'priority'   => ['nullable', 'string'],
    ]);

    $userIds = $validated['user_ids'] ?? [];

    // --- LÓGICA PARA RELACIÓN N:M ---
    if (!empty($userIds)) {
        // Buscamos si existe alguna tarea que...
        $overlap = Task::whereHas('users', function($q) use ($userIds) {
                // ...tenga a alguno de los usuarios que queremos asignar
                $q->whereIn('users.id', $userIds);
            })
            ->where(function ($query) use ($validated) {
                // ...y que sus fechas choquen con las nuevas
                $query->where(function ($q) use ($validated) {
                    $q->where('start_date', '<=', $validated['end_date'])
                      ->where('end_date', '>=', $validated['start_date']);
                });
            })->exists();

        if ($overlap) {
            return response()->json([
                'error' => 'Conflicto de agenda',
                'message' => 'Uno o más usuarios ya tienen tareas asignadas en este rango de fechas.'
            ], 422); // El test recibirá el 422 y pasará a verde
        }
    }

    // Si no hay solapamiento, creamos la tarea
    unset($validated['user_ids']);
    $task = Task::create($validated);

    if (!empty($userIds)) {
        $task->users()->attach($userIds);
    }

    return response()->json($task->load(['project', 'users']), 201);
}
    /**
     * Muestra el detalle de una tarea específica.
     * * Verifica que si el usuario es trabajador, realmente tenga permiso
     * para visualizar dicha tarea comprobando la tabla pivote.
     * * @param Request $request Petición HTTP.
     * @param Task $task Tarea inyectada automáticamente.
     * * @return \Illuminate\Http\JsonResponse Datos de la tarea o error de acceso.
     */
    public function show(Request $request, Task $task)
    {
        // Validar si el trabajador tiene asignada esta tarea en particular
        if ($request->user()->isWorker()) {
            $isAssigned = $task->users()->where('users.id', $request->user()->id)->exists();
            if (!$isAssigned) {
                return response()->json(['error' => 'Acceso denegado'], 403);
            }
        }

        // Devolver la tarea con la información del proyecto y usuarios asignados
        return response()->json($task->load(['project', 'users']), 200);
    }

    /**
     * Actualiza la información de una tarea.
     * - Trabajadores: Solo pueden modificar el campo 'priority'.
     * - Jefes: Pueden modificar cualquier campo y sincronizar usuarios.
     * * @param Request $request Datos a actualizar.
     * @param Task $task Tarea a modificar.
     * * @return \Illuminate\Http\JsonResponse Tarea actualizada.
     */
    public function update(Request $request, Task $task)
    {
        $user = $request->user();

        // Lógica restringida para el rol Trabajador
        if ($user->isWorker()) {
            $isAssigned = $task->users()->where('users.id', $user->id)->exists();
            if (!$isAssigned) {
                return response()->json(['error' => 'Acceso denegado'], 403);
            }

            // El trabajador solo tiene permiso para cambiar la prioridad
            $validated = $request->validate([
                'priority' => ['nullable', 'string'],
            ]);

            $task->update($validated);
            return response()->json($task->load(['project', 'users']), 200);
        }

        // Seguridad: Verificar que sea jefe para cambios globales
        if (!$user->isJefe()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        // Validación completa para el Jefe
        $validated = $request->validate([
            'project_id' => ['required', 'exists:projects,id'],
            'user_ids' => ['nullable', 'array'],
            'user_ids.*' => ['exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'status' => ['nullable', 'string'],
            'priority' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'description' => ['nullable', 'string'],
        ]);

        $userIds = $validated['user_ids'] ?? null;
        unset($validated['user_ids']);
        
        $task->update($validated);

        // Reemplaza todas las asignaciones previas por las nuevas
        if ($userIds !== null) {
            $task->users()->sync($userIds);
        }

        return response()->json($task->load(['project', 'users']), 200);
    }

    /**
     * Elimina una tarea de la base de datos.
     * * Acción restringida exclusivamente a usuarios con rol jefe.
     * * @param Request $request Petición HTTP.
     * @param Task $task Tarea a eliminar.
     * * @return \Illuminate\Http\JsonResponse Confirmación de la eliminación.
     */
    public function destroy(Request $request, Task $task)
    {
        // Verificar permisos de administración
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        // Proceder con el borrado físico del registro
        $task->delete();
        return response()->json(['message' => 'Tarea eliminada'], 200);
    }

    /**
     * Recupera todas las tareas vinculadas a un proyecto específico.
     * * @param Request $request Petición HTTP.
     * @param int $projectId ID numérico del proyecto.
     * * @return \Illuminate\Http\JsonResponse Colección de tareas del proyecto.
     */
    public function getByProject(Request $request, $projectId)
    {
        // Buscar tareas que pertenezcan al proyecto indicado
        $tasks = Task::where('project_id', $projectId)
            ->with(['project', 'users']) 
            ->get();

        return response()->json($tasks, 200);
    }
}
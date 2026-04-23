<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Listar tareas.
     */
    public function index(Request $request)
    {
        $query = Task::with(['project', 'users']);
        $user = $request->user();

        if ($user->role === 'worker') {
            $query->whereHas('users', function($q) use ($user) {
                $q->where('users.id', $user->id);
            });
        }

        if ($request->query('no_paginate')) {
            return response()->json($query->get(), 200);
        }

        return response()->json($query->paginate(15), 200);
    }

    /**
     * Crear una nueva tarea.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->isJefe()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

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

        $userIds = $validated['user_ids'] ?? [];
        unset($validated['user_ids']);
        
        $task = Task::create($validated);

        if (!empty($userIds)) {
            $task->users()->attach($userIds);
        }

        return response()->json($task->load(['project', 'users']), 201);
    }

    /**
     * Mostrar una tarea específica.
     */
    public function show(Request $request, Task $task)
    {
        if ($request->user()->isWorker()) {
            $isAssigned = $task->users()->where('users.id', $request->user()->id)->exists();
            if (!$isAssigned) {
                return response()->json(['error' => 'Acceso denegado'], 403);
            }
        }

        return response()->json($task->load(['project', 'users']), 200);
    }

    /**
     * Actualizar una tarea.
     */
    public function update(Request $request, Task $task)
    {
        $user = $request->user();

        if (!$user->isJefe()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

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

        if ($userIds !== null) {
            $task->users()->sync($userIds);
        }

        return response()->json($task->load(['project', 'users']), 200);
    }

    /**
     * Eliminar una tarea.
     */
    public function destroy(Request $request, Task $task)
    {
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $task->delete();
        return response()->json(['message' => 'Tarea eliminada'], 200);
    }

    /**
     * Obtener tareas de un proyecto específico.
     */
    public function getByProject(Request $request, $projectId)
    {
        $tasks = Task::where('project_id', $projectId)
            ->with(['project', 'users']) 
            ->get();

        return response()->json($tasks, 200);
    }
}


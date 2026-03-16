<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * Controlador para gestionar la relación N:M entre proyectos y usuarios.
 * 
 * Permite asignar/desasignar usuarios a proyectos y gestionar sus roles.
 */
class ProjectUserController extends Controller
{
    /**
     * Obtener todos los usuarios asignados a un proyecto.
     *
     * @param Project $project El proyecto
     * @return \Illuminate\Http\JsonResponse Lista de usuarios del proyecto
     */
    public function index(Project $project)
    {
        return response()->json($project->users()->get(), 200);
    }

    /**
     * Asignar un usuario a un proyecto.
     *
     * @param Request $request Petición HTTP
     * @param Project $project El proyecto
     * @return \Illuminate\Http\JsonResponse Confirmación de la asignación
     */
    public function store(Request $request, Project $project)
    {
        // Verificar que el usuario sea jefe
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'Solo los jefes pueden asignar usuarios'], 403);
        }

        // Validar datos
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'role' => ['nullable', 'string', 'in:member,leader,reviewer'],
        ]);

        // Verificar que el usuario no esté ya en el proyecto
        if ($project->users()->where('user_id', $validated['user_id'])->exists()) {
            return response()->json(['error' => 'Este usuario ya está asignado al proyecto'], 422);
        }

        // Asignar usuario al proyecto
        $project->users()->attach($validated['user_id'], [
            'role' => $validated['role'] ?? 'member',
        ]);

        return response()->json([
            'message' => 'Usuario asignado al proyecto exitosamente',
            'user_id' => $validated['user_id'],
            'role' => $validated['role'] ?? 'member',
        ], 201);
    }

    /**
     * Desasignar un usuario de un proyecto.
     *
     * @param Request $request Petición HTTP
     * @param Project $project El proyecto
     * @param User $user El usuario
     * @return \Illuminate\Http\JsonResponse Confirmación de la desasignación
     */
    public function destroy(Request $request, Project $project, User $user)
    {
        // Verificar que el usuario sea jefe
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'Solo los jefes pueden desasignar usuarios'], 403);
        }

        // Verificar que el usuario está en el proyecto
        if (!$project->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Este usuario no está asignado al proyecto'], 404);
        }

        // Desasignar
        $project->users()->detach($user->id);

        return response()->json([
            'message' => 'Usuario desasignado del proyecto exitosamente',
        ], 200);
    }

    /**
     * Actualizar el rol de un usuario en un proyecto.
     *
     * @param Request $request Petición HTTP
     * @param Project $project El proyecto
     * @param User $user El usuario
     * @return \Illuminate\Http\JsonResponse Confirmación de la actualización
     */
    public function update(Request $request, Project $project, User $user)
    {
        // Verificar que el usuario sea jefe
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'Solo los jefes pueden actualizar roles'], 403);
        }

        // Validar datos
        $validated = $request->validate([
            'role' => ['required', 'string', 'in:member,leader,reviewer'],
        ]);

        // Verificar que el usuario está en el proyecto
        if (!$project->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Este usuario no está asignado al proyecto'], 404);
        }

        // Actualizar rol
        $project->users()->updateExistingPivot($user->id, ['role' => $validated['role']]);

        return response()->json([
            'message' => 'Rol del usuario actualizado exitosamente',
            'user_id' => $user->id,
            'role' => $validated['role'],
        ], 200);
    }
}

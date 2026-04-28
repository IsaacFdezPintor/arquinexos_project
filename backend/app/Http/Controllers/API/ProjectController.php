<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * ProjectController
 * 
 * Controlador para la gestión de proyectos.
 * Proporciona endpoints CRUD para crear, leer, actualizar y eliminar proyectos.
 * Solo los usuarios con rol 'boss' pueden crear, actualizar y eliminar proyectos.
 * 
 * @OA\Tag(
 *     name="Projects",
 *     description="Endpoints para gestión de proyectos"
 * )
 */
class ProjectController extends Controller
{
    /**
     * Obtiene la lista de todos los proyectos
     * 
     * @param Request $request Solicitud HTTP
     * @return JsonResponse Lista de proyectos paginada o completa
     * 
     * @OA\Get(
     *     path="/api/projects",
     *     summary="Obtener lista de proyectos",
     *     description="Devuelve una lista paginada de todos los proyectos. Usa ?no_paginate=1 para obtener todos sin paginar",
     *     tags={"Projects"},
     *     @OA\Parameter(name="no_paginate", in="query", description="Si es 1, devuelve todos sin paginar", required=false, @OA\Schema(type="boolean")),
     *     @OA\Response(response=200, description="Lista de proyectos obtenida exitosamente"),
     *     @OA\Response(response=401, description="No autenticado")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        if ($request->query('no_paginate')) {
            return response()->json(Project::all(), 200);
        }
        return response()->json(Project::paginate(15), 200);
    }

    /**
     * Crea un nuevo proyecto
     * 
     * Solo los usuarios con rol 'boss' pueden crear proyectos.
     * Valida los datos de entrada y protege contra inyección SQL mediante Eloquent.
     * 
     * @param Request $request Datos del proyecto (name, type, client_name, status, etc.)
     * @return JsonResponse Proyecto creado o mensaje de error
     * 
     * @OA\Post(
     *     path="/api/projects",
     *     summary="Crear nuevo proyecto",
     *     description="Crea un nuevo proyecto. Solo disponible para usuarios con rol 'boss'",
     *     tags={"Projects"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Datos del proyecto",
     *         @OA\JsonContent(
     *             required={"name","type","client_name","status","start_date"},
     *             @OA\Property(property="name", type="string", example="Mi Proyecto"),
     *             @OA\Property(property="type", type="string", example="Software"),
     *             @OA\Property(property="client_name", type="string", example="Cliente ABC"),
     *             @OA\Property(property="description", type="string", example="Descripción del proyecto"),
     *             @OA\Property(property="status", type="string", enum={"pending","in_progress","completed","cancelled"}),
     *             @OA\Property(property="budget", type="number", example=5000.00),
     *             @OA\Property(property="start_date", type="string", format="date", example="2026-04-01"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2026-12-31"),
     *             @OA\Property(property="address", type="string", example="Calle Principal 123")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Proyecto creado exitosamente"),
     *     @OA\Response(response=403, description="No autorizado - solo jefes pueden crear"),
     *     @OA\Response(response=422, description="Datos de validación inválidos")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'No autorizado. Solo los jefes pueden crear proyectos'], 403);
        }

        // Validación de datos de entrada
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
            'budget' => 'nullable|numeric',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'address' => 'nullable|string|max:255',
        ]);

        try {
            $project = Project::create($validated);
            return response()->json($project, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al crear el proyecto',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtiene un proyecto específico por su ID
     * 
     * @param Project $project Proyecto solicitado (inyectado por Laravel)
     * @return JsonResponse Datos del proyecto con sus tareas relacionadas
     * 
     * @OA\Get(
     *     path="/api/projects/{id}",
     *     summary="Obtener proyecto específico",
     *     description="Devuelve los detalles completos de un proyecto incluyendo sus tareas",
     *     tags={"Projects"},
     *     @OA\Parameter(name="id", in="path", description="ID del proyecto", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Proyecto encontrado"),
     *     @OA\Response(response=404, description="Proyecto no encontrado")
     * )
     */
    public function show(Project $project): JsonResponse
    {
        return response()->json($project->load(['tasks']), 200);
    }

    /**
     * Actualiza un proyecto existente
     * 
     * Solo los usuarios con rol 'boss' pueden actualizar proyectos.
     * 
     * @param Request $request Datos actualizados del proyecto
     * @param Project $project Proyecto a actualizar
     * @return JsonResponse Proyecto actualizado o mensaje de error
     * 
     * @OA\Put(
     *     path="/api/projects/{id}",
     *     summary="Actualizar proyecto",
     *     description="Actualiza los datos de un proyecto existente. Solo disponible para jefes",
     *     tags={"Projects"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(name="id", in="path", description="ID del proyecto", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="type", type="string"),
     *             @OA\Property(property="client_name", type="string"),
     *             @OA\Property(property="status", type="string", enum={"pending","in_progress","completed","cancelled"}),
     *             @OA\Property(property="budget", type="number"),
     *             @OA\Property(property="start_date", type="string", format="date"),
     *             @OA\Property(property="end_date", type="string", format="date"),
     *             @OA\Property(property="address", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Proyecto actualizado"),
     *     @OA\Response(response=403, description="No autorizado"),
     *     @OA\Response(response=404, description="Proyecto no encontrado")
     * )
     */
    public function update(Request $request, Project $project): JsonResponse
    {
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'No autorizado. Solo los jefes pueden actualizar proyectos'], 403);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'type' => 'string|max:255',
            'client_name' => 'string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:pending,in_progress,completed,cancelled',
            'budget' => 'nullable|numeric',
            'start_date' => 'date',
            'end_date' => 'nullable|date',
            'address' => 'nullable|string|max:255',
        ]);

        $project->update($validated);
        return response()->json($project, 200);
    }

    /**
     * Elimina un proyecto existente
     * 
     * Solo los usuarios con rol 'boss' pueden eliminar proyectos.
     * 
     * @param Request $request Solicitud HTTP
     * @param Project $project Proyecto a eliminar
     * @return JsonResponse Mensaje de confirmación
     * 
     * @OA\Delete(
     *     path="/api/projects/{id}",
     *     summary="Eliminar proyecto",
     *     description="Elimina un proyecto existente. Solo disponible para jefes",
     *     tags={"Projects"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(name="id", in="path", description="ID del proyecto", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Proyecto eliminado"),
     *     @OA\Response(response=403, description="No autorizado"),
     *     @OA\Response(response=404, description="Proyecto no encontrado")
     * )
     */
    public function destroy(Request $request, Project $project): JsonResponse
    {
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'No autorizado. Solo los jefes pueden eliminar proyectos'], 403);
        }

        $project->delete();
        return response()->json(['message' => 'Proyecto eliminado correctamente'], 200);
    }
}
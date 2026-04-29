<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Controlador ProjectController - Gestión de Proyectos
 * * Este controlador gestiona el ciclo de vida completo de los proyectos (CRUD):
 * - Listado paginado o completo.
 * - Creación de nuevos proyectos con validación.
 * - Visualización de detalles y relaciones (tareas).
 * - Actualización y eliminación.
 * * Implementa restricciones de seguridad donde solo los usuarios con el rol 'jefe' 
 * pueden realizar acciones de escritura (POST, PUT, DELETE).
 */
class ProjectController extends Controller
{
    /**
     * Obtiene la lista de todos los proyectos.
     * * Permite alternar entre una lista paginada por defecto (15 elementos)
     * o la lista completa mediante un parámetro de consulta.
     * * @param Request $request Petición que puede contener:
     * - no_paginate: boolean (opcional) para saltar paginación.
     * * @return JsonResponse Lista de proyectos en formato JSON.
     */
    public function index(Request $request): JsonResponse
    {
        // Verificar si se solicita la lista completa sin paginar
        if ($request->query('no_paginate')) {
            return response()->json(Project::all(), 200);
        }
        
        // Retornar proyectos paginados (15 por página por defecto)
        return response()->json(Project::paginate(15), 200);
    }

    /**
     * Crea un nuevo proyecto en el sistema.
     * * Valida que el usuario tenga permisos de jefe y que los datos enviados
     * cumplan con las reglas de negocio antes de persistirlos.
     * * @param Request $request Petición con datos del proyecto:
     * * @return JsonResponse Proyecto creado con código 201 o mensaje de error.
     */
    public function store(Request $request): JsonResponse
    {
        // Control de acceso: solo usuarios con rol de jefe
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'No autorizado. Solo los jefes pueden crear proyectos'], 403);
        }

        // Validación rigurosa de los datos de entrada
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
            // Intenta crear el registro usando asignación masiva protegida por Eloquent
            $project = Project::create($validated);
            return response()->json($project, 201);
        } catch (\Exception $e) {
            // Manejo de errores inesperados durante la inserción
            return response()->json([
                'error' => 'Error al crear el proyecto',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtiene un proyecto específico por su ID.
     * * Utiliza Route Model Binding para inyectar la instancia de Project.
     * Carga automáticamente las tareas relacionadas para dar una vista completa.
     * * @param Project $project Instancia del proyecto inyectada automáticamente por Laravel.
     * * @return JsonResponse Datos del proyecto junto con su relación de tareas.
     */
    public function show(Project $project): JsonResponse
    {
        // Cargar la relación 'tasks' definida en el modelo antes de retornar
        return response()->json($project->load(['tasks']), 200);
    }

    /**
     * Actualiza un proyecto existente.
     * * Solo permite la edición a jefes. La validación es más flexible (campos opcionales)
     * para permitir actualizaciones parciales.
     * * @param Request $request Petición con los campos a modificar.
     * @param Project $project Instancia del proyecto a actualizar.
     * * @return JsonResponse Proyecto actualizado con los nuevos datos.
     */
    public function update(Request $request, Project $project): JsonResponse
    {
        // Verificar permisos de edición
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'No autorizado. Solo los jefes pueden actualizar proyectos'], 403);
        }

        // Validar los campos enviados (no son requeridos para permitir actualizaciones parciales)
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

        // Aplicar los cambios al registro
        $project->update($validated);
        
        return response()->json($project, 200);
    }

    /**
     * Elimina un proyecto del sistema.
     * * Realiza una eliminación definitiva del registro. Solo los jefes pueden eliminar proyectos.
     * * @param Request $request Petición HTTP.
     * @param Project $project Instancia del proyecto a eliminar.
     * * @return JsonResponse Mensaje de confirmación del borrado.
     */
    public function destroy(Request $request, Project $project): JsonResponse
    {
        // Verificar permisos de eliminación
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'No autorizado. Solo los jefes pueden eliminar proyectos'], 403);
        }

        // Ejecutar la eliminación del registro
        $project->delete();
        
        return response()->json(['message' => 'Proyecto eliminado correctamente'], 200);
    }
}
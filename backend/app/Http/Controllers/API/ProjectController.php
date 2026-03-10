<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

/**
 * Controlador encargado de gestionar los proyectos.
 * 
 * Permite listar proyectos, crear nuevos, ver un proyecto concreto,
 * actualizarlo y eliminarlo.
 */
class ProjectController extends Controller
{

    /**
     * Listar todos los proyectos con paginación opcional.
     * 
     * @param Request $request Petición HTTP
     * @return \Illuminate\Http\JsonResponse Listado de proyectos
     */
    public function index(Request $request)
    {
        // Si se pasa el parámetro no_paginate=true, devolver todos sin paginar
        if ($request->query('no_paginate')) {
            return response()->json(Project::all(), 200);
        }

        // Por defecto, paginar con 15 elementos por página
        return response()->json(Project::paginate(15), 200);
    }

    /**
     * Crear un nuevo proyecto.
     * 
     * Solo los usuarios con rol de "jefe" pueden crear proyectos.
     * Valida los datos recibidos desde el cliente y guarda
     * el proyecto en la base de datos.
     *
     * @param Request $request Datos enviados desde el formulario o API
     * @return \Illuminate\Http\JsonResponse Proyecto creado
     */
    public function store(Request $request)
    {
        // Verificar que el usuario tenga rol de jefe
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'Solo los jefes pueden crear proyectos'], 403);
        }

        // VALIDACIÓN DE DATOS
        // Se comprueba que todos los campos tengan el formato correcto
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'budget' => 'nullable|numeric',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        // CREACIÓN DEL PROYECTO
        // Se guarda el proyecto en la base de datos usando Eloquent
        $project = Project::create($validated);

        // Se devuelve el proyecto creado
        return response()->json($project, 201);
    }

    /**
     * Mostrar un proyecto específico.
     * 
     * Devuelve la información de un proyecto concreto junto
     * con sus relaciones (fases, tareas y registros de tiempo).
     *
     * @param Project $project Proyecto solicitado
     * @return \Illuminate\Http\JsonResponse Información del proyecto
     */
    public function show(Project $project)
    {
        // Se cargan también las relaciones del proyecto
        return response()->json(
            $project->load(['phases', 'tasks']),
            200
        );
    }

    /**
     * Actualizar un proyecto existente.
     * 
     * Solo los usuarios con rol de "jefe" pueden actualizar proyectos.
     * Permite modificar los datos de un proyecto ya existente
     * validando previamente la información recibida.
     *
     * @param Request $request Datos enviados para actualizar el proyecto
     * @param Project $project Proyecto que se desea modificar
     * @return \Illuminate\Http\JsonResponse Proyecto actualizado
     */
    public function update(Request $request, Project $project)
    {
        // Verificar que el usuario tenga rol de jefe
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'Solo los jefes pueden actualizar proyectos'], 403);
        }

        // VALIDACIÓN DE DATOS
        $validated = $request->validate([
            'name' => 'string|max:255',
            'type' => 'string|max:255',
            'client_name' => 'string|max:255',
            'description' => 'nullable|string',
            'status' => 'string',
            'budget' => 'nullable|numeric',
            'start_date' => 'date',
            'end_date' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        // ACTUALIZACIÓN DEL PROYECTO
        $project->update($validated);

        // Se devuelve el proyecto actualizado
        return response()->json($project, 200);
    }

    /**
     * Eliminar un proyecto.
     * 
     * Solo los usuarios con rol de "jefe" pueden eliminar proyectos.
     * Borra un proyecto de la base de datos.
     *
     * @param Request $request Petición HTTP del usuario autenticado
     * @param Project $project Proyecto que se desea eliminar
     * @return \Illuminate\Http\JsonResponse Mensaje de confirmación
     */
    public function destroy(Request $request, Project $project)
    {
        // Verificar que el usuario tenga rol de jefe
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'Solo los jefes pueden eliminar proyectos'], 403);
        }

        // Eliminación del proyecto
        $project->delete();

        // Respuesta de confirmación
        return response()->json(['message' => 'Project deleted'], 200);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        if ($request->query('no_paginate')) {
            return response()->json(Project::all(), 200);
        }
        return response()->json(Project::paginate(15), 200);
    }

    public function store(Request $request)
    {
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'Solo los jefes pueden crear proyectos'], 403);
        }

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
                'error' => 'Error de base de datos',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Project $project)
    {
        return response()->json($project->load(['tasks']), 200);
    }

    public function update(Request $request, Project $project)
    {
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'Solo los jefes pueden actualizar proyectos'], 403);
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

    public function destroy(Request $request, Project $project)
    {
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'Solo los jefes pueden eliminar proyectos'], 403);
        }

        $project->delete();
        return response()->json(['message' => 'Project deleted'], 200);
    }
}
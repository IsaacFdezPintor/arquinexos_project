<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Phase;
use Illuminate\Http\Request;

class PhaseController extends Controller
{

    /**
     * Listar todas las fases con paginación opcional.
     * 
     * @param Request $request Petición HTTP
     * @return \Illuminate\Http\JsonResponse Listado de fases
     */
    public function index(Request $request)
    {
        $query = Phase::with(['project', 'tasks']);

        if ($request->query('no_paginate')) {
            return response()->json($query->get(), 200);
        }

        return response()->json($query->paginate(15), 200);
    }

    public function store(Request $request)
    {
        // Verificar que el usuario tenga rol de jefe
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'Solo los jefes pueden crear fases'], 403);
        }

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'estimated_hours' => 'nullable|integer',
            'hourly_rate' => 'nullable|numeric',
            'order' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $phase = Phase::create($validated);
        return response()->json($phase, 201);
    }

    public function show(Phase $phase)
    {
        return response()->json($phase->load(['project', 'tasks']), 200);
    }

    public function update(Request $request, Phase $phase)
    {
        // Verificar que el usuario tenga rol de jefe
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'Solo los jefes pueden actualizar fases'], 403);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'status' => 'string',
            'estimated_hours' => 'nullable|integer',
            'hourly_rate' => 'nullable|numeric',
            'order' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $phase->update($validated);
        return response()->json($phase, 200);
    }

    public function destroy(Request $request, Phase $phase)
    {
        // Verificar que el usuario tenga rol de jefe
        if (!$request->user()->isJefe()) {
            return response()->json(['error' => 'Solo los jefes pueden eliminar fases'], 403);
        }

        $phase->delete();
        return response()->json(['message' => 'Phase deleted'], 200);
    }
}
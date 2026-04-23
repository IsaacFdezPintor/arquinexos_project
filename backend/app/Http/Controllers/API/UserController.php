<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('no_paginate')) {
            return response()->json(User::all(), 200);
        }
        return response()->json(User::paginate(15), 200);
    }

    public function team(Request $request)
    {
        $user = $request->user();
        
        \Log::info(' Petición de equipo', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_role' => $user->role,
            'is_jefe' => $user->isJefe()
        ]);
        
        if (!$user->isJefe()) {
            \Log::warning('Usuario sin permisos para ver equipo', ['user_id' => $user->id]);
            return response()->json(['error' => 'No tienes permisos para ver el equipo'], 403);
        }

        $team = User::where('role', 'worker')
            ->with('tasks')
            ->get();

        \Log::info('Equipo obtenido', ['count' => $team->count()]);

        return response()->json($team, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'nullable|in:boss,worker',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = $validated['role'] ?? 'worker';
        $user = User::create($validated);
        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return response()->json($user->load(['tasks', 'assignedTasks']), 200);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);
        return response()->json($user, 200);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted'], 200);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * Controlador UserController - Gestión de Usuarios 
 * * Este controlador centraliza la administración de los usuarios del sistema.
 * Permite realizar operaciones CRUD y gestionar la visualización del equipo
 * de trabajo para los usuarios con privilegios administrativos.
 */
class UserController extends Controller
{
    /**
     * Obtiene el listado global de usuarios.
     * * Permite devolver la colección completa o paginada según los parámetros
     * de la URL.
     * * @param Request $request Petición que puede contener:
     * * @return \Illuminate\Http\JsonResponse Lista de usuarios en formato JSON.
     */
    public function index(Request $request)
    {
        // Verificar si se solicita el listado total sin límites de página
        if ($request->has('no_paginate')) {
            return response()->json(User::all(), 200);
        }
        
        // Devuelve el listado con paginación estándar de Laravel (15 por página)
        return response()->json(User::paginate(15), 200);
    }

  
    /**
     * Registra un nuevo usuario en la base de datos.
     * * Aplica reglas de validación, cifra la contraseña mediante Hash
     * y asigna un rol por defecto si no se especifica.
     * * @param Request $request Petición con datos: name, email, password y role.
     * * @return \Illuminate\Http\JsonResponse Datos del usuario creado con código 201.
     */
    public function store(Request $request)
    {
        // Validar integridad y unicidad de los datos de entrada
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'nullable|in:boss,worker',
        ]);

        // Encriptar la contraseña antes de guardar
        $validated['password'] = Hash::make($validated['password']);
        
        // Establecer rol por defecto 'worker' si no se provee uno
        $validated['role'] = $validated['role'] ?? 'worker';
        
        // Persistir el nuevo usuario
        $user = User::create($validated);
        
        return response()->json($user, 201);
    }
    
    /**
     * Elimina a un usuario del sistema.
     * * Realiza el borrado del registro en la tabla users.
     * * @param User $user Instancia del usuario a eliminar.
     * * @return \Illuminate\Http\JsonResponse Mensaje de confirmación del borrado.
     */
    public function destroy(User $user)
    {
        // Proceder con la eliminación definitiva
        $user->delete();
        
        return response()->json(['message' => 'User deleted'], 200);
    }
}
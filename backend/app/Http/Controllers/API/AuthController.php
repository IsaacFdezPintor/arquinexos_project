<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Controlador de autenticación de usuarios.
 * 
 * Gestiona el registro, inicio de sesión, obtención del usuario autenticado
 * y cierre de sesión dentro de la API.
 */
class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas.'],
            ]);
        }

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    /**
     * Obtiene el usuario autenticado actualmente.
     * 
     * Esta función devuelve la información del usuario asociado al token
     * utilizado en la petición.
     *
     * @param Request $request Petición HTTP que contiene el token de autenticación
     * @return \Illuminate\Http\JsonResponse Datos del usuario autenticado
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Cierra la sesión del usuario.
     * 
     * Elimina el token de acceso actual para que no pueda seguir
     * utilizándose en futuras peticiones.
     *
     * @param Request $request Petición HTTP con el token del usuario autenticado
     * @return \Illuminate\Http\JsonResponse Mensaje de confirmación
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Sesión cerrada'], 200);
    }

     public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:worker,boss',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'token' => $token,
            'user' => $user,
        ], 201);
    }
}
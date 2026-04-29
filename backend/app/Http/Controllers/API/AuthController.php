<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Controlador AuthController - Autenticación de Usuarios
 * 
 * Gestiona todas las operaciones de autenticación:
 * - Registro de nuevos usuarios
 * - Inicio de sesión
 * - Obtención del usuario autenticado
 * - Cierre de sesión
 * 
 * Utiliza Laravel Sanctum para tokens de autenticación sin estado (stateless).
 * 
 */
class AuthController extends Controller
{
    /**
     * Inicia sesión de un usuario con email y contraseña.
     * 
     * Valida las credenciales del usuario, verifica que sean correctas
     * y genera un token de acceso para autenticar futuras peticiones.
     * 
     * @param Request $request Petición que contiene:
     *                          - email: string 
     *                          - password: string 
     * 
     * @return JsonResponse Devuelve un JSON con:
     *                      - token: Token de acceso para futuras peticiones
     *                      - user: Datos del usuario autenticado
     * 
     * @throws ValidationException Si las credenciales son incorrectas
     */
    public function login(Request $request)
    {
        // Validar que los datos requeridos estén presentes y sean válidos
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Buscar al usuario por email en la base de datos
        $user = User::where('email', $validated['email'])->first();

        // Verificar que el usuario existe y la contraseña es correcta
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas.'],
            ]);
        }

        // Generar un token único para este usuario
        $token = $user->createToken('web')->plainTextToken;

        // Retornar el token y los datos del usuario
        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    /**
     * Obtiene el usuario autenticado actualmente.
     * 
     * Requiere autenticación. Devuelve la información del usuario
     * asociado al token utilizado en la petición.
     * 
     * @param Request $request Petición HTTP (debe incluir token válido)
     * 
     * @return JsonResponse Datos del usuario autenticado
     */
    public function me(Request $request)
    {
        // Devuelve el usuario del request (inyectado por middleware de autenticación)
        return response()->json($request->user());
    }

    /**
     * Cierra la sesión del usuario.
     * 
     * Elimina el token de acceso actual para que no pueda utilizarse
     * en futuras peticiones. Requiere autenticación.
     * 
     * @param Request $request Petición HTTP (debe incluir token válido)
     * 
     * @return JsonResponse Mensaje de confirmación de cierre de sesión
     */
    public function logout(Request $request)
    {
        // Obtener el usuario autenticado del request
        $user = $request->user();

        // Verificar que existe un usuario y un token activo
        if ($user && $user->currentAccessToken()) {
            // Eliminar el token actual, eliminando el acceso
            $user->currentAccessToken()->delete();
        }

        // Devuelve mensaje de confirmación
        return response()->json(['message' => 'Sesión cerrada'], 200);
    }
    /**
     * Registra un nuevo usuario en el sistema.
     * * Crea un nuevo registro de usuario, le asigna un rol y 
     * devuelve un token de acceso automático.
     * * @param Request $request Petición con: name, email, password, role
     * @return JsonResponse Datos del usuario y token (Status 201)
     */
    public function register(Request $request)
    {
        // 1. Validar la entrada 
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['nullable', 'string'], 
        ]);

        // 2. Crear el usuario en la BD
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'worker', // Valor por defecto si no viene en el request
        ]);

        // 3. Generar el token (Igual que en el login)
        $token = $user->createToken('web')->plainTextToken;

        // 4. Retornar respuesta con código 201 (Creado)
        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }
}
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthController extends Controller
{
    /**
     * Handle admin login request.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if (Auth::guard('admin')->attempt($credentials)) {
            $request->session()->regenerate();

            /** @var Admin $admin */
            $admin = Auth::guard('admin')->user();

            return response()->json([
                'message' => 'Login admin berhasil.',
                'admin' => [
                    'admin_id' => $admin->admin_id,
                    'username' => $admin->username,
                ],
            ]);
        }

        return response()->json([
            'message' => 'Username atau password admin salah.',
        ], 401);
    }

    /**
     * Get currently logged-in admin data.
     */
    public function me(): JsonResponse
    {
        /** @var Admin|null $admin */
        $admin = Auth::guard('admin')->user();

        return response()->json([
            'admin' => $admin ? [
                'admin_id' => $admin->admin_id,
                'username' => $admin->username,
            ] : null,
        ]);
    }

    /**
     * Handle admin logout request.
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('admin')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout admin berhasil.',
        ]);
    }
}

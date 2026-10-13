<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GameAdminController extends Controller
{
    /**
     * Display a listing of games along with their email template configuration.
     */
    public function index(): JsonResponse
    {
        $games = Game::withCount([
            'accounts as total_accounts_count',
            'accounts as available_accounts_count' => function ($query): void {
                $query->where('status', 'tersedia');
            },
        ])->get();

        return response()->json($games);
    }

    /**
     * Display the specified game configuration.
     */
    public function show(int $game_id): JsonResponse
    {
        $game = Game::findOrFail($game_id);

        return response()->json($game);
    }

    /**
     * Update game settings and email template.
     */
    public function update(Request $request, int $game_id): JsonResponse
    {
        $game = Game::findOrFail($game_id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'webmail_url' => 'nullable|string|max:255',
            'guide_url' => 'nullable|string|max:255',
            'email_template' => 'nullable|string',
        ]);

        $game->update($validated);

        return response()->json([
            'message' => 'Konfigurasi game dan template email berhasil disimpan.',
            'game' => $game,
        ]);
    }
}

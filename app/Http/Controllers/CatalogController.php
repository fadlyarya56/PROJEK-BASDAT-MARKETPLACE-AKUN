<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Account;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index()
    {
        // Mengambil data kategori game
        $games = Game::select('game_id', 'name')->get();

        // Mengambil daftar akun yang statusnya 'tersedia'
        $accounts = Account::select('account_id', 'game_id', 'title', 'price', 'image_url', 'description', 'status')
            ->where('status', 'tersedia')
            ->get();

        // Mengirim data langsung sebagai Props ke React Catalog.tsx
        return Inertia::render('Catalog', [
            'games' => $games,
            'accounts' => $accounts,
        ]);
    }
}
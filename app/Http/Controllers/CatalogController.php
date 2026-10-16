<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Game;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index()
    {
        // Mengambil data kategori game
        $games = Game::select('game_id', 'name')->get();

        // Mengambil daftar akun yang statusnya 'tersedia' dengan relasi game, images, dan is_hot
        $accounts = Account::with('game')
            ->where('status', 'tersedia')
            ->latest('account_id')
            ->get();

        // Mengirim data langsung sebagai Props ke React Catalog.tsx
        return Inertia::render('Catalog', [
            'games' => $games,
            'accounts' => $accounts,
        ]);
    }

    public function show($account_id)
    {
        $account = Account::with('game')->findOrFail($account_id);

        $relatedAccounts = Account::with('game')
            ->where('game_id', $account->game_id)
            ->where('account_id', '!=', $account->account_id)
            ->where('status', 'tersedia')
            ->latest('account_id')
            ->take(4)
            ->get();

        return Inertia::render('AccountDetail', [
            'account' => $account,
            'relatedAccounts' => $relatedAccounts,
        ]);
    }
}

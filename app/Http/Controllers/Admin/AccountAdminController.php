<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AccountAdminController extends Controller
{
    /**
     * Display a listing of accounts for admin dashboard.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Account::with('game')->latest('account_id');

        if ($request->filled('game_id')) {
            $query->where('game_id', $request->query('game_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $rawSearch = trim($request->query('search'));
            $searchTerm = '%'.$rawSearch.'%';
            $numericId = preg_replace('/[^0-9]/', '', $rawSearch);

            $query->where(function ($subQuery) use ($searchTerm, $numericId) {
                if (! empty($numericId)) {
                    $subQuery->orWhere('account_id', $numericId);
                }
                $subQuery->orWhere('title', 'like', $searchTerm)
                    ->orWhere('description', 'like', $searchTerm)
                    ->orWhere('account_email', 'like', $searchTerm);
            });
        }

        $accounts = $query->paginate(20);

        return response()->json($accounts);
    }

    /**
     * Store a newly created account in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'game_id' => 'required|integer|exists:games,game_id',
            'title' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'account_email' => 'required|string|max:255',
            'email_password' => 'required|string|max:255',
            'game_password' => 'required|string|max:255',
            'is_hot' => 'nullable|boolean',
            'image' => 'nullable|image|max:4096',
            'images.*' => 'nullable|image|max:4096',
        ]);

        $imagePath = null;
        $imagesPaths = [];

        // Upload multiple images jika ada
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $imagesPaths[] = $file->store('accounts', 'public');
            }
        }

        // Upload single image (jika diunggah)
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('accounts', 'public');
            if (empty($imagesPaths)) {
                $imagesPaths[] = $imagePath;
            }
        } elseif (! empty($imagesPaths)) {
            $imagePath = $imagesPaths[0];
        }

        $account = Account::create([
            'game_id' => $validated['game_id'],
            'title' => $validated['title'],
            'price' => $validated['price'],
            'description' => $validated['description'] ?? null,
            'image_url' => $imagePath,
            'images' => ! empty($imagesPaths) ? $imagesPaths : null,
            'is_hot' => $request->boolean('is_hot'),
            'account_email' => $validated['account_email'],
            'email_password' => $validated['email_password'],
            'game_password' => $validated['game_password'],
            'status' => 'tersedia',
        ]);

        $account->makeVisible(['account_email', 'email_password', 'game_password']);

        return response()->json([
            'message' => 'Stok akun game berhasil ditambahkan.',
            'account' => $account,
        ], 201);
    }

    /**
     * Display the specified account detail including credentials for admin.
     */
    public function show(int $account_id): JsonResponse
    {
        $account = Account::with('game')->findOrFail($account_id);
        $account->makeVisible(['account_email', 'email_password', 'game_password']);

        return response()->json($account);
    }

    /**
     * Update the specified account in storage.
     */
    public function update(Request $request, int $account_id): JsonResponse
    {
        $account = Account::findOrFail($account_id);

        $validated = $request->validate([
            'game_id' => 'sometimes|required|integer|exists:games,game_id',
            'title' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'description' => 'nullable|string',
            'account_email' => 'sometimes|required|string|max:255',
            'email_password' => 'sometimes|required|string|max:255',
            'game_password' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|in:tersedia,tertunda,terjual',
            'is_hot' => 'nullable|boolean',
            'image' => 'nullable|image|max:4096',
            'images.*' => 'nullable|image|max:4096',
        ]);

        // Multiple images upload
        if ($request->hasFile('images')) {
            $imagesPaths = [];
            foreach ($request->file('images') as $file) {
                $imagesPaths[] = $file->store('accounts', 'public');
            }
            $validated['images'] = $imagesPaths;
            if (empty($validated['image_url']) && ! empty($imagesPaths)) {
                $validated['image_url'] = $imagesPaths[0];
            }
        }

        if ($request->hasFile('image')) {
            if ($account->image_url && Storage::disk('public')->exists($account->image_url)) {
                Storage::disk('public')->delete($account->image_url);
            }
            $validated['image_url'] = $request->file('image')->store('accounts', 'public');
        }

        if ($request->has('is_hot')) {
            $validated['is_hot'] = $request->boolean('is_hot');
        }

        $account->update($validated);
        $account->makeVisible(['account_email', 'email_password', 'game_password']);

        return response()->json([
            'message' => 'Data akun game berhasil diperbarui.',
            'account' => $account->fresh(['game']),
        ]);
    }

    /**
     * Toggle status hot item pada akun.
     */
    public function toggleHot(int $account_id): JsonResponse
    {
        $account = Account::findOrFail($account_id);
        $account->update(['is_hot' => ! $account->is_hot]);

        return response()->json([
            'message' => 'Status Hot Item berhasil diperbarui.',
            'is_hot' => $account->is_hot,
        ]);
    }

    /**
     * Remove the specified account from storage.
     */
    public function destroy(int $account_id): JsonResponse
    {
        $account = Account::findOrFail($account_id);

        if ($account->status === 'terjual') {
            return response()->json([
                'message' => 'Akun yang sudah terjual tidak dapat dihapus untuk menjaga integritas data riwayat pesanan.',
            ], 422);
        }

        if ($account->image_url && Storage::disk('public')->exists($account->image_url)) {
            Storage::disk('public')->delete($account->image_url);
        }

        $account->delete();

        return response()->json([
            'message' => 'Akun berhasil dihapus.',
        ]);
    }
}

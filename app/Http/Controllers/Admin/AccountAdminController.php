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

        $accounts = $query->paginate(15);
        $accounts->getCollection()->each(function ($account) {
            $account->makeVisible(['account_email', 'email_password', 'game_password']);
        });

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

        $newUploadedPaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $newUploadedPaths[] = $file->store('accounts', 'public');
            }
        } elseif ($request->hasFile('image')) {
            $newUploadedPaths[] = $request->file('image')->store('accounts', 'public');
        }

        $finalImages = [];
        if ($request->filled('images_manifest')) {
            $manifest = json_decode($request->input('images_manifest'), true);
            if (is_array($manifest)) {
                foreach ($manifest as $item) {
                    if (($item['type'] ?? '') === 'new' && isset($item['new_index'])) {
                        $idx = (int) $item['new_index'];
                        if (isset($newUploadedPaths[$idx])) {
                            $finalImages[] = $newUploadedPaths[$idx];
                        }
                    }
                }
            }
        }
        if (empty($finalImages)) {
            $finalImages = $newUploadedPaths;
        }

        $account = Account::create([
            'game_id' => $validated['game_id'],
            'title' => $validated['title'],
            'price' => $validated['price'],
            'description' => $validated['description'] ?? null,
            'image_url' => ! empty($finalImages) ? $finalImages[0] : null,
            'images' => ! empty($finalImages) ? $finalImages : null,
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
            'images_manifest' => 'nullable|string',
            'image' => 'nullable|image|max:4096',
            'images.*' => 'nullable|image|max:4096',
        ]);

        $newUploadedPaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $newUploadedPaths[] = $file->store('accounts', 'public');
            }
        } elseif ($request->hasFile('image')) {
            $newUploadedPaths[] = $request->file('image')->store('accounts', 'public');
        }

        if ($request->has('images_manifest')) {
            $finalImages = [];
            $manifest = json_decode($request->input('images_manifest'), true);
            if (is_array($manifest)) {
                foreach ($manifest as $item) {
                    if (($item['type'] ?? '') === 'existing' && ! empty($item['path'])) {
                        $finalImages[] = $item['path'];
                    } elseif (($item['type'] ?? '') === 'new' && isset($item['new_index'])) {
                        $idx = (int) $item['new_index'];
                        if (isset($newUploadedPaths[$idx])) {
                            $finalImages[] = $newUploadedPaths[$idx];
                        }
                    }
                }
            }

            // Hapus file foto lama dari storage disk jika admin menghapusnya dari daftar
            $oldImages = is_array($account->images) ? $account->images : ($account->image_url ? [$account->image_url] : []);
            foreach ($oldImages as $oldImg) {
                if (! in_array($oldImg, $finalImages)) {
                    if (Storage::disk('public')->exists($oldImg)) {
                        Storage::disk('public')->delete($oldImg);
                    }
                }
            }

            $validated['images'] = ! empty($finalImages) ? $finalImages : null;
            $validated['image_url'] = ! empty($finalImages) ? $finalImages[0] : null;
        } elseif (! empty($newUploadedPaths)) {
            $validated['images'] = $newUploadedPaths;
            $validated['image_url'] = $newUploadedPaths[0];
        }

        if ($request->has('is_hot')) {
            $validated['is_hot'] = $request->boolean('is_hot');
        }

        if (isset($validated['status'])) {
            if ($validated['status'] === 'terjual') {
                $validated['sold_at'] = $account->sold_at ?: now();
            } elseif ($validated['status'] === 'tersedia') {
                $validated['sold_at'] = null;
            }
        }

        // Jangan hapus password atau email jika tidak sengaja terkirim kosong
        if (array_key_exists('account_email', $validated) && empty($validated['account_email'])) {
            unset($validated['account_email']);
        }
        if (array_key_exists('email_password', $validated) && empty($validated['email_password'])) {
            unset($validated['email_password']);
        }
        if (array_key_exists('game_password', $validated) && empty($validated['game_password'])) {
            unset($validated['game_password']);
        }

        $account->update($validated);
        $account->makeVisible(['account_email', 'email_password', 'game_password']);

        return response()->json([
            'message' => 'Data akun game berhasil diperbarui.',
            'account' => $account->fresh(['game']),
        ]);
    }

    /**
     * Mengubah status akun secara langsung (tersedia <-> terjual <-> tertunda).
     */
    public function toggleStatus(Request $request, int $account_id): JsonResponse
    {
        $account = Account::findOrFail($account_id);

        $targetStatus = $request->input('status');
        if (! in_array($targetStatus, ['tersedia', 'terjual', 'tertunda'])) {
            $targetStatus = ($account->status === 'tersedia') ? 'terjual' : 'tersedia';
        }

        $updateData = ['status' => $targetStatus];
        if ($targetStatus === 'terjual') {
            $updateData['sold_at'] = $account->sold_at ?: now();
        } elseif ($targetStatus === 'tersedia') {
            $updateData['sold_at'] = null;
        }

        $account->update($updateData);

        return response()->json([
            'message' => 'Status akun #'.$account->account_id.' berhasil diubah menjadi '.strtoupper($targetStatus).'.',
            'status' => $account->status,
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

        $hasActiveOrder = $account->orders()->whereIn('status', ['menunggu', 'menunggu_konfirmasi'])->exists();
        if ($hasActiveOrder) {
            return response()->json([
                'message' => 'Akun sedang dalam proses pesanan aktif (menunggu pembayaran/verifikasi). Harap selesaikan atau batalkan pesanan terlebih dahulu sebelum menghapus.',
            ], 422);
        }

        try {
            $imagesToDelete = is_array($account->images) ? $account->images : ($account->image_url ? [$account->image_url] : []);
            foreach ($imagesToDelete as $img) {
                if ($img && Storage::disk('public')->exists($img)) {
                    Storage::disk('public')->delete($img);
                }
            }

            $account->delete();

            return response()->json([
                'message' => 'Akun #'.$account->account_id.' berhasil dihapus dari stok.',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Gagal menghapus akun: '.$e->getMessage(),
            ], 500);
        }
    }
}

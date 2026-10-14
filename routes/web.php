<?php

use App\Http\Controllers\Admin\AccountAdminController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\GameAdminController;
use App\Http\Controllers\Admin\PaymentAdminController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\OrderController;
use App\Models\Account;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Sisi Pembeli (Buyer & Catalog)
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/katalog', [CatalogController::class, 'index'])->name('catalog');

Route::get('/checkout', function () {
    return Inertia::render('Checkout');
});

Route::post('/checkout', [OrderController::class, 'store']);

Route::get('/order-status', [OrderController::class, 'status']);

Route::post('/orders/{order_id}/payment', [OrderController::class, 'storePayment']);

/*
|--------------------------------------------------------------------------
| Sisi Admin (Payment, Catalog Admin, & Settings)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {
    // 1. Route PUBLIK (Bisa diakses tanpa login)
    Route::post('/login', [AdminAuthController::class, 'login']);

    // 2. Route PRIVATE (Wajib login auth:admin)
    Route::middleware('auth:admin')->group(function () {
        // Auth Admin
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);

        // Ringkasan Dashboard & Audit Log Basdat
        Route::get('/dashboard-stats', function () {
            return response()->json([
                'pending_payments' => Payment::where('status', 'menunggu')->count(),
                'confirmed_payments' => Payment::where('status', 'dikonfirmasi')->count(),
                'rejected_payments' => Payment::where('status', 'ditolak')->count(),
                'available_accounts' => Account::where('status', 'tersedia')->count(),
                'sold_accounts' => Account::where('status', 'terjual')->count(),
                'total_revenue' => DB::table('payments')
                    ->join('orders', 'payments.order_id', '=', 'orders.order_id')
                    ->join('accounts', 'orders.account_id', '=', 'accounts.account_id')
                    ->where('payments.status', 'dikonfirmasi')
                    ->sum('accounts.price'),
            ]);
        });

        Route::get('/status-logs', function () {
            return response()->json(
                DB::table('status_logs')
                    ->join('accounts', 'status_logs.account_id', '=', 'accounts.account_id')
                    ->select('status_logs.*', 'accounts.title as account_title')
                    ->latest('changed_at')
                    ->limit(50)
                    ->get()
            );
        });

        // Verifikasi Pembayaran & Kirim Ulang Email
        Route::get('/payments', [PaymentAdminController::class, 'index']);
        Route::post('/payments/{payment_id}/approve', [PaymentAdminController::class, 'approve']);
        Route::post('/payments/{payment_id}/reject', [PaymentAdminController::class, 'reject']);
        Route::post('/orders/{order_id}/resend-email', [PaymentAdminController::class, 'resendEmail']);

        // Kelola Stok Akun Game (CRUD Admin)
        Route::get('/accounts', [AccountAdminController::class, 'index']);
        Route::post('/accounts', [AccountAdminController::class, 'store']);
        Route::get('/accounts/{account_id}', [AccountAdminController::class, 'show']);
        Route::post('/accounts/{account_id}', [AccountAdminController::class, 'update']);
        Route::put('/accounts/{account_id}', [AccountAdminController::class, 'update']);
        Route::delete('/accounts/{account_id}', [AccountAdminController::class, 'destroy']);

        // Kelola Game & Template Email
        Route::get('/games', [GameAdminController::class, 'index']);
        Route::get('/games/{game_id}', [GameAdminController::class, 'show']);
        Route::put('/games/{game_id}', [GameAdminController::class, 'update']);
    });
});

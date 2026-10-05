<?php
// Tambahkan ke routes/web.php atau routes/api.php (sesuaikan middleware auth-nya)

use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Admin\PaymentAdminController;

// Sisi buyer
Route::post('/orders/{order_id}/payment', [PaymentController::class, 'store']);

// Sisi admin (sebaiknya dibungkus middleware auth:admin)
Route::middleware('auth:admin')->prefix('admin')->group(function () {
    Route::get('/payments', [PaymentAdminController::class, 'index']);
    Route::post('/payments/{payment_id}/approve', [PaymentAdminController::class, 'approve']);
    Route::post('/payments/{payment_id}/reject', [PaymentAdminController::class, 'reject']);
});

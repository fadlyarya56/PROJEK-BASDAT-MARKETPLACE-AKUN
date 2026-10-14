<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\OrderController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::post('/orders/{order_id}/payment', [OrderController::class, 'storePayment']);

// Ubah baris ini agar mengarahkan ke halaman Catalog
Route::get('/katalog', [CatalogController::class, 'index'])->name('catalog');

Route::get('/checkout', function () {
    return Inertia::render('Checkout');
});

// Route  untuk Checkout
Route::post('/checkout', [OrderController::class, 'store']);

// Route baru untuk Cek Status Pesanan
Route::get('/order-status', [OrderController::class, 'status']);

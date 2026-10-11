<?php

use App\Models\Account;
use App\Models\Admin;
use App\Models\Buyer;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Mail;

// Matikan RefreshDatabase untuk file ini agar tabel db_game tidak di-wipe
uses()->group('payment');

test('panggilan approve kedua pada payment yang sama harus menghasilkan error 409', function () {
    Mail::fake();

    $admin = Admin::first();
    $account = Account::where('status', 'tersedia')->first();
    $account->update(['status' => 'tertunda']);

    $buyer = Buyer::firstOrCreate(
        ['email' => 'buyer_test@example.com'],
        ['name' => 'Buyer Test', 'phone' => '08123456789']
    );

    $order = Order::create([
        'buyer_id' => $buyer->buyer_id,
        'account_id' => $account->account_id,
        'delivery_email' => 'buyer_test@example.com',
        'status' => 'menunggu_konfirmasi',
    ]);

    $payment = Payment::create([
        'order_id' => $order->order_id,
        'method' => 'QRIS',
        'proof_image' => 'dummy.jpg',
        'status' => 'menunggu',
    ]);

    // Panggilan PERTAMA: Sukses (200 OK)
    $response1 = $this->actingAs($admin, 'admin')
        ->postJson("/admin/payments/{$payment->payment_id}/approve");

    $response1->assertOk();
    expect($account->fresh()->status)->toBe('terjual');

    // Panggilan KEDUA: Ditolak (409 Conflict)
    $response2 = $this->actingAs($admin, 'admin')
        ->postJson("/admin/payments/{$payment->payment_id}/approve");

    $response2->assertStatus(409);
});

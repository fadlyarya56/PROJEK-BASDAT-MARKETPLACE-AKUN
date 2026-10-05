<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\AccountDelivered;
use App\Models\Account;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class PaymentAdminController extends Controller
{
    /**
     * List semua payment yang masih menunggu konfirmasi admin.
     */
    public function index()
    {
        $payments = Payment::with(['order.account.game', 'order.buyer'])
            ->where('status', 'menunggu')
            ->whereHas('order', fn ($q) => $q->where('status', 'menunggu_konfirmasi'))
            ->latest('created_at')
            ->get();

        return response()->json($payments);
    }

    /**
     * Admin approve pembayaran.
     * Update payment -> order -> account dalam satu transaction.
     * status_logs keisi otomatis lewat trigger MySQL (after_account_status_update).
     */
    public function approve(Request $request, $payment_id)
    {
        $result = DB::transaction(function () use ($payment_id) {
            $payment = Payment::with('order')->findOrFail($payment_id);
            $order = $payment->order;

            // Lock baris akun biar gak ke-update bersamaan dari proses lain
            $account = Account::where('account_id', $order->account_id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($account->status === 'terjual') {
                abort(409, 'Akun ini sudah berstatus terjual sebelumnya.');
            }

            $payment->update([
                'status'       => 'dikonfirmasi',
                'confirmed_by' => Auth::guard('admin')->id(),
                'confirmed_at' => now(),
            ]);

            $order->update(['status' => 'valid']);

            // Trigger di MySQL otomatis insert ke status_logs saat baris ini berubah
            $account->update([
                'status'  => 'terjual',
                'sold_at' => now(),
            ]);

            return $order->fresh(['account.game', 'buyer']);
        });

        Mail::to($result->delivery_email)->send(new AccountDelivered($result->account));

        return response()->json([
            'message' => 'Pembayaran dikonfirmasi, akun terkirim ke email pembeli.',
        ]);
    }

    /**
     * Admin reject pembayaran.
     * Akun dilepas lagi jadi 'tersedia' biar bisa dibeli orang lain.
     */
    public function reject(Request $request, $payment_id)
    {
        DB::transaction(function () use ($payment_id) {
            $payment = Payment::with('order')->findOrFail($payment_id);
            $order = $payment->order;

            $payment->update([
                'status'       => 'ditolak',
                'confirmed_by' => Auth::guard('admin')->id(),
                'confirmed_at' => now(),
            ]);

            $order->update(['status' => 'ditolak']);

            Account::where('account_id', $order->account_id)
                ->update(['status' => 'tersedia']);
        });

        return response()->json([
            'message' => 'Pembayaran ditolak, akun kembali tersedia.',
        ]);
    }
}

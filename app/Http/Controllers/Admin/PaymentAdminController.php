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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PaymentAdminController extends Controller
{
    /**
     * List semua payment yang masih menunggu konfirmasi admin.
     */
    public function index(Request $request)
    {
        $status = $request->query('status'); // misal: menunggu, dikonfirmasi, ditolak, atau null (semua)
        $query = Payment::with(['order.account.game', 'order.buyer', 'confirmedBy'])
            ->latest('created_at');
        if ($status && in_array($status, ['menunggu', 'dikonfirmasi', 'ditolak'])) {
            $query->where('status', $status);
        }

        if ($request->filled('search')) {
            $search = trim($request->query('search'));
            $cleanOrderId = preg_replace('/[^0-9]/', '', $search);

            $query->where(function ($q) use ($search, $cleanOrderId) {
                if (! empty($cleanOrderId)) {
                    $q->orWhere('order_id', $cleanOrderId);
                }
                $q->orWhereHas('order', function ($orderQuery) use ($search) {
                    $orderQuery->where('delivery_email', 'like', "%{$search}%")
                        ->orWhereHas('account', function ($accountQuery) use ($search) {
                            $accountQuery->where('title', 'like', "%{$search}%");
                        });
                });
            });
        }

        $payments = $query->paginate(15);

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
            $account = Account::where('account_id', $order->account_id)
                ->lockForUpdate()
                ->firstOrFail();
            if ($account->status === 'terjual') {
                abort(409, 'Akun ini sudah berstatus terjual sebelumnya.');
            }
            $payment->update([
                'status' => 'dikonfirmasi',
                'confirmed_by' => Auth::guard('admin')->id(),
                'confirmed_at' => now(),
            ]);
            $order->update(['status' => 'valid']);
            $account->update([
                'status' => 'terjual',
                'sold_at' => now(),
            ]);

            return $order->fresh(['account.game', 'buyer']);
        });
        // Kirim email dengan penanganan error
        $emailSent = false;
        $emailErrorMessage = null;
        try {
            Mail::to($result->delivery_email)->send(new AccountDelivered($result->account));
            $emailSent = true;
        } catch (\Throwable $e) {
            Log::error("SMTP Error saat approve payment #{$payment_id} (Order #{$result->order_id}): ".$e->getMessage(), [
                'exception' => $e,
                'delivery_email' => $result->delivery_email,
            ]);
            $emailErrorMessage = $e->getMessage();
        }

        return response()->json([
            'message' => $emailSent
                ? 'Pembayaran dikonfirmasi, akun berhasil terkirim ke email pembeli.'
                : 'Pembayaran dikonfirmasi, namun email gagal terkirim karena kendala SMTP. Silakan gunakan tombol "Kirim Ulang Email".',
            'email_sent' => $emailSent,
            'order_id' => $result->order_id,
        ]);
    }

    /**
     * Admin mengirim ulang email data akun ke pembeli.
     */
    public function resendEmail(Request $request, $order_id)
    {
        $order = Order::with(['account.game'])->findOrFail($order_id);

        if ($order->status !== 'valid' || ! $order->account) {
            return response()->json([
                'message' => 'Email hanya dapat dikirim ulang untuk pesanan yang sudah berstatus valid.',
            ], 422);
        }

        try {
            Mail::to($order->delivery_email)->send(new AccountDelivered($order->account));

            return response()->json([
                'message' => "Email berhasil dikirim ulang ke {$order->delivery_email}.",
            ]);
        } catch (\Throwable $e) {
            Log::error("SMTP Error saat resend email order #{$order_id}: ".$e->getMessage());

            return response()->json([
                'message' => 'Gagal mengirim email: '.$e->getMessage(),
            ], 500);
        }
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
                'status' => 'ditolak',
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

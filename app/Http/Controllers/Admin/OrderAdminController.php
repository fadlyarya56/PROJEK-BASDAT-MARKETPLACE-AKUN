<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderAdminController extends Controller
{
    /**
     * Tampilkan riwayat semua pesanan beserta relasi buyer, account.game, payment, dan statusLogs (audit trail).
     */
    public function index(Request $request)
    {
        $status = $request->query('status');
        $search = trim((string) $request->query('search'));

        $query = Order::with([
            'buyer',
            'account.game',
            'payment.confirmedBy',
            'statusLogs',
        ])->latest('order_id');

        if ($status && in_array($status, ['menunggu', 'menunggu_konfirmasi', 'valid', 'ditolak'])) {
            $query->where('status', $status);
        }

        if (! empty($search)) {
            $cleanOrderId = preg_replace('/[^0-9]/', '', $search);
            $query->where(function ($q) use ($search, $cleanOrderId) {
                if (! empty($cleanOrderId)) {
                    $q->orWhere('order_id', $cleanOrderId);
                }
                $q->orWhere('delivery_email', 'like', "%{$search}%")
                    ->orWhereHas('buyer', function ($buyerQuery) use ($search) {
                        $buyerQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('account', function ($accountQuery) use ($search) {
                        $accountQuery->where('title', 'like', "%{$search}%")
                            ->orWhereHas('game', function ($gameQuery) use ($search) {
                                $gameQuery->where('name', 'like', "%{$search}%");
                            });
                    });
            });
        }

        $orders = $query->paginate(15);

        return response()->json($orders);
    }
}

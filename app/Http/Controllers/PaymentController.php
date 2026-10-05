<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Buyer upload bukti transfer untuk satu order.
     * Order harus berstatus 'menunggu' sebelum bisa upload bukti.
     */
    public function store(Request $request, $order_id)
    {
        $validated = $request->validate([
            'method'      => 'required|string|max:255', // misal: "Transfer BCA", "QRIS"
            'proof_image' => 'required|image|max:4096',  // max 4MB
        ]);

        $order = Order::findOrFail($order_id);

        if ($order->status !== 'menunggu') {
            return response()->json([
                'message' => 'Order ini sudah diproses sebelumnya.',
            ], 422);
        }

        $path = $request->file('proof_image')->store('bukti-transfer', 'public');

        DB::transaction(function () use ($order, $validated, $path) {
            Payment::create([
                'order_id'    => $order->order_id,
                'method'      => $validated['method'],
                'proof_image' => $path,
                'status'      => 'menunggu',
            ]);

            $order->update(['status' => 'menunggu_konfirmasi']);
        });

        return response()->json([
            'message' => 'Bukti transfer berhasil dikirim, menunggu konfirmasi admin.',
        ]);
    }
}

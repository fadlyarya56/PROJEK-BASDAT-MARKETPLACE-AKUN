<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Buyer;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function status(Request $request)
    {
        $search = $request->query('search');
        $order = null;

        if ($search) {
            // Menghilangkan awalan ORD- jika pembeli mengetik ORD-1
            $cleanSearch = preg_replace('/[^0-9]/', '', $search);

            $order = Order::with(['account.game', 'payment'])
                ->where('order_id', $cleanSearch)
                ->orWhere('delivery_email', $search)
                ->first();

            if ($order && $order->status === 'valid' && $order->account) {
                $order->account->makeVisible(['account_email', 'email_password', 'game_password']);
            }
        }

        return Inertia::render('OrderStatus', [
            'order' => $order,
            'searchQuery' => $search ?? '',
        ]);
    }

    public function store(Request $request)
    {
        // Validasi input dari form checkout
        $request->validate([
            'account_id' => 'required|exists:accounts,account_id',
            'delivery_email' => 'required|email',
            'payment_method' => 'required',
            'proof_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // 1. Buat atau cari data Buyer berdasarkan email
        $buyer = Buyer::firstOrCreate(
            ['email' => $request->delivery_email],
            ['name' => 'Pembeli '.rand(100, 999)]
        );

        // 2. Simpan Data Pesanan Baru
        $order = Order::create([
            'buyer_id' => $buyer->buyer_id,
            'account_id' => $request->account_id,
            'delivery_email' => $request->delivery_email,
            'status' => 'menunggu_konfirmasi',
        ]);

        // Lock akun menjadi 'tertunda' agar tidak bisa di-checkout pembeli lain
        Account::where('account_id', $request->account_id)->update(['status' => 'tertunda']);

        // 3. Upload Gambar Bukti Pembayaran (jika ada)
        $imagePath = null;
        if ($request->hasFile('proof_image')) {
            $imagePath = $request->file('proof_image')->store('payments', 'public');
        }

        // 4. Simpan Data Pembayaran
        Payment::create([
            'order_id' => $order->order_id,
            'method' => $request->payment_method,
            'proof_image' => $imagePath,
            'status' => 'menunggu',
        ]);

        // Redirect langsung ke halaman Lacak Pesanan dengan memasukkan order_id
        return redirect()->to('/order-status?search=ORD-'.$order->order_id);
    }

    public function storePayment(Request $request, $order_id)
    {
        // 1. Validasi input
        $request->validate([
            'delivery_email' => 'required|email',
            'method' => 'required|string',
            'proof_image' => 'required|image|mimes:jpeg,png,jpg|max:4096',
        ]);

        // 2. Simpan gambar bukti transfer
        $path = $request->file('proof_image')->store('payments', 'public');

        // 3. Simpan data ke tabel Payment
        Payment::updateOrCreate(
            ['order_id' => $order_id],
            ['method' => $request->input('method'), 'proof_image' => $path, 'status' => 'menunggu']
        );

        // 4. Update status Order & email
        $order = Order::findOrFail($order_id);
        $order->update([
            'delivery_email' => $request->delivery_email,
            'status' => 'menunggu_konfirmasi',
        ]);

        return redirect()->to('/order-status?search=ORD-'.$order_id);
    }
}

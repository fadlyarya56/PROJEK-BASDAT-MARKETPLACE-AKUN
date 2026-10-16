import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';

interface AccountData {
    account_id: number;
    title: string;
    price: number;
    account_email: string;
    email_password: string;
    game_password: string;
    game?: {
        name: string;
    };
}

interface PaymentData {
    method: string;
    status: string;
}

interface OrderData {
    order_id: number;
    delivery_email: string;
    status: 'menunggu' | 'menunggu_konfirmasi' | 'valid' | 'ditolak';
    created_at: string;
    account?: AccountData;
    payment?: PaymentData;
}

interface OrderStatusProps {
    order: OrderData | null;
    searchQuery: string;
}

export default function OrderStatus({ order, searchQuery }: OrderStatusProps) {
    const [search, setSearch] = useState(searchQuery || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.get('/order-status', { search: search.trim() }, { preserveState: true });
        }
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto space-y-8 py-4">
                <div className="text-center space-y-2">
                    <span className="text-[11px] font-bold text-blue-400 bg-blue-950/80 border border-blue-800/60 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                        Tracking System
                    </span>
                    <h1 className="text-3xl font-black text-white tracking-tight">Lacak Pesanan Akun</h1>
                    <p className="text-dropbox-muted text-xs">
                        Masukkan ID Pesanan (contoh: <code className="font-bold text-blue-400">1</code> atau <code className="font-bold text-blue-400">ORD-1</code>) atau Email Pengiriman kamu.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="flex gap-3">
                    <input
                        type="text"
                        required
                        placeholder="Masukkan ID Pesanan atau Email Pengiriman"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-[#111726] border border-dropbox-border rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-dropbox-accent transition shadow-lg placeholder:text-slate-500 font-medium"
                    />
                    <button
                        type="submit"
                        className="bg-dropbox-accent hover:bg-blue-600 text-white font-extrabold px-7 py-3.5 rounded-2xl transition shadow-lg shadow-blue-900/40 text-xs border border-blue-400/30"
                    >
                        Cek Status
                    </button>
                </form>

                {searchQuery && (
                    <div className="space-y-6">
                        {order ? (
                            <div className="bg-[#111726] border border-dropbox-border rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dropbox-border pb-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-dropbox-muted uppercase tracking-wider block">Kode Transaksi</span>
                                        <span className="text-xl font-black text-white">ORD-{order.order_id}</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                                        order.status === 'valid'
                                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
                                            : order.status === 'ditolak'
                                                ? 'bg-rose-950/80 text-rose-400 border-rose-700/60'
                                                : 'bg-amber-950/80 text-amber-400 border-amber-700/60'
                                    }`}>
                                        {order.status === 'menunggu_konfirmasi' ? 'Menunggu Konfirmasi' : order.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div className="p-3 bg-[#0A0D15] rounded-xl border border-dropbox-border/60">
                                        <span className="text-slate-400 font-semibold block">Nama Akun</span>
                                        <p className="font-bold text-white text-sm mt-0.5">
                                            {order.account?.title || `Akun Game #${order.account?.account_id}`}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-[#0A0D15] rounded-xl border border-dropbox-border/60">
                                        <span className="text-slate-400 font-semibold block">Email Pengiriman</span>
                                        <p className="font-bold text-white text-sm mt-0.5">{order.delivery_email}</p>
                                    </div>
                                    <div className="p-3 bg-[#0A0D15] rounded-xl border border-dropbox-border/60">
                                        <span className="text-slate-400 font-semibold block">Metode Pembayaran</span>
                                        <p className="font-bold text-white text-sm mt-0.5">{order.payment?.method || 'QRIS'}</p>
                                    </div>
                                    <div className="p-3 bg-[#0A0D15] rounded-xl border border-dropbox-border/60">
                                        <span className="text-slate-400 font-semibold block">Total Tagihan</span>
                                        <p className="font-black text-blue-400 text-base mt-0.5">
                                            {formatRupiah(Number(order.account?.price || 0))}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Progress Information */}
                                {order.status === 'menunggu_konfirmasi' && (
                                    <div className="p-4 bg-amber-950/40 border border-amber-800/50 rounded-2xl space-y-1.5 text-xs">
                                        <p className="font-bold text-amber-400">
                                            Pembayaran Sedang Diverifikasi Admin
                                        </p>
                                        <p className="text-slate-300">
                                            Admin sedang memeriksa bukti transfer kamu. Segera setelah diverifikasi, data email &amp; password akun akan tampil otomatis di sini dan dikirimkan ke email kamu.
                                        </p>
                                    </div>
                                )}

                                {order.status === 'valid' && order.account && (
                                    <div className="p-5 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl space-y-3">
                                        <p className="text-emerald-400 font-black text-xs uppercase tracking-wider">
                                            Data Login Akun Terverifikasi:
                                        </p>
                                        <div className="bg-[#0A0D15] p-4 rounded-xl space-y-2 font-mono text-xs text-slate-200 border border-dropbox-border shadow-inner">
                                            <p><span className="text-slate-400">Email Akun   :</span> <strong className="text-white">{order.account.account_email}</strong></p>
                                            <p><span className="text-slate-400">Pass Email   :</span> <strong className="text-emerald-400">{order.account.email_password}</strong></p>
                                            <p><span className="text-slate-400">Pass Game    :</span> <strong className="text-emerald-400">{order.account.game_password}</strong></p>
                                        </div>
                                        <p className="text-[11px] text-slate-300">
                                            Segera login dan amankan akun dengan mengganti password serta mengaitkan email/nomor ponsel pribadimu. Hubungi CS jika butuh panduan.
                                        </p>
                                    </div>
                                )}

                                {order.status === 'ditolak' && (
                                    <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-2xl space-y-1 text-xs">
                                        <p className="font-bold text-rose-400">
                                            Pembayaran Ditolak
                                        </p>
                                        <p className="text-slate-300">
                                            Bukti pembayaran tidak sesuai atau tidak valid. Silakan hubungi Customer Service kami untuk konfirmasi lebih lanjut.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-[#111726] border border-dropbox-border rounded-3xl space-y-2">
                                <span className="text-3xl">🔎</span>
                                <p className="text-slate-300 font-medium text-sm">
                                    Pesanan dengan kata kunci <span className="text-rose-400 font-bold">{searchQuery}</span> tidak ditemukan.
                                </p>
                                <p className="text-xs text-dropbox-muted">
                                    Pastikan ID Pesanan atau format email pengiriman yang kamu ketik sudah benar.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="text-center pt-4">
                    <Link href="/katalog" className="text-xs font-bold text-dropbox-muted hover:text-white transition">
                        &larr; Kembali ke Katalog Akun
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
}
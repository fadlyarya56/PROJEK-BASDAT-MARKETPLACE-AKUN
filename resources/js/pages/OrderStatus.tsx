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
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-dropbox-text tracking-tight">Lacak Pesanan</h1>
                    <p className="text-dropbox-muted text-sm">
                        Masukkan ID Pesanan (contoh: <code className="font-bold text-dropbox-accent">1</code> atau <code className="font-bold text-dropbox-accent">ORD-1</code>) atau Email Pengiriman.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="flex gap-3">
                    <input
                        type="text"
                        required
                        placeholder="Masukkan ID Pesanan atau Email Pengiriman"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-white border border-dropbox-border rounded-full px-5 py-3 text-dropbox-text text-sm focus:outline-none focus:border-dropbox-accent transition shadow-xs font-medium"
                    />
                    <button
                        type="submit"
                        className="bg-dropbox-text hover:bg-black text-white font-bold px-6 py-3 rounded-full transition shadow-xs text-xs"
                    >
                        Cek Status
                    </button>
                </form>

                {searchQuery && (
                    <div className="space-y-6">
                        {order ? (
                            <div className="bg-white border border-dropbox-border rounded-2xl p-6 space-y-6 shadow-xs">
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dropbox-border pb-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-dropbox-muted uppercase tracking-wider block">Kode Transaksi</span>
                                        <span className="text-lg font-bold text-dropbox-text">ORD-{order.order_id}</span>
                                    </div>
                                    <span className="bg-dropbox-secondary text-dropbox-accent border border-dropbox-accent/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {order.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-xs text-dropbox-muted font-bold block">Nama Akun</span>
                                        <p className="font-bold text-dropbox-text mt-0.5">
                                            {order.account?.title || `Akun Game #${order.account?.account_id}`}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-dropbox-muted font-bold block">Email Pengiriman</span>
                                        <p className="font-medium text-dropbox-text mt-0.5">{order.delivery_email}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-dropbox-muted font-bold block">Metode Pembayaran</span>
                                        <p className="font-medium text-dropbox-text mt-0.5">{order.payment?.method || 'QRIS'}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-dropbox-muted font-bold block">Total Tagihan</span>
                                        <p className="font-bold text-dropbox-text text-base mt-0.5">
                                            {formatRupiah(Number(order.account?.price || 0))}
                                        </p>
                                    </div>
                                </div>

                                {order.status === 'valid' && order.account && (
                                    <div className="p-5 bg-dropbox-secondary/60 border border-dropbox-accent/30 rounded-xl space-y-3">
                                        <p className="text-dropbox-accent font-bold text-xs uppercase tracking-wider">
                                            Data Login Akun Terverifikasi:
                                        </p>
                                        <div className="bg-white p-4 rounded-lg space-y-2 font-mono text-xs text-dropbox-text border border-dropbox-border shadow-xs">
                                            <p><span className="text-dropbox-muted">Email Akun   :</span> {order.account.account_email}</p>
                                            <p><span className="text-dropbox-muted">Pass Email   :</span> {order.account.email_password}</p>
                                            <p><span className="text-dropbox-muted">Pass Game    :</span> {order.account.game_password}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white border border-dropbox-border rounded-2xl">
                                <p className="text-dropbox-muted font-medium text-sm">
                                    Pesanan <span className="text-rose-500 font-bold">{searchQuery}</span> tidak ditemukan.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="text-center pt-4">
                    <Link href="/" className="text-xs font-bold text-dropbox-muted hover:text-dropbox-text transition">
                        &larr; Kembali ke Katalog Utama
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
}
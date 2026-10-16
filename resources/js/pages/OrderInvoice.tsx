import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Link, Head } from '@inertiajs/react';
import { resolveStorageUrl } from '@/lib/utils';

interface OrderData {
    order_id: number;
    delivery_email: string;
    security_pin?: string;
    status: string;
    created_at: string;
    account?: {
        account_id: number;
        title: string;
        price: number;
        image_url?: string | null;
        image_full_url?: string | null;
        images_list?: string[];
        game?: {
            name: string;
        };
    };
    payment?: {
        method: string;
        status: string;
        proof_image?: string | null;
        created_at?: string;
    };
    buyer?: {
        name: string;
        email: string;
    };
}

interface OrderInvoiceProps {
    order: OrderData;
}

export default function OrderInvoice({ order }: OrderInvoiceProps) {
    const [copied, setCopied] = useState(false);
    const [copiedPin, setCopiedPin] = useState(false);
    const [showProofModal, setShowProofModal] = useState(false);

    const orderCode = `ORD-${order.order_id}`;

    const handleCopyCode = () => {
        navigator.clipboard.writeText(orderCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyPin = () => {
        if (order.security_pin) {
            navigator.clipboard.writeText(order.security_pin);
            setCopiedPin(true);
            setTimeout(() => setCopiedPin(false), 2000);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        const d = new Date(dateString);
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }) + ' WIB';
    };

    const accountImage = resolveStorageUrl(
        order.account?.images_list?.[0] || order.account?.image_url,
        order.account?.image_full_url
    );

    const proofImageUrl = resolveStorageUrl(order.payment?.proof_image);

    const waConfirmationText = encodeURIComponent(
        `Halo Admin GameStore, saya sudah melakukan checkout pesanan dengan Kode Transaksi: ${orderCode}. Akun: ${order.account?.title || 'Akun Game'} (${order.account?.game?.name || ''}). Mohon dicek ya, terima kasih!`
    );

    return (
        <MainLayout>
            <Head title={`Invoice ${orderCode} - AKUNKU Store`} />

            <div className="max-w-3xl mx-auto space-y-8 py-4">
                
                {/* 1. HEADER INVOICE DENGAN SUKSES BADGE */}
                <div className="bg-[#111726] border border-dropbox-border rounded-3xl p-6 sm:p-8 text-center space-y-4 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 space-y-3">
                        <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-950/50">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
                                Transaksi Berhasil Dibuat
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                Invoice Pesanan Kamu
                            </h1>
                            <p className="text-xs text-dropbox-muted max-w-md mx-auto leading-relaxed">
                                Bukti pembayaran dan data pengiriman berhasil kami terima. Simpan kode transaksimu untuk melacak status akun kapan saja.
                            </p>
                        </div>

                        {/* Kotak Kode Pesanan & PIN Keamanan Interaktif */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <div className="w-full sm:w-auto inline-flex items-center justify-between gap-3 bg-[#0A0D15] border border-blue-500/40 rounded-2xl p-3 px-5 shadow-inner">
                                <div className="text-left">
                                    <span className="text-[10px] text-dropbox-muted block font-semibold uppercase tracking-wider">
                                        KODE PESANAN
                                    </span>
                                    <span className="text-lg sm:text-xl font-black text-white tracking-wider font-mono">
                                        {orderCode}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopyCode}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                        copied
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-dropbox-accent hover:bg-blue-600 text-white shadow-md shadow-blue-900/30'
                                    }`}
                                >
                                    <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                                </button>
                            </div>

                            {order.security_pin && (
                                <div className="w-full sm:w-auto inline-flex items-center justify-between gap-3 bg-[#0A0D15] border border-amber-500/50 rounded-2xl p-3 px-5 shadow-inner">
                                    <div className="text-left">
                                        <span className="text-[10px] text-amber-400 block font-semibold uppercase tracking-wider">
                                            PIN KEAMANAN (RAHASIA)
                                        </span>
                                        <span className="text-lg sm:text-xl font-black text-amber-300 tracking-widest font-mono">
                                            {order.security_pin}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopyPin}
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                            copiedPin
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-900/30'
                                        }`}
                                    >
                                        <span>{copiedPin ? 'Tersalin!' : 'Salin PIN'}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {order.security_pin && (
                            <p className="text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-800/50 rounded-xl py-2 px-3 max-w-lg mx-auto">
                                <strong>PENTING:</strong> Simpan PIN Keamanan 6-digit di atas. Anda wajib memasukkan PIN ini untuk membuka kredensial email &amp; password akun di halaman Lacak Pesanan.
                            </p>
                        )}
                    </div>
                </div>

                {/* 2. KARTU DETAIL INVOICE TRANSAKSI */}
                <div className="bg-[#111726] border border-dropbox-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                    <div className="flex items-center justify-between border-b border-dropbox-border pb-4">
                        <div className="space-y-0.5">
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                                Rincian Pembelian
                            </h2>
                            <p className="text-[11px] text-dropbox-muted">
                                Dibuat pada: {formatDate(order.created_at)}
                            </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950/80 text-amber-400 border border-amber-700/60 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            <span>Menunggu Konfirmasi</span>
                        </span>
                    </div>

                    {/* Ringkasan Item Akun */}
                    <div className="bg-[#0A0D15] border border-dropbox-border rounded-2xl p-4 flex items-center space-x-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#111726] border border-dropbox-border rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {accountImage ? (
                                <img
                                    src={accountImage}
                                    alt={order.account?.title || 'Akun'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-dropbox-muted text-xs">No Image</span>
                            )}
                        </div>
                        <div className="space-y-1 overflow-hidden flex-1">
                            <span className="text-[10px] font-bold text-dropbox-accent uppercase tracking-wider block">
                                {order.account?.game?.name || 'GAME'}
                            </span>
                            <h3 className="font-bold text-white text-sm sm:text-base truncate">
                                {order.account?.title || `Akun Game #${order.account?.account_id}`}
                            </h3>
                            <span className="text-xs font-bold text-blue-400 block">
                                {formatRupiah(Number(order.account?.price || 0))}
                            </span>
                        </div>
                    </div>

                    {/* Rincian Transaksi Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                        <div className="p-3.5 bg-[#0A0D15] rounded-xl border border-dropbox-border/60 space-y-1">
                            <span className="text-slate-400 font-semibold block">Email Penerima Akun</span>
                            <p className="font-bold text-white text-sm break-all">{order.delivery_email}</p>
                            <span className="text-[10px] text-dropbox-muted">Data akun akan dikirim ke email ini</span>
                        </div>

                        <div className="p-3.5 bg-[#0A0D15] rounded-xl border border-dropbox-border/60 space-y-1">
                            <span className="text-slate-400 font-semibold block">Metode Pembayaran</span>
                            <p className="font-bold text-white text-sm">{order.payment?.method || 'QRIS'}</p>
                            <span className="text-[10px] text-dropbox-muted">Biaya Layanan: Rp 0 (Gratis)</span>
                        </div>

                        <div className="p-3.5 bg-[#0A0D15] rounded-xl border border-dropbox-border/60 space-y-1">
                            <span className="text-slate-400 font-semibold block">Bukti Transfer</span>
                            <div className="flex items-center justify-between pt-0.5">
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                    <span>✓</span> Berhasil Terunggah
                                </span>
                                {proofImageUrl && (
                                    <button
                                        type="button"
                                        onClick={() => setShowProofModal(true)}
                                        className="text-dropbox-accent hover:underline text-[11px] font-semibold"
                                    >
                                        Lihat Bukti
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-3.5 bg-[#0A0D15] rounded-xl border border-dropbox-border/60 space-y-1">
                            <span className="text-slate-400 font-semibold block">Total Tagihan</span>
                            <p className="text-blue-400 font-black text-lg">
                                {formatRupiah(Number(order.account?.price || 0))}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. PANDUAN LANGKAH SELANJUTNYA & CARA CEK STATUS (AGAR TIDAK BINGUNG) */}
                <div className="bg-[#111726] border border-blue-900/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                        Apa Langkah Selanjutnya? (Cara Cek Status Akun)
                    </h2>

                    <div className="space-y-3.5 text-xs">
                        {/* Langkah 1 */}
                        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#0A0D15] border border-dropbox-border/60">
                            <div className="w-6 h-6 rounded-full bg-blue-950 border border-blue-700 text-blue-400 font-black flex items-center justify-center flex-shrink-0 text-xs">
                                1
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-bold text-white">Simpan Kode Pesanan Kamu</p>
                                <p className="text-slate-300 leading-relaxed">
                                    Salin dan simpan kode <strong className="text-blue-400 font-mono">{orderCode}</strong> atau bookmark halaman ini. Kode ini adalah identitas bukti pembelianmu.
                                </p>
                            </div>
                        </div>

                        {/* Langkah 2 */}
                        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#0A0D15] border border-dropbox-border/60">
                            <div className="w-6 h-6 rounded-full bg-amber-950 border border-amber-700 text-amber-400 font-black flex items-center justify-center flex-shrink-0 text-xs">
                                2
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-bold text-white">Admin Memverifikasi Pembayaran (5-15 Menit)</p>
                                <p className="text-slate-300 leading-relaxed">
                                    Tim kami sedang memvalidasi bukti transfer yang kamu unggah. Kamu tidak perlu khawatir, transaksi bergaransi aman 100%.
                                </p>
                            </div>
                        </div>

                        {/* Langkah 3 */}
                        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#0A0D15] border border-dropbox-border/60">
                            <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 font-black flex items-center justify-center flex-shrink-0 text-xs">
                                3
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-bold text-white">Data Akun Langsung Terbuka &amp; Terkirim ke Email</p>
                                <p className="text-slate-300 leading-relaxed">
                                    Setelah pembayaran diverifikasi (Status: <strong>VALID</strong>), kredensial email &amp; password akun akan otomatis muncul di halaman Lacak Pesanan dan dikirimkan ke <strong className="text-white">{order.delivery_email}</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. TOMBOL AKSI UTAMA */}
                <div className="space-y-3 pt-2">
                    {/* Tombol Utama: Langsung Menuju Halaman Lacak Pesanan */}
                    <Link
                        href={`/order-status?search=${orderCode}${order.security_pin ? `&pin=${order.security_pin}` : ''}`}
                        className="w-full bg-dropbox-accent hover:bg-blue-600 text-white font-extrabold text-sm py-4 rounded-2xl transition shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 border border-blue-400/30 text-center"
                    >
                        <span>Lacak Status Pesanan Sekarang</span>
                        <span>&rarr;</span>
                    </Link>

                    {/* Tombol Pendukung: Cetak & WhatsApp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="w-full bg-[#182033] hover:bg-[#202b44] text-white font-bold text-xs py-3.5 rounded-2xl transition border border-dropbox-border flex items-center justify-center gap-2"
                        >
                            <span>Cetak / Simpan Invoice</span>
                        </button>

                        <a
                            href={`https://wa.me/6281234567890?text=${waConfirmationText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 font-bold text-xs py-3.5 rounded-2xl transition flex items-center justify-center gap-2 text-center"
                        >
                            <span>Konfirmasi Cepat ke WhatsApp CS</span>
                        </a>
                    </div>

                    <div className="text-center pt-2">
                        <Link
                            href="/katalog"
                            className="text-xs text-dropbox-muted hover:text-white font-medium transition"
                        >
                            &larr; Selesai dan Kembali ke Katalog
                        </Link>
                    </div>
                </div>

            </div>

            {/* Modal Preview Bukti Transfer */}
            {showProofModal && proofImageUrl && (
                <div 
                    className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => setShowProofModal(false)}
                >
                    <div className="bg-[#111726] border border-dropbox-border rounded-2xl p-5 max-w-md w-full space-y-4">
                        <div className="flex items-center justify-between border-b border-dropbox-border pb-3">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                                Bukti Transfer Terunggah
                            </h3>
                            <button
                                onClick={() => setShowProofModal(false)}
                                className="text-dropbox-muted hover:text-white font-bold text-sm"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="max-h-[60vh] overflow-auto rounded-xl border border-dropbox-border bg-black flex items-center justify-center p-2">
                            <img
                                src={proofImageUrl}
                                alt="Bukti Transfer"
                                className="max-h-[55vh] object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

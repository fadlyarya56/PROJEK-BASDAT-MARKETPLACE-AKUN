import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useForm, Link } from '@inertiajs/react';

interface AccountData {
    account_id: number;
    title: string;
    price: number;
    image_url?: string;
    game?: {
        name: string;
    };
}

interface CheckoutProps {
    account?: AccountData;
}

export default function Checkout({ account }: CheckoutProps) {
    const [selectedMethod, setSelectedMethod] = useState<'qris' | 'bank' | 'e-wallet'>('qris');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accId = urlParams.get('account_id');
        if (accId) {
            setData('account_id', Number(accId));
        }
    }, []);

    const { data, setData, post, processing, errors } = useForm({
        account_id: account?.account_id || 36,
        delivery_email: '',
        payment_method: 'qris',
        proof_image: null as File | null,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('proof_image', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout', {
            forceFormData: true,
        });
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
            <div className="max-w-5xl mx-auto space-y-6 py-2">
                {/* Header Judul */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-dropbox-text tracking-tight">
                        Masukkan Detail Pembayaran
                    </h1>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Grid Layout: Kiri Form (7 Col), Kanan Ringkasan (5 Col) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* BAGIAN KIRI: Form Pengisian (Container Putih Bersih) */}
                        <div className="lg:col-span-7 bg-white border border-dropbox-border rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xs">
                            <h2 className="text-sm font-bold text-dropbox-text border-b border-dropbox-border pb-3">
                                Informasi Pembayaran & Pengiriman
                            </h2>

                            {/* Form Input Email */}
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-dropbox-text uppercase tracking-wider">
                                    Email Pengiriman <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="contoh: emailkamu@gmail.com"
                                    value={data.delivery_email}
                                    onChange={(e) => setData('delivery_email', e.target.value)}
                                    className="w-full bg-dropbox-bg border border-dropbox-border rounded-xl px-4 py-3 text-dropbox-text text-sm focus:outline-none focus:border-dropbox-accent transition font-normal placeholder:text-dropbox-muted/60"
                                />
                                {errors.delivery_email && (
                                    <p className="text-xs text-rose-500 font-normal">{errors.delivery_email}</p>
                                )}
                            </div>

                            {/* Pilih Metode Pembayaran */}
                            <div className="space-y-3">
                                <label className="block text-xs font-semibold text-dropbox-text uppercase tracking-wider">
                                    Metode Pembayaran
                                </label>
                                
                                <div className="grid grid-cols-3 gap-2.5">
                                    {(['qris', 'bank', 'e-wallet'] as const).map((method) => (
                                        <button
                                            type="button"
                                            key={method}
                                            onClick={() => {
                                                setSelectedMethod(method);
                                                setData('payment_method', method === 'qris' ? 'QRIS' : method === 'bank' ? 'Transfer Bank BCA' : 'E-Wallet DANA');
                                            }}
                                            className={`py-2.5 px-2 rounded-xl border text-xs transition text-center ${
                                                selectedMethod === method
                                                    ? 'bg-dropbox-accent text-white border-dropbox-accent font-semibold shadow-2xs'
                                                    : 'bg-dropbox-bg text-dropbox-text border-dropbox-border font-medium hover:border-dropbox-text/30'
                                            }`}
                                        >
                                            {method === 'qris' ? 'QRIS' : method === 'bank' ? 'Bank BCA' : 'E-Wallet'}
                                        </button>
                                    ))}
                                </div>

                                {/* Box Instruksi Bayar */}
                                <div className="p-4 bg-dropbox-bg border border-dropbox-border rounded-xl text-xs space-y-3 text-dropbox-text">
                                    {selectedMethod === 'qris' && (
                                        <div className="text-center space-y-2">
                                            <p className="font-normal text-xs text-dropbox-muted">Scan Kode QRIS di bawah menggunakan E-Wallet / M-Banking:</p>
                                            <div className="w-32 h-32 bg-white mx-auto rounded-xl flex items-center justify-center text-xs p-2 border border-dropbox-border text-dropbox-muted font-medium shadow-2xs">
                                                [ KODE QRIS ]
                                            </div>
                                        </div>
                                    )}
                                    {selectedMethod === 'bank' && (
                                        <div className="space-y-1">
                                            <p className="font-semibold text-xs">Transfer Bank BCA</p>
                                            <p className="font-mono text-dropbox-accent text-base font-bold">1234-5678-9012</p>
                                            <p className="text-dropbox-muted text-[11px] font-normal">a.n. GameStore Marketplace</p>
                                        </div>
                                    )}
                                    {selectedMethod === 'e-wallet' && (
                                        <div className="space-y-1">
                                            <p className="font-semibold text-xs">DANA / OVO / GoPay</p>
                                            <p className="font-mono text-dropbox-accent text-base font-bold">0812-3456-7890</p>
                                            <p className="text-dropbox-muted text-[11px] font-normal">a.n. GameStore Marketplace</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Upload Bukti Transfer */}
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-dropbox-text uppercase tracking-wider">
                                    Upload Bukti Transfer <span className="text-rose-500">*</span>
                                </label>
                                <div className="bg-dropbox-bg border border-dropbox-border rounded-xl p-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        required
                                        onChange={handleImageChange}
                                        className="w-full text-xs text-dropbox-muted file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-dropbox-text file:text-white hover:file:bg-black cursor-pointer font-normal"
                                    />
                                    {previewImage && (
                                        <div className="mt-3 w-24 aspect-square rounded-lg overflow-hidden border border-dropbox-border">
                                            <img src={previewImage} alt="Bukti Transfer" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2">
                                <Link href="/" className="text-xs font-medium text-dropbox-muted hover:text-dropbox-text transition">
                                    &larr; Batal dan Kembali ke Katalog
                                </Link>
                            </div>
                        </div>

                        {/* BAGIAN KANAN: Ringkasan Pesanan (Container Putih Bersih) */}
                        <div className="lg:col-span-5 bg-white border border-dropbox-border rounded-2xl p-6 space-y-5 sticky top-24 shadow-2xs">
                            <h2 className="text-sm font-bold text-dropbox-text border-b border-dropbox-border pb-3">
                                Ringkasan Pesanan
                            </h2>

                            {/* Item Card Ringkas */}
                            <div className="bg-dropbox-bg border border-dropbox-border rounded-xl p-4 flex items-center space-x-4">
                                <div className="w-16 h-16 bg-[#F2F0EB] border border-[#E3DFD7] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {account?.image_url ? (
                                        <img
                                            src={account.image_url}
                                            alt={account.title || `Akun #${account.account_id}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-dropbox-muted font-normal text-[10px]">No Image</span>
                                    )}
                                </div>
                                <div className="space-y-0.5 overflow-hidden">
                                    <span className="text-[10px] font-semibold text-dropbox-accent uppercase tracking-wider block">
                                        {account?.game?.name || 'GAME'}
                                    </span>
                                    <h3 className="font-bold text-dropbox-text text-sm truncate">
                                        {account?.title || `Akun Game #${account?.account_id || data.account_id}`}
                                    </h3>
                                    <span className="text-xs font-semibold text-dropbox-text block">
                                        {formatRupiah(Number(account?.price || 150000))}
                                    </span>
                                </div>
                            </div>

                            {/* Rincian Biaya */}
                            <div className="space-y-2 text-xs pt-2 border-t border-dropbox-border">
                                <div className="flex justify-between text-dropbox-muted font-normal">
                                    <span>Harga Akun</span>
                                    <span className="font-semibold text-dropbox-text">{formatRupiah(Number(account?.price || 150000))}</span>
                                </div>
                                <div className="flex justify-between text-dropbox-muted font-normal">
                                    <span>Biaya Layanan</span>
                                    <span className="font-semibold text-emerald-600">Gratis (Rp 0)</span>
                                </div>
                                <div className="flex justify-between text-sm pt-2 border-t border-dropbox-border">
                                    <span className="font-bold text-dropbox-text">Total Tagihan</span>
                                    <span className="text-dropbox-accent font-extrabold text-base">{formatRupiah(Number(account?.price || 150000))}</span>
                                </div>
                            </div>

                            {/* Tombol Konfirmasi Utama */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-dropbox-accent hover:bg-blue-700 text-white text-xs font-semibold py-3.5 rounded-xl transition"
                                >
                                    {processing ? 'Memproses...' : 'Konfirmasi & Bayar Sekarang'}
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
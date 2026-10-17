import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useForm, Link } from '@inertiajs/react';
import { resolveStorageUrl } from '@/lib/utils';

interface AccountData {
    account_id: number;
    title: string;
    price: number;
    image_url?: string | null;
    image_full_url?: string | null;
    images?: string[] | null;
    images_list?: string[];
    description?: string | null;
    game?: {
        name: string;
    };
}

interface CheckoutProps {
    account?: AccountData | null;
}

export default function Checkout({ account }: CheckoutProps) {
    const [selectedMethod, setSelectedMethod] = useState<'qris' | 'bank' | 'e-wallet'>('qris');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imgError, setImgError] = useState(false);
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(label);
        setTimeout(() => setCopiedText(null), 2000);
    };

    const { data, setData, post, processing, errors } = useForm<{
        account_id: number;
        delivery_email: string;
        payment_method: string;
        proof_image: File | null;
    }>({
        account_id: account?.account_id || 0,
        delivery_email: '',
        payment_method: 'QRIS',
        proof_image: null,
    });

    useEffect(() => {
        if (account?.account_id) {
            setData('account_id', account.account_id);
        }
    }, [account?.account_id]);

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

    const firstImage = (account?.images_list && account.images_list.length > 0)
        ? account.images_list[0]
        : (account?.images && account.images.length > 0)
            ? account.images[0]
            : account?.image_url;

    const imageUrl = resolveStorageUrl(firstImage, account?.image_full_url);

    if (!account) {
        return (
            <MainLayout>
                <div className="max-w-xl mx-auto py-20 text-center space-y-4 bg-[#111726] border border-dropbox-border rounded-3xl p-8">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                        <svg className="w-7 h-7 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={1.75}>
                            <circle cx="8" cy="21" r="1"/>
                            <circle cx="19" cy="21" r="1"/>
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-white">Tidak Ada Akun Yang Dipilih</h1>
                    <p className="text-xs text-dropbox-muted">
                        Silakan kembali ke katalog dan pilih akun game yang ingin kamu beli terlebih dahulu.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/katalog"
                            className="inline-block bg-dropbox-accent hover:bg-blue-600 text-white text-xs font-bold px-6 py-3.5 rounded-full transition shadow-md shadow-blue-900/30"
                        >
                            &larr; Lihat Katalog Akun
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto space-y-6 py-2">
                {/* Header Judul */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-white tracking-tight">
                        Masukkan Detail Pembayaran
                    </h1>
                    <p className="text-xs text-dropbox-muted">
                        Isi email pengiriman akun dan konfirmasi metode transfer pilihanmu.
                    </p>
                </div>

                {errors.account_id && (
                    <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-2xl text-xs text-rose-300 font-medium">
                        {errors.account_id}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Grid Layout: Kiri Form (7 Col), Kanan Ringkasan (5 Col) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* BAGIAN KIRI: Form Pengisian */}
                        <div className="lg:col-span-7 bg-[#111726] border border-dropbox-border rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
                            <h2 className="text-sm font-bold text-white border-b border-dropbox-border pb-3">
                                Informasi Pembayaran &amp; Pengiriman
                            </h2>

                            {/* 1. Form Input Email (delivery_email) */}
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Email Pengiriman <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="contoh: emailkamu@gmail.com"
                                    value={data.delivery_email}
                                    onChange={(e) => setData('delivery_email', e.target.value)}
                                    className="w-full bg-[#0A0D15] border border-dropbox-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-dropbox-accent transition placeholder:text-slate-500"
                                />
                                <p className="text-[11px] text-dropbox-muted">
                                    Data login akun (email &amp; password) akan langsung dikirimkan ke email ini.
                                </p>
                                {errors.delivery_email && (
                                    <p className="text-xs text-rose-400">{errors.delivery_email}</p>
                                )}
                            </div>

                            {/* 2. Pilih Metode Pembayaran (payment_method) */}
                            <div className="space-y-3">
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Pilih Metode Pembayaran
                                </label>
                                
                                <div className="grid grid-cols-3 gap-2.5">
                                    {(['qris', 'bank', 'e-wallet'] as const).map((m) => (
                                        <button
                                            type="button"
                                            key={m}
                                            onClick={() => {
                                                setSelectedMethod(m);
                                                const methodName = m === 'qris' ? 'QRIS' : m === 'bank' ? 'Transfer BCA' : 'E-Wallet';
                                                setData('payment_method', methodName);
                                            }}
                                            className={`py-3 px-2 rounded-xl border text-xs font-bold transition text-center ${
                                                selectedMethod === m
                                                    ? 'bg-dropbox-accent text-white border-dropbox-accent shadow-md shadow-blue-900/40'
                                                    : 'bg-[#0A0D15] text-slate-400 border-dropbox-border hover:border-slate-500 hover:text-white'
                                            }`}
                                        >
                                            {m === 'qris' ? 'QRIS' : m === 'bank' ? 'Bank BCA' : 'E-Wallet'}
                                        </button>
                                    ))}
                                </div>

                                {/* Box Instruksi Bayar */}
                                <div className="p-4 bg-[#0A0D15] border border-dropbox-border rounded-2xl text-xs space-y-3 text-slate-300">
                                    {selectedMethod === 'qris' && (
                                        <div className="text-center space-y-2">
                                            <p className="text-xs text-slate-400">Scan Kode QRIS di bawah menggunakan E-Wallet / M-Banking:</p>
                                            <div className="w-36 h-36 bg-white mx-auto rounded-xl flex items-center justify-center text-xs p-2 border border-slate-300 text-slate-800 font-bold shadow-md">
                                                [ KODE QRIS OFFICIAL ]
                                            </div>
                                            <p className="text-[10px] text-emerald-400 font-medium">Mendukung Gopay, OVO, Dana, ShopeePay, BCA, Mandiri dll</p>
                                        </div>
                                    )}
                                    {selectedMethod === 'bank' && (
                                        <div className="space-y-1.5">
                                            <p className="font-semibold text-xs text-slate-400">Transfer Bank BCA</p>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-mono text-blue-400 text-lg font-bold">1234-5678-9012</p>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy('123456789012', 'bca')}
                                                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white transition border border-blue-500/40"
                                                >
                                                    {copiedText === 'bca' ? '✓ Tersalin' : 'Salin Rekening'}
                                                </button>
                                            </div>
                                            <p className="text-slate-400 text-[11px]">a.n. TempatAkun Marketplace Official</p>
                                        </div>
                                    )}
                                    {selectedMethod === 'e-wallet' && (
                                        <div className="space-y-1.5">
                                            <p className="font-semibold text-xs text-slate-400">DANA / OVO / GoPay</p>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-mono text-blue-400 text-lg font-bold">0812-3456-7890</p>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy('081234567890', 'ewallet')}
                                                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white transition border border-blue-500/40"
                                                >
                                                    {copiedText === 'ewallet' ? '✓ Tersalin' : 'Salin Nomor'}
                                                </button>
                                            </div>
                                            <p className="text-slate-400 text-[11px]">a.n. TempatAkun Marketplace Official</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 3. Upload Bukti Transfer (proof_image) */}
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Upload Bukti Transfer <span className="text-rose-500">*</span>
                                </label>
                                <div className="bg-[#0A0D15] border border-dropbox-border rounded-2xl p-4">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                        required
                                        onChange={handleImageChange}
                                        className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                                    />
                                    {errors.proof_image && (
                                        <p className="text-xs text-rose-400 mt-2">{errors.proof_image}</p>
                                    )}
                                    {previewImage && (
                                        <div className="mt-4 w-28 aspect-square rounded-xl overflow-hidden border border-dropbox-border">
                                            <img src={previewImage} alt="Bukti Transfer" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2">
                                <Link href="/katalog" className="text-xs font-medium text-slate-400 hover:text-white transition">
                                    &larr; Batal dan Kembali ke Katalog
                                </Link>
                            </div>
                        </div>

                        {/* BAGIAN KANAN: Ringkasan Pesanan */}
                        <div className="lg:col-span-5 bg-[#111726] border border-dropbox-border rounded-3xl p-6 sm:p-7 space-y-5 sticky top-24 shadow-xl">
                            <h2 className="text-sm font-bold text-white border-b border-dropbox-border pb-3">
                                Ringkasan Pesanan
                            </h2>

                            {/* Item Card Ringkas */}
                            <div className="bg-[#0A0D15] border border-dropbox-border rounded-2xl p-4 flex items-center space-x-4">
                                <div className="w-16 h-16 bg-[#111726] border border-dropbox-border rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {imageUrl && !imgError ? (
                                        <img
                                            src={imageUrl}
                                            alt={account.title || `Akun #${account.account_id}`}
                                            className="w-full h-full object-cover"
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        <span className="text-dropbox-muted font-normal text-[10px]">No Image</span>
                                    )}
                                </div>
                                <div className="space-y-0.5 overflow-hidden">
                                    <span className="text-[10px] font-bold text-dropbox-accent uppercase tracking-wider block">
                                        {account.game?.name || 'GAME'}
                                    </span>
                                    <h3 className="font-bold text-white text-sm truncate">
                                        {account.title || `Akun Game #${account.account_id}`}
                                    </h3>
                                    <span className="text-xs font-bold text-blue-400 block">
                                        {formatRupiah(Number(account.price))}
                                    </span>
                                </div>
                            </div>

                            {/* Rincian Biaya */}
                            <div className="space-y-2 text-xs pt-2 border-t border-dropbox-border">
                                <div className="flex justify-between text-slate-400">
                                    <span>Harga Akun</span>
                                    <span className="font-bold text-white">{formatRupiah(Number(account.price))}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Biaya Layanan</span>
                                    <span className="font-bold text-emerald-400">Gratis (Rp 0)</span>
                                </div>
                                <div className="flex justify-between text-sm pt-3 border-t border-dropbox-border">
                                    <span className="font-bold text-white">Total Tagihan</span>
                                    <span className="text-blue-400 font-black text-xl">{formatRupiah(Number(account.price))}</span>
                                </div>
                            </div>

                            {/* Tombol Konfirmasi Utama */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-dropbox-accent hover:bg-blue-600 text-white text-xs font-extrabold py-4 rounded-2xl transition shadow-lg shadow-blue-900/40 border border-blue-400/30 flex items-center justify-center gap-2"
                                >
                                    <span>{processing ? 'Memproses Pesanan...' : 'Konfirmasi & Bayar Sekarang'}</span>
                                    <span>&rarr;</span>
                                </button>
                            </div>

                            <div className="text-[11px] text-slate-400 text-center">
                                Data transaksi terlindungi enkripsi 256-bit
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
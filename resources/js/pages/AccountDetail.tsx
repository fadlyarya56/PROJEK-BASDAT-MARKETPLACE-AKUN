import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Link, Head } from '@inertiajs/react';
import { resolveStorageUrl } from '@/lib/utils';
import AccountCard, { Account } from '@/Components/AccountCard';

interface AccountDetailProps {
    account: Account;
    relatedAccounts?: Account[];
}

export default function AccountDetail({ account, relatedAccounts = [] }: AccountDetailProps) {
    // Ambil daftar gambar akun
    const imagesList: string[] = (account.images_list && account.images_list.length > 0)
        ? account.images_list
        : (account.images && account.images.length > 0)
            ? account.images.map((img) => resolveStorageUrl(img) || img)
            : account.image_url
                ? [resolveStorageUrl(account.image_url, account.image_full_url) || account.image_url]
                : [];

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    const currentImage = imagesList[activeImageIndex] || null;

    const nextImage = () => {
        if (imagesList.length > 1) {
            setActiveImageIndex((prev) => (prev + 1) % imagesList.length);
        }
    };

    const prevImage = () => {
        if (imagesList.length > 1) {
            setActiveImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
        }
    };

    return (
        <MainLayout>
            <Head title={`${account.title || `Akun #${account.account_id}`} - TempatAkun`} />

            <div className="space-y-6 sm:space-y-8 py-2 pb-24 lg:pb-2">
                {/* Breadcrumbs Navigasi Ramah Mobile */}
                <nav className="flex items-center space-x-2 text-xs text-dropbox-muted overflow-x-auto whitespace-nowrap pb-1 scrollbar-none">
                    <Link href="/" className="hover:text-white transition flex-shrink-0">Home</Link>
                    <span className="flex-shrink-0">/</span>
                    <Link href="/katalog" className="hover:text-white transition flex-shrink-0">Katalog</Link>
                    {account.game?.name && (
                        <>
                            <span className="flex-shrink-0">/</span>
                            <span className="text-dropbox-muted flex-shrink-0">{account.game.name}</span>
                        </>
                    )}
                    <span className="flex-shrink-0">/</span>
                    <span className="text-white font-medium truncate max-w-[180px] sm:max-w-xs">
                        {account.title || `Akun #${account.account_id}`}
                    </span>
                </nav>

                {/* Konten Utama Detail: Galeri Kiri (7 Col), Detail & Checkout Kanan (5 Col) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* BAGIAN KIRI: Galeri Multi-Foto & Deskripsi Lengkap */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Frame Foto Utama */}
                        <div className="bg-[#111726] border border-dropbox-border rounded-3xl p-4 space-y-4 shadow-xl relative">
                            <div className="aspect-video bg-[#0A0D15] rounded-2xl overflow-hidden relative flex items-center justify-center border border-dropbox-border/50 group">
                                {currentImage && !imgError ? (
                                    <img
                                        src={currentImage}
                                        alt={account.title || `Foto Akun ${activeImageIndex + 1}`}
                                        className="w-full h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
                                        onClick={() => setLightboxOpen(true)}
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-dropbox-muted p-8 text-center">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="2" y="6" width="20" height="12" rx="6" />
                                                <path d="M6 12h4m-2-2v4m7-2h.01m3 0h.01" />
                                            </svg>
                                        </div>
                                        <p className="text-xs font-semibold text-white">Tidak Ada Foto Tambahan</p>
                                        <p className="text-[11px] text-dropbox-muted">Akun ini belum memiliki tangkapan layar spesifikasi.</p>
                                    </div>
                                )}

                                {/* Tombol Navigasi Gambar (Jika multi-image) */}
                                {imagesList.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-dropbox-accent text-white flex items-center justify-center transition border border-white/20 text-xs shadow-md"
                                        >
                                            &#10094;
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-dropbox-accent text-white flex items-center justify-center transition border border-white/20 text-xs shadow-md"
                                        >
                                            &#10095;
                                        </button>
                                    </>
                                )}

                                {/* Indikator Posisi Foto */}
                                {imagesList.length > 0 && (
                                    <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                                        {activeImageIndex + 1} / {imagesList.length} Foto
                                    </span>
                                )}

                                {/* Tombol Zoom Fullscreen */}
                                {currentImage && !imgError && (
                                    <button
                                        type="button"
                                        onClick={() => setLightboxOpen(true)}
                                        className="absolute top-3 right-3 bg-black/60 hover:bg-black/90 text-white text-xs p-2 rounded-xl border border-white/20 transition font-medium"
                                        title="Perbesar Foto"
                                    >
                                        Perbesar
                                    </button>
                                )}
                            </div>

                            {/* Strip Thumbnail Multi-Image (Bisa Diklik Admin & Pembeli) */}
                            {imagesList.length > 1 && (
                                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                                    {imagesList.map((imgUrl, idx) => (
                                        <button
                                            type="button"
                                            key={idx}
                                            onClick={() => {
                                                setImgError(false);
                                                setActiveImageIndex(idx);
                                            }}
                                            className={`relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                                                activeImageIndex === idx
                                                    ? 'border-dropbox-accent shadow-md shadow-blue-600/30 scale-105'
                                                    : 'border-dropbox-border hover:border-dropbox-muted opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={imgUrl}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Kolom Deskripsi Lengkap Spesifikasi */}
                        <div className="bg-[#111726] border border-dropbox-border rounded-3xl p-6 sm:p-7 space-y-5">
                            <h2 className="text-base font-bold text-white border-b border-dropbox-border pb-3">
                                Spesifikasi &amp; Deskripsi Akun
                            </h2>

                            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                                {account.description || 'Akun siap dimainkan. Seluruh data login (email dan password) telah diverifikasi aman dan bergaransi anti hack-back.'}
                            </div>

                            {/* Fitur Jaminan Transaksi */}
                            <div className="pt-4 border-t border-dropbox-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3 bg-[#0D121F] rounded-xl border border-dropbox-border text-xs space-y-1">
                                    <p className="font-bold text-white">
                                        100% Anti Hack-Back
                                    </p>
                                    <p className="text-[11px] text-dropbox-muted">Garansi perlindungan akun seumur hidup dengan garansi uang kembali.</p>
                                </div>
                                <div className="p-3 bg-[#0D121F] rounded-xl border border-dropbox-border text-xs space-y-1">
                                    <p className="font-bold text-white">
                                        Pengiriman Otomatis
                                    </p>
                                    <p className="text-[11px] text-dropbox-muted">Data akun langsung dikirimkan ke email kamu setelah pembayaran disetujui.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BAGIAN KANAN: Ringkasan Harga & Tombol Checkout (Sticky) */}
                    <div className="lg:col-span-5 space-y-6 sticky top-24">
                        <div className="bg-[#111726] border border-dropbox-border rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl relative overflow-hidden">
                            <div className="space-y-3">
                                {/* Badges */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {account.game?.name && (
                                        <span className="text-xs font-bold text-blue-400 bg-blue-950/80 border border-blue-800/60 px-3 py-1 rounded-full uppercase tracking-wider">
                                            {account.game.name}
                                        </span>
                                    )}
                                    {account.is_hot && (
                                         <span className="text-xs font-black text-amber-300 bg-gradient-to-r from-amber-950 to-rose-950 border border-amber-700/60 px-3 py-1 rounded-full">
                                             HOT ITEM
                                         </span>
                                     )}
                                     {account.status && account.status !== 'tersedia' && (
                                         <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border bg-amber-950/80 text-amber-400 border-amber-700/60">
                                             {account.status}
                                         </span>
                                     )}
                                 </div>

                                 {/* Judul Akun */}
                                 <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                                     {account.title || `Akun Game #${account.account_id}`}
                                 </h1>

                                 <p className="text-xs text-dropbox-muted">
                                     ID Akun: <span className="font-mono text-white font-bold">#{account.account_id}</span>
                                 </p>
                             </div>

                             {/* Harga Akun */}
                             <div className="p-4 bg-[#0A0D15] rounded-2xl border border-dropbox-border space-y-1">
                                 <span className="text-[11px] font-bold text-dropbox-muted uppercase tracking-wider block">
                                     Harga Akun
                                 </span>
                                 <div className="flex items-baseline space-x-2">
                                     <span className="text-3xl font-black text-blue-400">
                                         {formatRupiah(Number(account.price))}
                                     </span>
                                 </div>
                                 <span className="text-[11px] text-emerald-400 font-medium block">
                                     Biaya Layanan Gratis (Rp 0)
                                 </span>
                             </div>

                             {/* Tombol Aksi Pembelian */}
                             <div className="space-y-3 pt-1">
                                 {account.status === 'tersedia' ? (
                                     <Link
                                         href={`/checkout?account_id=${account.account_id}`}
                                         className="w-full bg-dropbox-accent hover:bg-blue-600 text-white font-extrabold text-sm py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 border border-blue-400/30"
                                     >
                                         <span>Beli Sekarang</span>
                                         <span>&rarr;</span>
                                     </Link>
                                 ) : (
                                     <button
                                         disabled
                                         className="w-full bg-slate-800 text-slate-400 font-bold text-sm py-4 rounded-2xl cursor-not-allowed border border-slate-700"
                                     >
                                         Akun Sedang Tidak Tersedia ({account.status})
                                     </button>
                                 )}

                                 {/* Tombol Tanya CS Seputar Akun Ini */}
                                 <a
                                     href={`https://wa.me/6285601133945?text=Halo%20Admin%20TempatAkun%2C%20saya%20tertarik%20dengan%20Akun%20ID%20%23${account.account_id}%20(${encodeURIComponent(account.title || 'Akun Game')})%20seharga%20${encodeURIComponent(formatRupiah(Number(account.price)))}.%20Apakah%20masih%20tersedia%3F`}
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     className="w-full bg-[#182033] hover:bg-[#222c44] text-slate-200 font-bold text-xs py-3 rounded-2xl transition flex items-center justify-center gap-2 border border-dropbox-border"
                                 >
                                     <span>Tanya CS Tentang Akun Ini</span>
                                 </a>
                             </div>

                             {/* Ringkasan Transaksi Cepat */}
                             <div className="pt-4 border-t border-dropbox-border/60 space-y-2 text-xs text-dropbox-muted">
                                 <div className="flex justify-between">
                                     <span>Metode Pembayaran</span>
                                     <span className="text-white font-medium">QRIS, BCA, E-Wallet</span>
                                 </div>
                                 <div className="flex justify-between">
                                     <span>Waktu Proses</span>
                                     <span className="text-emerald-400 font-medium">5-10 Menit Otomatis</span>
                                 </div>
                                 <div className="flex justify-between">
                                     <span>Tipe Pengiriman</span>
                                     <span className="text-white font-medium">Direct Delivery (Email)</span>
                                 </div>
                             </div>
                         </div>
                     </div>

                 </div>

                 {/* Rekomendasi Akun Terkait */}
                 {relatedAccounts.length > 0 && (
                     <div className="space-y-4 pt-8 border-t border-dropbox-border">
                         <div className="flex items-center justify-between">
                             <h2 className="text-lg font-bold text-white">
                                 Akun Serupa Yang Mungkin Kamu Suka
                             </h2>
                            <Link href="/katalog" className="text-xs font-bold text-dropbox-accent hover:text-blue-400 transition">
                                Lihat Semua &rarr;
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                            {relatedAccounts.map((rel) => (
                                <AccountCard key={rel.account_id} account={rel} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Sticky Buy Bar (Tampil paten di atas bottom navigation bar HP, layer teratas di z-40) */}
            <div className="lg:hidden fixed bottom-14 left-0 right-0 z-40 bg-[#0E1422]/95 backdrop-blur-md border-t border-dropbox-border px-4 py-2.5 flex items-center justify-between shadow-2xl">
                <div>
                    <span className="text-[10px] text-dropbox-muted block font-medium">Total Harga</span>
                    <span className="text-base font-black text-blue-400">
                        {formatRupiah(Number(account.price))}
                    </span>
                </div>
                {account.status === 'tersedia' ? (
                    <Link
                        href={`/checkout?account_id=${account.account_id}`}
                        className="bg-dropbox-accent hover:bg-blue-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-900/40 border border-blue-400/30 flex items-center gap-1.5"
                    >
                        <span>Beli Sekarang</span>
                        <span>&rarr;</span>
                    </Link>
                ) : (
                    <span className="text-xs font-bold text-amber-400 px-3 py-1.5 bg-amber-950/80 rounded-xl border border-amber-800/60 capitalize">
                        {account.status}
                    </span>
                )}
            </div>

            {/* Modal Lightbox Fullscreen Gambar */}
            {lightboxOpen && currentImage && (
                <div 
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setLightboxOpen(false)}
                >
                    <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute -top-10 right-0 text-white hover:text-rose-400 text-sm font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20"
                        >
                            Tutup
                        </button>
                        <img
                            src={currentImage}
                            alt="Preview Full"
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-dropbox-border"
                        />
                        {imagesList.length > 1 && (
                            <div className="flex gap-2 mt-4">
                                {imagesList.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i); }}
                                        className={`w-12 h-8 rounded-lg overflow-hidden border-2 ${activeImageIndex === i ? 'border-dropbox-accent' : 'border-white/30'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

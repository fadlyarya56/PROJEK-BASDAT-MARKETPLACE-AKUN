import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { Account } from '@/Components/AccountCard';
import { resolveStorageUrl } from '@/lib/utils';

interface HomeProps {
    hotItems?: Account[];
}

export default function Home({ hotItems = [] }: HomeProps) {
    // State untuk Banner Slider Promosi
    const [activeBanner, setActiveBanner] = useState(0);

    const banners = [
        {
            tag: 'PROMO SPESIAL HARI INI',
            title: 'DISKON HINGGA 30% AKUN SULTAN',
            subtitle: 'Koleksi akun Mobile Legends & eFootball skin langka, siap ranked & turnamen.',
            code: 'HEMAT30',
            bgGradient: 'from-blue-900/60 via-[#111726] to-[#0B0F19]',
            accentColor: 'text-blue-400',
            badgeBg: 'bg-blue-950 border-blue-800 text-blue-300',
            ctaText: 'Serbu Diskon',
            ctaLink: '/katalog',
        },
        {
            tag: 'KEAMANAN PRIORITAS NO. 1',
            title: 'GARANSI ANTI HACK-BACK 100%',
            subtitle: 'Seluruh akun telah diverifikasi penuh. Pembelian aman dipandu langsung oleh CS.',
            code: '100% AMAN',
            bgGradient: 'from-indigo-900/60 via-[#111726] to-[#0B0F19]',
            accentColor: 'text-indigo-400',
            badgeBg: 'bg-indigo-950 border-indigo-800 text-indigo-300',
            ctaText: 'Pelajari Keamanan',
            ctaLink: '/katalog',
        },
        {
            tag: 'PENGIRIMAN INSTAN 24/7',
            title: 'TRANSAKSI CEPAT VIA QRIS & BANK',
            subtitle: 'Setelah pembayaran terverifikasi, data login akun langsung masuk ke email kamu.',
            code: 'INSTANT DELIVERY',
            bgGradient: 'from-emerald-900/60 via-[#111726] to-[#0B0F19]',
            accentColor: 'text-emerald-400',
            badgeBg: 'bg-emerald-950 border-emerald-800 text-emerald-300',
            ctaText: 'Cari Akun Sekarang',
            ctaLink: '/katalog',
        },
    ];

    // Auto slide untuk Banner Promosi
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveBanner((prev) => (prev + 1) % banners.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [banners.length]);

    // State & Slider untuk Bagian HOT ITEMS
    const [hotIndex, setHotIndex] = useState(0);
    const [isHoveredHot, setIsHoveredHot] = useState(false);

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    // Auto rotate Hot Items jika user tidak hover
    useEffect(() => {
        if (hotItems.length <= 1 || isHoveredHot) return;
        const interval = setInterval(() => {
            setHotIndex((prev) => (prev + 1) % hotItems.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [hotItems.length, isHoveredHot]);

    const nextHot = () => {
        if (hotItems.length > 0) {
            setHotIndex((prev) => (prev + 1) % hotItems.length);
        }
    };

    const prevHot = () => {
        if (hotItems.length > 0) {
            setHotIndex((prev) => (prev - 1 + hotItems.length) % hotItems.length);
        }
    };

    // Tampilkan 4 hot items per slide di desktop jika tersedia
    const activeHotAccount = hotItems[hotIndex] || null;

    return (
        <MainLayout>
            <div className="space-y-16 py-4">
                
                {/* 1. HERO SECTION - Dark Gamer Vibe dengan 1 Tombol CTA Saja */}
                <section className="relative rounded-3xl bg-[#0F1524] border border-dropbox-border p-8 sm:p-14 overflow-hidden shadow-2xl">
                    {/* Background Glow Mesh Gaming */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none"></div>

                    <div className="relative z-10 max-w-2xl space-y-6">
                        {/* Live Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 text-xs font-bold tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                            <span>OFFICIAL VERIFIED GAMING STORE</span>
                        </div>

                        {/* Judul Besar Gamer */}
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                            PERFORMANCE &amp; <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
                                VERIFIED ACCOUNTS
                            </span>
                        </h1>

                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg font-normal">
                            Platform transaksi jual beli akun game terpercaya. Dapatkan akun siap turnamen dengan data login 100% aman, terverifikasi, dan bergaransi anti hack-back seumur hidup.
                        </p>

                        {/* HANYA ADA SATU TOMBOL CTA: JELAJAHI KATALOG AKUN (Sesuai Request) */}
                        <div className="pt-2">
                            <Link
                                href="/katalog"
                                className="inline-flex items-center gap-3 bg-dropbox-accent hover:bg-blue-600 text-white font-extrabold text-sm px-8 py-4 rounded-full transition shadow-lg shadow-blue-600/30 border border-blue-400/30 group"
                            >
                                <span>JELAJAHI KATALOG AKUN</span>
                                <span className="group-hover:translate-x-1.5 transition text-base">&rarr;</span>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="pt-6 border-t border-dropbox-border/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                            <span className="flex items-center gap-2">
                                <span className="text-blue-400 font-bold">✓</span> 100% Garansi Login
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="text-blue-400 font-bold">✓</span> Pengiriman Cepat 24/7
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="text-blue-400 font-bold">✓</span> CS Standby Siaga
                            </span>
                        </div>
                    </div>
                </section>

                {/* 2. TEMPAT PROMO BANNER (BANNER SPACE CAROUSEL) */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                                Event &amp; Promo Spesial
                            </h2>
                        </div>
                        {/* Dot Navigasi Banner */}
                        <div className="flex items-center gap-1.5">
                            {banners.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveBanner(i)}
                                    className={`h-2 rounded-full transition-all ${
                                        activeBanner === i ? 'w-6 bg-dropbox-accent' : 'w-2 bg-slate-700 hover:bg-slate-500'
                                    }`}
                                    aria-label={`Banner ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Banner Card Container */}
                    <div className="relative rounded-3xl overflow-hidden border border-dropbox-border shadow-xl min-h-[170px] sm:min-h-[190px] flex items-center">
                        {banners.map((b, idx) => (
                            <div
                                key={idx}
                                className={`absolute inset-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r ${b.bgGradient} transition-opacity duration-700 ${
                                    activeBanner === idx ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                                }`}
                            >
                                <div className="space-y-2 max-w-xl">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${b.badgeBg} inline-block`}>
                                        {b.tag}
                                    </span>
                                    <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                                        {b.title}
                                    </h3>
                                    <p className="text-xs text-slate-300 font-normal">
                                        {b.subtitle}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:block text-right">
                                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">KODE EVENT</span>
                                        <span className="text-sm font-mono font-bold text-white">{b.code}</span>
                                    </div>
                                    <Link
                                        href={b.ctaLink}
                                        className="bg-white hover:bg-slate-200 text-slate-900 font-bold text-xs px-5 py-3 rounded-full transition shadow-md whitespace-nowrap"
                                    >
                                        {b.ctaText} &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. BAGIAN HOT ITEMS (AUTO-SLIDING / CAROUSEL DENGAN PILIHAN ADMIN) */}
                <section 
                    className="space-y-4"
                    onMouseEnter={() => setIsHoveredHot(true)}
                    onMouseLeave={() => setIsHoveredHot(false)}
                >
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-white tracking-tight uppercase">
                                    Hot Items Minggu Ini
                                </h2>
                                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded-full uppercase">
                                    PILIHAN ADMIN
                                </span>
                            </div>
                            <p className="text-xs text-dropbox-muted">
                                Akun paling dicari dan siap dimainkan. Bergeser otomatis setiap 4 detik.
                            </p>
                        </div>

                        {/* Tombol Panah Slider */}
                        {hotItems.length > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={prevHot}
                                    className="w-8 h-8 rounded-full bg-[#111726] hover:bg-dropbox-accent text-white border border-dropbox-border flex items-center justify-center transition text-xs shadow-sm"
                                    aria-label="Item Sebelumnya"
                                >
                                    &#10094;
                                </button>
                                <button
                                    onClick={nextHot}
                                    className="w-8 h-8 rounded-full bg-[#111726] hover:bg-dropbox-accent text-white border border-dropbox-border flex items-center justify-center transition text-xs shadow-sm"
                                    aria-label="Item Selanjutnya"
                                >
                                    &#10095;
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Hot Item Showcase Card Besar + Strip Carousel */}
                    {activeHotAccount ? (
                        <div className="bg-[#111726] border border-dropbox-border rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                                
                                {/* Gambar Hot Item */}
                                <div className="md:col-span-5">
                                    <Link 
                                        href={`/katalog/${activeHotAccount.account_id}`}
                                        className="aspect-video sm:aspect-square bg-[#0A0D15] rounded-2xl overflow-hidden border border-dropbox-border relative block group"
                                    >
                                        <img
                                            src={
                                                resolveStorageUrl(
                                                    activeHotAccount.images_list?.[0] || activeHotAccount.image_url,
                                                    activeHotAccount.image_full_url
                                                ) || ''
                                            }
                                            alt={activeHotAccount.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/0A0D15/3B82F6?text=Hot+Item+Akun';
                                            }}
                                        />
                                        <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                                            HOT #{hotIndex + 1}
                                        </span>
                                    </Link>
                                </div>

                                {/* Spesifikasi & CTA Hot Item */}
                                <div className="md:col-span-7 space-y-4">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-bold text-dropbox-accent uppercase tracking-widest px-2.5 py-1 rounded bg-blue-950/80 border border-blue-800/80 inline-block">
                                            {activeHotAccount.game?.name || 'GAME MARKET'}
                                        </span>
                                        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                                            {activeHotAccount.title || `Akun Game #${activeHotAccount.account_id}`}
                                        </h3>
                                        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                                            {activeHotAccount.description || 'Akun siap dimainkan, hero & skin melimpah, data login lengkap dan bergaransi anti hack-back seumur hidup.'}
                                        </p>
                                    </div>

                                    {/* Harga & Tombol */}
                                    <div className="pt-2 border-t border-dropbox-border flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <span className="text-[10px] text-dropbox-muted block font-semibold uppercase">Harga Spesial</span>
                                            <span className="text-2xl font-black text-blue-400">
                                                {formatRupiah(Number(activeHotAccount.price))}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/katalog/${activeHotAccount.account_id}`}
                                                className="bg-dropbox-accent hover:bg-blue-600 text-white font-extrabold text-xs px-6 py-3.5 rounded-full transition shadow-md shadow-blue-900/30 flex items-center gap-2 border border-blue-400/30"
                                            >
                                                <span>Lihat Detail Akun</span>
                                                <span>&rarr;</span>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Indikator Slider Hot Items */}
                                    {hotItems.length > 1 && (
                                        <div className="pt-3 flex items-center gap-1.5">
                                            {hotItems.map((item, idx) => (
                                                <button
                                                    key={item.account_id}
                                                    onClick={() => setHotIndex(idx)}
                                                    className={`h-1.5 rounded-full transition-all ${
                                                        hotIndex === idx ? 'w-8 bg-dropbox-accent' : 'w-2 bg-slate-700 hover:bg-slate-500'
                                                    }`}
                                                    aria-label={`Hot Item ${idx + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-[#111726] border border-dropbox-border rounded-3xl">
                            <p className="text-dropbox-muted text-xs">Belum ada akun yang ditandai sebagai Hot Item.</p>
                        </div>
                    )}
                </section>

                {/* 4. KEUNGGULAN GAMESTORE (FITUR & TRUST) */}
                <section className="space-y-6 pt-4">
                    <div className="text-center space-y-1 max-w-xl mx-auto">
                        <span className="text-[10px] font-bold text-dropbox-accent uppercase tracking-widest">KENAPA KAMI?</span>
                        <h2 className="text-xl sm:text-2xl font-black text-white">Keamanan Transaksi Terjamin 100%</h2>
                        <p className="text-xs text-dropbox-muted">Standar operasional ketat untuk melindungi pembeli dari segala risiko.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-[#111726] border border-dropbox-border rounded-2xl p-6 space-y-3 hover:border-blue-500/50 transition duration-200">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-white text-sm">Anti Hack-Back Warranty</h3>
                            <p className="text-xs text-dropbox-muted leading-relaxed">
                                Jaminan proteksi akun penuh. Jika akun bermasalah dalam masa garansi, kami berikan penggantian akun atau uang kembali.
                            </p>
                        </div>

                        <div className="bg-[#111726] border border-dropbox-border rounded-2xl p-6 space-y-3 hover:border-blue-500/50 transition duration-200">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-white text-sm">Pengiriman Otomatis 24/7</h3>
                            <p className="text-xs text-dropbox-muted leading-relaxed">
                                Setelah bukti pembayaran disetujui, kredensial login akun langsung dikirim otomatis ke alamat email pengiriman kamu.
                            </p>
                        </div>

                        <div className="bg-[#111726] border border-dropbox-border rounded-2xl p-6 space-y-3 hover:border-blue-500/50 transition duration-200">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-white text-sm">CS Standby Siap Bantu</h3>
                            <p className="text-xs text-dropbox-muted leading-relaxed">
                                Tim bantuan kami selalu siap memandu proses pergantian bind akun (email, password, moonton/konami id) hingga tuntas.
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </MainLayout>
    );
}
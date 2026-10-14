import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';

export default function Home() {
    return (
        <MainLayout>
            <div className="space-y-16 py-4">
                {/* HERO SECTION - Sesuai Referensi Gambar (Split Screen) */}
                <section className="bg-white border border-dropbox-border rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-2xs">
                    
                    {/* Sisi Kiri: Teks & Tombol Aksi */}
                    <div className="lg:col-span-7 space-y-6 z-10">
                        <div className="space-y-4">
                            <div>
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-dropbox-accent bg-dropbox-secondary px-3.5 py-1.5 rounded-full border border-dropbox-accent/20 inline-block">
                                    Official Game Marketplace
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl font-extrabold text-dropbox-text tracking-tight leading-tight pt-1">
                                PERFORMANCE &amp; VERIFIED GAME ACCOUNTS
                            </h1>
                            <p className="text-dropbox-muted text-xs sm:text-sm leading-relaxed font-normal max-w-lg">
                                Platform transaksi jual beli akun game terpercaya. Data terverifikasi 100% aman dengan sistem pengiriman otomatis 24 jam nonstop.
                            </p>
                        </div>

                        {/* Tombol Aksi Kiri */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Link
                                href="/katalog"
                                className="bg-dropbox-accent hover:bg-blue-700 text-white font-semibold text-xs px-7 py-3.5 rounded-full transition shadow-2xs"
                            >
                                JELAJAHI KATALOG
                            </Link>
                            <Link
                                href="/order-status"
                                className="bg-dropbox-bg hover:bg-white text-dropbox-text border border-dropbox-border font-semibold text-xs px-7 py-3.5 rounded-full transition"
                            >
                                LACAK PESANAN
                            </Link>
                        </div>

                        {/* Trust Badges Tipis */}
                        <div className="pt-4 border-t border-dropbox-border/60 flex items-center gap-6 text-[11px] text-dropbox-muted font-medium">
                            <span className="flex items-center gap-1.5">
                                <strong className="text-dropbox-text font-bold">100%</strong> Garansi Login
                            </span>
                            <span className="flex items-center gap-1.5">
                                <strong className="text-dropbox-text font-bold">Instant</strong> Delivery
                            </span>
                            <span className="flex items-center gap-1.5">
                                <strong className="text-dropbox-text font-bold">24/7</strong> Support
                            </span>
                        </div>
                    </div>

                    {/* Sisi Kanan: Visual Preview Card & Shape Geometric */}
                    <div className="lg:col-span-5 relative flex items-center justify-center">
                        {/* Circle Background Accent */}
                        <div className="absolute w-72 h-72 rounded-full bg-dropbox-secondary/70 border border-dropbox-accent/20 -z-0"></div>
                        <div className="absolute w-48 h-48 rounded-full bg-dropbox-accent/10 -bottom-4 -right-4 -z-0"></div>

                        {/* Card Mockup Visual Produk */}
                        <div className="bg-white border border-dropbox-border rounded-2xl p-5 shadow-sm space-y-4 w-full max-w-sm z-10">
                            <div className="aspect-video bg-[#F2F0EB] border border-[#E3DFD7] rounded-xl flex items-center justify-center relative overflow-hidden">
                                <span className="text-dropbox-accent font-bold text-xs uppercase tracking-wider">
                                    [ GAME PREVIEW ]
                                </span>
                                <span className="absolute top-2 right-2 bg-white text-dropbox-accent text-[10px] font-bold px-2 py-0.5 rounded-full border border-dropbox-accent/20">
                                    READY
                                </span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-dropbox-accent uppercase">TERPOPULER</span>
                                <h4 className="text-sm font-bold text-dropbox-text">Akun Game Tournament Ready</h4>
                                <p className="text-xs text-dropbox-muted line-clamp-1">Spesifikasi lengkap, hero &amp; skin melimpah.</p>
                            </div>
                            <div className="pt-2 border-t border-dropbox-border flex items-center justify-between">
                                <span className="text-sm font-extrabold text-dropbox-accent">Rp 250.000</span>
                                <Link
                                    href="/katalog"
                                    className="bg-dropbox-text hover:bg-black text-white text-[11px] font-semibold px-4 py-2 rounded-full transition"
                                >
                                    Lihat Akun
                                </Link>
                            </div>
                        </div>
                    </div>

                </section>

                {/* SECTION FITUR / KEUNGGULAN */}
                <section className="space-y-6">
                    <div className="text-center space-y-1 max-w-xl mx-auto">
                        <h2 className="text-xl font-bold text-dropbox-text">Mengapa Memilih GameStore?</h2>
                        <p className="text-xs text-dropbox-muted">Keamanan transaksi dan kualitas akun adalah prioritas utama kami.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white border border-dropbox-border rounded-2xl p-6 space-y-2">
                            <span className="text-xs font-bold text-dropbox-accent bg-dropbox-secondary px-2.5 py-1 rounded-md inline-block">
                                01
                            </span>
                            <h3 className="text-sm font-bold text-dropbox-text">Data Terverifikasi</h3>
                            <p className="text-xs text-dropbox-muted leading-relaxed">
                                Setiap akun yang dijual telah melalui proses pemeriksaan data login secara presisi dan aman.
                            </p>
                        </div>

                        <div className="bg-white border border-dropbox-border rounded-2xl p-6 space-y-2">
                            <span className="text-xs font-bold text-dropbox-accent bg-dropbox-secondary px-2.5 py-1 rounded-md inline-block">
                                02
                            </span>
                            <h3 className="text-sm font-bold text-dropbox-text">Proses Otomatis</h3>
                            <p className="text-xs text-dropbox-muted leading-relaxed">
                                Setelah pembayaran terkonfirmasi, informasi akun langsung dikirimkan ke email kamu.
                            </p>
                        </div>

                        <div className="bg-white border border-dropbox-border rounded-2xl p-6 space-y-2">
                            <span className="text-xs font-bold text-dropbox-accent bg-dropbox-secondary px-2.5 py-1 rounded-md inline-block">
                                03
                            </span>
                            <h3 className="text-sm font-bold text-dropbox-text">Garansi Transaksi</h3>
                            <p className="text-xs text-dropbox-muted leading-relaxed">
                                Dukungan bantuan penuh jika terjadi kendala pada saat pertama kali melakukan login akun.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CALL TO ACTION FOOTER BANNER */}
                <section className="bg-dropbox-text text-white rounded-3xl p-8 sm:p-10 text-center space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">Siap Untuk Membeli Akun Game?</h2>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                        Cari akun sesuai dengan budget dan spesifikasi yang kamu inginkan di katalog kami.
                    </p>
                    <div>
                        <Link
                            href="/katalog"
                            className="bg-dropbox-accent hover:bg-blue-700 text-white font-semibold text-xs px-8 py-3.5 rounded-full inline-block transition"
                        >
                            BUKA KATALOG AKUN
                        </Link>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
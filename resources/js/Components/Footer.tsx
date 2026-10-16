import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-[#080C14] border-t border-dropbox-border mt-16 text-dropbox-muted">
            <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
                {/* Bagian Grid Atas */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {/* Brand & About (5 cols) */}
                    <div className="md:col-span-5 space-y-4">
                        <Link href="/" className="text-2xl font-black tracking-tight text-white inline-block">
                            AKUN<span className="text-dropbox-accent">KU</span>
                        </Link>
                        <p className="text-xs leading-relaxed max-w-sm">
                            Platform marketplace jual beli akun game nomor satu di Indonesia. 
                            Setiap akun melalui tahap verifikasi keamanan, garansi anti hack-back 100%, 
                            dan proses pengiriman otomatis 24 jam nonstop.
                        </p>
                        <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Sistem Transaksi Otomatis Aktif</span>
                        </div>
                    </div>

                    {/* Navigasi Cepat (3 cols) */}
                    <div className="md:col-span-3 space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                            Navigasi Cepat
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <Link href="/" className="hover:text-white transition">
                                    Beranda Utama
                                </Link>
                            </li>
                            <li>
                                <Link href="/katalog" className="hover:text-white transition">
                                    Katalog Akun Tersedia
                                </Link>
                            </li>
                            <li>
                                <Link href="/order-status" className="hover:text-white transition">
                                    Lacak Status Pesanan
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/login" className="hover:text-white transition text-dropbox-muted/70">
                                    Portal Admin
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service & Sosial Media (4 cols) */}
                    <div className="md:col-span-4 space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                            Layanan Pelanggan &amp; Komunitas
                        </h4>
                        <p className="text-xs leading-relaxed">
                            Punya pertanyaan seputar akun atau butuh panduan? Hubungi admin kami melalui saluran resmi berikut:
                        </p>

                        {/* Ikon Sosial Media & Chat */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-1">
                            {/* WhatsApp */}
                            <a
                                href="https://wa.me/6281234567890"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="WhatsApp Customer Service"
                                className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-700/50 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-sm transition"
                            >
                                💬
                            </a>

                            {/* Discord */}
                            <a
                                href="https://discord.gg/gamestore"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Server Discord Komunitas"
                                className="w-9 h-9 rounded-xl bg-indigo-950/60 border border-indigo-700/50 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-sm transition"
                            >
                                👾
                            </a>

                            {/* Instagram */}
                            <a
                                href="https://instagram.com/gamestore_id"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Instagram Resmi"
                                className="w-9 h-9 rounded-xl bg-pink-950/60 border border-pink-700/50 hover:bg-pink-600 hover:text-white flex items-center justify-center text-sm transition"
                            >
                                📸
                            </a>

                            {/* TikTok */}
                            <a
                                href="https://tiktok.com/@gamestore_id"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="TikTok Gaming Highlights"
                                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 hover:bg-white hover:text-black flex items-center justify-center text-sm transition"
                            >
                                🎵
                            </a>

                            {/* YouTube */}
                            <a
                                href="https://youtube.com/@gamestore_id"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="YouTube Channel"
                                className="w-9 h-9 rounded-xl bg-red-950/60 border border-red-700/50 hover:bg-red-600 hover:text-white flex items-center justify-center text-sm transition"
                            >
                                ▶️
                            </a>
                        </div>

                        <div className="text-[11px] space-y-1 pt-1">
                            <p className="text-white font-medium">Jam Layanan CS: <span className="text-emerald-400">24 Jam / 7 Hari</span></p>
                            <p className="text-dropbox-muted">Email: support@akunku.com</p>
                        </div>
                    </div>
                </div>

                {/* Metode Pembayaran & Keamanan */}
                <div className="pt-6 border-t border-dropbox-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-dropbox-muted">Didukung Metode:</span>
                        <span className="px-2.5 py-1 rounded-md bg-[#111726] border border-dropbox-border text-[11px] font-bold text-white">QRIS</span>
                        <span className="px-2.5 py-1 rounded-md bg-[#111726] border border-dropbox-border text-[11px] font-bold text-white">Bank BCA</span>
                        <span className="px-2.5 py-1 rounded-md bg-[#111726] border border-dropbox-border text-[11px] font-bold text-white">DANA</span>
                        <span className="px-2.5 py-1 rounded-md bg-[#111726] border border-dropbox-border text-[11px] font-bold text-white">GoPay</span>
                        <span className="px-2.5 py-1 rounded-md bg-[#111726] border border-dropbox-border text-[11px] font-bold text-white">OVO</span>
                    </div>

                    <div className="flex items-center space-x-4 text-[11px]">
                        <span>SSL Secured 256-Bit</span>
                        <span>Instant Delivery</span>
                    </div>
                </div>

                {/* Copyright Bawah */}
                <div className="pt-4 border-t border-dropbox-border/40 text-center text-[11px] text-dropbox-muted/70">
                    <p>&copy; {new Date().getFullYear()} AKUNKU Marketplace. Seluruh hak cipta dilindungi undang-undang.</p>
                </div>
            </div>
        </footer>
    );
}

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
                        <Link href="/" className="text-2xl font-black tracking-tight text-white inline-flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white text-xs font-black shadow-md shadow-blue-600/30">
                                T
                            </div>
                            <span>TEMPAT<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">AKUN</span></span>
                            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-400">
                                .MY.ID
                            </span>
                        </Link>
                        <p className="text-xs leading-relaxed max-w-sm">
                            Platform marketplace jual beli akun game terpercaya dan bergaransi di Indonesia. 
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
                                href="https://wa.me/6285601133945?text=Halo%20Admin%20TempatAkun%2C%20saya%20butuh%20bantuan."
                                target="_blank"
                                rel="noopener noreferrer"
                                title="WhatsApp Customer Service"
                                className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 flex items-center justify-center transition shadow-sm"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                            </a>

                            {/* Discord */}
                            <a
                                href="https://discord.gg/tempatakun"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Server Discord Komunitas"
                                className="w-9 h-9 rounded-xl bg-indigo-950/60 border border-indigo-700/50 text-indigo-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 flex items-center justify-center transition shadow-sm"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                </svg>
                            </a>

                            {/* Instagram */}
                            <a
                                href="https://instagram.com/tempatakun_id"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Instagram Resmi"
                                className="w-9 h-9 rounded-xl bg-pink-950/60 border border-pink-700/50 text-pink-400 hover:bg-pink-600 hover:text-white hover:border-pink-500 flex items-center justify-center transition shadow-sm"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>

                            {/* TikTok */}
                            <a
                                href="https://tiktok.com/@tempatakun_id"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="TikTok Gaming Highlights"
                                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:bg-white hover:text-black hover:border-white flex items-center justify-center transition shadow-sm"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.88 3.48 2.69 1.04-.07 2-.63 2.53-1.51.35-.55.49-1.22.48-1.87.03-4.91.02-9.82.02-14.73z" />
                                </svg>
                            </a>

                            {/* YouTube */}
                            <a
                                href="https://youtube.com/@tempatakun_id"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="YouTube Channel"
                                className="w-9 h-9 rounded-xl bg-red-950/60 border border-red-700/50 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-500 flex items-center justify-center transition shadow-sm"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>

                        <div className="text-[11px] space-y-1 pt-1">
                            <p className="text-white font-medium">Jam Layanan CS: <span className="text-emerald-400">24 Jam / 7 Hari</span></p>
                            <p className="text-dropbox-muted">Email: support@tempatakun.id</p>
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

                    <div className="flex items-center space-x-4 text-[11px] text-dropbox-muted">
                        <span>Enkripsi Kredensial 256-Bit</span>
                        <span>•</span>
                        <span>Garansi Anti Hack-Back</span>
                    </div>
                </div>

                {/* Copyright Bawah */}
                <div className="pt-4 border-t border-dropbox-border/40 text-center text-[11px] text-dropbox-muted/70">
                    <p>&copy; {new Date().getFullYear()} TempatAkun. Seluruh hak cipta dilindungi undang-undang.</p>
                </div>
            </div>
        </footer>
    );
}

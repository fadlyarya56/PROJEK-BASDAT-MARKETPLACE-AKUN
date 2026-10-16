import React from 'react';
import { Link } from '@inertiajs/react';
import CustomerSupportWidget from '@/Components/CustomerSupportWidget';
import Footer from '@/Components/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0B0F19] text-dropbox-text font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white">
            {/* Topbar Informasi Gamer */}
            <div className="bg-[#070A10] border-b border-dropbox-border/50 text-dropbox-muted text-[11px] py-2 px-6 text-center font-medium tracking-wide flex items-center justify-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>100% Garansi Login Anti Hack-Back • Pengiriman Otomatis 24/7 • CS Fast Response</span>
            </div>

            {/* Header / Navbar Modern Dark */}
            <header className="bg-[#0B0F19]/90 backdrop-blur-md border-b border-dropbox-border sticky top-0 z-40 transition-colors">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-2xl font-black tracking-tight text-white flex items-center gap-1 group">
                            <span>AKUN</span>
                            <span className="text-dropbox-accent group-hover:text-blue-400 transition">KU</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800/80 text-blue-400 ml-1">
                                STORE
                            </span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider text-dropbox-muted">
                            <Link 
                                href="/" 
                                className="hover:text-white hover:border-b-2 hover:border-dropbox-accent py-1 transition"
                            >
                                Home
                            </Link>
                            <Link 
                                href="/katalog" 
                                className="hover:text-white hover:border-b-2 hover:border-dropbox-accent py-1 transition"
                            >
                                Katalog Akun
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Link
                            href="/katalog"
                            className="hidden sm:inline-flex items-center text-xs font-semibold text-dropbox-muted hover:text-white px-3 py-2 transition"
                        >
                            Cari Akun
                        </Link>
                        <Link
                            href="/order-status"
                            className="bg-dropbox-accent hover:bg-blue-600 text-white px-5 py-2.5 rounded-full transition font-bold text-xs shadow-md shadow-blue-900/30 border border-blue-400/20 flex items-center gap-1.5"
                        >
                            <span>Lacak Pesanan</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-6">
                {children}
            </main>

            {/* Footer Komprehensif dengan Sosmed & CS */}
            <Footer />

            {/* Floating Customer Support Widget Selalu Tersedia */}
            <CustomerSupportWidget />
        </div>
    );
}
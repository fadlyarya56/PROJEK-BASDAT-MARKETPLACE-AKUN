import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import CustomerSupportWidget from '@/Components/CustomerSupportWidget';
import Footer from '@/Components/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();

    return (
        <div className="min-h-screen bg-[#0B0F19] text-dropbox-text font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white">
            {/* Topbar Informasi Gamer */}
            <div className="bg-[#070A10] border-b border-dropbox-border/50 text-dropbox-muted text-[10px] sm:text-[11px] py-1.5 sm:py-2 px-3 sm:px-6 text-center font-medium tracking-wide flex items-center justify-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
                <span className="truncate">100% Garansi Login Anti Hack-Back • Pengiriman Otomatis 24/7 • CS Fast Response</span>
            </div>

            {/* Header / Navbar Modern Dark */}
            <header className="bg-[#0B0F19]/90 backdrop-blur-md border-b border-dropbox-border sticky top-0 z-40 transition-colors">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white text-sm font-black shadow-md shadow-blue-600/30">
                                T
                            </div>
                            <div className="flex items-baseline">
                                <span className="text-white">TEMPAT</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 group-hover:from-blue-300 group-hover:to-cyan-300 transition">AKUN</span>
                            </div>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider text-dropbox-muted">
                            <Link 
                                href="/" 
                                className={`py-1 transition hover:text-white ${url === '/' ? 'text-white border-b-2 border-dropbox-accent' : ''}`}
                            >
                                Home
                            </Link>
                            <Link 
                                href="/katalog" 
                                className={`py-1 transition hover:text-white ${url.startsWith('/katalog') ? 'text-white border-b-2 border-dropbox-accent' : ''}`}
                            >
                                Katalog Akun
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <Link
                            href="/katalog"
                            className="hidden sm:inline-flex items-center text-xs font-semibold text-dropbox-muted hover:text-white px-3 py-2 transition"
                        >
                            Cari Akun
                        </Link>
                        <Link
                            href="/order-status"
                            className="bg-dropbox-accent hover:bg-blue-600 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition font-bold text-xs shadow-md shadow-blue-900/30 border border-blue-400/20 flex items-center gap-1.5"
                        >
                            <span className="hidden sm:inline">Lacak Pesanan</span>
                            <span className="sm:hidden">Lacak</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content dengan padding bawah ramah mobile */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6 pb-24 md:pb-6">
                {children}
            </main>

            {/* Footer Komprehensif dengan Sosmed & CS */}
            <Footer />

            {/* Bottom Navigation Bar Khusus Tampilan Layar HP / Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-lg border-t border-dropbox-border/90 px-4 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
                <Link
                    href="/"
                    className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition ${
                        url === '/' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-[10px]">Home</span>
                </Link>

                <Link
                    href="/katalog"
                    className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition ${
                        url.startsWith('/katalog') ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span className="text-[10px]">Katalog</span>
                </Link>

                <Link
                    href="/order-status"
                    className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition ${
                        url.startsWith('/order-status') || url.startsWith('/invoice') ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span className="text-[10px]">Lacak</span>
                </Link>
            </nav>

            {/* Floating Customer Support Widget Selalu Tersedia di Desktop & Mobile */}
            <CustomerSupportWidget 
                className={Boolean(url.match(/^\/katalog\/\d+/)) ? 'bottom-32 md:bottom-6 right-3 sm:right-6' : 'bottom-16 md:bottom-6 right-3 sm:right-6'} 
            />
        </div>
    );
}
import React from 'react';
import { Link } from '@inertiajs/react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-dropbox-bg text-dropbox-text font-sans antialiased flex flex-col">
            {/* Topbar Informasi */}
            <div className="bg-dropbox-text text-white text-[11px] py-1.5 px-6 text-center font-medium tracking-wide">
                100% Garansi Akun Valid & Transaksi Otomatis 24/7
            </div>

            {/* Header / Navbar */}
            <header className="bg-white border-b border-dropbox-border sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-2xl font-black tracking-tight text-dropbox-text">
                            AKUN<span className="text-dropbox-accent">KU</span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider text-dropbox-muted">
                            <Link href="/" className="hover:text-dropbox-accent transition">
                                Home
                            </Link>
                            <Link href="/katalog" className="hover:text-dropbox-accent transition">
                                Katalog Akun
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="/order-status"
                            className="bg-dropbox-accent hover:bg-blue-700 text-white px-5 py-2 rounded-full transition font-semibold text-xs shadow-2xs"
                        >
                            Cek Pesanan
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-6">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-dropbox-border py-8 text-center text-xs text-dropbox-muted bg-white mt-12">
                <p>&copy; 2026 GameStore Marketplace. All rights reserved.</p>
            </footer>
        </div>
    );
}
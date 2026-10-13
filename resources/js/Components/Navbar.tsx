import React from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar() {
    return (
        <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand / Logo */}
                    <div className="flex items-center space-x-3">
                        <Link href="/" className="text-xl font-bold tracking-wider text-indigo-500 hover:text-indigo-400">
                            GAME<span className="text-white">STORE</span>
                        </Link>
                    </div>

                    {/* Nav Menu */}
                    <div className="flex items-center space-x-6">
                        <Link 
                            href="/" 
                            className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition"
                        >
                            Katalog
                        </Link>
                        <Link 
                            href="/order-status" 
                            className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition shadow-md"
                        >
                            Cek Pesanan
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
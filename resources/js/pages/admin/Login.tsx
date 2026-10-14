import { useState } from 'react';
import { Head } from '@inertiajs/react';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setProcessing(true);

        try {
            const csrfMeta = document.querySelector('meta[name="csrf-token"]');
            const token = csrfMeta?.getAttribute('content') ?? '';

            const res = await fetch('/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                credentials: 'same-origin',
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                window.location.href = '/admin';
            } else {
                setError(data.message ?? 'Kredensial tidak valid. Periksa username dan password.');
            }
        } catch {
            setError('Koneksi ke server gagal. Pastikan backend aktif.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Masuk Admin - AKUNKU" />
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 antialiased text-slate-900">
                <main className="w-full max-w-sm bg-white border border-slate-300 rounded-lg p-6 sm:p-8">
                    
                    {/* Header Brand */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                AKUN<span className="text-blue-700">KU</span>
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700">
                                Internal
                            </span>
                        </div>
                        <h1 className="text-sm font-semibold text-slate-800">Panel Administrator</h1>
                        <p className="text-xs text-slate-600 mt-0.5">Masuk untuk mengelola pesanan, stok, dan audit transaksi.</p>
                    </div>

                    {/* Feedback Alert */}
                    {error && (
                        <div 
                            role="alert" 
                            className="mb-5 p-3 rounded border border-rose-300 bg-rose-50 text-rose-800 text-xs font-medium"
                        >
                            {error}
                        </div>
                    )}

                    {/* Form Login */}
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-xs font-semibold text-slate-800 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Contoh: admin"
                                required
                                autoComplete="username"
                                className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-semibold text-slate-800 mb-1">
                                Kata Sandi
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan kata sandi"
                                required
                                autoComplete="current-password"
                                className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-2 rounded bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-medium py-2 px-4 text-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 disabled:opacity-60"
                        >
                            {processing ? 'Memverifikasi...' : 'Masuk ke Konsol Admin'}
                        </button>
                    </form>

                    {/* Footer Nav */}
                    <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                        <a 
                            href="/" 
                            className="text-xs text-slate-600 hover:text-blue-700 underline underline-offset-2"
                        >
                            Kembali ke Katalog Publik
                        </a>
                    </div>
                </main>
            </div>
        </>
    );
}

import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

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
            <Head title="Masuk Admin - TempatAkun" />

            <div className="min-h-screen bg-[#0B0F19] text-dropbox-text font-sans antialiased flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

                <main className="w-full max-w-sm bg-[#111726] border border-dropbox-border rounded-3xl p-7 sm:p-8 relative z-10 shadow-2xl space-y-6">
                    
                    {/* Header Brand */}
                    <div className="space-y-2 text-center">
                        <div className="inline-flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white text-sm font-black shadow-md shadow-blue-600/30">
                                T
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white">
                                TEMPAT<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">AKUN</span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-400">
                                INTERNAL
                            </span>
                        </div>
                        <h1 className="text-sm font-bold text-white uppercase tracking-wider">
                            Portal Administrator
                        </h1>
                        <p className="text-xs text-dropbox-muted">
                            Masuk untuk verifikasi pembayaran, kelola stok akun, dan audit transaksi.
                        </p>
                    </div>

                    {/* Feedback Alert */}
                    {error && (
                        <div 
                            role="alert" 
                            className="p-3.5 rounded-2xl border border-rose-800/80 bg-rose-950/60 text-rose-300 text-xs font-medium animate-in fade-in duration-200"
                        >
                            {error}
                        </div>
                    )}

                    {/* Form Login */}
                    <form onSubmit={submit} className="space-y-4 text-xs">
                        <div className="space-y-1.5">
                            <label htmlFor="username" className="block font-bold text-white uppercase text-[10px] tracking-wider">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Masukkan username admin"
                                required
                                autoComplete="username"
                                className="w-full bg-[#0A0D15] border border-dropbox-border rounded-xl px-4 py-3 text-white text-xs placeholder:text-dropbox-muted outline-none focus:border-dropbox-accent transition font-medium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block font-bold text-white uppercase text-[10px] tracking-wider">
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
                                className="w-full bg-[#0A0D15] border border-dropbox-border rounded-xl px-4 py-3 text-white text-xs placeholder:text-dropbox-muted outline-none focus:border-dropbox-accent transition font-medium"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-2 bg-dropbox-accent hover:bg-blue-600 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs transition shadow-lg shadow-blue-900/40 border border-blue-400/30 disabled:opacity-60"
                        >
                            {processing ? 'Memverifikasi...' : 'Masuk ke Konsol Admin'}
                        </button>
                    </form>

                    {/* Footer Nav */}
                    <div className="pt-4 border-t border-dropbox-border/60 text-center">
                        <Link 
                            href="/katalog" 
                            className="text-xs text-dropbox-muted hover:text-white font-medium transition"
                        >
                            &larr; Kembali ke Katalog Publik
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}

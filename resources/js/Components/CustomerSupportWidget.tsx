import React, { useState } from 'react';

export default function CustomerSupportWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <aside aria-label="Customer Service & Bantuan" className="fixed bottom-6 right-6 z-50">
            {/* Pop-up Box CS */}
            {isOpen && (
                <div 
                    role="dialog"
                    aria-label="Panel Bantuan Customer Service"
                    className="mb-3 w-80 sm:w-96 bg-[#111726]/95 backdrop-blur-md border border-dropbox-border rounded-2xl shadow-2xl p-5 text-dropbox-text space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
                >
                    {/* Header Pop-up */}
                    <div className="flex items-center justify-between border-b border-dropbox-border pb-3">
                        <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-dropbox-accent/20 border border-dropbox-accent flex items-center justify-center text-dropbox-accent">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                                    Customer Service
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                </h2>
                                <p className="text-[11px] text-dropbox-muted">Online 24/7 • Fast Response</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Tutup Panel Bantuan"
                            className="text-dropbox-muted hover:text-white transition p-1 text-sm font-bold"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Informasi Bantuan */}
                    <p className="text-xs text-dropbox-muted leading-relaxed">
                        Ada kendala saat checkout, ingin tanya spesifikasi akun, atau butuh bantuan garansi? Tim CS siap membantu kamu.
                    </p>

                    {/* Tombol Saluran CS */}
                    <div className="space-y-2">
                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/6281234567890?text=Halo%20Admin%20GameStore%2C%20saya%20butuh%20bantuan%20terkait%20pembelian%20akun%20game."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 hover:border-emerald-500 transition group text-xs text-white font-medium"
                        >
                            <div>
                                <p className="font-bold text-emerald-400 group-hover:text-emerald-300">WhatsApp Official</p>
                                <p className="text-[10px] text-dropbox-muted">+62 812-3456-7890 (Chat Aktif)</p>
                            </div>
                            <span className="text-dropbox-muted group-hover:translate-x-1 transition text-sm">&rarr;</span>
                        </a>

                        {/* Discord Support */}
                        <a
                            href="https://discord.gg/gamestore"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 hover:border-indigo-500 transition group text-xs text-white font-medium"
                        >
                            <div>
                                <p className="font-bold text-indigo-400 group-hover:text-indigo-300">Discord Ticket Support</p>
                                <p className="text-[10px] text-dropbox-muted">Buka tiket bantuan &amp; komunitas</p>
                            </div>
                            <span className="text-dropbox-muted group-hover:translate-x-1 transition text-sm">&rarr;</span>
                        </a>

                        {/* Telegram CS */}
                        <a
                            href="https://t.me/gamestore_cs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl bg-sky-950/40 border border-sky-800/50 hover:border-sky-500 transition group text-xs text-white font-medium"
                        >
                            <div>
                                <p className="font-bold text-sky-400 group-hover:text-sky-300">Telegram Admin</p>
                                <p className="text-[10px] text-dropbox-muted">@gamestore_cs</p>
                            </div>
                            <span className="text-dropbox-muted group-hover:translate-x-1 transition text-sm">&rarr;</span>
                        </a>
                    </div>

                    {/* Jaminan Singkat */}
                    <div className="pt-2 border-t border-dropbox-border/60 flex items-center justify-between text-[10px] text-dropbox-muted">
                        <span>100% Anti Hack-Back</span>
                        <span>Pengiriman Instan</span>
                    </div>
                </div>
            )}

            {/* Tombol Floating Utama */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Buka Chat Customer Service"
                className="group relative flex items-center space-x-2.5 bg-dropbox-accent hover:bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-blue-500/25 transition duration-200 border border-blue-400/30"
            >
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold tracking-wide">Hubungi CS</span>
            </button>
        </aside>
    );
}

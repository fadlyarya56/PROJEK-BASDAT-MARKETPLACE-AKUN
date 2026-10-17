import React, { useState } from 'react';

interface CustomerSupportWidgetProps {
    className?: string;
}

export default function CustomerSupportWidget({ className }: CustomerSupportWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <aside 
            aria-label="Customer Service & Bantuan" 
            className={`fixed z-50 transition-all duration-200 ${className || 'bottom-16 md:bottom-6 right-3 sm:right-6'}`}
        >
            {/* Pop-up Box CS */}
            {isOpen && (
                <div 
                    role="dialog"
                    aria-label="Panel Bantuan Customer Service"
                    className="mb-3 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-[#111726]/95 backdrop-blur-md border border-dropbox-border rounded-2xl shadow-2xl p-4 sm:p-5 text-dropbox-text space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
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
                        Ada kendala saat checkout, ingin tanya spesifikasi akun, atau butuh bantuan garansi? Tim CS TempatAkun siap membantu kamu.
                    </p>

                    {/* Tombol Saluran CS: Hanya WhatsApp */}
                    <div className="space-y-2">
                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/6285601133945?text=Halo%20Admin%20TempatAkun%2C%20saya%20butuh%20bantuan%20terkait%20pembelian%20akun%20game."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-700/60 hover:bg-emerald-900/40 hover:border-emerald-500 transition group text-xs text-white font-medium shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-emerald-400 group-hover:text-emerald-300 text-sm">WhatsApp Official CS</p>
                                    <p className="text-[11px] text-dropbox-muted font-mono">+62 856-0113-3945 (Online)</p>
                                </div>
                            </div>
                            <span className="text-emerald-400 group-hover:translate-x-1 transition text-base font-bold">&rarr;</span>
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
                className="group relative flex items-center space-x-2 bg-dropbox-accent hover:bg-blue-600 text-white px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-lg hover:shadow-blue-500/25 transition duration-200 border border-blue-400/30"
            >
                <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold tracking-wide">CS Help</span>
            </button>
        </aside>
    );
}

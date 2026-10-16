import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { resolveStorageUrl } from '@/lib/utils';

export interface Account {
    account_id: number;
    game_id: number;
    title: string;
    price: number;
    image_url?: string | null;
    image_full_url?: string | null;
    images?: string[] | null;
    images_list?: string[];
    description?: string | null;
    status: string;
    is_hot?: boolean;
    game?: {
        name: string;
    };
}

interface AccountCardProps {
    account: Account;
}

export default function AccountCard({ account }: AccountCardProps) {
    const [imgError, setImgError] = useState(false);

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    // Ambil gambar pertama dari images_list atau image_url
    const firstImage = (account.images_list && account.images_list.length > 0)
        ? account.images_list[0]
        : (account.images && account.images.length > 0)
            ? account.images[0]
            : account.image_url;

    const imageUrl = resolveStorageUrl(firstImage, account.image_full_url);

    return (
        <div className="relative group transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full">
            {/* Outer Aura Glow Blur on Hover (Toned down by 40%) */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/0 via-cyan-500/0 to-indigo-600/0 rounded-2xl blur-xs opacity-0 group-hover:opacity-30 group-hover:from-blue-600/25 group-hover:via-cyan-500/20 group-hover:to-indigo-600/25 transition-all duration-300 pointer-events-none" />

            {/* Main Card Container */}
            <div className="relative bg-[#111726] border border-dropbox-border group-hover:border-blue-500/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-blue-950/40 flex flex-col justify-between flex-1">
                {/* Radial Glow light that fills the interior on hover (Toned down) */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-36 h-36 bg-blue-500/12 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />

                <div className="relative z-10 flex flex-col flex-1">
                    {/* Thumbnail Gambar Pertama */}
                    <Link 
                        href={`/katalog/${account.account_id}`}
                        className="aspect-[4/5] bg-[#0D121F] relative flex items-center justify-center overflow-hidden block"
                    >
                        {imageUrl && !imgError ? (
                            <img
                                src={imageUrl}
                                alt={account.title || `Akun #${account.account_id}`}
                                className="w-full h-full object-cover"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-dropbox-muted p-4 text-center">
                                <svg className="w-8 h-8 mb-1 opacity-30 text-dropbox-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-dropbox-muted font-medium text-[11px]">
                                    No Preview
                                </span>
                            </div>
                        )}

                        {/* Badge Hot Item (Jika dipilih admin) */}
                        {account.is_hot && (
                            <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                                HOT
                            </span>
                        )}

                        {/* Badge Status (Hanya tampil jika bukan 'tersedia') */}
                        {account.status && account.status !== 'tersedia' && (
                            <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm uppercase tracking-wider bg-amber-950/80 text-amber-400 border-amber-700/60">
                                {account.status}
                            </span>
                        )}
                    </Link>

                    {/* Info Produk: Hanya Kategori Game & Nama Akun */}
                    <div className="p-3 sm:p-4 pb-1.5 sm:pb-2 space-y-1">
                        {account.game?.name && (
                            <span className="text-[9px] sm:text-[10px] font-bold text-dropbox-accent uppercase tracking-wider block">
                                {account.game.name}
                            </span>
                        )}
                        <Link href={`/katalog/${account.account_id}`}>
                            <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-2 group-hover:text-blue-400 transition leading-snug" title={account.title}>
                                {account.title || `Akun Game #${account.account_id}`}
                            </h3>
                        </Link>
                    </div>

                    {/* Container Bawah: Harga Selalu di Atas Tombol Lihat Detail */}
                    <div className="mt-auto p-3 sm:p-4 pt-1 sm:pt-2 relative z-10 space-y-2 sm:space-y-2.5">
                        <div className="pt-1.5 sm:pt-2 border-t border-dropbox-border/40">
                            <span className="text-[9px] sm:text-[10px] text-dropbox-muted block font-medium">Harga</span>
                            <span className="text-sm sm:text-base font-black text-blue-400">
                                {formatRupiah(Number(account.price))}
                            </span>
                        </div>

                        <Link
                            href={`/katalog/${account.account_id}`}
                            className="w-full bg-[#182033] group-hover:bg-dropbox-accent text-white font-bold text-[11px] sm:text-xs py-2 sm:py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 border border-dropbox-border group-hover:border-blue-400/50 shadow-sm group-hover:shadow-md group-hover:shadow-blue-600/30"
                        >
                            <span>Lihat Detail</span>
                            <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
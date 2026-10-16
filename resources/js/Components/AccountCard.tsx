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
    const totalPhotos = (account.images_list && account.images_list.length > 0)
        ? account.images_list.length
        : (account.images && account.images.length > 0)
            ? account.images.length
            : (account.image_url ? 1 : 0);

    return (
        <div className="bg-[#111726] border border-dropbox-border rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/30 transition duration-300 flex flex-col justify-between group relative">
            <div>
                {/* Thumbnail Gambar Pertama */}
                <Link 
                    href={`/katalog/${account.account_id}`}
                    className="aspect-square bg-[#0D121F] relative flex items-center justify-center overflow-hidden block"
                >
                    {imageUrl && !imgError ? (
                        <img
                            src={imageUrl}
                            alt={account.title || `Akun #${account.account_id}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
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

                    {/* Gradient Overlay saat Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111726] via-transparent to-transparent opacity-60 pointer-events-none"></div>

                    {/* Badge Hot Item (Jika dipilih admin) */}
                    {account.is_hot && (
                        <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                            HOT
                        </span>
                    )}

                    {/* Badge Multi-Foto */}
                    {totalPhotos > 1 && (
                        <span className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/20">
                            {totalPhotos} Foto
                        </span>
                    )}

                    {/* Badge Status */}
                    <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm uppercase tracking-wider ${
                        account.status === 'tersedia'
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
                            : 'bg-amber-950/80 text-amber-400 border-amber-700/60'
                    }`}>
                        {account.status}
                    </span>
                </Link>

                {/* Info Produk */}
                <div className="p-4 space-y-1.5">
                    {account.game?.name && (
                        <span className="text-[10px] font-bold text-dropbox-accent uppercase tracking-wider block">
                            {account.game.name}
                        </span>
                    )}
                    <Link href={`/katalog/${account.account_id}`}>
                        <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-blue-400 transition" title={account.title}>
                            {account.title || `Akun Game #${account.account_id}`}
                        </h3>
                    </Link>
                    <p className="text-dropbox-muted text-xs line-clamp-2 leading-relaxed">
                        {account.description || 'Spesifikasi akun lengkap, garansi data terverifikasi dan aman digunakan.'}
                    </p>
                    <div className="pt-2 flex items-baseline justify-between">
                        <div>
                            <span className="text-[10px] text-dropbox-muted block font-medium">Harga</span>
                            <span className="text-base font-extrabold text-blue-400">
                                {formatRupiah(Number(account.price))}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tombol Lihat Detail Navigasi Halaman */}
            <div className="p-4 pt-0">
                <Link
                    href={`/katalog/${account.account_id}`}
                    className="w-full bg-[#182033] hover:bg-dropbox-accent text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 border border-dropbox-border hover:border-dropbox-accent shadow-sm"
                >
                    <span>Lihat Detail</span>
                    <span className="text-sm">&rarr;</span>
                </Link>
            </div>
        </div>
    );
}
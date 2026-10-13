import React from 'react';

export interface Account {
    account_id: number;
    game_id: number;
    title: string;
    price: number;
    image_url?: string;
    description?: string;
    status: string;
}

interface AccountCardProps {
    account: Account;
    onDetailClick: (account: Account) => void;
}

export default function AccountCard({ account, onDetailClick }: AccountCardProps) {
    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    return (
        <div className="bg-white border border-dropbox-border/80 rounded-2xl overflow-hidden hover:shadow-md transition duration-200 flex flex-col justify-between group">
            <div>
                {/* Image Placeholder ala E-Retail Clean */}
                <div className="aspect-square bg-[#F2F0EB] relative flex items-center justify-center overflow-hidden">
                    {account.image_url ? (
                        <img
                            src={account.image_url}
                            alt={account.title || `Akun #${account.account_id}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                    ) : (
                        <span className="text-dropbox-muted font-medium text-xs">
                            No Image
                        </span>
                    )}
                    <span className="absolute top-2.5 right-2.5 bg-white text-dropbox-accent text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-dropbox-accent/20 shadow-2xs">
                        {account.status}
                    </span>
                </div>

                {/* Info Produk Minimalis */}
                <div className="p-4 space-y-1">
                    <h3 className="font-bold text-dropbox-text text-sm line-clamp-1 group-hover:text-dropbox-accent transition">
                        {account.title || `Akun Game #${account.account_id}`}
                    </h3>
                    <p className="text-dropbox-muted text-xs line-clamp-2 leading-relaxed">
                        {account.description || 'Akun siap dimainkan, data aman dan valid.'}
                    </p>
                    <p className="text-sm font-black text-dropbox-accent pt-1">
                        {formatRupiah(Number(account.price))}
                    </p>
                </div>
            </div>

            {/* Tombol Beli / Detail */}
            <div className="p-4 pt-0">
                <button
                    onClick={() => onDetailClick(account)}
                    className="w-full bg-dropbox-text hover:bg-black text-white font-semibold text-xs py-2 rounded-xl transition shadow-xs"
                >
                    Lihat Detail
                </button>
            </div>
        </div>
    );
}
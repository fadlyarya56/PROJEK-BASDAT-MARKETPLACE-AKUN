import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import GameFilter, { Game } from '@/Components/GameFilter';
import AccountCard, { Account } from '@/Components/AccountCard';
import { Link } from '@inertiajs/react';

interface CatalogProps {
    games: Game[];
    accounts: Account[];
}

export default function Catalog({ games = [], accounts = [] }: CatalogProps) {
    const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    const filteredAccounts = selectedGameId
        ? accounts.filter((acc) => acc.game_id === selectedGameId)
        : accounts;

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    return (
        <MainLayout>
            <div className="space-y-8">
                {/* Header Judul Halaman Katalog */}
                <div className="space-y-1 border-b border-dropbox-border pb-4">
                    <h1 className="text-2xl font-extrabold text-dropbox-text tracking-tight">
                        Katalog Akun Game Available
                    </h1>
                    <p className="text-dropbox-muted text-xs">
                        Pilih kategori game di bawah untuk menyaring daftar akun yang tersedia.
                    </p>
                </div>

                {/* Filter Kategori Game */}
                <div className="space-y-3">
                    <GameFilter
                        games={games}
                        selectedGameId={selectedGameId}
                        onSelectGame={setSelectedGameId}
                    />
                </div>

                {/* Grid Katalog Akun */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-dropbox-muted font-normal">
                            Menampilkan {filteredAccounts.length} item akun
                        </span>
                    </div>

                    {filteredAccounts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {filteredAccounts.map((account) => (
                                <AccountCard
                                    key={account.account_id}
                                    account={account}
                                    onDetailClick={setSelectedAccount}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white border border-dropbox-border rounded-2xl space-y-2">
                            <p className="text-dropbox-text font-bold text-sm">
                                Stok Akun Belum Tersedia
                            </p>
                            <p className="text-dropbox-muted text-xs">
                                Tidak ada akun yang cocok dengan kategori ini saat ini.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detail Akun Pop-Up */}
            {selectedAccount && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                    <div className="bg-white border border-dropbox-border w-full max-w-lg rounded-2xl overflow-hidden p-6 space-y-5">
                        <div className="flex items-center justify-between border-b border-dropbox-border pb-3">
                            <h3 className="text-sm font-bold text-dropbox-text">
                                Detail Spesifikasi #{selectedAccount.account_id}
                            </h3>
                            <button
                                onClick={() => setSelectedAccount(null)}
                                className="text-dropbox-muted hover:text-dropbox-text transition p-1 font-bold text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="aspect-video bg-[#F2F0EB] border border-[#E3DFD7] rounded-xl overflow-hidden flex items-center justify-center">
                            {selectedAccount.image_url ? (
                                <img
                                    src={selectedAccount.image_url}
                                    alt={selectedAccount.title || `Akun #${selectedAccount.account_id}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-dropbox-muted font-medium text-xs">
                                    No Image Available
                                </span>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <h2 className="text-lg font-bold text-dropbox-text">
                                {selectedAccount.title || `Akun Game #${selectedAccount.account_id}`}
                            </h2>
                            <p className="text-dropbox-muted text-xs font-normal leading-relaxed">
                                {selectedAccount.description || 'Akun siap dimainkan, garansi data terverifikasi dan aman digunakan.'}
                            </p>
                        </div>

                        <div className="pt-3 border-t border-dropbox-border flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-medium text-dropbox-muted block uppercase tracking-wider">
                                    Harga Akun
                                </span>
                                <span className="text-lg font-bold text-dropbox-accent">
                                    {formatRupiah(Number(selectedAccount.price))}
                                </span>
                            </div>
                            <Link
                                href={`/checkout?account_id=${selectedAccount.account_id}`}
                                className="bg-dropbox-accent hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition"
                            >
                                Beli Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
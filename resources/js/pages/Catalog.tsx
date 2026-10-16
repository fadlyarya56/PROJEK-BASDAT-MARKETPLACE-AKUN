import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import GameFilter, { Game } from '@/Components/GameFilter';
import AccountCard, { Account } from '@/Components/AccountCard';

interface CatalogProps {
    games: Game[];
    accounts: Account[];
}

type SortOption = 'newest' | 'oldest' | 'price_asc' | 'price_desc';
type PricePreset = 'all' | 'under_200' | '200_500' | 'above_500' | 'custom';

export default function Catalog({ games = [], accounts = [] }: CatalogProps) {
    const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [pricePreset, setPricePreset] = useState<PricePreset>('all');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [showCustomPrice, setShowCustomPrice] = useState(false);

    // Handler untuk quick preset harga
    const handlePresetChange = (preset: PricePreset) => {
        setPricePreset(preset);
        if (preset === 'all') {
            setMinPrice('');
            setMaxPrice('');
            setShowCustomPrice(false);
        } else if (preset === 'under_200') {
            setMinPrice('');
            setMaxPrice('200000');
            setShowCustomPrice(false);
        } else if (preset === '200_500') {
            setMinPrice('200000');
            setMaxPrice('500000');
            setShowCustomPrice(false);
        } else if (preset === 'above_500') {
            setMinPrice('500000');
            setMaxPrice('');
            setShowCustomPrice(false);
        } else if (preset === 'custom') {
            setShowCustomPrice(true);
        }
    };

    // Reset semua filter & sortir
    const handleResetAll = () => {
        setSelectedGameId(null);
        setSearchQuery('');
        setSortBy('newest');
        setPricePreset('all');
        setMinPrice('');
        setMaxPrice('');
        setShowCustomPrice(false);
    };

    const isFiltered = selectedGameId !== null || 
        searchQuery.trim() !== '' || 
        sortBy !== 'newest' || 
        minPrice !== '' || 
        maxPrice !== '';

    // Filter & Sortir Akun
    const filteredAccounts = accounts
        .filter((acc) => {
            const matchesGame = selectedGameId ? acc.game_id === selectedGameId : true;
            const matchesSearch = searchQuery.trim() === ''
                ? true
                : (acc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   acc.description?.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const priceNum = Number(acc.price);
            const matchesMin = minPrice !== '' ? priceNum >= Number(minPrice) : true;
            const matchesMax = maxPrice !== '' ? priceNum <= Number(maxPrice) : true;

            return matchesGame && matchesSearch && matchesMin && matchesMax;
        })
        .sort((a, b) => {
            if (sortBy === 'price_asc') {
                return Number(a.price) - Number(b.price);
            }
            if (sortBy === 'price_desc') {
                return Number(b.price) - Number(a.price);
            }
            if (sortBy === 'oldest') {
                return a.account_id - b.account_id;
            }
            // default 'newest'
            return b.account_id - a.account_id;
        });

    return (
        <MainLayout>
            <Head title="Katalog Akun Game - TempatAkun" />
            <div className="space-y-8 py-2">
                {/* Header Judul Halaman Katalog Gamer Style */}
                <div className="bg-[#111726] border border-dropbox-border rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-xl">
                            <span className="text-[11px] font-bold text-blue-400 bg-blue-950/80 border border-blue-800/60 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                                Verified Stock Marketplace
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                Katalog Akun Game Siap Pakai
                            </h1>
                            <p className="text-dropbox-muted text-xs leading-relaxed">
                                Gunakan filter harga dan sortir untuk menemukan akun game impianmu secara cepat dan presisi.
                            </p>
                        </div>

                        {/* Search Bar Input */}
                        <div className="w-full md:w-80">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari hero, skin, judul akun..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#0B0F19] border border-dropbox-border rounded-xl px-4 py-3 pl-10 text-white text-xs placeholder:text-dropbox-muted focus:outline-none focus:border-dropbox-accent transition"
                                />
                                <span className="absolute left-3.5 top-3.5 text-dropbox-muted text-xs">
                                    🔍
                                </span>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-3 text-dropbox-muted hover:text-white text-xs"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1. Filter Kategori Game */}
                <div className="space-y-3">
                    <h2 className="text-xs font-bold text-dropbox-muted uppercase tracking-wider">
                        Kategori Game
                    </h2>
                    <GameFilter
                        games={games}
                        selectedGameId={selectedGameId}
                        onSelectGame={setSelectedGameId}
                    />
                </div>

                {/* 2. TOOLBAR FILTER HARGA & SORTIR */}
                <div className="bg-[#111726] border border-dropbox-border rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                        
                        {/* Kiri: Filter Rentang Harga (Quick Chips) */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                                Rentang Harga:
                            </span>

                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handlePresetChange('all')}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                                        pricePreset === 'all'
                                            ? 'bg-dropbox-accent text-white border-dropbox-accent shadow-xs'
                                            : 'bg-[#0B0F19] text-dropbox-muted border-dropbox-border hover:text-white hover:border-slate-600'
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handlePresetChange('under_200')}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                                        pricePreset === 'under_200'
                                            ? 'bg-dropbox-accent text-white border-dropbox-accent shadow-xs'
                                            : 'bg-[#0B0F19] text-dropbox-muted border-dropbox-border hover:text-white hover:border-slate-600'
                                    }`}
                                >
                                    &lt; Rp 200.000
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handlePresetChange('200_500')}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                                        pricePreset === '200_500'
                                            ? 'bg-dropbox-accent text-white border-dropbox-accent shadow-xs'
                                            : 'bg-[#0B0F19] text-dropbox-muted border-dropbox-border hover:text-white hover:border-slate-600'
                                    }`}
                                >
                                    Rp 200rb - 500rb
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handlePresetChange('above_500')}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                                        pricePreset === 'above_500'
                                            ? 'bg-dropbox-accent text-white border-dropbox-accent shadow-xs'
                                            : 'bg-[#0B0F19] text-dropbox-muted border-dropbox-border hover:text-white hover:border-slate-600'
                                    }`}
                                >
                                    &gt; Rp 500.000
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handlePresetChange('custom')}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                                        pricePreset === 'custom'
                                            ? 'bg-dropbox-accent text-white border-dropbox-accent shadow-xs'
                                            : 'bg-[#0B0F19] text-dropbox-muted border-dropbox-border hover:text-white hover:border-slate-600'
                                    }`}
                                >
                                    Custom Min/Max
                                </button>
                            </div>
                        </div>

                        {/* Kanan: Dropdown Sortir */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                                Sortir:
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="bg-[#0B0F19] border border-dropbox-border text-white text-xs font-medium rounded-xl px-3.5 py-2 outline-none focus:border-dropbox-accent transition cursor-pointer"
                            >
                                <option value="newest">Terbaru ke Terlama</option>
                                <option value="oldest">Terlama ke Terbaru</option>
                                <option value="price_asc">Harga: Terendah ke Tertinggi</option>
                                <option value="price_desc">Harga: Tertinggi ke Terendah</option>
                            </select>

                            {/* Tombol Reset Filter jika ada yang aktif */}
                            {isFiltered && (
                                <button
                                    type="button"
                                    onClick={handleResetAll}
                                    className="text-xs text-rose-400 hover:text-rose-300 font-bold px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-800/60 transition"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>

                    </div>

                    {/* Input Custom Min & Max Harga (Jika tombol Custom diklik) */}
                    {showCustomPrice && (
                        <div className="pt-3 border-t border-dropbox-border/60 flex flex-wrap items-center gap-3 animate-in fade-in duration-200">
                            <span className="text-xs text-dropbox-muted">Tentukan Batas Harga:</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="Harga Min (Rp)"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-36 bg-[#0B0F19] border border-dropbox-border rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-dropbox-accent"
                                />
                                <span className="text-dropbox-muted text-xs">-</span>
                                <input
                                    type="number"
                                    placeholder="Harga Max (Rp)"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-36 bg-[#0B0F19] border border-dropbox-border rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-dropbox-accent"
                                />
                            </div>
                            {(minPrice || maxPrice) && (
                                <span className="text-[11px] text-blue-400 font-medium">
                                    Filter aktif: Rp {Number(minPrice || 0).toLocaleString('id-ID')} s/d {maxPrice ? `Rp ${Number(maxPrice).toLocaleString('id-ID')}` : 'Maksimal'}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Info Jumlah Akun */}
                <div className="flex items-center justify-between text-xs text-dropbox-muted">
                    <span>
                        Menampilkan <strong className="text-white">{filteredAccounts.length}</strong> akun game siap beli
                    </span>
                    {sortBy === 'price_asc' && <span className="text-emerald-400 font-medium">Urutan: Harga Termurah</span>}
                    {sortBy === 'price_desc' && <span className="text-blue-400 font-medium">Urutan: Harga Tertinggi</span>}
                </div>

                {/* Grid Katalog Akun */}
                <div className="space-y-4">
                    {filteredAccounts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {filteredAccounts.map((account) => (
                                <AccountCard
                                    key={account.account_id}
                                    account={account}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-[#111726] border border-dropbox-border rounded-3xl space-y-3">
                            <span className="text-4xl">🔎</span>
                            <p className="text-white font-bold text-sm">
                                Tidak Ada Akun Yang Sesuai
                            </p>
                            <p className="text-dropbox-muted text-xs max-w-sm mx-auto">
                                Coba sesuaikan rentang harga, pilih kategori game lain, atau reset filter untuk menampilkan seluruh inventaris akun.
                            </p>
                            <div className="pt-2">
                                <button
                                    onClick={handleResetAll}
                                    className="bg-dropbox-accent hover:bg-blue-600 text-white text-xs font-bold px-6 py-2.5 rounded-full transition shadow-md shadow-blue-900/30"
                                >
                                    Reset Semua Filter
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
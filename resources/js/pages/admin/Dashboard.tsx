import { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { resolveStorageUrl } from '@/lib/utils';

interface DashboardStats {
    pending_payments: number;
    confirmed_payments: number;
    rejected_payments: number;
    available_accounts: number;
    sold_accounts: number;
    total_revenue: number;
}

interface PaymentItem {
    payment_id: number;
    order_id: number;
    method: string;
    proof_image: string | null;
    status: 'menunggu' | 'dikonfirmasi' | 'ditolak';
    confirmed_at: string | null;
    created_at: string;
    order?: {
        order_id: number;
        delivery_email: string;
        status: string;
        account?: {
            account_id: number;
            title: string;
            price: string | number;
            image_url?: string | null;
            images?: string[] | null;
            game?: {
                name: string;
            };
        };
        buyer?: {
            name: string;
            email: string;
            phone: string;
        };
    };
}

interface AccountItem {
    account_id: number;
    game_id: number;
    title: string;
    price: number | string;
    image_url: string | null;
    images?: string[] | null;
    is_hot?: boolean;
    description: string | null;
    account_email: string;
    email_password?: string;
    game_password?: string;
    status: 'tersedia' | 'tertunda' | 'terjual';
    created_at: string;
    game?: {
        game_id: number;
        name: string;
    };
}

interface StatusLog {
    log_id: number;
    account_id: number;
    account_title?: string;
    old_status: string;
    new_status: string;
    changed_at: string;
}

interface GameItem {
    game_id: number;
    name: string;
    webmail_url: string | null;
    guide_url: string | null;
    email_template: string | null;
}

interface ManagedImage {
    id: string;
    type: 'existing' | 'new';
    previewUrl: string;
    path?: string;
    file?: File;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'accounts' | 'logs' | 'games'>('overview');

    // Data State
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [payments, setPayments] = useState<PaymentItem[]>([]);
    const [accounts, setAccounts] = useState<AccountItem[]>([]);
    const [statusLogs, setStatusLogs] = useState<StatusLog[]>([]);
    const [games, setGames] = useState<GameItem[]>([]);

    // UI & Filter States
    const [loading, setLoading] = useState(false);
    const [paymentFilter, setPaymentFilter] = useState<string>('semua');
    const [paymentSearch, setPaymentSearch] = useState<string>('');
    const [accountGameFilter, setAccountGameFilter] = useState<string>('semua');
    const [accountStatusFilter, setAccountStatusFilter] = useState<string>('semua');
    const [accountSearch, setAccountSearch] = useState<string>('');
    const [logSearch, setLogSearch] = useState<string>('');

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Modal state for Add/Edit Account
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<AccountItem | null>(null);
    const [accountForm, setAccountForm] = useState({
        game_id: '1',
        title: '',
        price: '',
        description: '',
        account_email: '',
        email_password: '',
        game_password: '',
        is_hot: false,
        status: 'tersedia',
    });
    const [managedImages, setManagedImages] = useState<ManagedImage[]>([]);
    const [showCredentials, setShowCredentials] = useState<{ [key: number]: boolean }>({});

    // Modal state for Edit Game
    const [isGameModalOpen, setIsGameModalOpen] = useState(false);
    const [editingGame, setEditingGame] = useState<GameItem | null>(null);
    const [gameForm, setGameForm] = useState({
        name: '',
        webmail_url: '',
        guide_url: '',
        email_template: '',
    });

    const getCsrfToken = () => {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
    };

    const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3500);
    };

    const formatRupiah = (val: number | string | undefined | null) => {
        const num = Number(val) || 0;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(num);
    };

    const loadStats = async () => {
        try {
            const res = await fetch('/admin/dashboard-stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch {
            // Keep current stats
        }
    };

    const loadPayments = async (status?: string, search?: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            const targetStatus = status !== undefined ? status : paymentFilter;
            const targetSearch = search !== undefined ? search : paymentSearch;

            if (targetStatus && targetStatus !== 'semua') {
                params.append('status', targetStatus);
            }
            if (targetSearch && targetSearch.trim() !== '') {
                params.append('search', targetSearch.trim());
            }

            const url = params.toString() ? `/admin/payments?${params.toString()}` : '/admin/payments';
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setPayments(data.data || []);
            }
        } catch {
            // Handle error silently
        } finally {
            setLoading(false);
        }
    };

    const loadAccounts = async (gameId?: string, status?: string, search?: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            const targetGame = gameId !== undefined ? gameId : accountGameFilter;
            const targetStatus = status !== undefined ? status : accountStatusFilter;
            const targetSearch = search !== undefined ? search : accountSearch;

            if (targetGame && targetGame !== 'semua') {
                params.append('game_id', targetGame);
            }
            if (targetStatus && targetStatus !== 'semua') {
                params.append('status', targetStatus);
            }
            if (targetSearch && targetSearch.trim() !== '') {
                params.append('search', targetSearch.trim());
            }

            const url = params.toString() ? `/admin/accounts?${params.toString()}` : '/admin/accounts';
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setAccounts(data.data || []);
            }
        } catch {
            // Handle error silently
        } finally {
            setLoading(false);
        }
    };

    const loadLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/admin/status-logs');
            if (res.ok) {
                const data = await res.json();
                setStatusLogs(data || []);
            }
        } catch {
            // Handle error silently
        } finally {
            setLoading(false);
        }
    };

    const loadGames = async () => {
        try {
            const res = await fetch('/admin/games');
            if (res.ok) {
                const data = await res.json();
                setGames(data || []);
                if (data.length > 0 && !accountForm.game_id) {
                    setAccountForm(prev => ({ ...prev, game_id: String(data[0].game_id) }));
                }
            }
        } catch {
            // Handle error silently
        }
    };

    useEffect(() => {
        loadStats();
        loadGames();
        loadPayments();
        loadAccounts();
        loadLogs();
    }, []);

    const handleTabChange = (tab: typeof activeTab) => {
        setActiveTab(tab);
        if (tab === 'overview') {
            loadStats();
            loadLogs();
            loadPayments('menunggu');
        } else if (tab === 'payments') {
            loadPayments(paymentFilter, paymentSearch);
        } else if (tab === 'accounts') {
            loadAccounts(accountGameFilter, accountStatusFilter, accountSearch);
        } else if (tab === 'logs') {
            loadLogs();
        } else if (tab === 'games') {
            loadGames();
        }
    };

    const handleApprovePayment = async (paymentId: number) => {
        if (!confirm('Setujui pembayaran ini? Status pesanan akan menjadi Valid dan akun otomatis Terjual.')) {
            return;
        }
        setActionLoading(paymentId);
        try {
            const res = await fetch(`/admin/payments/${paymentId}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
            });
            const data = await res.json();
            if (res.ok) {
                showNotify(data.message || 'Pembayaran berhasil disetujui.');
                loadPayments(paymentFilter, paymentSearch);
                loadStats();
                loadLogs();
            } else {
                showNotify(data.message || 'Gagal memverifikasi pembayaran.', 'error');
            }
        } catch {
            showNotify('Koneksi terganggu saat memproses permintaan.', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectPayment = async (paymentId: number) => {
        if (!confirm('Tolak pembayaran ini? Akun game akan dikembalikan ke status tersedia.')) {
            return;
        }
        setActionLoading(paymentId);
        try {
            const res = await fetch(`/admin/payments/${paymentId}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
            });
            const data = await res.json();
            if (res.ok) {
                showNotify(data.message || 'Pembayaran ditolak.');
                loadPayments(paymentFilter, paymentSearch);
                loadStats();
                loadLogs();
            } else {
                showNotify(data.message || 'Gagal menolak pembayaran.', 'error');
            }
        } catch {
            showNotify('Koneksi terganggu saat memproses permintaan.', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleResendEmail = async (orderId: number) => {
        setActionLoading(orderId);
        try {
            const res = await fetch(`/admin/orders/${orderId}/resend-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
            });
            const data = await res.json();
            if (res.ok) {
                showNotify(data.message || 'Kredensial akun berhasil dikirim ulang ke email pembeli.');
            } else {
                showNotify(data.message || 'Gagal mengirim ulang email.', 'error');
            }
        } catch {
            showNotify('Koneksi terganggu saat memproses permintaan.', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleHot = async (accountId: number) => {
        try {
            const res = await fetch(`/admin/accounts/${accountId}/toggle-hot`, {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
            });
            const data = await res.json();
            if (res.ok) {
                showNotify(data.message || 'Status Hot Item berhasil diperbarui.');
                loadAccounts(accountGameFilter, accountStatusFilter, accountSearch);
            } else {
                showNotify(data.message || 'Gagal mengubah status Hot Item.', 'error');
            }
        } catch {
            showNotify('Koneksi terganggu saat mengubah status.', 'error');
        }
    };

    const handleQuickStatusToggle = async (accountId: number, targetStatus?: string) => {
        try {
            const res = await fetch(`/admin/accounts/${accountId}/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
                body: JSON.stringify(targetStatus ? { status: targetStatus } : {}),
            });
            const data = await res.json();
            if (res.ok) {
                showNotify(data.message || 'Status akun berhasil diperbarui.');
                loadAccounts(accountGameFilter, accountStatusFilter, accountSearch);
                loadStats();
            } else {
                showNotify(data.message || 'Gagal mengubah status akun.', 'error');
            }
        } catch {
            showNotify('Koneksi terganggu saat mengubah status.', 'error');
        }
    };

    const handleDeleteAccount = async (accountId: number) => {
        if (!confirm('Hapus akun ini dari sistem secara permanen?')) return;
        try {
            const res = await fetch(`/admin/accounts/${accountId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
            });
            const data = await res.json();
            if (res.ok) {
                showNotify(data.message || 'Akun telah dihapus.');
                loadAccounts(accountGameFilter, accountStatusFilter, accountSearch);
                loadStats();
            } else {
                showNotify(data.message || 'Gagal menghapus akun.', 'error');
            }
        } catch {
            showNotify('Koneksi terganggu saat menghapus data.', 'error');
        }
    };

    const openAddAccount = () => {
        setEditingAccount(null);
        setAccountForm({
            game_id: games.length > 0 ? String(games[0].game_id) : '1',
            title: '',
            price: '',
            description: '',
            account_email: '',
            email_password: '',
            game_password: '',
            is_hot: false,
            status: 'tersedia',
        });
        setManagedImages([]);
        setIsAccountModalOpen(true);
    };

    const openEditAccount = async (acc: AccountItem) => {
        setEditingAccount(acc);
        setAccountForm({
            game_id: String(acc.game_id),
            title: acc.title,
            price: String(acc.price),
            description: acc.description || '',
            account_email: acc.account_email || '',
            email_password: acc.email_password || '',
            game_password: acc.game_password || '',
            is_hot: !!acc.is_hot,
            status: acc.status || 'tersedia',
        });

        // Muat gambar yang sudah ada ke dalam daftar managedImages
        const initialImages: ManagedImage[] = [];
        const rawList = (acc.images && acc.images.length > 0)
            ? acc.images
            : (acc.image_url ? [acc.image_url] : []);

        rawList.forEach((path, idx) => {
            if (path) {
                initialImages.push({
                    id: `existing-${idx}-${path}`,
                    type: 'existing',
                    previewUrl: resolveStorageUrl(path) || '',
                    path: path,
                });
            }
        });
        setManagedImages(initialImages);
        setIsAccountModalOpen(true);

        // Fetch fresh detail dari server agar email & password akun yang ada di database terisi lengkap
        try {
            const res = await fetch(`/admin/accounts/${acc.account_id}`);
            if (res.ok) {
                const fresh = await res.json();
                setAccountForm(prev => ({
                    ...prev,
                    account_email: fresh.account_email ?? prev.account_email,
                    email_password: fresh.email_password ?? prev.email_password,
                    game_password: fresh.game_password ?? prev.game_password,
                }));
            }
        } catch {
            // Keep current values
        }
    };

    const handleAddNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const added: ManagedImage[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            added.push({
                id: `new-${Date.now()}-${i}-${file.name}`,
                type: 'new',
                previewUrl: URL.createObjectURL(file),
                file: file,
            });
        }
        setManagedImages(prev => [...prev, ...added]);
        e.target.value = '';
    };

    const handleMoveImage = (index: number, direction: 'left' | 'right') => {
        const target = direction === 'left' ? index - 1 : index + 1;
        if (target < 0 || target >= managedImages.length) return;
        setManagedImages(prev => {
            const arr = [...prev];
            const item = arr[index];
            arr[index] = arr[target];
            arr[target] = item;
            return arr;
        });
    };

    const handleSetAsCover = (index: number) => {
        if (index === 0) return;
        setManagedImages(prev => {
            const arr = [...prev];
            const [item] = arr.splice(index, 1);
            arr.unshift(item);
            return arr;
        });
    };

    const handleDeleteImage = (index: number) => {
        setManagedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSaveAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('game_id', accountForm.game_id);
        formData.append('title', accountForm.title);
        formData.append('price', accountForm.price);
        formData.append('description', accountForm.description);
        formData.append('account_email', accountForm.account_email);
        formData.append('email_password', accountForm.email_password);
        formData.append('game_password', accountForm.game_password);
        formData.append('is_hot', accountForm.is_hot ? '1' : '0');
        formData.append('status', accountForm.status);

        // Susun manifest urutan foto & kumpulkan file baru
        const newFiles: File[] = [];
        const manifest = managedImages.map(img => {
            if (img.type === 'existing') {
                return { type: 'existing', path: img.path };
            } else {
                const newIdx = newFiles.length;
                newFiles.push(img.file!);
                return { type: 'new', new_index: newIdx };
            }
        });

        formData.append('images_manifest', JSON.stringify(manifest));
        newFiles.forEach(file => {
            formData.append('images[]', file);
        });

        const url = editingAccount 
            ? `/admin/accounts/${editingAccount.account_id}` 
            : '/admin/accounts';

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                showNotify(data.message || 'Data akun berhasil disimpan.');
                setIsAccountModalOpen(false);
                setEditingAccount(null);
                setManagedImages([]);
                loadAccounts(accountGameFilter, accountStatusFilter, accountSearch);
                loadStats();
            } else {
                showNotify(data.message || 'Gagal menyimpan data akun.', 'error');
            }
        } catch {
            showNotify('Koneksi terganggu saat menyimpan data.', 'error');
        }
    };

    const handleUpdateGame = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingGame) return;
        try {
            const res = await fetch(`/admin/games/${editingGame.game_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
                body: JSON.stringify(gameForm),
            });
            const data = await res.json();
            if (res.ok) {
                showNotify(data.message || 'Pengaturan game berhasil diperbarui.');
                setIsGameModalOpen(false);
                loadGames();
            } else {
                showNotify(data.message || 'Gagal memperbarui pengaturan game.', 'error');
            }
        } catch {
            showNotify('Koneksi terganggu saat menyimpan pengaturan.', 'error');
        }
    };

    const handleLogout = async () => {
        if (!confirm('Keluar dari panel admin?')) return;
        try {
            await fetch('/admin/logout', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
            });
            window.location.href = '/admin/login';
        } catch {
            window.location.href = '/admin/login';
        }
    };

    // Filter Logs Local
    const filteredLogs = useMemo(() => {
        if (!logSearch.trim()) return statusLogs;
        const q = logSearch.toLowerCase();
        return statusLogs.filter(log => 
            String(log.account_id).includes(q) ||
            (log.account_title && log.account_title.toLowerCase().includes(q)) ||
            log.old_status.toLowerCase().includes(q) ||
            log.new_status.toLowerCase().includes(q)
        );
    }, [statusLogs, logSearch]);

    return (
        <>
            <Head title="Panel Admin - AKUNKU Store" />

            <div className="min-h-screen bg-[#0B0F19] text-dropbox-text font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white">

                {/* Notifikasi Floating Alert */}
                {notification && (
                    <div 
                        role="status"
                        className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl border text-xs font-bold shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-200 ${
                            notification.type === 'success' 
                                ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-300' 
                                : 'bg-rose-950/90 border-rose-500/80 text-rose-300'
                        }`}
                    >
                        {notification.message}
                    </div>
                )}

                {/* Topbar / Header Utama Dashboard Dark Theme */}
                <header className="bg-[#0B0F19]/90 backdrop-blur-md border-b border-dropbox-border sticky top-0 z-30 transition-colors">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/admin" className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                                <span>AKUN</span>
                                <span className="text-dropbox-accent">KU</span>
                            </Link>
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-400">
                                ADMIN CONSOLE
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href="/katalog"
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-slate-300 hover:text-white border border-dropbox-border bg-[#111726] hover:bg-[#182033] px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
                            >
                                <span>Katalog Web</span>
                                <svg className="w-3.5 h-3.5 text-dropbox-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                            <button
                                onClick={handleLogout}
                                className="text-xs font-bold text-rose-400 hover:text-rose-300 border border-rose-900/60 bg-rose-950/40 hover:bg-rose-900/40 px-3.5 py-2 rounded-xl transition"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>

                    {/* Navigasi Tab Modern Gamer Style */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-dropbox-border/60">
                        <nav className="flex space-x-2 overflow-x-auto py-2 text-xs font-bold scrollbar-none">
                            <button
                                onClick={() => handleTabChange('overview')}
                                className={`px-4 py-2 rounded-xl transition ${
                                    activeTab === 'overview'
                                        ? 'bg-dropbox-accent text-white shadow-md shadow-blue-900/30'
                                        : 'text-dropbox-muted hover:text-white hover:bg-[#111726]'
                                }`}
                            >
                                Ringkasan
                            </button>

                            <button
                                onClick={() => handleTabChange('payments')}
                                className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                                    activeTab === 'payments'
                                        ? 'bg-dropbox-accent text-white shadow-md shadow-blue-900/30'
                                        : 'text-dropbox-muted hover:text-white hover:bg-[#111726]'
                                }`}
                            >
                                <span>Verifikasi Pembayaran</span>
                                {stats && stats.pending_payments > 0 && (
                                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.2 rounded-full animate-pulse">
                                        {stats.pending_payments}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => handleTabChange('accounts')}
                                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                                    activeTab === 'accounts'
                                        ? 'bg-dropbox-accent text-white shadow-md shadow-blue-900/30'
                                        : 'text-dropbox-muted hover:text-white hover:bg-[#111726]'
                                }`}
                            >
                                <span>Kelola Stok Akun</span>
                                <span className="text-[11px] text-dropbox-muted/80">({stats?.available_accounts ?? 0})</span>
                            </button>

                            <button
                                onClick={() => handleTabChange('logs')}
                                className={`px-4 py-2 rounded-xl transition ${
                                    activeTab === 'logs'
                                        ? 'bg-dropbox-accent text-white shadow-md shadow-blue-900/30'
                                        : 'text-dropbox-muted hover:text-white hover:bg-[#111726]'
                                }`}
                            >
                                Audit Log Status (Trigger)
                            </button>

                            <button
                                onClick={() => handleTabChange('games')}
                                className={`px-4 py-2 rounded-xl transition ${
                                    activeTab === 'games'
                                        ? 'bg-dropbox-accent text-white shadow-md shadow-blue-900/30'
                                        : 'text-dropbox-muted hover:text-white hover:bg-[#111726]'
                                }`}
                            >
                                Konfigurasi Game &amp; Template
                            </button>
                        </nav>
                    </div>
                </header>

                {/* Konten Halaman */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">

                    {/* TAB 1: RINGKASAN (OVERVIEW) */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            
                            {/* Grid Metrik Statistik Gaming Card */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
                                <div className="bg-[#111726] border border-amber-800/40 rounded-2xl p-4 space-y-1 relative overflow-hidden">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Menunggu</div>
                                    <div className="text-2xl font-black text-amber-300">{stats?.pending_payments ?? 0}</div>
                                    <div className="text-[11px] text-dropbox-muted">Verifikasi tertunda</div>
                                </div>

                                <div className="bg-[#111726] border border-emerald-800/40 rounded-2xl p-4 space-y-1 relative overflow-hidden">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Dikonfirmasi</div>
                                    <div className="text-2xl font-black text-emerald-300">{stats?.confirmed_payments ?? 0}</div>
                                    <div className="text-[11px] text-dropbox-muted">Transaksi sukses</div>
                                </div>

                                <div className="bg-[#111726] border border-rose-800/40 rounded-2xl p-4 space-y-1 relative overflow-hidden">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Ditolak</div>
                                    <div className="text-2xl font-black text-rose-300">{stats?.rejected_payments ?? 0}</div>
                                    <div className="text-[11px] text-dropbox-muted">Bukti tidak sah</div>
                                </div>

                                <div className="bg-[#111726] border border-blue-800/40 rounded-2xl p-4 space-y-1 relative overflow-hidden">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Stok Siap Beli</div>
                                    <div className="text-2xl font-black text-blue-300">{stats?.available_accounts ?? 0}</div>
                                    <div className="text-[11px] text-dropbox-muted">Tersedia di katalog</div>
                                </div>

                                <div className="bg-[#111726] border border-purple-800/40 rounded-2xl p-4 space-y-1 relative overflow-hidden">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Akun Terjual</div>
                                    <div className="text-2xl font-black text-purple-300">{stats?.sold_accounts ?? 0}</div>
                                    <div className="text-[11px] text-dropbox-muted">Terkirim ke pembeli</div>
                                </div>

                                <div className="bg-[#111726] border border-dropbox-border rounded-2xl p-4 space-y-1 relative overflow-hidden col-span-2 md:col-span-1">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Omzet</div>
                                    <div className="text-lg font-black text-blue-400 truncate mt-1">
                                        {formatRupiah(stats?.total_revenue)}
                                    </div>
                                    <div className="text-[11px] text-dropbox-muted">Dari order valid</div>
                                </div>
                            </div>

                            {/* Section: Pesanan Menunggu Tindakan Cepat */}
                            <section className="bg-[#111726] border border-dropbox-border rounded-3xl p-6 space-y-4 shadow-xl">
                                <div className="flex items-center justify-between border-b border-dropbox-border pb-3">
                                    <div>
                                        <h2 className="text-base font-bold text-white">Pesanan Menunggu Persetujuan</h2>
                                        <p className="text-xs text-dropbox-muted">Cek bukti transfer pembeli dan tentukan persetujuan akun.</p>
                                    </div>
                                    <button
                                        onClick={() => handleTabChange('payments')}
                                        className="text-xs text-dropbox-accent hover:text-blue-400 font-bold transition"
                                    >
                                        Buka Semua Pembayaran &rarr;
                                    </button>
                                </div>

                                {payments.filter(p => p.status === 'menunggu').length === 0 ? (
                                    <div className="py-12 text-center text-xs text-dropbox-muted bg-[#0A0D15] rounded-2xl border border-dropbox-border/60">
                                        Tidak ada pesanan yang menunggu persetujuan saat ini. Seluruh transaksi telah diproses.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="border-b border-dropbox-border/80 text-dropbox-muted uppercase font-bold text-[10px] tracking-wider bg-[#0A0D15]/80">
                                                    <th className="p-3">ID Pesanan</th>
                                                    <th className="p-3">Akun Game</th>
                                                    <th className="p-3">Email Pengiriman</th>
                                                    <th className="p-3">Nominal</th>
                                                    <th className="p-3">Bukti</th>
                                                    <th className="p-3 text-right">Tindakan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-dropbox-border/60">
                                                {payments.filter(p => p.status === 'menunggu').slice(0, 5).map(pay => (
                                                    <tr key={pay.payment_id} className="hover:bg-[#182033]/60 transition">
                                                        <td className="p-3 font-mono font-bold text-white">ORD-{pay.order_id}</td>
                                                        <td className="p-3">
                                                            <div className="font-bold text-white">{pay.order?.account?.title || '-'}</div>
                                                            <div className="text-[10px] text-dropbox-accent uppercase font-bold">{pay.order?.account?.game?.name || ''}</div>
                                                        </td>
                                                        <td className="p-3 font-mono text-slate-300">{pay.order?.delivery_email}</td>
                                                        <td className="p-3 font-black text-blue-400">{formatRupiah(pay.order?.account?.price)}</td>
                                                        <td className="p-3">
                                                            {pay.proof_image ? (
                                                                <button
                                                                    onClick={() => setPreviewImage(pay.proof_image)}
                                                                    className="text-dropbox-accent hover:underline font-bold text-xs"
                                                                >
                                                                    Lihat Bukti
                                                                </button>
                                                            ) : (
                                                                <span className="text-dropbox-muted">Tidak ada</span>
                                                            )}
                                                        </td>
                                                        <td className="p-3 text-right space-x-2 whitespace-nowrap">
                                                            <button
                                                                disabled={actionLoading === pay.payment_id}
                                                                onClick={() => handleApprovePayment(pay.payment_id)}
                                                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs transition disabled:opacity-50"
                                                            >
                                                                Setujui
                                                            </button>
                                                            <button
                                                                disabled={actionLoading === pay.payment_id}
                                                                onClick={() => handleRejectPayment(pay.payment_id)}
                                                                className="bg-rose-950/50 hover:bg-rose-900/50 border border-rose-700/60 text-rose-300 px-3 py-1.5 rounded-xl font-bold text-xs transition disabled:opacity-50"
                                                            >
                                                                Tolak
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>

                            {/* Section: Audit Trail Terkini */}
                            <section className="bg-[#111726] border border-dropbox-border rounded-3xl p-6 space-y-4 shadow-xl">
                                <div className="flex items-center justify-between border-b border-dropbox-border pb-3">
                                    <div>
                                        <h2 className="text-base font-bold text-white">Riwayat Perubahan Status (Trigger MySQL)</h2>
                                        <p className="text-xs text-dropbox-muted">Otomatis dicatat oleh trigger basis data saat status akun berubah.</p>
                                    </div>
                                    <button
                                        onClick={() => handleTabChange('logs')}
                                        className="text-xs text-dropbox-accent hover:text-blue-400 font-bold transition"
                                    >
                                        Buka Seluruh Log &rarr;
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="border-b border-dropbox-border/80 text-dropbox-muted uppercase font-bold text-[10px] tracking-wider bg-[#0A0D15]/80">
                                                <th className="p-3">ID Log</th>
                                                <th className="p-3">Nama Akun</th>
                                                <th className="p-3">Status Lama</th>
                                                <th className="p-3">Status Baru</th>
                                                <th className="p-3">Waktu Pencatatan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-dropbox-border/60 font-mono">
                                            {statusLogs.slice(0, 5).map(log => (
                                                <tr key={log.log_id} className="hover:bg-[#182033]/60 transition">
                                                    <td className="p-3 text-dropbox-muted">#{log.log_id}</td>
                                                    <td className="p-3 font-sans font-bold text-white">{log.account_title || `Akun #${log.account_id}`}</td>
                                                    <td className="p-3 text-slate-400">{log.old_status}</td>
                                                    <td className="p-3 font-bold text-emerald-400">{log.new_status}</td>
                                                    <td className="p-3 text-dropbox-muted font-sans">{new Date(log.changed_at).toLocaleString('id-ID')}</td>
                                                </tr>
                                            ))}
                                            {statusLogs.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="p-6 text-center text-dropbox-muted font-sans">
                                                        Belum ada data audit log status.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                        </div>
                    )}

                    {/* TAB 2: VERIFIKASI PEMBAYARAN */}
                    {activeTab === 'payments' && (
                        <div className="bg-[#111726] border border-dropbox-border rounded-3xl p-6 space-y-5 shadow-xl animate-in fade-in duration-200">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-dropbox-border pb-4">
                                <div>
                                    <h2 className="text-base font-bold text-white">Daftar Verifikasi Pembayaran</h2>
                                    <p className="text-xs text-dropbox-muted">Validasi bukti transfer pembeli agar kredensial otomatis terkirim.</p>
                                </div>

                                {/* Filter & Pencarian Toolbar */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Cari ID (ORD-..), email, judul..."
                                            value={paymentSearch}
                                            onChange={(e) => setPaymentSearch(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && loadPayments(paymentFilter, paymentSearch)}
                                            className="bg-[#0A0D15] border border-dropbox-border rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-dropbox-muted outline-none focus:border-dropbox-accent transition w-60"
                                        />
                                    </div>

                                    <select
                                        value={paymentFilter}
                                        onChange={(e) => {
                                            setPaymentFilter(e.target.value);
                                            loadPayments(e.target.value, paymentSearch);
                                        }}
                                        className="bg-[#0A0D15] border border-dropbox-border rounded-xl px-3.5 py-2 text-xs text-white font-medium outline-none focus:border-dropbox-accent cursor-pointer"
                                    >
                                        <option value="semua">Semua Status</option>
                                        <option value="menunggu">Menunggu Konfirmasi</option>
                                        <option value="dikonfirmasi">Dikonfirmasi</option>
                                        <option value="ditolak">Ditolak</option>
                                    </select>

                                    <button
                                        onClick={() => loadPayments(paymentFilter, paymentSearch)}
                                        className="bg-[#182033] hover:bg-dropbox-accent text-white font-bold text-xs px-4 py-2 rounded-xl transition border border-dropbox-border hover:border-dropbox-accent"
                                    >
                                        Cari / Segarkan
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-dropbox-border/80 text-dropbox-muted uppercase font-bold text-[10px] tracking-wider bg-[#0A0D15]/80">
                                            <th className="p-3">ID Pembayaran</th>
                                            <th className="p-3">Pesanan &amp; Akun</th>
                                            <th className="p-3">Email Pengiriman</th>
                                            <th className="p-3">Nominal &amp; Metode</th>
                                            <th className="p-3">Bukti</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3 text-right">Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dropbox-border/60">
                                        {payments.map(pay => (
                                            <tr key={pay.payment_id} className="hover:bg-[#182033]/60 transition">
                                                <td className="p-3 font-mono font-bold text-white">PAY-{pay.payment_id}</td>
                                                <td className="p-3">
                                                    <div className="font-bold text-white font-mono text-[11px]">ORD-{pay.order_id}</div>
                                                    <div className="font-medium text-slate-300 line-clamp-1">{pay.order?.account?.title || '-'}</div>
                                                    <div className="text-[10px] text-dropbox-accent font-bold uppercase">{pay.order?.account?.game?.name || ''}</div>
                                                </td>
                                                <td className="p-3 font-mono text-slate-300">{pay.order?.delivery_email}</td>
                                                <td className="p-3">
                                                    <div className="font-black text-blue-400">{formatRupiah(pay.order?.account?.price)}</div>
                                                    <div className="text-[10px] text-dropbox-muted font-mono">{pay.method}</div>
                                                </td>
                                                <td className="p-3">
                                                    {pay.proof_image ? (
                                                        <button
                                                            onClick={() => setPreviewImage(pay.proof_image)}
                                                            className="text-dropbox-accent hover:underline font-bold text-xs"
                                                        >
                                                            Lihat Bukti
                                                        </button>
                                                    ) : (
                                                        <span className="text-dropbox-muted">Tidak ada</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                        pay.status === 'dikonfirmasi' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60' :
                                                        pay.status === 'ditolak' ? 'bg-rose-950/80 text-rose-400 border-rose-700/60' :
                                                        'bg-amber-950/80 text-amber-400 border-amber-700/60'
                                                    }`}>
                                                        {pay.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right space-x-2 whitespace-nowrap">
                                                    {pay.status === 'menunggu' && (
                                                        <>
                                                            <button
                                                                disabled={actionLoading === pay.payment_id}
                                                                onClick={() => handleApprovePayment(pay.payment_id)}
                                                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl font-bold text-xs transition disabled:opacity-50"
                                                            >
                                                                Setujui
                                                            </button>
                                                            <button
                                                                disabled={actionLoading === pay.payment_id}
                                                                onClick={() => handleRejectPayment(pay.payment_id)}
                                                                className="bg-rose-950/50 hover:bg-rose-900/50 border border-rose-700/60 text-rose-300 px-3 py-1.5 rounded-xl font-bold text-xs transition disabled:opacity-50"
                                                            >
                                                                Tolak
                                                            </button>
                                                        </>
                                                    )}
                                                    {pay.status === 'dikonfirmasi' && (
                                                        <button
                                                            disabled={actionLoading === pay.order_id}
                                                            onClick={() => handleResendEmail(pay.order_id)}
                                                            className="bg-[#182033] hover:bg-blue-600 text-white border border-dropbox-border hover:border-blue-500 px-3 py-1.5 rounded-xl font-bold text-xs transition disabled:opacity-50"
                                                        >
                                                            Kirim Ulang Email
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {payments.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="p-8 text-center text-dropbox-muted">
                                                    {loading ? 'Memuat data pembayaran...' : 'Tidak ada pembayaran yang cocok dengan filter.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: KELOLA STOK AKUN */}
                    {activeTab === 'accounts' && (
                        <div className="bg-[#111726] border border-dropbox-border rounded-3xl p-6 space-y-5 shadow-xl animate-in fade-in duration-200">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-dropbox-border pb-4">
                                <div>
                                    <h2 className="text-base font-bold text-white">Inventaris Akun Game</h2>
                                    <p className="text-xs text-dropbox-muted">Kelola akun, foto galeri spesifikasi, dan kredensial login.</p>
                                </div>

                                {/* Toolbar & Quick Filters */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <input
                                        type="text"
                                        placeholder="Cari ID (#12), judul, email..."
                                        value={accountSearch}
                                        onChange={(e) => setAccountSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && loadAccounts(accountGameFilter, accountStatusFilter, accountSearch)}
                                        className="bg-[#0A0D15] border border-dropbox-border rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-dropbox-muted outline-none focus:border-dropbox-accent transition w-56"
                                    />

                                    <select
                                        value={accountGameFilter}
                                        onChange={(e) => {
                                            setAccountGameFilter(e.target.value);
                                            loadAccounts(e.target.value, accountStatusFilter, accountSearch);
                                        }}
                                        className="bg-[#0A0D15] border border-dropbox-border rounded-xl px-3 py-2 text-xs text-white font-medium outline-none focus:border-dropbox-accent cursor-pointer"
                                    >
                                        <option value="semua">Semua Kategori Game</option>
                                        {games.map(g => (
                                            <option key={g.game_id} value={g.game_id}>{g.name}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={accountStatusFilter}
                                        onChange={(e) => {
                                            setAccountStatusFilter(e.target.value);
                                            loadAccounts(accountGameFilter, e.target.value, accountSearch);
                                        }}
                                        className="bg-[#0A0D15] border border-dropbox-border rounded-xl px-3 py-2 text-xs text-white font-medium outline-none focus:border-dropbox-accent cursor-pointer"
                                    >
                                        <option value="semua">Semua Status</option>
                                        <option value="tersedia">Tersedia</option>
                                        <option value="terjual">Terjual</option>
                                        <option value="tertunda">Tertunda</option>
                                    </select>

                                    <button
                                        onClick={openAddAccount}
                                        className="bg-dropbox-accent hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-blue-900/30 flex items-center gap-1.5"
                                    >
                                        <span>+</span>
                                        <span>Tambah Akun Baru</span>
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-dropbox-border/80 text-dropbox-muted uppercase font-bold text-[10px] tracking-wider bg-[#0A0D15]/80">
                                            <th className="p-3">Cover</th>
                                            <th className="p-3">ID &amp; Judul Akun</th>
                                            <th className="p-3">Game</th>
                                            <th className="p-3">Harga</th>
                                            <th className="p-3">Kredensial Akun</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Hot Item</th>
                                            <th className="p-3 text-right">Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dropbox-border/60">
                                        {accounts.map(acc => {
                                            const thumbUrl = resolveStorageUrl(acc.images?.[0] || acc.image_url);
                                            return (
                                                <tr key={acc.account_id} className="hover:bg-[#182033]/60 transition">
                                                    {/* Cover Photo */}
                                                    <td className="p-3">
                                                        <div className="w-12 h-12 rounded-xl bg-[#0A0D15] border border-dropbox-border overflow-hidden flex items-center justify-center flex-shrink-0">
                                                            {thumbUrl ? (
                                                                <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-[9px] text-dropbox-muted">No Image</span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Judul & ID */}
                                                    <td className="p-3 max-w-xs">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-mono text-dropbox-muted font-bold text-[11px]">#{acc.account_id}</span>
                                                            <Link
                                                                href={`/katalog/${acc.account_id}`}
                                                                target="_blank"
                                                                className="font-bold text-white hover:text-dropbox-accent transition line-clamp-1"
                                                            >
                                                                {acc.title}
                                                            </Link>
                                                        </div>
                                                        <div className="text-[11px] text-dropbox-muted line-clamp-1 mt-0.5">
                                                            {acc.description || 'Tidak ada deskripsi'}
                                                        </div>
                                                    </td>

                                                    {/* Game */}
                                                    <td className="p-3">
                                                        <span className="text-blue-400 font-bold uppercase text-[11px]">
                                                            {acc.game?.name || '-'}
                                                        </span>
                                                    </td>

                                                    {/* Harga */}
                                                    <td className="p-3 font-black text-blue-400 text-sm">
                                                        {formatRupiah(acc.price)}
                                                    </td>

                                                    {/* Kredensial */}
                                                    <td className="p-3">
                                                        <div className="font-mono text-slate-300 text-[11px] truncate max-w-[150px]">{acc.account_email}</div>
                                                        {showCredentials[acc.account_id] && (
                                                            <div className="font-mono text-[10px] text-slate-200 bg-[#0A0D15] p-2 rounded-xl border border-dropbox-border mt-1.5 space-y-1">
                                                                <div><span className="text-dropbox-muted">P.Email:</span> <strong className="text-emerald-400">{acc.email_password || '-'}</strong></div>
                                                                <div><span className="text-dropbox-muted">P.Game:</span> <strong className="text-emerald-400">{acc.game_password || '-'}</strong></div>
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => setShowCredentials(prev => ({ ...prev, [acc.account_id]: !prev[acc.account_id] }))}
                                                            className="text-[10px] text-dropbox-accent hover:underline font-bold mt-1 block"
                                                        >
                                                            {showCredentials[acc.account_id] ? 'Sembunyikan' : 'Lihat Sandi'}
                                                        </button>
                                                    </td>

                                                    {/* Status Switcher (Langsung Ubah Tersedia <-> Terjual) */}
                                                    <td className="p-3">
                                                        <div className="space-y-1">
                                                            <select
                                                                value={acc.status}
                                                                onChange={(e) => handleQuickStatusToggle(acc.account_id, e.target.value)}
                                                                className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-lg border outline-none cursor-pointer transition ${
                                                                    acc.status === 'tersedia'
                                                                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60 hover:border-emerald-500'
                                                                        : acc.status === 'terjual'
                                                                            ? 'bg-purple-950/80 text-purple-400 border-purple-700/60 hover:border-purple-500'
                                                                            : 'bg-amber-950/80 text-amber-400 border-amber-700/60 hover:border-amber-500'
                                                                }`}
                                                                title="Klik untuk mengubah status akun langsung"
                                                            >
                                                                <option value="tersedia" className="bg-[#0B0F19] text-emerald-400">Tersedia</option>
                                                                <option value="terjual" className="bg-[#0B0F19] text-purple-400">Terjual</option>
                                                                <option value="tertunda" className="bg-[#0B0F19] text-amber-400">Tertunda</option>
                                                            </select>
                                                            <div className="text-[9px] text-dropbox-muted">
                                                                {acc.status === 'tersedia' ? 'Di Katalog' : acc.status === 'terjual' ? 'Sudah Laku' : 'Pending'}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Hot Item Toggle */}
                                                    <td className="p-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleHot(acc.account_id)}
                                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition ${
                                                                acc.is_hot 
                                                                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-amber-400 shadow-sm' 
                                                                    : 'bg-[#0A0D15] text-dropbox-muted border-dropbox-border hover:border-slate-500 hover:text-white'
                                                            }`}
                                                        >
                                                            {acc.is_hot ? 'HOT' : 'Normal'}
                                                        </button>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="p-3 text-right space-x-2 whitespace-nowrap">
                                                        <Link
                                                            href={`/katalog/${acc.account_id}`}
                                                            target="_blank"
                                                            className="bg-[#182033] hover:bg-[#202b44] text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl font-bold text-xs transition border border-dropbox-border"
                                                        >
                                                            Lihat
                                                        </Link>
                                                        <button
                                                            onClick={() => openEditAccount(acc)}
                                                            className="bg-dropbox-accent/20 hover:bg-dropbox-accent text-blue-300 hover:text-white border border-blue-500/40 px-2.5 py-1.5 rounded-xl font-bold text-xs transition"
                                                        >
                                                            Ubah
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAccount(acc.account_id)}
                                                            className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 px-2.5 py-1.5 rounded-xl font-bold text-xs transition"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {accounts.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="p-8 text-center text-dropbox-muted">
                                                    {loading ? 'Memuat inventaris akun...' : 'Belum ada akun di kategori ini.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: AUDIT TRAIL LOG STATUS (TRIGGER DATABASE) */}
                    {activeTab === 'logs' && (
                        <div className="bg-[#111726] border border-dropbox-border rounded-3xl p-6 space-y-5 shadow-xl animate-in fade-in duration-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dropbox-border pb-4">
                                <div>
                                    <h2 className="text-base font-bold text-white">Audit Trail Status Akun (Trigger MySQL)</h2>
                                    <p className="text-xs text-dropbox-muted">
                                        Data otomatis tercatat ke tabel <code className="text-blue-400 font-mono bg-[#0A0D15] px-1.5 py-0.5 rounded border border-dropbox-border">status_logs</code> setiap kali ada perubahan status akun.
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        placeholder="Filter ID akun atau status..."
                                        value={logSearch}
                                        onChange={(e) => setLogSearch(e.target.value)}
                                        className="bg-[#0A0D15] border border-dropbox-border rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-dropbox-muted outline-none focus:border-dropbox-accent transition w-56"
                                    />
                                    <button
                                        onClick={loadLogs}
                                        className="bg-[#182033] hover:bg-dropbox-accent text-white font-bold text-xs px-4 py-2 rounded-xl transition border border-dropbox-border"
                                    >
                                        Segarkan Log
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse font-mono">
                                    <thead>
                                        <tr className="border-b border-dropbox-border/80 text-dropbox-muted uppercase font-bold text-[10px] tracking-wider bg-[#0A0D15]/80 font-sans">
                                            <th className="p-3">ID Log</th>
                                            <th className="p-3">ID Akun</th>
                                            <th className="p-3">Nama Akun</th>
                                            <th className="p-3">Status Lama</th>
                                            <th className="p-3">Status Baru</th>
                                            <th className="p-3">Waktu Pencatatan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dropbox-border/60">
                                        {filteredLogs.map(log => (
                                            <tr key={log.log_id} className="hover:bg-[#182033]/60 transition">
                                                <td className="p-3 text-dropbox-muted">#{log.log_id}</td>
                                                <td className="p-3 text-white font-bold">ACC-{log.account_id}</td>
                                                <td className="p-3 font-sans font-bold text-white">{log.account_title || '-'}</td>
                                                <td className="p-3 text-slate-400">
                                                    <span className="px-2 py-0.5 rounded bg-[#0A0D15] border border-dropbox-border">
                                                        {log.old_status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-emerald-400 font-bold">
                                                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">
                                                        {log.new_status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-dropbox-muted font-sans">{new Date(log.changed_at).toLocaleString('id-ID')}</td>
                                            </tr>
                                        ))}
                                        {filteredLogs.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-dropbox-muted font-sans">
                                                    Belum ada riwayat perubahan status yang cocok.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: KONFIGURASI GAME & TEMPLATE EMAIL */}
                    {activeTab === 'games' && (
                        <div className="bg-[#111726] border border-dropbox-border rounded-3xl p-6 space-y-6 shadow-xl animate-in fade-in duration-200">
                            <div className="border-b border-dropbox-border pb-4">
                                <h2 className="text-base font-bold text-white">Konfigurasi Game &amp; Template Email</h2>
                                <p className="text-xs text-dropbox-muted">Atur tautan webmail, panduan pengalihan data akun, dan format pengiriman kredensial otomatis.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {games.map(game => (
                                    <div key={game.game_id} className="bg-[#0A0D15] border border-dropbox-border rounded-2xl p-5 space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-dropbox-border/60">
                                            <h3 className="font-bold text-white text-base">{game.name}</h3>
                                            <button
                                                onClick={() => {
                                                    setEditingGame(game);
                                                    setGameForm({
                                                        name: game.name,
                                                        webmail_url: game.webmail_url || '',
                                                        guide_url: game.guide_url || '',
                                                        email_template: game.email_template || '',
                                                    });
                                                    setIsGameModalOpen(true);
                                                }}
                                                className="text-xs bg-dropbox-accent/20 hover:bg-dropbox-accent text-blue-300 hover:text-white border border-blue-500/40 font-bold px-3 py-1.5 rounded-xl transition"
                                            >
                                                Ubah Konfigurasi
                                            </button>
                                        </div>

                                        <div className="text-xs space-y-3">
                                            <div>
                                                <span className="text-dropbox-muted font-bold block mb-1">Tautan Webmail Akun:</span>
                                                <a href={game.webmail_url || '#'} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline font-mono text-[11px] break-all">
                                                    {game.webmail_url || 'Belum diatur'}
                                                </a>
                                            </div>
                                            <div>
                                                <span className="text-dropbox-muted font-bold block mb-1">Tautan Panduan Pengalihan:</span>
                                                <a href={game.guide_url || '#'} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline font-mono text-[11px] break-all">
                                                    {game.guide_url || 'Belum diatur'}
                                                </a>
                                            </div>
                                            <div>
                                                <span className="text-dropbox-muted font-bold block mb-1">Template Format Email Pengiriman:</span>
                                                <pre className="p-3 bg-[#111726] border border-dropbox-border rounded-xl text-[11px] text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                                                    {game.email_template || 'Belum ada format pesan tersimpan.'}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </main>

                {/* MODAL: PRATINJAU BUKTI PEMBAYARAN */}
                {previewImage && (
                    <div 
                        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
                        onClick={() => setPreviewImage(null)}
                    >
                        <div 
                            className="bg-[#111726] border border-dropbox-border rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 p-5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b border-dropbox-border pb-3">
                                <h3 className="font-bold text-xs uppercase tracking-wider text-white">Bukti Transfer Pembeli</h3>
                                <button
                                    onClick={() => setPreviewImage(null)}
                                    className="text-dropbox-muted hover:text-white text-sm font-bold p-1"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="flex items-center justify-center bg-black/60 rounded-2xl p-2 border border-dropbox-border/60 max-h-[65vh] overflow-auto">
                                <img
                                    src={`/storage/${previewImage}`}
                                    alt="Bukti Transfer"
                                    className="max-w-full max-h-[60vh] object-contain rounded-xl"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = previewImage.startsWith('http') ? previewImage : `/${previewImage}`;
                                    }}
                                />
                            </div>
                            <div className="text-right pt-2 border-t border-dropbox-border/60">
                                <button
                                    onClick={() => setPreviewImage(null)}
                                    className="bg-dropbox-accent hover:bg-blue-600 text-white text-xs font-bold px-5 py-2 rounded-xl transition"
                                >
                                    Selesai
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: TAMBAH / UBAH AKUN DENGAN PREVIEW FOTO REAL-TIME */}
                {isAccountModalOpen && (
                    <div 
                        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
                        onClick={() => setIsAccountModalOpen(false)}
                    >
                        <div 
                            className="bg-[#111726] border border-dropbox-border rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl p-6 space-y-5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b border-dropbox-border pb-3">
                                <h3 className="font-black text-sm uppercase tracking-wider text-white">
                                    {editingAccount ? `Ubah Data Akun #${editingAccount.account_id}` : 'Tambah Stok Akun Game Baru'}
                                </h3>
                                <button
                                    onClick={() => setIsAccountModalOpen(false)}
                                    className="text-dropbox-muted hover:text-white font-bold text-sm p-1"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSaveAccount} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-xs">
                                <div>
                                    <label htmlFor="form-game-id" className="block font-bold text-white uppercase text-[10px] tracking-wider mb-1.5">
                                        Kategori Game <span className="text-rose-400">*</span>
                                    </label>
                                    <select
                                        id="form-game-id"
                                        value={accountForm.game_id}
                                        onChange={e => setAccountForm({ ...accountForm, game_id: e.target.value })}
                                        className="w-full bg-[#0A0D15] border border-dropbox-border rounded-xl p-3 text-xs text-white outline-none focus:border-dropbox-accent"
                                        required
                                    >
                                        {games.map(g => (
                                            <option key={g.game_id} value={g.game_id}>{g.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="form-title" className="block font-bold text-white uppercase text-[10px] tracking-wider mb-1.5">
                                        Judul Akun / Spesifikasi Ringkas <span className="text-rose-400">*</span>
                                    </label>
                                    <input
                                        id="form-title"
                                        type="text"
                                        placeholder="Contoh: Akun Mythic Glory Full Hero &amp; Skin Collector"
                                        value={accountForm.title}
                                        onChange={e => setAccountForm({ ...accountForm, title: e.target.value })}
                                        className="w-full bg-[#0A0D15] border border-dropbox-border rounded-xl p-3 text-xs text-white outline-none focus:border-dropbox-accent placeholder:text-dropbox-muted"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="form-price" className="block font-bold text-white uppercase text-[10px] tracking-wider mb-1.5">
                                        Harga Jual (Rp) <span className="text-rose-400">*</span>
                                    </label>
                                    <input
                                        id="form-price"
                                        type="number"
                                        placeholder="Contoh: 250000"
                                        value={accountForm.price}
                                        onChange={e => setAccountForm({ ...accountForm, price: e.target.value })}
                                        className="w-full bg-[#0A0D15] border border-dropbox-border rounded-xl p-3 text-xs text-white outline-none focus:border-dropbox-accent placeholder:text-dropbox-muted"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="form-status" className="block font-bold text-white uppercase text-[10px] tracking-wider mb-1.5">
                                        Status Ketersediaan Akun <span className="text-rose-400">*</span>
                                    </label>
                                    <select
                                        id="form-status"
                                        value={accountForm.status}
                                        onChange={e => setAccountForm({ ...accountForm, status: e.target.value })}
                                        className="w-full bg-[#0A0D15] border border-dropbox-border rounded-xl p-3 text-xs text-white outline-none focus:border-dropbox-accent cursor-pointer"
                                        required
                                    >
                                        <option value="tersedia">Tersedia (Tampil di Katalog Web)</option>
                                        <option value="terjual">Terjual (Tandai Laku / Non-Aktif)</option>
                                        <option value="tertunda">Tertunda (Sedang dalam Proses Pembayaran)</option>
                                    </select>
                                    <p className="text-[11px] text-dropbox-muted mt-1">
                                        Pilih <strong>Terjual</strong> jika akun sudah dibeli pembeli lewat WhatsApp/offline di luar situs agar tidak dibeli orang lain.
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="form-desc" className="block font-bold text-white uppercase text-[10px] tracking-wider mb-1.5">
                                        Deskripsi Spesifikasi Lengkap
                                    </label>
                                    <textarea
                                        id="form-desc"
                                        rows={3}
                                        placeholder="Tuliskan spesifikasi detail, tier rank, skin langka, win rate, jaminan data..."
                                        value={accountForm.description}
                                        onChange={e => setAccountForm({ ...accountForm, description: e.target.value })}
                                        className="w-full bg-[#0A0D15] border border-dropbox-border rounded-xl p-3 text-xs text-white outline-none focus:border-dropbox-accent placeholder:text-dropbox-muted"
                                    />
                                </div>

                                {/* Kotak Kredensial Akun Game */}
                                <div className="p-4 bg-[#0A0D15] rounded-2xl border border-dropbox-border space-y-3">
                                    <div className="font-bold text-white uppercase text-[10px] tracking-wider text-blue-400">
                                        Kredensial Login (Terkirim Otomatis ke Pembeli)
                                    </div>
                                    <div>
                                        <label htmlFor="form-email" className="block text-slate-300 mb-1 text-[11px]">Email Login Akun</label>
                                        <input
                                            id="form-email"
                                            type="text"
                                            value={accountForm.account_email}
                                            onChange={e => setAccountForm({ ...accountForm, account_email: e.target.value })}
                                            className="w-full bg-[#111726] border border-dropbox-border rounded-xl p-2.5 text-xs text-white outline-none focus:border-dropbox-accent"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label htmlFor="form-email-pass" className="block text-slate-300 mb-1 text-[11px]">Kata Sandi Email</label>
                                            <input
                                                id="form-email-pass"
                                                type="text"
                                                value={accountForm.email_password}
                                                onChange={e => setAccountForm({ ...accountForm, email_password: e.target.value })}
                                                className="w-full bg-[#111726] border border-dropbox-border rounded-xl p-2.5 text-xs text-white outline-none focus:border-dropbox-accent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="form-game-pass" className="block text-slate-300 mb-1 text-[11px]">Kata Sandi Game</label>
                                            <input
                                                id="form-game-pass"
                                                type="text"
                                                value={accountForm.game_password}
                                                onChange={e => setAccountForm({ ...accountForm, game_password: e.target.value })}
                                                className="w-full bg-[#111726] border border-dropbox-border rounded-xl p-2.5 text-xs text-white outline-none focus:border-dropbox-accent"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Gallery Foto Akun & Atur Urutan */}
                                <div className="space-y-3 p-4 bg-[#0A0D15] rounded-2xl border border-dropbox-border">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <label className="block font-bold text-white uppercase text-[10px] tracking-wider">
                                                Kelola Galeri &amp; Urutan Foto Akun
                                            </label>
                                            <p className="text-[11px] text-dropbox-muted">
                                                Foto di urutan pertama otomatis menjadi <strong>Cover Utama</strong> di katalog. Gunakan tombol panah untuk menukar posisi.
                                            </p>
                                        </div>

                                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm self-start sm:self-auto flex-shrink-0">
                                            <span>+ Tambah Foto</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleAddNewImages}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {managedImages.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                            {managedImages.map((img, idx) => (
                                                <div
                                                    key={img.id}
                                                    className={`relative rounded-xl overflow-hidden border bg-[#111726] flex flex-col justify-between group shadow-sm transition ${
                                                        idx === 0
                                                            ? 'border-blue-500 ring-1 ring-blue-500/50'
                                                            : 'border-dropbox-border hover:border-slate-600'
                                                    }`}
                                                >
                                                    {/* Image Preview */}
                                                    <div className="aspect-[4/5] relative overflow-hidden bg-black flex items-center justify-center">
                                                        <img
                                                            src={img.previewUrl}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />

                                                        {/* Badge Cover */}
                                                        {idx === 0 ? (
                                                            <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-md tracking-wider">
                                                                COVER UTAMA
                                                            </span>
                                                        ) : (
                                                            <span className="absolute top-1.5 left-1.5 bg-black/70 text-slate-300 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                                                #{idx + 1}
                                                            </span>
                                                        )}

                                                        {/* Tombol Hapus */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteImage(idx)}
                                                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white flex items-center justify-center text-xs transition shadow-md"
                                                            title="Hapus foto ini"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>

                                                    {/* Toolbar Reorder Bawah */}
                                                    <div className="p-1.5 bg-[#0D121F] border-t border-dropbox-border/80 flex items-center justify-between text-[10px]">
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                disabled={idx === 0}
                                                                onClick={() => handleMoveImage(idx, 'left')}
                                                                className="w-6 h-6 rounded-lg bg-[#182033] hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-[#182033] text-white flex items-center justify-center transition font-bold"
                                                                title="Geser ke kiri / prioritaskan urutan"
                                                            >
                                                                &#10094;
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={idx === managedImages.length - 1}
                                                                onClick={() => handleMoveImage(idx, 'right')}
                                                                className="w-6 h-6 rounded-lg bg-[#182033] hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-[#182033] text-white flex items-center justify-center transition font-bold"
                                                                title="Geser ke kanan / turunkan urutan"
                                                            >
                                                                &#10095;
                                                            </button>
                                                        </div>

                                                        {idx !== 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSetAsCover(idx)}
                                                                className="text-[9px] font-bold text-blue-400 hover:text-blue-300 hover:underline px-1"
                                                                title="Jadikan foto ini cover utama di katalog"
                                                            >
                                                                Set Cover
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 border border-dashed border-dropbox-border rounded-xl">
                                            <p className="text-xs text-dropbox-muted mb-2">Belum ada foto yang ditambahkan untuk akun ini.</p>
                                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-[#182033] hover:bg-[#202b44] text-white rounded-xl text-xs font-bold transition border border-dropbox-border">
                                                <span>Pilih Foto dari Komputer</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleAddNewImages}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* Checkbox Hot Item */}
                                <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-2xl flex items-center gap-3">
                                    <input
                                        id="form-is-hot"
                                        type="checkbox"
                                        checked={accountForm.is_hot}
                                        onChange={e => setAccountForm({ ...accountForm, is_hot: e.target.checked })}
                                        className="h-4 w-4 rounded border-amber-400 text-amber-500 focus:ring-amber-500 bg-[#0A0D15] cursor-pointer"
                                    />
                                    <label htmlFor="form-is-hot" className="text-xs font-bold text-amber-300 cursor-pointer">
                                        Tampilkan Sebagai HOT ITEM di Beranda Utama
                                    </label>
                                </div>

                                <div className="pt-3 flex justify-end gap-3 border-t border-dropbox-border">
                                    <button
                                        type="button"
                                        onClick={() => setIsAccountModalOpen(false)}
                                        className="px-4 py-2.5 rounded-xl border border-dropbox-border text-slate-300 hover:text-white hover:bg-[#182033] font-bold text-xs transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 rounded-xl bg-dropbox-accent hover:bg-blue-600 text-white font-extrabold text-xs transition shadow-md shadow-blue-900/30"
                                    >
                                        Simpan Akun
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: UBAH KONFIGURASI GAME */}
                {isGameModalOpen && editingGame && (
                    <div 
                        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
                        onClick={() => setIsGameModalOpen(false)}
                    >
                        <div 
                            className="bg-[#111726] border border-dropbox-border rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b border-dropbox-border pb-3">
                                <h3 className="font-black text-sm uppercase tracking-wider text-white">
                                    Konfigurasi Game: {editingGame.name}
                                </h3>
                                <button
                                    onClick={() => setIsGameModalOpen(false)}
                                    className="text-dropbox-muted hover:text-white font-bold text-sm p-1"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleUpdateGame} className="space-y-4 text-xs">
                                <div>
                                    <label htmlFor="form-game-name" className="block font-bold text-white uppercase text-[10px] tracking-wider mb-1.5">
                                        Nama Game
                                    </label>
                                    <input
                                        id="form-game-name"
                                        type="text"
                                        value={gameForm.name}
                                        onChange={e => setGameForm({ ...gameForm, name: e.target.value })}
                                        className="w-full bg-[#0A0D15] border border-dropbox-border rounded-xl p-3 text-xs text-white outline-none focus:border-dropbox-accent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="form-game-webmail" className="block font-bold text-white uppercase text-[10px] tracking-wider mb-1.5">
                                        Tautan Webmail Akun
                                    </label>
                                    <input
                                        id="form-game-webmail"
                                        type="url"
                                        value={gameForm.webmail_url}
                                        onChange={e => setGameForm({ ...gameForm, webmail_url: e.target.value })}
                                        placeholder="https://mail.google.com"
                                        className="w-full bg-[#0A0D15] border border-dropbox-border rounded-xl p-3 text-xs text-white outline-none focus:border-dropbox-accent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="form-game-guide" className="block font-bold text-white uppercase text-[10px] tracking-wider mb-1.5">
                                        Tautan Petunjuk Pengalihan Akun
                                    </label>
                                    <input
                                        id="form-game-guide"
                                        type="url"
                                        value={gameForm.guide_url}
                                        onChange={e => setGameForm({ ...gameForm, guide_url: e.target.value })}
                                        placeholder="https://panduan.contoh.com"
                                        className="w-full bg-[#0A0D15] border border-dropbox-border rounded-xl p-3 text-xs text-white outline-none focus:border-dropbox-accent"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label htmlFor="form-game-template" className="block font-bold text-white uppercase text-[10px] tracking-wider">
                                            Template Format Email Otomatis
                                        </label>
                                        <span className="text-[10px] text-blue-400 font-medium">Gunakan Placeholder</span>
                                    </div>
                                    <textarea
                                        id="form-game-template"
                                        rows={6}
                                        value={gameForm.email_template}
                                        onChange={e => setGameForm({ ...gameForm, email_template: e.target.value })}
                                        placeholder="Contoh:&#10;Email: {email}&#10;Password: {game_pw}&#10;Webmail: {webmail_url}"
                                        className="w-full bg-[#0A0D15] border border-dropbox-border rounded-xl p-3 text-xs text-white outline-none focus:border-dropbox-accent font-mono leading-relaxed"
                                    />
                                    <div className="pt-2 space-y-1.5">
                                        <span className="text-[10px] text-dropbox-muted font-bold block">Tag Placeholder Tersedia (Klik untuk masukkan):</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {[
                                                { tag: '{game_name}', desc: 'Nama Game' },
                                                { tag: '{email}', desc: 'Email Akun' },
                                                { tag: '{email_pw}', desc: 'Pass Email' },
                                                { tag: '{game_pw}', desc: 'Pass Game' },
                                                { tag: '{webmail_url}', desc: 'Link Webmail' },
                                                { tag: '{guide_url}', desc: 'Link Panduan' },
                                            ].map((item) => (
                                                <button
                                                    type="button"
                                                    key={item.tag}
                                                    onClick={() => setGameForm(prev => ({ ...prev, email_template: (prev.email_template ? prev.email_template + ' ' : '') + item.tag }))}
                                                    className="px-2 py-0.5 rounded-lg bg-[#182033] hover:bg-dropbox-accent text-slate-300 hover:text-white border border-dropbox-border text-[10px] font-mono transition"
                                                    title={`Sisipkan ${item.desc}`}
                                                >
                                                    {item.tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 flex justify-end gap-3 border-t border-dropbox-border">
                                    <button
                                        type="button"
                                        onClick={() => setIsGameModalOpen(false)}
                                        className="px-4 py-2.5 rounded-xl border border-dropbox-border text-slate-300 hover:text-white hover:bg-[#182033] font-bold text-xs transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 rounded-xl bg-dropbox-accent hover:bg-blue-600 text-white font-extrabold text-xs transition shadow-md shadow-blue-900/30"
                                    >
                                        Simpan Konfigurasi
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}

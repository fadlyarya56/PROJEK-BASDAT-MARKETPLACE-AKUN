import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';

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

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'accounts' | 'logs' | 'games'>('overview');
    
    // Data State
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [payments, setPayments] = useState<PaymentItem[]>([]);
    const [accounts, setAccounts] = useState<AccountItem[]>([]);
    const [statusLogs, setStatusLogs] = useState<StatusLog[]>([]);
    const [games, setGames] = useState<GameItem[]>([]);
    
    // UI Interaction State
    const [loading, setLoading] = useState(false);
    const [paymentFilter, setPaymentFilter] = useState<string>('semua');
    const [accountGameFilter, setAccountGameFilter] = useState<string>('semua');
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
    });
    const [accountImageFile, setAccountImageFile] = useState<File | null>(null);
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

    const loadStats = async () => {
        try {
            const res = await fetch('/admin/dashboard-stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch {
            // Keep existing state
        }
    };

    const loadPayments = async (status?: string) => {
        setLoading(true);
        try {
            const url = status && status !== 'semua' ? `/admin/payments?status=${status}` : '/admin/payments';
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setPayments(data.data || []);
            }
        } catch {
            // Error handling
        } finally {
            setLoading(false);
        }
    };

    const loadAccounts = async (gameId?: string) => {
        setLoading(true);
        try {
            const url = gameId && gameId !== 'semua' ? `/admin/accounts?game_id=${gameId}` : '/admin/accounts';
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setAccounts(data.data || []);
            }
        } catch {
            // Error handling
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
            // Error handling
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
            // Error handling
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
            loadPayments(paymentFilter);
        } else if (tab === 'accounts') {
            loadAccounts(accountGameFilter);
        } else if (tab === 'logs') {
            loadLogs();
        } else if (tab === 'games') {
            loadGames();
        }
    };

    const handleApprovePayment = async (paymentId: number) => {
        if (!confirm('Konfirmasi verifikasi pembayaran ini? Database akan memperbarui order dan stok akun.')) {
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
                showNotify(data.message || 'Pembayaran telah disetujui.');
                loadPayments(paymentFilter);
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
                loadPayments(paymentFilter);
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
                showNotify(data.message || 'Kredensial berhasil dikirim ulang ke pembeli.');
            } else {
                showNotify(data.message || 'Gagal mengirim ulang email.', 'error');
            }
        } catch {
            showNotify('Koneksi terganggu saat memproses permintaan.', 'error');
        } finally {
            setActionLoading(null);
        }
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
        if (accountImageFile) {
            formData.append('image', accountImageFile);
        }

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
                loadAccounts(accountGameFilter);
                loadStats();
            } else {
                showNotify(data.message || 'Gagal menyimpan data akun.', 'error');
            }
        } catch {
            showNotify('Koneksi terganggu saat menyimpan data.', 'error');
        }
    };

    const handleDeleteAccount = async (accountId: number) => {
        if (!confirm('Hapus akun ini dari sistem?')) return;
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
                loadAccounts(accountGameFilter);
                loadStats();
            } else {
                showNotify(data.message || 'Gagal menghapus akun.', 'error');
            }
        } catch {
            showNotify('Koneksi terganggu saat menghapus data.', 'error');
        }
    };

    const openEditAccount = (acc: AccountItem) => {
        setEditingAccount(acc);
        setAccountForm({
            game_id: String(acc.game_id),
            title: acc.title,
            price: String(acc.price),
            description: acc.description || '',
            account_email: acc.account_email,
            email_password: acc.email_password || '',
            game_password: acc.game_password || '',
        });
        setAccountImageFile(null);
        setIsAccountModalOpen(true);
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
        });
        setAccountImageFile(null);
        setIsAccountModalOpen(true);
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
                showNotify(data.message || 'Pengaturan game diperbarui.');
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

    const formatRupiah = (val: number | string | undefined | null) => {
        const num = Number(val) || 0;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(num);
    };

    return (
        <>
            <Head title="Panel Admin - AKUNKU" />
            <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased">
                
                {/* Notifikasi Status */}
                {notification && (
                    <div 
                        role="status"
                        className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded border text-xs font-semibold shadow-md ${
                            notification.type === 'success' 
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                                : 'bg-rose-50 border-rose-300 text-rose-900'
                        }`}
                    >
                        {notification.message}
                    </div>
                )}

                {/* Header Utama */}
                <header className="bg-white border-b border-slate-300 sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold tracking-tight text-slate-900">
                                AKUN<span className="text-blue-700">KU</span>
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700">
                                Panel Admin
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href="/"
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-medium text-slate-700 hover:text-blue-700 border border-slate-300 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded transition-colors"
                            >
                                Katalog Pembeli
                            </a>
                            <button
                                onClick={handleLogout}
                                className="text-xs font-medium text-rose-700 hover:text-rose-900 border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded transition-colors"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>

                    {/* Navigasi Tab */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200">
                        <nav className="flex space-x-1 overflow-x-auto py-1.5 text-xs">
                            <button
                                onClick={() => handleTabChange('overview')}
                                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                                    activeTab === 'overview'
                                        ? 'bg-blue-700 text-white'
                                        : 'text-slate-700 hover:bg-slate-200/70'
                                }`}
                            >
                                Ringkasan
                            </button>
                            <button
                                onClick={() => handleTabChange('payments')}
                                className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1.5 ${
                                    activeTab === 'payments'
                                        ? 'bg-blue-700 text-white'
                                        : 'text-slate-700 hover:bg-slate-200/70'
                                }`}
                            >
                                Verifikasi Pembayaran
                                {stats && stats.pending_payments > 0 && (
                                    <span className="bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                        {stats.pending_payments}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => handleTabChange('accounts')}
                                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                                    activeTab === 'accounts'
                                        ? 'bg-blue-700 text-white'
                                        : 'text-slate-700 hover:bg-slate-200/70'
                                }`}
                            >
                                Kelola Akun ({stats?.available_accounts ?? 0})
                            </button>
                            <button
                                onClick={() => handleTabChange('logs')}
                                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                                    activeTab === 'logs'
                                        ? 'bg-blue-700 text-white'
                                        : 'text-slate-700 hover:bg-slate-200/70'
                                }`}
                            >
                                Log Perubahan Status (Trigger Basdat)
                            </button>
                            <button
                                onClick={() => handleTabChange('games')}
                                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                                    activeTab === 'games'
                                        ? 'bg-blue-700 text-white'
                                        : 'text-slate-700 hover:bg-slate-200/70'
                                }`}
                            >
                                Konfigurasi Game & Email
                            </button>
                        </nav>
                    </div>
                </header>

                {/* Konten Halaman */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full flex-1">
                    
                    {/* TAB 1: RINGKASAN */}
                    {activeTab === 'overview' && (
                        <div className="space-y-5">
                            {/* Metrik Statistik */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                <div className="bg-white p-3.5 rounded border border-slate-300">
                                    <div className="text-[11px] font-semibold text-slate-600">Menunggu Verifikasi</div>
                                    <div className="text-xl font-bold text-amber-700 mt-1">{stats?.pending_payments ?? 0}</div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">Transaksi tertunda</div>
                                </div>
                                <div className="bg-white p-3.5 rounded border border-slate-300">
                                    <div className="text-[11px] font-semibold text-slate-600">Dikonfirmasi</div>
                                    <div className="text-xl font-bold text-emerald-700 mt-1">{stats?.confirmed_payments ?? 0}</div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">Transaksi selesai</div>
                                </div>
                                <div className="bg-white p-3.5 rounded border border-slate-300">
                                    <div className="text-[11px] font-semibold text-slate-600">Ditolak</div>
                                    <div className="text-xl font-bold text-rose-700 mt-1">{stats?.rejected_payments ?? 0}</div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">Bukti tidak valid</div>
                                </div>
                                <div className="bg-white p-3.5 rounded border border-slate-300">
                                    <div className="text-[11px] font-semibold text-slate-600">Stok Tersedia</div>
                                    <div className="text-xl font-bold text-blue-700 mt-1">{stats?.available_accounts ?? 0}</div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">Siap dibeli</div>
                                </div>
                                <div className="bg-white p-3.5 rounded border border-slate-300">
                                    <div className="text-[11px] font-semibold text-slate-600">Akun Terjual</div>
                                    <div className="text-xl font-bold text-purple-700 mt-1">{stats?.sold_accounts ?? 0}</div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">Terkirim ke pembeli</div>
                                </div>
                                <div className="bg-white p-3.5 rounded border border-slate-300 col-span-2 md:col-span-1">
                                    <div className="text-[11px] font-semibold text-slate-600">Total Pemasukan</div>
                                    <div className="text-sm font-bold text-slate-900 mt-1 truncate">{formatRupiah(stats?.total_revenue)}</div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">Pesanan dikonfirmasi</div>
                                </div>
                            </div>

                            {/* Tindakan Cepat: Pembayaran Menunggu */}
                            <section className="bg-white rounded border border-slate-300 p-4">
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900">Pesanan Menunggu Konfirmasi</h2>
                                        <p className="text-xs text-slate-600">Periksa bukti transfer dan tentukan tindakan.</p>
                                    </div>
                                    <button
                                        onClick={() => handleTabChange('payments')}
                                        className="text-xs text-blue-700 hover:underline font-semibold"
                                    >
                                        Buka Semua Pembayaran
                                    </button>
                                </div>

                                {payments.filter(p => p.status === 'menunggu').length === 0 ? (
                                    <div className="py-6 text-center text-xs text-slate-500">
                                        Tidak ada pesanan menunggu saat ini.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                                                    <th className="p-2 font-semibold">ID Pesanan</th>
                                                    <th className="p-2 font-semibold">Akun Game</th>
                                                    <th className="p-2 font-semibold">Email Pengiriman</th>
                                                    <th className="p-2 font-semibold">Harga</th>
                                                    <th className="p-2 font-semibold">Bukti</th>
                                                    <th className="p-2 font-semibold text-right">Tindakan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {payments.filter(p => p.status === 'menunggu').slice(0, 5).map(pay => (
                                                    <tr key={pay.payment_id} className="hover:bg-slate-50">
                                                        <td className="p-2 font-mono font-medium text-slate-800">ORD-{pay.order_id}</td>
                                                        <td className="p-2 font-medium text-slate-800">{pay.order?.account?.title || '-'}</td>
                                                        <td className="p-2 font-mono text-slate-700">{pay.order?.delivery_email}</td>
                                                        <td className="p-2 text-slate-800">{formatRupiah(pay.order?.account?.price)}</td>
                                                        <td className="p-2">
                                                            {pay.proof_image ? (
                                                                <button
                                                                    onClick={() => setPreviewImage(pay.proof_image)}
                                                                    className="text-blue-700 underline font-medium"
                                                                >
                                                                    Lihat Bukti
                                                                </button>
                                                            ) : (
                                                                <span className="text-slate-400">Tidak ada</span>
                                                            )}
                                                        </td>
                                                        <td className="p-2 text-right space-x-1.5 whitespace-nowrap">
                                                            <button
                                                                disabled={actionLoading === pay.payment_id}
                                                                onClick={() => handleApprovePayment(pay.payment_id)}
                                                                className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded font-medium text-xs disabled:opacity-50"
                                                            >
                                                                Setujui
                                                            </button>
                                                            <button
                                                                disabled={actionLoading === pay.payment_id}
                                                                onClick={() => handleRejectPayment(pay.payment_id)}
                                                                className="bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded font-medium text-xs disabled:opacity-50"
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

                            {/* Ringkasan Log Trigger */}
                            <section className="bg-white rounded border border-slate-300 p-4">
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900">Riwayat Perubahan Status (Trigger MySQL)</h2>
                                        <p className="text-xs text-slate-600">Catatan otomatis dari tabel status_logs saat status akun diperbarui.</p>
                                    </div>
                                    <button
                                        onClick={() => handleTabChange('logs')}
                                        className="text-xs text-blue-700 hover:underline font-semibold"
                                    >
                                        Buka Semua Log
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                                                <th className="p-2 font-semibold">ID</th>
                                                <th className="p-2 font-semibold">Akun</th>
                                                <th className="p-2 font-semibold">Status Awal</th>
                                                <th className="p-2 font-semibold">Status Akhir</th>
                                                <th className="p-2 font-semibold">Waktu Pencatatan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {statusLogs.slice(0, 5).map(log => (
                                                <tr key={log.log_id} className="hover:bg-slate-50">
                                                    <td className="p-2 font-mono text-slate-500">#{log.log_id}</td>
                                                    <td className="p-2 font-medium text-slate-800">{log.account_title || `Akun #${log.account_id}`}</td>
                                                    <td className="p-2 font-mono text-slate-700">{log.old_status}</td>
                                                    <td className="p-2 font-mono font-semibold text-slate-900">{log.new_status}</td>
                                                    <td className="p-2 text-slate-600">{new Date(log.changed_at).toLocaleString('id-ID')}</td>
                                                </tr>
                                            ))}
                                            {statusLogs.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="p-4 text-center text-slate-500">Belum ada data riwayat status.</td>
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
                        <div className="bg-white rounded border border-slate-300 p-4 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">Daftar Verifikasi Pembayaran</h2>
                                    <p className="text-xs text-slate-600">Persetujuan pembayaran akan memperbarui status pesanan dan mengirim akun ke pembeli.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="filter-payment" className="text-xs font-medium text-slate-700">Filter:</label>
                                    <select
                                        id="filter-payment"
                                        value={paymentFilter}
                                        onChange={(e) => {
                                            setPaymentFilter(e.target.value);
                                            loadPayments(e.target.value);
                                        }}
                                        className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-900 outline-none focus:border-blue-700"
                                    >
                                        <option value="semua">Semua Status</option>
                                        <option value="menunggu">Menunggu Konfirmasi</option>
                                        <option value="dikonfirmasi">Dikonfirmasi</option>
                                        <option value="ditolak">Ditolak</option>
                                    </select>
                                    <button
                                        onClick={() => loadPayments(paymentFilter)}
                                        className="text-xs border border-slate-300 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded text-slate-700"
                                    >
                                        Segarkan
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                                            <th className="p-2 font-semibold">ID</th>
                                            <th className="p-2 font-semibold">Pesanan & Akun</th>
                                            <th className="p-2 font-semibold">Pembeli</th>
                                            <th className="p-2 font-semibold">Email Pengiriman</th>
                                            <th className="p-2 font-semibold">Nominal</th>
                                            <th className="p-2 font-semibold">Bukti</th>
                                            <th className="p-2 font-semibold">Status</th>
                                            <th className="p-2 font-semibold text-right">Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {payments.map(pay => (
                                            <tr key={pay.payment_id} className="hover:bg-slate-50">
                                                <td className="p-2 font-mono text-slate-600">PAY-{pay.payment_id}</td>
                                                <td className="p-2">
                                                    <div className="font-semibold text-slate-900">ORD-{pay.order_id}</div>
                                                    <div className="text-slate-700">{pay.order?.account?.title || '-'}</div>
                                                </td>
                                                <td className="p-2 text-slate-800">{pay.order?.buyer?.name || '-'}</td>
                                                <td className="p-2 font-mono text-slate-700">{pay.order?.delivery_email}</td>
                                                <td className="p-2 text-slate-900 font-medium">
                                                    {formatRupiah(pay.order?.account?.price)}
                                                    <div className="text-[10px] text-slate-500 font-mono">{pay.method}</div>
                                                </td>
                                                <td className="p-2">
                                                    {pay.proof_image ? (
                                                        <button
                                                            onClick={() => setPreviewImage(pay.proof_image)}
                                                            className="text-blue-700 underline font-medium"
                                                        >
                                                            Lihat Bukti
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-400">Tidak ada</span>
                                                    )}
                                                </td>
                                                <td className="p-2">
                                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                                        pay.status === 'dikonfirmasi' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                                        pay.status === 'ditolak' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                                                        'bg-amber-100 text-amber-800 border border-amber-300'
                                                    }`}>
                                                        {pay.status}
                                                    </span>
                                                </td>
                                                <td className="p-2 text-right space-x-1.5 whitespace-nowrap">
                                                    {pay.status === 'menunggu' && (
                                                        <>
                                                            <button
                                                                disabled={actionLoading === pay.payment_id}
                                                                onClick={() => handleApprovePayment(pay.payment_id)}
                                                                className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded font-medium text-xs disabled:opacity-50"
                                                            >
                                                                Setujui
                                                            </button>
                                                            <button
                                                                disabled={actionLoading === pay.payment_id}
                                                                onClick={() => handleRejectPayment(pay.payment_id)}
                                                                className="bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded font-medium text-xs disabled:opacity-50"
                                                            >
                                                                Tolak
                                                            </button>
                                                        </>
                                                    )}
                                                    {pay.status === 'dikonfirmasi' && (
                                                        <button
                                                            disabled={actionLoading === pay.order_id}
                                                            onClick={() => handleResendEmail(pay.order_id)}
                                                            className="border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 px-2.5 py-1 rounded font-medium text-xs disabled:opacity-50"
                                                        >
                                                            Kirim Ulang Email
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {payments.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="p-6 text-center text-slate-500">
                                                    {loading ? 'Memuat data pembayaran...' : 'Tidak ada catatan pembayaran yang cocok dengan filter.'}
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
                        <div className="bg-white rounded border border-slate-300 p-4 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">Manajemen Inventaris Akun</h2>
                                    <p className="text-xs text-slate-600">Kelola judul, harga, dan kredensial akun yang dijual.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={accountGameFilter}
                                        onChange={(e) => {
                                            setAccountGameFilter(e.target.value);
                                            loadAccounts(e.target.value);
                                        }}
                                        className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-900 outline-none focus:border-blue-700"
                                    >
                                        <option value="semua">Semua Kategori Game</option>
                                        {games.map(g => (
                                            <option key={g.game_id} value={g.game_id}>{g.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={openAddAccount}
                                        className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
                                    >
                                        Tambah Akun Baru
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                                            <th className="p-2 font-semibold">ID</th>
                                            <th className="p-2 font-semibold">Judul Akun</th>
                                            <th className="p-2 font-semibold">Game</th>
                                            <th className="p-2 font-semibold">Harga</th>
                                            <th className="p-2 font-semibold">Kredensial</th>
                                            <th className="p-2 font-semibold">Status</th>
                                            <th className="p-2 font-semibold text-right">Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {accounts.map(acc => (
                                            <tr key={acc.account_id} className="hover:bg-slate-50">
                                                <td className="p-2 font-mono text-slate-500">#{acc.account_id}</td>
                                                <td className="p-2">
                                                    <div className="font-semibold text-slate-900">{acc.title}</div>
                                                    <div className="text-[11px] text-slate-600 line-clamp-1">{acc.description || 'Tidak ada deskripsi'}</div>
                                                </td>
                                                <td className="p-2">
                                                    <span className="text-slate-800 font-medium">
                                                        {acc.game?.name || '-'}
                                                    </span>
                                                </td>
                                                <td className="p-2 font-medium text-slate-900">
                                                    {formatRupiah(acc.price)}
                                                </td>
                                                <td className="p-2">
                                                    <div className="font-mono text-[11px] text-slate-700">{acc.account_email}</div>
                                                    {showCredentials[acc.account_id] && (
                                                        <div className="font-mono text-[11px] text-slate-900 bg-slate-100 p-1.5 rounded border border-slate-300 mt-1 space-y-0.5">
                                                            <div>Pass Email: {acc.email_password || '-'}</div>
                                                            <div>Pass Game: {acc.game_password || '-'}</div>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => setShowCredentials(prev => ({ ...prev, [acc.account_id]: !prev[acc.account_id] }))}
                                                        className="text-[11px] text-blue-700 hover:underline mt-0.5 block"
                                                    >
                                                        {showCredentials[acc.account_id] ? 'Sembunyikan' : 'Periksa Kata Sandi'}
                                                    </button>
                                                </td>
                                                <td className="p-2">
                                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                                        acc.status === 'tersedia' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                                        acc.status === 'terjual' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                                                        'bg-amber-100 text-amber-800 border border-amber-300'
                                                    }`}>
                                                        {acc.status}
                                                    </span>
                                                </td>
                                                <td className="p-2 text-right space-x-1.5 whitespace-nowrap">
                                                    <button
                                                        onClick={() => openEditAccount(acc)}
                                                        className="border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 px-2.5 py-1 rounded font-medium text-xs"
                                                    >
                                                        Ubah
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAccount(acc.account_id)}
                                                        className="border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 rounded font-medium text-xs"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {accounts.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="p-6 text-center text-slate-500">
                                                    {loading ? 'Memuat inventaris...' : 'Belum ada akun di kategori ini.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: AUDIT TRAIL LOG BASIS DATA */}
                    {activeTab === 'logs' && (
                        <div className="bg-white rounded border border-slate-300 p-4 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">Audit Trail: Trigger Status Akun</h2>
                                    <p className="text-xs text-slate-600">
                                        Data pada tabel <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">status_logs</code> dicatat otomatis melalui Trigger MySQL saat status akun berubah.
                                    </p>
                                </div>
                                <button
                                    onClick={loadLogs}
                                    className="text-xs border border-slate-300 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded text-slate-700"
                                >
                                    Segarkan Data
                                </button>
                            </div>


                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse font-mono">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-slate-600 bg-slate-50 font-sans">
                                            <th className="p-2 font-semibold">ID Log</th>
                                            <th className="p-2 font-semibold">ID Akun</th>
                                            <th className="p-2 font-semibold">Nama Akun</th>
                                            <th className="p-2 font-semibold">Status Lama</th>
                                            <th className="p-2 font-semibold">Status Baru</th>
                                            <th className="p-2 font-semibold">Waktu Eksekusi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {statusLogs.map(log => (
                                            <tr key={log.log_id} className="hover:bg-slate-50">
                                                <td className="p-2 text-slate-500">#{log.log_id}</td>
                                                <td className="p-2 text-slate-700">ACC-{log.account_id}</td>
                                                <td className="p-2 font-sans font-medium text-slate-900">{log.account_title || '-'}</td>
                                                <td className="p-2 text-slate-700">{log.old_status}</td>
                                                <td className="p-2 font-semibold text-slate-900">{log.new_status}</td>
                                                <td className="p-2 text-slate-600 font-sans">{new Date(log.changed_at).toLocaleString('id-ID')}</td>
                                            </tr>
                                        ))}
                                        {statusLogs.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="p-6 text-center text-slate-500 font-sans">
                                                    Belum ada histori perubahan status yang tercatat.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: KONFIGURASI GAME & EMAIL */}
                    {activeTab === 'games' && (
                        <div className="bg-white rounded border border-slate-300 p-4 space-y-4">
                            <div className="pb-3 border-b border-slate-200">
                                <h2 className="text-sm font-bold text-slate-900">Konfigurasi Game dan Template Email</h2>
                                <p className="text-xs text-slate-600">Atur tautan webmail, petunjuk pengalihan akun, dan format pengiriman email otomatis.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {games.map(game => (
                                    <div key={game.game_id} className="border border-slate-300 rounded p-4 space-y-3 bg-slate-50">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                                            <h3 className="font-bold text-slate-900 text-sm">{game.name}</h3>
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
                                                className="text-xs border border-slate-300 bg-white hover:bg-slate-100 text-blue-700 font-medium px-2.5 py-1 rounded"
                                            >
                                                Ubah Konfigurasi
                                            </button>
                                        </div>

                                        <div className="text-xs space-y-2 text-slate-700">
                                            <div>
                                                <span className="font-medium text-slate-600 block mb-0.5">Tautan Webmail:</span>
                                                <a href={game.webmail_url || '#'} target="_blank" rel="noreferrer" className="text-blue-700 underline font-mono text-[11px]">
                                                    {game.webmail_url || 'Belum diatur'}
                                                </a>
                                            </div>
                                            <div>
                                                <span className="font-medium text-slate-600 block mb-0.5">Tautan Panduan:</span>
                                                <a href={game.guide_url || '#'} target="_blank" rel="noreferrer" className="text-blue-700 underline font-mono text-[11px]">
                                                    {game.guide_url || 'Belum diatur'}
                                                </a>
                                            </div>
                                            <div>
                                                <span className="font-medium text-slate-600 block mb-0.5">Template Pesan Email:</span>
                                                <pre className="p-2 bg-white border border-slate-300 rounded text-[11px] text-slate-800 whitespace-pre-wrap font-mono">
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
                    <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-4">
                        <div className="bg-white rounded border border-slate-300 max-w-lg w-full overflow-hidden shadow-lg">
                            <div className="p-3 border-b border-slate-200 flex items-center justify-between">
                                <h3 className="font-bold text-xs text-slate-900">Bukti Transfer Pembeli</h3>
                                <button
                                    onClick={() => setPreviewImage(null)}
                                    className="text-slate-500 hover:text-slate-800 text-sm font-bold"
                                >
                                    Tutup
                                </button>
                            </div>
                            <div className="p-4 flex items-center justify-center bg-slate-100 max-h-[70vh] overflow-auto">
                                <img
                                    src={`/storage/${previewImage}`}
                                    alt="Bukti Transfer"
                                    className="max-w-full max-h-[60vh] object-contain border border-slate-300 rounded"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = previewImage.startsWith('http') ? previewImage : `/${previewImage}`;
                                    }}
                                />
                            </div>
                            <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
                                <button
                                    onClick={() => setPreviewImage(null)}
                                    className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded"
                                >
                                    Selesai
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: TAMBAH / UBAH AKUN */}
                {isAccountModalOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-4">
                        <div className="bg-white rounded border border-slate-300 max-w-lg w-full overflow-hidden shadow-lg">
                            <div className="p-3 border-b border-slate-200 flex items-center justify-between">
                                <h3 className="font-bold text-xs text-slate-900">
                                    {editingAccount ? 'Ubah Data Akun Game' : 'Tambah Akun Game'}
                                </h3>
                                <button
                                    onClick={() => setIsAccountModalOpen(false)}
                                    className="text-slate-500 hover:text-slate-800 font-bold"
                                >
                                    Tutup
                                </button>
                            </div>
                            <form onSubmit={handleSaveAccount} className="p-4 space-y-3 max-h-[75vh] overflow-y-auto text-xs">
                                <div>
                                    <label htmlFor="form-game-id" className="block font-medium text-slate-800 mb-1">Kategori Game</label>
                                    <select
                                        id="form-game-id"
                                        value={accountForm.game_id}
                                        onChange={e => setAccountForm({ ...accountForm, game_id: e.target.value })}
                                        className="w-full border border-slate-300 rounded p-2 text-xs bg-white text-slate-900"
                                        required
                                    >
                                        {games.map(g => (
                                            <option key={g.game_id} value={g.game_id}>{g.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="form-title" className="block font-medium text-slate-800 mb-1">Judul / Ringkasan Spesifikasi</label>
                                    <input
                                        id="form-title"
                                        type="text"
                                        placeholder="Contoh: Akun Mythic Glory Full Hero"
                                        value={accountForm.title}
                                        onChange={e => setAccountForm({ ...accountForm, title: e.target.value })}
                                        className="w-full border border-slate-300 rounded p-2 text-xs"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="form-price" className="block font-medium text-slate-800 mb-1">Harga (Rupiah)</label>
                                    <input
                                        id="form-price"
                                        type="number"
                                        placeholder="Contoh: 150000"
                                        value={accountForm.price}
                                        onChange={e => setAccountForm({ ...accountForm, price: e.target.value })}
                                        className="w-full border border-slate-300 rounded p-2 text-xs"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="form-desc" className="block font-medium text-slate-800 mb-1">Deskripsi Akun</label>
                                    <textarea
                                        id="form-desc"
                                        rows={2}
                                        placeholder="Rincian informasi akun..."
                                        value={accountForm.description}
                                        onChange={e => setAccountForm({ ...accountForm, description: e.target.value })}
                                        className="w-full border border-slate-300 rounded p-2 text-xs"
                                    />
                                </div>
                                <div className="p-3 bg-slate-50 rounded border border-slate-300 space-y-2">
                                    <div className="font-semibold text-slate-800">Kredensial Akun (Terkirim Otomatis ke Pembeli)</div>
                                    <div>
                                        <label htmlFor="form-email" className="block text-slate-700 mb-0.5">Alamat Email Akun</label>
                                        <input
                                            id="form-email"
                                            type="text"
                                            value={accountForm.account_email}
                                            onChange={e => setAccountForm({ ...accountForm, account_email: e.target.value })}
                                            className="w-full border border-slate-300 rounded p-1.5 text-xs bg-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="form-email-pass" className="block text-slate-700 mb-0.5">Kata Sandi Email</label>
                                        <input
                                            id="form-email-pass"
                                            type="text"
                                            value={accountForm.email_password}
                                            onChange={e => setAccountForm({ ...accountForm, email_password: e.target.value })}
                                            className="w-full border border-slate-300 rounded p-1.5 text-xs bg-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="form-game-pass" className="block text-slate-700 mb-0.5">Kata Sandi Game</label>
                                        <input
                                            id="form-game-pass"
                                            type="text"
                                            value={accountForm.game_password}
                                            onChange={e => setAccountForm({ ...accountForm, game_password: e.target.value })}
                                            className="w-full border border-slate-300 rounded p-1.5 text-xs bg-white"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="form-image" className="block font-medium text-slate-800 mb-1">Unggah Tangkapan Layar / Foto</label>
                                    <input
                                        id="form-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setAccountImageFile(e.target.files ? e.target.files[0] : null)}
                                        className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-slate-300 file:text-xs file:bg-slate-50"
                                    />
                                </div>
                                <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setIsAccountModalOpen(false)}
                                        className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 text-xs"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-3.5 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: UBAH KONFIGURASI GAME */}
                {isGameModalOpen && editingGame && (
                    <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-4">
                        <div className="bg-white rounded border border-slate-300 max-w-lg w-full overflow-hidden shadow-lg">
                            <div className="p-3 border-b border-slate-200 flex items-center justify-between">
                                <h3 className="font-bold text-xs text-slate-900">
                                    Ubah Konfigurasi: {editingGame.name}
                                </h3>
                                <button
                                    onClick={() => setIsGameModalOpen(false)}
                                    className="text-slate-500 hover:text-slate-800 font-bold"
                                >
                                    Tutup
                                </button>
                            </div>
                            <form onSubmit={handleUpdateGame} className="p-4 space-y-3 text-xs">
                                <div>
                                    <label htmlFor="form-game-name" className="block font-medium text-slate-800 mb-1">Nama Game</label>
                                    <input
                                        id="form-game-name"
                                        type="text"
                                        value={gameForm.name}
                                        onChange={e => setGameForm({ ...gameForm, name: e.target.value })}
                                        className="w-full border border-slate-300 rounded p-2 text-xs"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="form-game-webmail" className="block font-medium text-slate-800 mb-1">Tautan Webmail</label>
                                    <input
                                        id="form-game-webmail"
                                        type="url"
                                        value={gameForm.webmail_url}
                                        onChange={e => setGameForm({ ...gameForm, webmail_url: e.target.value })}
                                        placeholder="https://mail.google.com"
                                        className="w-full border border-slate-300 rounded p-2 text-xs"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="form-game-guide" className="block font-medium text-slate-800 mb-1">Tautan Petunjuk Pengalihan</label>
                                    <input
                                        id="form-game-guide"
                                        type="url"
                                        value={gameForm.guide_url}
                                        onChange={e => setGameForm({ ...gameForm, guide_url: e.target.value })}
                                        placeholder="https://panduan.contoh.com"
                                        className="w-full border border-slate-300 rounded p-2 text-xs"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="form-game-template" className="block font-medium text-slate-800 mb-1">Template Format Email</label>
                                    <textarea
                                        id="form-game-template"
                                        rows={4}
                                        value={gameForm.email_template}
                                        onChange={e => setGameForm({ ...gameForm, email_template: e.target.value })}
                                        className="w-full border border-slate-300 rounded p-2 text-xs font-mono"
                                    />
                                </div>
                                <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setIsGameModalOpen(false)}
                                        className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 text-xs"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-3.5 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs"
                                    >
                                        Simpan
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

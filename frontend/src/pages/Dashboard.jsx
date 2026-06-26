import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Search, Plus, Filter, AlertCircle, RefreshCw, Calendar, Trash2, Edit } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Search and Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '' for all, 'pending', 'in-progress', 'done'

  // Debounced search logic could go here, or we can just fetch on change / input key press.
  // Since it's live search, we can use a useEffect with a small timeout.
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTasks();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter]);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/tasks', {
        params: {
          status: statusFilter || undefined,
          search: search || undefined
        }
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Gagal memuat daftar tugas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-m3-background text-m3-onBackground pb-12">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-display text-m3-primary mb-1">
              Halo, {user?.name || 'User'} 👋
            </h1>
            <p className="text-m3-onSurfaceVariant text-sm">
              Kelola tugas-tugas harian Anda dengan mudah.
            </p>
          </div>

          {/* Add Task Button */}
          <button
            className="self-start bg-m3-primary text-m3-onPrimary hover:bg-m3-primaryContainer hover:text-m3-onPrimaryContainer font-bold px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 m3-ripple shadow-lg"
          >
            <Plus size={20} />
            <span>Tambah Tugas</span>
          </button>
        </div>

        {/* Search and Filter Panel */}
        <div className="glassmorphism rounded-3xl p-6 mb-8 border border-m3-outline/10 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Live Search */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-m3-onSurfaceVariant">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Cari tugas berdasarkan judul..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-m3-surfaceVariant/20 text-m3-onSurface rounded-3xl border border-m3-outline/15 focus:border-m3-primary focus:outline-none focus:ring-1 focus:ring-m3-primary transition-all duration-300 text-sm"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="text-xs font-semibold text-m3-onSurfaceVariant uppercase mr-2 flex items-center gap-1">
              <Filter size={14} />
              <span>Filter:</span>
            </div>
            {[
              { label: 'Semua', value: '' },
              { label: 'Pending', value: 'pending' },
              { label: 'In Progress', value: 'in-progress' },
              { label: 'Selesai', value: 'done' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`text-sm px-4 py-2 rounded-full font-medium transition-all duration-300 m3-ripple ${
                  statusFilter === tab.value
                    ? 'bg-m3-tertiary text-m3-onTertiary shadow-md'
                    : 'bg-m3-surfaceVariant/30 hover:bg-m3-surfaceVariant/50 text-m3-onSurfaceVariant'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Grid Area */}
        {error && (
          <div className="p-4 bg-m3-onError text-m3-error rounded-3xl text-sm border border-m3-error/20 flex items-center gap-2 mb-6">
            <AlertCircle size={18} />
            <span>{error}</span>
            <button onClick={fetchTasks} className="ml-auto text-xs underline font-bold flex items-center gap-1 hover:opacity-90">
              <RefreshCw size={12} /> Coba Lagi
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-m3-primary border-t-transparent"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 glassmorphism rounded-3xl border border-m3-outline/5 p-8 max-w-md mx-auto">
            <AlertCircle className="mx-auto h-12 w-12 text-m3-outline mb-4" />
            <h3 className="text-lg font-bold text-m3-onSurface mb-2">Tidak ada tugas</h3>
            <p className="text-m3-onSurfaceVariant text-sm">
              {search || statusFilter ? 'Tidak ada tugas yang cocok dengan pencarian Anda.' : 'Mulailah dengan membuat tugas baru.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Task cards will be rendered here in the next commits */}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

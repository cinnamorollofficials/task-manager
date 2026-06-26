import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Search, Plus, Filter, AlertCircle, RefreshCw, ClipboardList } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Infinite scroll page states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Search and Filter States synced with URL params
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const statusFilter = searchParams.get('status') || '';
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Sentinel ref for scroll observation
  const sentinelRef = useRef(null);

  // Synchronize local search state with URL parameters (for browser back/forward navigation)
  const urlSearch = searchParams.get('search') || '';
  useEffect(() => {
    setSearch(urlSearch);
    setDebouncedSearch(urlSearch);
  }, [urlSearch]);

  // Sync local search input to URL with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearch(search);
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (search) {
          next.set('search', search);
        } else {
          next.delete('search');
        }
        return next;
      }, { replace: true });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, setSearchParams]);

  // Reset page when search or statusFilter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const fetchTasks = useCallback(async (isFresh = false) => {
    setLoading(true);
    setError('');
    const targetPage = isFresh ? 1 : page;
    try {
      const response = await api.get('/tasks', {
        params: {
          status: statusFilter || undefined,
          search: debouncedSearch || undefined,
          page: targetPage,
          limit: 6
        }
      });
      const newTasks = response.data.tasks;
      const pagination = response.data.pagination;

      if (isFresh) {
        setTasks(newTasks);
      } else {
        setTasks(prev => {
          const existingIds = new Set(prev.map(t => t.id));
          const filteredNew = newTasks.filter(t => !existingIds.has(t.id));
          return [...prev, ...filteredNew];
        });
      }
      setHasMore(pagination.currentPage < pagination.totalPages);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Gagal memuat daftar tugas.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch, page]);

  // Fetch tasks on page or search/filter changes
  useEffect(() => {
    fetchTasks(page === 1);
  }, [page, debouncedSearch, statusFilter, fetchTasks]);

  // Intersection Observer for scroll detection
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    }, { threshold: 0.1 });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [loading, hasMore]);

  // Helper to refresh data when adding/updating/deleting a task
  const handleRefresh = useCallback(() => {
    if (page === 1) {
      fetchTasks(true);
    } else {
      setPage(1);
    }
  }, [page, fetchTasks]);

  // Helper to update status filter via URL
  const setStatusFilter = (newStatus) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (newStatus) {
        next.set('status', newStatus);
      } else {
        next.delete('status');
      }
      return next;
    }, { replace: true });
  };

  // Add Task
  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Edit Task
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Handle Submit Form (Create / Update)
  const handleFormSubmit = async (taskData) => {
    try {
      if (editingTask) {
        // Update
        await api.put(`/tasks/${editingTask.id}`, taskData);
      } else {
        // Create
        await api.post('/tasks', taskData);
      }
      setIsModalOpen(false);
      handleRefresh();
    } catch (err) {
      console.error('Error saving task:', err);
      alert(err.response?.data?.message || 'Gagal menyimpan tugas.');
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        handleRefresh();
      } catch (err) {
        console.error('Error deleting task:', err);
        alert(err.response?.data?.message || 'Gagal menghapus tugas.');
      }
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
            onClick={handleOpenAddModal}
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
          <div className="text-center py-20 glassmorphism rounded-3xl border border-m3-outline/5 p-8 max-w-sm mx-auto flex flex-col items-center">
            <ClipboardList className="h-14 w-14 text-m3-outline/60 mb-4" />
            <h3 className="text-lg font-bold text-m3-onSurface mb-2">Tidak ada tugas</h3>
            <p className="text-m3-onSurfaceVariant text-sm text-center">
              {search || statusFilter ? 'Tidak ada tugas yang cocok dengan kriteria filter Anda.' : 'Semua tugas kosong. Mulailah dengan menambahkan tugas pertama Anda.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>

            {/* Sentinel element for infinite scroll */}
            <div ref={sentinelRef} className="h-20 flex justify-center items-center mt-8">
              {loading && hasMore && (
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-m3-primary border-t-transparent"></div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Task Creation & Modification Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
      />
    </div>
  );
};

export default Dashboard;

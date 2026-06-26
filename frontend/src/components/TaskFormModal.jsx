import React, { useState, useEffect } from 'react';
import { X, Calendar, Type, AlignLeft, BarChart2 } from 'lucide-react';

const TaskFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  // Sync state with initialData when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setStatus(initialData.status || 'pending');
      // Format deadline to yyyy-MM-dd for input date element
      if (initialData.deadline) {
        setDeadline(initialData.deadline.substring(0, 10));
      } else {
        setDeadline('');
      }
    } else {
      // Clear inputs for creation mode
      setTitle('');
      setDescription('');
      setStatus('pending');
      setDeadline('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title || title.trim() === '') {
      setError('Judul tugas wajib diisi.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      status,
      deadline: deadline || null
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="w-full max-w-lg glassmorphism rounded-4xl p-6 relative z-10 border border-m3-outline/25 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-m3-outline/10">
          <h3 className="text-xl font-bold font-display text-m3-primary">
            {initialData ? 'Edit Tugas' : 'Tambah Tugas Baru'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-m3-surfaceVariant/50 text-m3-onSurfaceVariant transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 bg-m3-onError text-m3-error rounded-3xl text-sm border border-m3-error/20">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-m3-onSurfaceVariant uppercase tracking-wider pl-2">Judul Tugas *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-m3-onSurfaceVariant">
                <Type size={16} />
              </span>
              <input
                type="text"
                placeholder="Masukkan judul tugas..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-m3-surfaceVariant/20 text-m3-onSurface rounded-3xl border border-m3-outline/20 focus:border-m3-primary focus:outline-none transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-m3-onSurfaceVariant uppercase tracking-wider pl-2">Deskripsi (Opsional)</label>
            <div className="relative">
              <span className="absolute top-3 left-4 text-m3-onSurfaceVariant">
                <AlignLeft size={16} />
              </span>
              <textarea
                placeholder="Tulis detail deskripsi tugas..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-m3-surfaceVariant/20 text-m3-onSurface rounded-3xl border border-m3-outline/20 focus:border-m3-primary focus:outline-none transition-all duration-300 text-sm resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-m3-onSurfaceVariant uppercase tracking-wider pl-2">Status</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-m3-onSurfaceVariant">
                  <BarChart2 size={16} />
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-m3-surfaceVariant/20 text-m3-onSurface rounded-3xl border border-m3-outline/20 focus:border-m3-primary focus:outline-none transition-all duration-300 text-sm appearance-none cursor-pointer"
                >
                  <option value="pending" className="bg-m3-surface text-m3-onSurface">Pending</option>
                  <option value="in-progress" className="bg-m3-surface text-m3-onSurface">In Progress</option>
                  <option value="done" className="bg-m3-surface text-m3-onSurface">Selesai</option>
                </select>
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-m3-onSurfaceVariant uppercase tracking-wider pl-2">Deadline</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-m3-onSurfaceVariant">
                  <Calendar size={16} />
                </span>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-m3-surfaceVariant/20 text-m3-onSurface rounded-3xl border border-m3-outline/20 focus:border-m3-primary focus:outline-none transition-all duration-300 text-sm cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-m3-outline/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-m3-surfaceVariant/30 hover:bg-m3-surfaceVariant/50 text-m3-onSurfaceVariant font-semibold text-sm transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-m3-primary text-m3-onPrimary hover:bg-m3-primaryContainer hover:text-m3-onPrimaryContainer font-bold text-sm transition shadow-lg m3-ripple"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;

import React from 'react';
import { Calendar, Edit3, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  // Helper to parse deadline string safely in local timezone (avoiding timezone offset shifts)
  const getDeadlineDate = (dateStr) => {
    const [year, month, day] = dateStr.substring(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Format Date to Indonsian Locale
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Tanpa deadline';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return getDeadlineDate(dateStr).toLocaleDateString('id-ID', options);
  };

  // Get status color styles (Material 3 container style)
  const getStatusStyles = (status) => {
    switch (status) {
      case 'done':
        return 'bg-m3-tertiaryContainer text-m3-onTertiaryContainer border-m3-tertiary/20';
      case 'in-progress':
        return 'bg-m3-primaryContainer text-m3-onPrimaryContainer border-m3-primary/20';
      case 'pending':
      default:
        return 'bg-m3-secondaryContainer text-m3-onSecondaryContainer border-m3-secondary/20';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'done':
        return 'Selesai';
      case 'in-progress':
        return 'In Progress';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  // Check if task is overdue (has deadline, is not done, and deadline date is in the past)
  const isOverdue = task.deadline && task.status !== 'done' && getDeadlineDate(task.deadline).setHours(23, 59, 59, 999) < Date.now();

  return (
    <div className="glassmorphism rounded-3xl p-6 border border-m3-outline/10 flex flex-col justify-between hover:scale-[1.02] hover:border-m3-primary/30 transition-all duration-300 shadow-md relative overflow-hidden group">
      {/* Top Section */}
      <div>
        <div className="flex justify-between items-start mb-4 gap-2">
          {/* Status Badge */}
          <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full border ${getStatusStyles(task.status)}`}>
            {getStatusLabel(task.status)}
          </span>

          {/* Deadline */}
          <span className={`text-xs flex items-center gap-1.5 font-medium ${isOverdue ? 'text-m3-error font-semibold' : 'text-m3-onSurfaceVariant'}`}>
            <Calendar size={14} className={isOverdue ? 'text-m3-error' : 'text-m3-primary'} />
            {formatDate(task.deadline)}
            {isOverdue && (
              <span className="px-1.5 py-0.5 bg-m3-onError text-m3-error rounded text-[10px] font-extrabold uppercase tracking-wide animate-pulse">
                Terlewat
              </span>
            )}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-m3-onSurface tracking-tight line-clamp-1 mb-2 font-display">
          {task.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-m3-onSurfaceVariant line-clamp-3 mb-6 leading-relaxed font-light">
          {task.description || 'Tidak ada deskripsi.'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-m3-outline/5">
        <button
          onClick={() => onEdit(task)}
          className="p-2.5 rounded-full bg-m3-surfaceVariant/30 hover:bg-m3-surfaceVariant/80 text-m3-primary transition-all duration-200 m3-ripple"
          title="Edit Tugas"
        >
          <Edit3 size={16} />
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="p-2.5 rounded-full bg-m3-error/10 hover:bg-m3-error hover:text-m3-onError text-m3-error transition-all duration-200 m3-ripple"
          title="Hapus Tugas"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;

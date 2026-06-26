import React from 'react';
import { Calendar, Edit3, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  // Format Date to Indonsian Locale
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Tanpa deadline';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
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
          <span className="text-xs text-m3-onSurfaceVariant flex items-center gap-1.5 font-medium">
            <Calendar size={14} className="text-m3-primary" />
            {formatDate(task.deadline)}
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

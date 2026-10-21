'use client';
import { Task } from '@/lib/types';
import { cn, getPriorityColor, getStatusIcon, formatTime } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onStatusChange, onDelete, onEdit }: TaskCardProps) {
  const nextStatus: Record<string, Task['status']> = {
    'todo': 'in-progress',
    'in-progress': 'done',
    'done': 'todo',
    'cancelled': 'todo',
  };

  return (
    <div className={cn(
      'border rounded-lg p-3 mb-2 transition-all hover:shadow-md',
      getPriorityColor(task.priority),
      task.status === 'done' && 'opacity-60'
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1">
          <button
            onClick={() => onStatusChange(task.id, nextStatus[task.status])}
            className="text-lg mt-0.5 hover:scale-110 transition-transform"
            title={`Status: ${task.status}`}
          >
            {getStatusIcon(task.status)}
          </button>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'font-medium text-sm text-gray-900',
              task.status === 'done' && 'line-through'
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-gray-500 mt-0.5 truncate">{task.description}</p>
            )}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {task.time && (
                <span className="text-xs text-gray-500">🕐 {formatTime(task.time)}</span>
              )}
              {task.duration && (
                <span className="text-xs text-gray-500">⏱ {task.duration}min</span>
              )}
              <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded">{task.category}</span>
              {task.tags.map(tag => (
                <span key={tag} className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button onClick={() => onEdit(task)} className="p-1 text-gray-400 hover:text-blue-500 text-xs">✏️</button>
          <button onClick={() => onDelete(task.id)} className="p-1 text-gray-400 hover:text-red-500 text-xs">🗑️</button>
        </div>
      </div>
    </div>
  );
}

'use client';
import { Task } from '@/lib/types';
import { getStatusIcon } from '@/lib/utils';

interface WidgetProps {
  tasks: Task[];
  date: string;
}

export function Widget({ tasks, date }: WidgetProps) {
  const completed = tasks.filter(t => t.status === 'done').length;
  const total = tasks.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const nextTask = tasks
    .filter(t => t.status !== 'done' && t.status !== 'cancelled')
    .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))[0];

  const displayDate = new Date(date + 'T12:00:00');
  const dayName = displayDate.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = displayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm opacity-80">{dayName}</p>
          <p className="text-2xl font-bold">{monthDay}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{progress}%</p>
          <p className="text-xs opacity-80">{completed}/{total} done</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/20 rounded-full h-2 mb-4">
        <div
          className="bg-white rounded-full h-2 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {nextTask ? (
        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-xs opacity-80 mb-1">Up next</p>
          <p className="font-medium text-sm">{nextTask.title}</p>
          {nextTask.time && <p className="text-xs opacity-80 mt-0.5">🕐 {nextTask.time}</p>}
        </div>
      ) : total > 0 ? (
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <p className="text-sm">🎉 All tasks completed!</p>
        </div>
      ) : (
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <p className="text-sm opacity-80">No tasks yet. Add one!</p>
        </div>
      )}

      {/* Quick task list */}
      {tasks.length > 0 && (
        <div className="mt-3 space-y-1">
          {tasks.slice(0, 4).map(t => (
            <div key={t.id} className="flex items-center gap-2 text-xs opacity-90">
              <span>{getStatusIcon(t.status)}</span>
              <span className={t.status === 'done' ? 'line-through opacity-60' : ''}>{t.title}</span>
            </div>
          ))}
          {tasks.length > 4 && (
            <p className="text-xs opacity-60 pl-6">+{tasks.length - 4} more</p>
          )}
        </div>
      )}
    </div>
  );
}

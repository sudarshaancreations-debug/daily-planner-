export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function getToday(): string {
  return formatDate(new Date());
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent': return 'text-red-500 bg-red-50 border-red-200';
    case 'high': return 'text-orange-500 bg-orange-50 border-orange-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-green-500 bg-green-50 border-green-200';
    default: return 'text-gray-500 bg-gray-50 border-gray-200';
  }
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case 'done': return '✅';
    case 'in-progress': return '🔄';
    case 'cancelled': return '❌';
    default: return '⬜';
  }
}

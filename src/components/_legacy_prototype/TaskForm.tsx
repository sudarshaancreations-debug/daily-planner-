'use client';
import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  initial?: Task | null;
  selectedDate: string;
}

export function TaskForm({ onSubmit, onCancel, initial, selectedDate }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [time, setTime] = useState(initial?.time || '');
  const [duration, setDuration] = useState(initial?.duration?.toString() || '');
  const [priority, setPriority] = useState<Task['priority']>(initial?.priority || 'medium');
  const [category, setCategory] = useState(initial?.category || 'Work');
  const [tags, setTags] = useState(initial?.tags.join(', ') || '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      date: selectedDate,
      time: time || undefined,
      duration: duration ? parseInt(duration) : undefined,
      priority,
      status: initial?.status || 'todo',
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
      >
        <h2 className="text-lg font-bold mb-4">{initial ? 'Edit Task' : 'New Task'}</h2>

        <div className="space-y-3">
          <input
            autoFocus
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Duration (min)</label>
              <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
                placeholder="30" className="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className="w-full border rounded px-3 py-1.5 text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded px-3 py-1.5 text-sm">
                {['Work', 'Personal', 'Health', 'Learning', 'Errands'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <input
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {initial ? 'Update' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
}

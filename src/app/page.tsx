'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/lib/types';
import { db } from '@/lib/db';
import { getToday, formatDate } from '@/lib/utils';
import { Sidebar } from '@/components/Sidebar';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { VoiceOverlay } from '@/components/VoiceOverlay';
import { RightPanel } from '@/components/RightPanel';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize date on client mount to avoid hydration mismatch
  useEffect(() => {
    const today = getToday();
    setSelectedDate(today);

    // Seed default tasks if empty
    const currentTasks = db.getAllTasks();
    if (currentTasks.length === 0) {
      db.createTask({
        title: 'Review daily priorities & roadmap',
        description: 'Check MCP Hub tools and daily planner schedule',
        date: today,
        time: '09:00',
        duration: 30,
        priority: 'high',
        status: 'in-progress',
        category: 'Work',
        tags: ['planning', 'mcp'],
      });
      db.createTask({
        title: 'Call design sync',
        description: 'Discuss widget layout and voice interaction',
        date: today,
        time: '11:30',
        duration: 45,
        priority: 'medium',
        status: 'todo',
        category: 'Work',
        tags: ['team', 'sync'],
      });
      db.createTask({
        title: 'Afternoon workout & run',
        description: '30 min jog in the park',
        date: today,
        time: '17:00',
        duration: 45,
        priority: 'low',
        status: 'todo',
        category: 'Health',
        tags: ['fitness'],
      });
    }
    setIsLoaded(true);
  }, []);

  const refreshTasks = useCallback(() => {
    if (!selectedDate) return;
    const all = db.getAllTasks();
    const uniqueCats = Array.from(new Set(all.map(t => t.category).filter(Boolean)));
    setCategories(uniqueCats);

    const dayTasks = db.getTasksByDate(selectedDate);
    setTasks(dayTasks);
  }, [selectedDate]);

  useEffect(() => {
    if (isLoaded) {
      refreshTasks();
    }
  }, [selectedDate, isLoaded, refreshTasks]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setIsVoiceOpen(true);
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEditingTask(null);
        setIsTaskFormOpen(true);
      } else if (e.key === 'Escape') {
        setIsVoiceOpen(false);
        setIsTaskFormOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStatusChange = (id: string, status: Task['status']) => {
    db.updateTask(id, { status });
    refreshTasks();
  };

  const handleDelete = (id: string) => {
    db.deleteTask(id);
    refreshTasks();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleFormSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      db.updateTask(editingTask.id, taskData);
    } else {
      db.createTask(taskData);
    }
    setIsTaskFormOpen(false);
    setEditingTask(null);
    refreshTasks();
  };

  const handleVoiceTranscript = (text: string) => {
    db.createTask({
      title: text,
      date: selectedDate || getToday(),
      priority: 'medium',
      status: 'todo',
      category: selectedCategory || 'Work',
      tags: ['voice'],
    });
    refreshTasks();
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (selectedCategory && task.category !== selectedCategory) return false;
    if (filterStatus === 'todo' && task.status !== 'todo') return false;
    if (filterStatus === 'in-progress' && task.status !== 'in-progress') return false;
    if (filterStatus === 'done' && task.status !== 'done') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q) || false;
      const matchTag = task.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 text-gray-700">
        <p className="text-sm font-medium animate-pulse">Loading Daily Planner & MCP Hub...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900 overflow-hidden font-sans">
      {/* Column 1: Navigation Sidebar */}
      <Sidebar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Column 2: Central Daily Planner Workspace */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-white">
        {/* Top Header Bar */}
        <header className="border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-white/90 backdrop-blur z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>Day View</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                {selectedDate}
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} showing
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVoiceOpen(true)}
              className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm"
              title="Shortcut: V"
            >
              <span>🎙️</span>
              <span className="hidden sm:inline">Voice</span>
            </button>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsTaskFormOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm"
              title="Shortcut: N"
            >
              <span>+</span>
              <span>New Task</span>
            </button>
          </div>
        </header>

        {/* Filter and Search Bar */}
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            {(['all', 'todo', 'in-progress', 'done'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                  filterStatus === status
                    ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                {status.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search tasks or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <span className="absolute left-2.5 top-2 text-xs text-gray-400">🔍</span>
          </div>
        </div>

        {/* Task Cards List */}
        <div className="flex-1 p-6 overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/40">
              <span className="text-4xl">✨</span>
              <h3 className="text-sm font-semibold text-gray-800 mt-2">No tasks found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                {searchQuery || filterStatus !== 'all' || selectedCategory
                  ? 'No tasks match your active filters or search terms.'
                  : 'Start planning your day by adding a task or pressing V for voice input.'}
              </p>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsTaskFormOpen(true);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
              >
                + Add your first task
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Column 3: Right Panel (Widget & Stats & Notes) */}
      <RightPanel tasks={tasks} date={selectedDate} />

      {/* Modals & Overlays */}
      <VoiceOverlay
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onTranscript={handleVoiceTranscript}
      />

      {isTaskFormOpen && (
        <TaskForm
          initial={editingTask}
          selectedDate={selectedDate}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsTaskFormOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

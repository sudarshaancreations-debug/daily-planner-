import { Task, DayPlan } from './types';

const STORAGE_KEY = 'daily-planner-data';

interface DBState {
  tasks: Task[];
  plans: Record<string, DayPlan>;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadState(): DBState {
  if (typeof window === 'undefined') return { tasks: [], plans: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { tasks: [], plans: {} };
}

function saveState(state: DBState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const db = {
  getAllTasks(): Task[] {
    return loadState().tasks;
  },

  getTasksByDate(date: string): Task[] {
    return loadState().tasks.filter(t => t.date === date);
  },

  getTask(id: string): Task | undefined {
    return loadState().tasks.find(t => t.id === id);
  },

  createTask(input: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const state = loadState();
    const now = new Date().toISOString();
    const task: Task = { ...input, id: generateId(), createdAt: now, updatedAt: now };
    state.tasks.push(task);
    saveState(state);
    return task;
  },

  updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const state = loadState();
    const idx = state.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    state.tasks[idx] = { ...state.tasks[idx], ...updates, updatedAt: new Date().toISOString() };
    saveState(state);
    return state.tasks[idx];
  },

  deleteTask(id: string): boolean {
    const state = loadState();
    const len = state.tasks.length;
    state.tasks = state.tasks.filter(t => t.id !== id);
    if (state.tasks.length === len) return false;
    saveState(state);
    return true;
  },

  getDayPlan(date: string): DayPlan {
    const state = loadState();
    const tasks = state.tasks.filter(t => t.date === date);
    return state.plans[date] || { date, tasks, notes: '', goals: [] };
  },

  saveDayPlan(plan: DayPlan): DayPlan {
    const state = loadState();
    state.plans[plan.date] = plan;
    saveState(state);
    return plan;
  },

  resetDemoData(): void {
    const demoTasks: NimoraTask[] = [
      {
        id: 'demo-1',
        title: 'Morning Review',
        date: getToday(),
        startTime: '9:00 AM',
        endTime: '9:30 AM',
        priority: 'high',
        status: 'todo',
        category: 'Work',
        tags: ['review'],
      },
      {
        id: 'demo-2',
        title: 'Team Sync',
        date: getToday(),
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        priority: 'medium',
        status: 'todo',
        category: 'Work',
        tags: ['meeting'],
      },
    ];
    const state = { tasks: demoTasks, plans: {} };
    saveState(state as any);
  },
    const tasks = this.getTasksByDate(date);
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'done').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      todo: tasks.filter(t => t.status === 'todo').length,
    };
  },

  searchTasks(query: string): Task[] {
    const q = query.toLowerCase();
    return loadState().tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.description?.toLowerCase().includes(q)) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  },
};

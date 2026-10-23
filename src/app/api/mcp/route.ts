import { NextRequest, NextResponse } from 'next/server';

// In-memory server-side store (for API routes)
interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  duration?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'done' | 'cancelled';
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const defaultTasks: Task[] = [
  {
    id: 't_default_01',
    title: 'Executive Client Milestone Review',
    description: 'Review project status and deliverables',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    duration: 30,
    priority: 'high',
    status: 'todo',
    category: 'Work',
    tags: ['priority', 'client'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const store: { tasks: Task[]; plans: Record<string, { notes: string; goals: string[] }> } = {
  tasks: [...defaultTasks],
  plans: {},
};

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// 16 MCP tools
const toolHandlers: Record<string, (args: Record<string, unknown>) => unknown> = {
  list_tasks: (args) => {
    let tasks = store.tasks.length > 0 ? store.tasks : [...defaultTasks];
    if (args.date) tasks = tasks.filter(t => t.date === args.date);
    if (args.status) tasks = tasks.filter(t => t.status === args.status);
    if (args.category) tasks = tasks.filter(t => t.category === args.category);
    if (args.priority) tasks = tasks.filter(t => t.priority === args.priority);
    return { tasks, count: tasks.length };
  },
  get_task: (args) => {
    const task = store.tasks.find(t => t.id === args.id);
    return task || { error: 'Task not found' };
  },
  create_task: (args) => {
    const now = new Date().toISOString();
    const task: Task = {
      id: genId(),
      title: args.title as string,
      description: args.description as string | undefined,
      date: (args.date as string) || new Date().toISOString().split('T')[0],
      time: args.time as string | undefined,
      duration: args.duration as number | undefined,
      priority: (args.priority as Task['priority']) || 'medium',
      status: 'todo',
      category: (args.category as string) || 'Work',
      tags: (args.tags as string[]) || [],
      createdAt: now,
      updatedAt: now,
    };
    store.tasks.push(task);
    return task;
  },
  update_task: (args) => {
    const idx = store.tasks.findIndex(t => t.id === args.id);
    if (idx === -1) return { error: 'Task not found' };
    const { id, ...updates } = args;
    store.tasks[idx] = { ...store.tasks[idx], ...updates, updatedAt: new Date().toISOString() } as Task;
    return store.tasks[idx];
  },
  delete_task: (args) => {
    const len = store.tasks.length;
    store.tasks = store.tasks.filter(t => t.id !== args.id);
    return { deleted: store.tasks.length < len };
  },
  complete_task: (args) => {
    let task = store.tasks.find(t => t.id === args.id);
    if (!task) {
      task = {
        id: (args.id as string) || genId(),
        title: 'Task ' + args.id,
        date: new Date().toISOString().split('T')[0],
        priority: 'medium',
        status: 'done',
        category: 'Work',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.tasks.push(task);
    } else {
      task.status = 'done';
      task.updatedAt = new Date().toISOString();
    }
    return task;
  },
  search_tasks: (args) => {
    const q = (args.query as string || '').toLowerCase();
    const results = store.tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
    return { results, count: results.length };
  },
  get_day_plan: (args) => {
    const date = args.date as string;
    const tasks = store.tasks.filter(t => t.date === date);
    const plan = store.plans[date] || { notes: '', goals: [] };
    return { date, tasks, ...plan };
  },
  save_day_plan: (args) => {
    const date = args.date as string;
    store.plans[date] = { notes: args.notes as string || '', goals: (args.goals as string[]) || [] };
    return { saved: true, date };
  },
  get_stats: (args) => {
    const date = args.date as string;
    const tasks = date ? store.tasks.filter(t => t.date === date) : store.tasks;
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'done').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      todo: tasks.filter(t => t.status === 'todo').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length,
    };
  },
  get_categories: () => {
    const cats = new Set(store.tasks.map(t => t.category));
    return { categories: [...cats] };
  },
  get_tags: () => {
    const tags = new Set(store.tasks.flatMap(t => t.tags));
    return { tags: [...tags] };
  },
  bulk_create: (args) => {
    const tasks = (args.tasks as Array<Record<string, unknown>>).map(t => {
      const now = new Date().toISOString();
      const task: Task = {
        id: genId(),
        title: t.title as string,
        description: t.description as string | undefined,
        date: (t.date as string) || new Date().toISOString().split('T')[0],
        time: t.time as string | undefined,
        duration: t.duration as number | undefined,
        priority: (t.priority as Task['priority']) || 'medium',
        status: 'todo',
        category: (t.category as string) || 'Work',
        tags: (t.tags as string[]) || [],
        createdAt: now,
        updatedAt: now,
      };
      store.tasks.push(task);
      return task;
    });
    return { created: tasks.length, tasks };
  },
  bulk_update_status: (args) => {
    const ids = args.ids as string[];
    const status = args.status as Task['status'];
    let count = 0;
    ids.forEach(id => {
      const task = store.tasks.find(t => t.id === id);
      if (task) { task.status = status; task.updatedAt = new Date().toISOString(); count++; }
    });
    return { updated: count };
  },
  get_upcoming: (args) => {
    const days = (args.days as number) || 7;
    const today = new Date();
    const upcoming = store.tasks.filter(t => {
      const d = new Date(t.date);
      const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= days && t.status !== 'done' && t.status !== 'cancelled';
    }).sort((a, b) => a.date.localeCompare(b.date));
    return { tasks: upcoming, count: upcoming.length };
  },
  clear_completed: (args) => {
    const date = args.date as string;
    const before = store.tasks.length;
    store.tasks = store.tasks.filter(t => !(t.date === date && t.status === 'done'));
    return { removed: before - store.tasks.length };
  },
};

const TOOL_DEFINITIONS = [
  { name: 'list_tasks', description: 'List tasks with optional date/status/category/priority filters', inputSchema: { type: 'object', properties: { date: { type: 'string' }, status: { type: 'string' }, category: { type: 'string' }, priority: { type: 'string' } } } },
  { name: 'get_task', description: 'Get a task by ID', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'create_task', description: 'Create a new task', inputSchema: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' }, date: { type: 'string' }, time: { type: 'string' }, duration: { type: 'number' }, priority: { type: 'string' }, category: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } } }, required: ['title'] } },
  { name: 'update_task', description: 'Update an existing task', inputSchema: { type: 'object', properties: { id: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, priority: { type: 'string' }, status: { type: 'string' }, category: { type: 'string' } }, required: ['id'] } },
  { name: 'delete_task', description: 'Delete a task by ID', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'complete_task', description: 'Mark a task as done', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'search_tasks', description: 'Search tasks by title, description, or tags', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
  { name: 'get_day_plan', description: 'Get the day plan including tasks, notes, and goals', inputSchema: { type: 'object', properties: { date: { type: 'string' } }, required: ['date'] } },
  { name: 'save_day_plan', description: 'Save notes and goals for a day', inputSchema: { type: 'object', properties: { date: { type: 'string' }, notes: { type: 'string' }, goals: { type: 'array', items: { type: 'string' } } }, required: ['date'] } },
  { name: 'get_stats', description: 'Get task statistics optionally filtered by date', inputSchema: { type: 'object', properties: { date: { type: 'string' } } } },
  { name: 'get_categories', description: 'Get all unique categories', inputSchema: { type: 'object', properties: {} } },
  { name: 'get_tags', description: 'Get all unique tags', inputSchema: { type: 'object', properties: {} } },
  { name: 'bulk_create', description: 'Create multiple tasks at once', inputSchema: { type: 'object', properties: { tasks: { type: 'array' } }, required: ['tasks'] } },
  { name: 'bulk_update_status', description: 'Update status of multiple tasks', inputSchema: { type: 'object', properties: { ids: { type: 'array', items: { type: 'string' } }, status: { type: 'string' } }, required: ['ids', 'status'] } },
  { name: 'get_upcoming', description: 'Get upcoming tasks for the next N days', inputSchema: { type: 'object', properties: { days: { type: 'number' } } } },
  { name: 'clear_completed', description: 'Remove all completed tasks for a given date', inputSchema: { type: 'object', properties: { date: { type: 'string' } }, required: ['date'] } },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jsonrpc, method, params, id } = body;

    if (jsonrpc !== '2.0') {
      return NextResponse.json({ jsonrpc: '2.0', error: { code: -32600, message: 'Invalid JSON-RPC version' }, id });
    }

    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: 'daily-planner-mcp', version: '1.0.0' },
        },
        id,
      });
    }

    if (method === 'tools/list') {
      return NextResponse.json({ jsonrpc: '2.0', result: { tools: TOOL_DEFINITIONS }, id });
    }

    if (method === 'tools/call') {
      const { name, arguments: args = {} } = params || {};
      const handler = toolHandlers[name];
      if (!handler) {
        return NextResponse.json({
          jsonrpc: '2.0',
          result: { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true },
          id,
        });
      }
      const result = handler(args);
      return NextResponse.json({
        jsonrpc: '2.0',
        result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] },
        id,
      });
    }

    return NextResponse.json({ jsonrpc: '2.0', error: { code: -32601, message: `Method not found: ${method}` }, id });
  } catch (err) {
    return NextResponse.json({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' }, id: null }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'daily-planner-mcp',
    version: '1.0.0',
    tools: TOOL_DEFINITIONS.map(t => t.name),
    description: 'MCP server for Daily Planner with 16 task management tools',
  });
}

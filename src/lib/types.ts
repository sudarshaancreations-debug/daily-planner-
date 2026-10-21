export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string YYYY-MM-DD
  time?: string; // HH:MM
  duration?: number; // minutes
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'done' | 'cancelled';
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DayPlan {
  date: string;
  tasks: Task[];
  notes: string;
  goals: string[];
}

export interface VoiceCommand {
  transcript: string;
  confidence: number;
  intent: 'add_task' | 'update_task' | 'delete_task' | 'query' | 'unknown';
  entities: Record<string, string>;
}

export interface WidgetData {
  todayTasks: Task[];
  nextTask: Task | null;
  completedCount: number;
  totalCount: number;
  upcomingEvents: Task[];
}

export interface MCPToolCall {
  tool: string;
  arguments: Record<string, unknown>;
}

export interface MCPToolResult {
  content: { type: string; text: string }[];
  isError?: boolean;
}

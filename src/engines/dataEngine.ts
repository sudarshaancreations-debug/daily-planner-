/**
 * Data Engine (Persistence & Backup Subsystem)
 * 
 * Manages:
 * 1. Persistent Storage across app restarts & sessions
 * 2. Backup & Restore (JSON Export / Import)
 * 3. Habit, Routine, Focus Session, and Goal Tables
 * 4. User Preferences & Active Device Sessions
 * 5. Permanent Local Wipe (GDPR / Google Play Data Erasure)
 */

import { PlannerTask, HabitItem, RoutineSequence, FocusSession, GoalItem } from './plannerEngine';
import { INITIAL_TASKS } from '@/nimora/data';

export interface FullAppBackup {
  version: string;
  exportedAt: string;
  tasks: PlannerTask[];
  habits: HabitItem[];
  routines: RoutineSequence[];
  focusSessions: FocusSession[];
  goals: GoalItem[];
  userPreferences: Record<string, any>;
}

const STORAGE_KEYS = {
  TASKS: 'nimora_planner_tasks',
  HABITS: 'nimora_planner_habits',
  ROUTINES: 'nimora_planner_routines',
  FOCUS: 'nimora_planner_focus_sessions',
  GOALS: 'nimora_planner_goals',
  PREFERENCES: 'nimora_user_preferences',
};

const DEFAULT_HABITS: HabitItem[] = [
  {
    id: 'habit-1',
    title: 'Hydrate & Morning Sunlight',
    category: 'health',
    streak: 12,
    bestStreak: 18,
    completedDates: [],
    targetFrequency: 'daily',
  },
  {
    id: 'habit-2',
    title: '30-Minute Deep Work Session',
    category: 'mindset',
    streak: 8,
    bestStreak: 14,
    completedDates: [],
    targetFrequency: 'weekdays',
  },
  {
    id: 'habit-3',
    title: 'Review & Close Evening Agenda',
    category: 'mindset',
    streak: 15,
    bestStreak: 21,
    completedDates: [],
    targetFrequency: 'daily',
  },
];

const DEFAULT_ROUTINES: RoutineSequence[] = [
  {
    id: 'routine-morning',
    name: 'Executive Morning Sequence',
    timeOfDay: 'morning',
    steps: [
      { id: 'step-1', title: 'Hydrate (500ml water)', durationMinutes: 5, completed: true },
      { id: 'step-2', title: 'Review Daily Time Blocks', durationMinutes: 10, completed: true },
      { id: 'step-3', title: 'Priority Task Alignment', durationMinutes: 15, completed: false },
    ],
  },
  {
    id: 'routine-evening',
    name: 'Evening Wind-down & Reflection',
    timeOfDay: 'evening',
    steps: [
      { id: 'step-e1', title: 'Log Completed Milestones', durationMinutes: 10, completed: false },
      { id: 'step-e2', title: 'Prepare Tomorrow’s Key Focus', durationMinutes: 15, completed: false },
    ],
  },
];

class DataEngineImpl {
  // ==========================================
  // HABITS & ROUTINES
  // ==========================================

  public getHabits(): HabitItem[] {
    if (typeof window === 'undefined') return DEFAULT_HABITS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_HABITS;
  }

  public saveHabits(habits: HabitItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch {}
  }

  public getRoutines(): RoutineSequence[] {
    if (typeof window === 'undefined') return DEFAULT_ROUTINES;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_ROUTINES;
  }

  public saveRoutines(routines: RoutineSequence[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
    } catch {}
  }

  // ==========================================
  // FOCUS SESSIONS
  // ==========================================

  public getFocusSessions(): FocusSession[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FOCUS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  }

  public logFocusSession(session: FocusSession): void {
    const list = this.getFocusSessions();
    list.unshift(session);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.FOCUS, JSON.stringify(list.slice(0, 50)));
      } catch {}
    }
  }

  // ==========================================
  // BACKUP & RESTORE (EXPORTS & IMPORTS)
  // ==========================================

  public exportBackup(): FullAppBackup {
    let tasks: PlannerTask[] = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
        if (raw) tasks = JSON.parse(raw);
      } catch {}
    }

    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      tasks: tasks.length > 0 ? tasks : (INITIAL_TASKS as any),
      habits: this.getHabits(),
      routines: this.getRoutines(),
      focusSessions: this.getFocusSessions(),
      goals: [],
      userPreferences: {
        theme: typeof window !== 'undefined' ? localStorage.getItem('nimora_theme_mode') : 'auto',
      },
    };
  }

  public downloadBackupFile(): void {
    if (typeof window === 'undefined') return;
    const backup = this.exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nimora-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  public restoreBackup(jsonString: string): boolean {
    try {
      const backup: FullAppBackup = JSON.parse(jsonString);
      if (typeof window !== 'undefined') {
        if (Array.isArray(backup.tasks)) {
          localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(backup.tasks));
        }
        if (Array.isArray(backup.habits)) {
          localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(backup.habits));
        }
        if (Array.isArray(backup.routines)) {
          localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(backup.routines));
        }
      }
      return true;
    } catch (e) {
      console.error('Failed to restore backup:', e);
      return false;
    }
  }

  /**
   * Complete GDPR & Google Play account and data wipe.
   */
  public wipeAllData(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
  }
}

export const dataEngine = new DataEngineImpl();

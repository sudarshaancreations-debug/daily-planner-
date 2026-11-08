/**
 * Planner Engine (Core Application Engine)
 * 
 * Manages:
 * 1. Task Lifecycle, Priorities & Subtasks
 * 2. Schedule Timeline & Conflict Detection Engine
 * 3. Habit Tracker & Routine Sequences
 * 4. Focus Mode & Pomodoro Timer State
 * 5. Goals & Measurable Milestones
 * 
 * Works 100% independently of AI.
 */

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus =
  | 'inbox'
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'deferred'
  | 'cancelled'
  | 'overdue';

export interface PlannerSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface PlannerTask {
  id: string;
  title: string;
  description?: string;
  date: string;              // ISO format YYYY-MM-DD
  startTime?: string;        // e.g. "09:00 AM"
  endTime?: string;          // e.g. "10:30 AM"
  durationMinutes: number;   // e.g. 90
  priority: TaskPriority;
  status: TaskStatus;
  category: 'deep_work' | 'meeting' | 'admin' | 'personal' | 'health';
  isLocked?: boolean;        // If locked, AI cannot move without manual override
  subtasks?: PlannerSubtask[];
  goalId?: string;           // Optional link to high-level goal
  recurrence?: 'none' | 'daily' | 'weekdays' | 'weekly';
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleConflict {
  taskA: PlannerTask;
  taskB: PlannerTask;
  overlapMinutes: number;
  message: string;
}

export interface HabitItem {
  id: string;
  title: string;
  category: 'health' | 'mindset' | 'learning' | 'fitness';
  streak: number;
  bestStreak: number;
  completedDates: string[];   // Array of YYYY-MM-DD
  targetFrequency: 'daily' | 'weekdays' | 'weekly';
}

export interface RoutineSequence {
  id: string;
  name: string;             // e.g. "Morning Executive Routine"
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  steps: Array<{
    id: string;
    title: string;
    durationMinutes: number;
    completed: boolean;
  }>;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  actualDurationSeconds: number;
  distractionNotes: string[];
  completedAt: string;
}

export interface GoalItem {
  id: string;
  title: string;
  category: string;
  targetDate: string;
  progressPercentage: number;
  milestones: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

class PlannerEngineImpl {
  /**
   * Parse a 12-hour or 24-hour time string into minutes from midnight (0 to 1439).
   */
  public parseTimeToMinutes(timeStr?: string): number | null {
    if (!timeStr) return null;
    const match = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const meridiem = (match[3] || '').toUpperCase();

    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  /**
   * Format minutes from midnight back into human-readable 12-hour format.
   */
  public formatMinutesToTime(totalMins: number): string {
    const wrapped = ((totalMins % 1440) + 1440) % 1440;
    let hours = Math.floor(wrapped / 60);
    const minutes = wrapped % 60;
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${meridiem}`;
  }

  /**
   * Detect overlapping schedule conflicts between active tasks.
   */
  public detectConflicts(tasks: PlannerTask[]): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];
    const timedTasks = tasks.filter(
      (t) => t.status !== 'completed' && t.status !== 'cancelled' && t.startTime && t.endTime
    );

    for (let i = 0; i < timedTasks.length; i++) {
      for (let j = i + 1; j < timedTasks.length; j++) {
        const taskA = timedTasks[i];
        const taskB = timedTasks[j];

        if (taskA.date !== taskB.date) continue;

        const startA = this.parseTimeToMinutes(taskA.startTime);
        const endA = this.parseTimeToMinutes(taskA.endTime);
        const startB = this.parseTimeToMinutes(taskB.startTime);
        const endB = this.parseTimeToMinutes(taskB.endTime);

        if (startA !== null && endA !== null && startB !== null && endB !== null) {
          // Check overlap: max(startA, startB) < min(endA, endB)
          const overlapStart = Math.max(startA, startB);
          const overlapEnd = Math.min(endA, endB);
          if (overlapStart < overlapEnd) {
            const overlapMinutes = overlapEnd - overlapStart;
            conflicts.push({
              taskA,
              taskB,
              overlapMinutes,
              message: `"${taskA.title}" overlaps with "${taskB.title}" by ${overlapMinutes} mins`,
            });
          }
        }
      }
    }

    return conflicts;
  }

  /**
   * Find available free slots in a workday (e.g. 08:00 AM to 06:00 PM).
   */
  public findAvailableSlots(
    tasks: PlannerTask[],
    workdayStartMinutes: number = 8 * 60,   // 8:00 AM
    workdayEndMinutes: number = 18 * 60     // 6:00 PM
  ): Array<{ startMins: number; endMins: number; durationMins: number }> {
    const intervals: Array<{ start: number; end: number }> = [];

    tasks
      .filter((t) => t.status !== 'completed' && t.status !== 'cancelled' && t.startTime && t.endTime)
      .forEach((t) => {
        const s = this.parseTimeToMinutes(t.startTime);
        const e = this.parseTimeToMinutes(t.endTime);
        if (s !== null && e !== null && s < e) {
          intervals.push({ start: s, end: e });
        }
      });

    intervals.sort((a, b) => a.start - b.start);

    const freeSlots: Array<{ startMins: number; endMins: number; durationMins: number }> = [];
    let currentCursor = workdayStartMinutes;

    for (const block of intervals) {
      if (block.start > currentCursor) {
        freeSlots.push({
          startMins: currentCursor,
          endMins: block.start,
          durationMins: block.start - currentCursor,
        });
      }
      currentCursor = Math.max(currentCursor, block.end);
    }

    if (currentCursor < workdayEndMinutes) {
      freeSlots.push({
        startMins: currentCursor,
        endMins: workdayEndMinutes,
        durationMins: workdayEndMinutes - currentCursor,
      });
    }

    return freeSlots;
  }

  /**
   * Habit tracking helper: Toggle today's completion and recalculate streaks.
   */
  public toggleHabitCompletion(habit: HabitItem, dateIso: string): HabitItem {
    const isCompleted = habit.completedDates.includes(dateIso);
    let newDates: string[];

    if (isCompleted) {
      newDates = habit.completedDates.filter((d) => d !== dateIso);
    } else {
      newDates = [...habit.completedDates, dateIso].sort();
    }

    // Calculate streak from sorted dates
    let currentStreak = 0;
    if (newDates.length > 0) {
      const today = new Date();
      let checkDate = new Date(today);

      for (let i = 0; i < 365; i++) {
        const iso = checkDate.toISOString().split('T')[0];
        if (newDates.includes(iso)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (i === 0) {
          // If not completed today, check if completed yesterday to keep streak active
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    const bestStreak = Math.max(habit.bestStreak, currentStreak);

    return {
      ...habit,
      completedDates: newDates,
      streak: currentStreak,
      bestStreak,
    };
  }
}

export const plannerEngine = new PlannerEngineImpl();

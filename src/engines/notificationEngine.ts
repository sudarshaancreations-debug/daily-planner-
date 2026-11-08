/**
 * Notification Engine (Smart Reminders Subsystem)
 * 
 * Manages:
 * 1. Task Reminders, Appointment Alerts & Habit Reminders
 * 2. Browser Push & In-App Notification Channels
 * 3. Quiet Hours & Do-Not-Disturb Logic
 * 4. Voice Announcements via VoiceEngine
 * 5. Snooze & Duplicate Prevention
 */

import { voiceEngine } from './voiceEngine';
import { PlannerTask } from './plannerEngine';

export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  voiceAlertsEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // e.g. "22:00"
  quietHoursEnd: string;   // e.g. "07:00"
  advanceMinutes: number;  // Remind 10 mins before
}

export interface SmartNotification {
  id: string;
  taskId?: string;
  title: string;
  body: string;
  scheduledTime: string; // ISO
  delivered: boolean;
  read: boolean;
}

class NotificationEngineImpl {
  private settings: NotificationSettings = {
    enabled: true,
    soundEnabled: true,
    voiceAlertsEnabled: true,
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    advanceMinutes: 10,
  };

  private deliveredIds: Set<string> = new Set();

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('nimora_notification_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch {}
  }

  public saveSettings(newSettings: Partial<NotificationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nimora_notification_settings', JSON.stringify(this.settings));
      } catch {}
    }
  }

  public getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  /**
   * Request standard HTML5 Notification permission.
   */
  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Check if current time falls within user-configured Quiet Hours.
   */
  public isQuietHours(): boolean {
    if (!this.settings.quietHoursEnabled) return false;
    const now = new Date();
    const currentH = now.getHours();
    const [startH] = this.settings.quietHoursStart.split(':').map((n) => parseInt(n, 10));
    const [endH] = this.settings.quietHoursEnd.split(':').map((n) => parseInt(n, 10));

    if (startH > endH) {
      // Over midnight (e.g. 22:00 to 07:00)
      return currentH >= startH || currentH < endH;
    } else {
      return currentH >= startH && currentH < endH;
    }
  }

  /**
   * Trigger a smart reminder alert with visual notification + optional voice speech.
   */
  public triggerReminder(task: PlannerTask): boolean {
    if (!this.settings.enabled) return false;
    if (this.isQuietHours()) return false;
    if (task.status === 'completed' || task.status === 'cancelled') return false;

    const dedupeKey = `${task.id}-${task.startTime}-${task.date}`;
    if (this.deliveredIds.has(dedupeKey)) return false;
    this.deliveredIds.add(dedupeKey);

    const title = `Reminder: ${task.title}`;
    const body = task.startTime ? `Scheduled at ${task.startTime}` : 'Due today';

    // 1. Browser Native Notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch {}
    }

    // 2. TTS Voice Announcement
    if (this.settings.voiceAlertsEnabled) {
      voiceEngine.speak(`Reminder: You have ${task.title} coming up.`);
    }

    return true;
  }
}

export const notificationEngine = new NotificationEngineImpl();

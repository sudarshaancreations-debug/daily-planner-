/**
 * The 5 Independent Engines of NIMORA
 * 
 * 1. VoiceEngine: Independent TTS (intact) + STT listener.
 * 2. PlannerEngine: Tasks, conflict detection, habits, routines, focus timer.
 * 3. AIEngine: Multi-provider planning, natural-language commands & proposal approval loop.
 * 4. NotificationEngine: Reminders, quiet hours, browser alerts & TTS announcements.
 * 5. DataEngine: Persistent database, backup/restore, JSON export/import & data wipe.
 */

export * from './voiceEngine';
export * from './plannerEngine';
export * from './aiEngine';
export * from './notificationEngine';
export * from './dataEngine';

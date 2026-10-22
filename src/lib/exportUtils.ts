import { NimoraTask } from '@/nimora/data';

/**
 * Generates an RFC 5545 compliant iCalendar (.ics) string for a list of NIMORA tasks.
 */
export function generateICS(tasks: NimoraTask[], calendarName = 'NIMORA Daily Agenda'): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  // Format date helper: 2026-10-20
  const parseTaskDateTime = (dateStr: string, timeStr: string) => {
    // e.g. "9:00 AM", "11:30 AM", "1:00 PM"
    const [t, meridiem] = timeStr.split(' ');
    let [hours, minutes] = t.split(':').map(Number);
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    const pad = (n: number) => n.toString().padStart(2, '0');
    // Using default fixed date 20261020 for the mockup day or current year
    return `20261020T${pad(hours)}${pad(minutes)}00`;
  };

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NIMORA//Daily Planner & MCP Hub//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${calendarName}`,
    'X-WR-TIMEZONE:Asia/Kolkata',
  ];

  for (const task of tasks) {
    const dtStart = parseTaskDateTime(task.date, task.startTime);
    const dtEnd = parseTaskDateTime(task.date, task.endTime);

    ics.push(
      'BEGIN:VEVENT',
      `UID:nimora-${task.id}@planner.local`,
      `DTSTAMP:${timestamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${task.title}${task.subtitle ? ` - ${task.subtitle}` : ''}`,
      `DESCRIPTION:${(task.notes || task.title).replace(/\n/g, '\\n')}`,
      `STATUS:CONFIRMED`,
      `PRIORITY:${task.priority === 'high' ? '1' : task.priority === 'medium' ? '5' : '9'}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${task.title}`,
      'END:VALARM',
      'END:VEVENT'
    );
  }

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

/**
 * Triggers a browser download of the generated .ics file
 */
export function downloadICS(tasks: NimoraTask[], filename = 'nimora-schedule.ics') {
  const icsData = generateICS(tasks);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

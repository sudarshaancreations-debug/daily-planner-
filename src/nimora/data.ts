export interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  category: 'client' | 'lead' | 'team';
  phone: string;
  email: string;
  location: string;
  followUpCount: number;
  lastCall: string;
  avatarColor: string;
  interactions: {
    type: 'call' | 'whatsapp' | 'followup';
    title: string;
    description: string;
    date: string;
  }[];
}

export interface NimoraTask {
  id: string;
  title: string;
  subtitle?: string;
  category: 'task' | 'followup' | 'call' | 'note';
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  priority: 'low' | 'medium' | 'high';
  status: 'upcoming' | 'completed' | 'overdue';
  color: 'blue' | 'green' | 'coral' | 'orange' | 'gray';
  relatedContactId?: string;
  notes?: string;
}

export interface AISuggestion {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  actionText: string;
}

export interface NimoraNotification {
  id: string;
  title: string;
  body: string;
  timeAgo: string;
  actions: { label: string; primary?: boolean }[];
}

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Arun Mehta',
    title: 'Managing Director',
    company: 'ABC Constructions',
    category: 'client',
    phone: '+91 98765 43210',
    email: 'arun@abcconstructions.com',
    location: 'ABC Constructions, Chennai',
    followUpCount: 3,
    lastCall: '2 days ago',
    avatarColor: 'bg-emerald-700',
    interactions: [
      {
        type: 'call',
        title: 'Client Call',
        description: 'Discussed project timeline & milestone payments',
        date: '2 days ago',
      },
      {
        type: 'whatsapp',
        title: 'WhatsApp Message',
        description: 'Sent revised architectural drawings PDF',
        date: '4 days ago',
      },
      {
        type: 'followup',
        title: 'Follow-up',
        description: 'Confirm site visit date and engineering team arrival',
        date: '1 week ago',
      },
    ],
  },
  {
    id: 'c2',
    name: 'Rohan Sharma',
    title: 'Lead Contractor',
    company: 'Sharma Builders',
    category: 'client',
    phone: '+91 98450 11223',
    email: 'rohan@sharmabuilders.in',
    location: 'Bangalore Central',
    followUpCount: 2,
    lastCall: '1 week ago',
    avatarColor: 'bg-amber-700',
    interactions: [
      {
        type: 'followup',
        title: 'Materials Confirmation',
        description: 'Awaiting quotation approval for structural steel',
        date: '1 week ago',
      },
    ],
  },
  {
    id: 'c3',
    name: 'Priya Nair',
    title: 'Interior Designer',
    company: 'Studio Priya Interiors',
    category: 'team',
    phone: '+91 99001 88776',
    email: 'priya@priyadesign.com',
    location: 'Kochi & Bangalore',
    followUpCount: 1,
    lastCall: '3 days ago',
    avatarColor: 'bg-indigo-700',
    interactions: [
      {
        type: 'call',
        title: 'Material Board Sync',
        description: 'Reviewed marble samples and lighting fixtures',
        date: '3 days ago',
      },
    ],
  },
  {
    id: 'c4',
    name: 'Vikram Rao',
    title: 'Director',
    company: 'Rao Developers',
    category: 'lead',
    phone: '+91 97312 33445',
    email: 'vikram@raodevelopers.com',
    location: 'Hyderabad Tech Zone',
    followUpCount: 0,
    lastCall: 'No follow-ups yet',
    avatarColor: 'bg-teal-700',
    interactions: [],
  },
];

export const INITIAL_TASKS: NimoraTask[] = [
  {
    id: 't1',
    title: 'Client Call',
    subtitle: 'ABC Constructions',
    category: 'call',
    date: 'Tue, 20 Oct 2026',
    startTime: '9:00 AM',
    endTime: '9:30 AM',
    durationMinutes: 30,
    priority: 'high',
    status: 'upcoming',
    color: 'blue',
    relatedContactId: 'c1',
    notes: 'Discuss new project requirements and timeline.',
  },
  {
    id: 't2',
    title: 'Review Drawings',
    subtitle: 'Project A',
    category: 'task',
    date: 'Tue, 20 Oct 2026',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    durationMinutes: 60,
    priority: 'medium',
    status: 'upcoming',
    color: 'green',
    notes: 'Verify structural load calculations and balcony column offsets.',
  },
  {
    id: 't3',
    title: 'Site Visit',
    subtitle: 'Downtown Project',
    category: 'task',
    date: 'Tue, 20 Oct 2026',
    startTime: '11:30 AM',
    endTime: '12:30 PM',
    durationMinutes: 60,
    priority: 'high',
    status: 'upcoming',
    color: 'coral',
    notes: 'Inspect foundation pour and meet site manager on location.',
  },
  {
    id: 't4',
    title: 'Lunch Break',
    subtitle: 'Rest & recharge',
    category: 'note',
    date: 'Tue, 20 Oct 2026',
    startTime: '1:00 PM',
    endTime: '2:00 PM',
    durationMinutes: 60,
    priority: 'low',
    status: 'upcoming',
    color: 'gray',
  },
  {
    id: 't5',
    title: 'Follow up Email',
    subtitle: 'Rohan - Materials',
    category: 'followup',
    date: 'Tue, 20 Oct 2026',
    startTime: '2:00 PM',
    endTime: '2:30 PM',
    durationMinutes: 30,
    priority: 'medium',
    status: 'upcoming',
    color: 'orange',
    relatedContactId: 'c2',
    notes: 'Send purchase order draft for structural steel rebar.',
  },
  {
    id: 't6',
    title: 'Design Discussion',
    subtitle: 'Team Meeting',
    category: 'task',
    date: 'Tue, 20 Oct 2026',
    startTime: '3:00 PM',
    endTime: '4:00 PM',
    durationMinutes: 60,
    priority: 'medium',
    status: 'upcoming',
    color: 'blue',
    relatedContactId: 'c3',
    notes: 'Align with Priya on penthouse living room light fixtures.',
  },
];

export const INITIAL_AI_SUGGESTIONS: AISuggestion[] = [
  {
    id: 's1',
    title: 'Follow up with Rohan',
    subtitle: 'Material confirmation pending',
    tag: 'Materials',
    actionText: 'Add',
  },
  {
    id: 's2',
    title: 'Prepare drawings for Site Visit',
    subtitle: 'Tomorrow at 11:30 AM',
    tag: 'Site Prep',
    actionText: 'Add',
  },
  {
    id: 's3',
    title: 'Call Priya',
    subtitle: 'Last call was 3 days ago',
    tag: 'Design',
    actionText: 'Add',
  },
  {
    id: 's4',
    title: 'Schedule team meeting',
    subtitle: 'Based on recent emails',
    tag: 'Team Sync',
    actionText: 'Add',
  },
];

export const INITIAL_NOTIFICATIONS: NimoraNotification[] = [
  {
    id: 'n1',
    title: 'Client Call starts in 5 minutes',
    body: 'ABC Constructions with Arun Mehta',
    timeAgo: 'now',
    actions: [{ label: 'Snooze' }, { label: 'Open', primary: true }],
  },
  {
    id: 'n2',
    title: 'Follow up with Rohan',
    body: 'Material confirmation pending',
    timeAgo: '1h ago',
    actions: [{ label: 'Mark Done', primary: true }],
  },
  {
    id: 'n3',
    title: 'AI Suggestion',
    body: 'Add a task: Review drawings for Site Visit tomorrow',
    timeAgo: '3h ago',
    actions: [{ label: 'View Suggestion', primary: true }],
  },
];

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Contact, AISuggestion, NimoraTask } from '../data';
import { haptics } from '@/lib/haptics';

export interface ContactsAndAIProps {
  contacts: Contact[];
  suggestions: AISuggestion[];
  onNavigate?: (screenNumber: number) => void;
  onSelectContact?: (contact: Contact) => void;
  selectedContact?: Contact;
  onAddTask?: (task: NimoraTask) => void;
  onDeleteTask?: (id: string) => void;
  assistantName?: string;
  onUpdateAssistantName?: (name: string) => void;
  tasks?: NimoraTask[];
}

// 9. Contacts & Follow-ups (80% Utilitarian Minimalism)
export function Screen11Contacts({ contacts, onNavigate, onSelectContact }: ContactsAndAIProps) {
  const [filter, setFilter] = useState<'all' | 'client' | 'lead' | 'team'>('all');
  const [search, setSearch] = useState('');

  const filtered = contacts.filter((c) => {
    if (filter !== 'all' && c.category !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.company.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full h-full min-h-[680px] bg-[#0c0f0d] text-[#ededec] flex flex-col justify-between select-none rounded-[32px] overflow-hidden border border-white/[0.08]">
      {/* Top Header */}
      <div className="p-4 bg-[#0e120f] border-b border-white/[0.08]">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e9c349] text-[20px]">group</span>
            <h2 className="text-base font-bold text-[#ededec] font-['Space_Grotesk']">CRM & Network</h2>
          </div>
          <span className="text-[10px] font-mono text-[#a1d1bd] font-medium">{filtered.length} Contacts</span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients, architects, vendors..."
            className="w-full bg-[#151916] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-[#ededec] outline-none focus:border-[#e9c349] placeholder-[#8a938e]"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-[#8a938e]">search</span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['all', 'client', 'lead', 'team'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-[#1e2420] text-[#e9c349] border border-white/[0.15]'
                  : 'minimal-btn-secondary text-[#8a938e] hover:text-[#ededec]'
              }`}
            >
              {cat === 'all' ? 'All' : `${cat}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Contact Cards List (Minimalist Editorial Stream) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filtered.map((contact) => (
          <div
            key={contact.id}
            onClick={() => {
              onSelectContact?.(contact);
              onNavigate?.(10);
            }}
            className="minimal-card p-3 rounded-xl flex items-center justify-between hover:border-white/[0.18] transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${contact.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow-sm ring-1 ring-white/10 font-['Space_Grotesk']`}>
                {contact.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#ededec] font-['Space_Grotesk']">{contact.name}</h4>
                <p className="text-[10px] text-[#9b9f9c]">{contact.company} · {contact.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {contact.followUpCount > 0 ? (
                    <span className="text-[8px] font-mono uppercase tracking-wider text-[#e9c349] bg-[#1a201c] border border-[#e9c349]/25 px-1.5 py-0.2 rounded">
                      {contact.followUpCount} {contact.followUpCount === 1 ? 'follow-up' : 'follow-ups'}
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-[#8a938e]">Active</span>
                  )}
                  <span className="text-[9px] font-mono text-[#8a938e]">• Last: {contact.lastCall}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                onClick={(e) => e.stopPropagation()}
                href={`tel:${contact.phone}`}
                className="w-7 h-7 rounded-lg minimal-btn-secondary flex items-center justify-center text-[#a1d1bd] cursor-pointer"
                title="Call"
              >
                <span className="material-symbols-outlined text-[15px]">call</span>
              </a>
              <span className="text-[#8a938e] text-xs font-mono">›</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 10. Contact Details & History
export function Screen12ContactDetails({ contacts, onNavigate, selectedContact }: ContactsAndAIProps) {
  const contact = selectedContact || contacts[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'followups' | 'notes'>('history');

  return (
    <div className="w-full h-full min-h-[680px] bg-[#0c0f0d] text-[#ededec] flex flex-col justify-between select-none rounded-[32px] overflow-hidden border border-white/[0.08]">
      {/* Header Profile Card */}
      <div className="p-4 bg-[#0e120f] border-b border-white/[0.08]">
        <div className="flex justify-between items-center mb-3">
          <button onClick={() => onNavigate?.(9)} className="text-[#9b9f9c] hover:text-[#ededec] text-xs font-mono font-medium flex items-center gap-1 cursor-pointer">
            ‹ Contacts
          </button>
          <span className="text-[9px] font-mono uppercase tracking-wider text-[#e9c349] bg-[#181c19] px-2 py-0.5 rounded-full border border-white/[0.08]">
            {contact.category}
          </span>
        </div>

        <div className="flex items-center gap-3.5 mb-4">
          <div className={`w-12 h-12 rounded-full ${contact.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-md ring-1 ring-white/10 font-['Space_Grotesk']`}>
            {contact.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-base font-bold text-[#ededec] font-['Space_Grotesk']">{contact.name}</h3>
            <p className="text-xs text-[#9b9f9c]">{contact.title} · {contact.company}</p>
          </div>
        </div>

        {/* Quick contact actions (Minimalist + Liquid Glass Action Pills) */}
        <div className="flex gap-2">
          <a
            href={`tel:${contact.phone}`}
            className="flex-1 py-2 minimal-btn-secondary rounded-xl text-xs font-medium text-[#a1d1bd] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">call</span> Call
          </a>
          <a
            href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2 liquid-glass-pill rounded-xl text-xs font-semibold text-[#4edea3] flex items-center justify-center gap-1.5 hover:brightness-110 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">chat</span> WhatsApp
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="flex-1 py-2 minimal-btn-secondary rounded-xl text-xs font-medium text-[#e9c349] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">mail</span> Email
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#414945]/30 bg-[#121412] px-4 text-xs font-semibold">
        {(['overview', 'history', 'followups', 'notes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-3 border-b-2 capitalize transition-all ${
              activeTab === tab
                ? 'border-[#e9c349] text-[#e9c349]'
                : 'border-transparent text-[#8a938e] hover:text-[#c0c8c3]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Contact Info Box */}
        <div className="glass-card specular-border rounded-2xl p-3.5 shadow-sm space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#c0c8c3]">
            <span className="material-symbols-outlined text-[16px] text-[#a1d1bd]">call</span>
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-[#c0c8c3]">
            <span className="material-symbols-outlined text-[16px] text-[#e9c349]">mail</span>
            <span>{contact.email}</span>
          </div>
          <div className="flex items-center gap-2 text-[#c0c8c3]">
            <span className="material-symbols-outlined text-[16px] text-[#4edea3]">location_on</span>
            <span>{contact.location}</span>
          </div>
        </div>

        {/* Recent Interactions List */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#8a938e] mb-2 font-['Space_Grotesk']">
            Interaction Log & History
          </h4>
          <div className="space-y-2">
            {contact.interactions.map((interaction, i) => (
              <div key={i} className="glass-card specular-border rounded-xl p-3 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-[#e3e2e0] flex items-center gap-1.5 font-['Space_Grotesk']">
                    <span className="material-symbols-outlined text-[16px] text-[#e9c349]">
                      {interaction.type === 'whatsapp' ? 'chat' : interaction.type === 'call' ? 'call' : 'event_note'}
                    </span>
                    <span>{interaction.title}</span>
                  </span>
                  <span className="text-[10px] text-[#8a938e]">{interaction.date}</span>
                </div>
                <p className="text-[11px] text-[#c0c8c3]">{interaction.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-[#121412] border-t border-[#414945]/30">
        <button
          onClick={() => onNavigate?.(7)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0e3e30] to-[#0A2E24] border border-[#e9c349]/50 text-[#e9c349] font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all font-['Space_Grotesk']"
        >
          + Add Follow-up Task
        </button>
      </div>
    </div>
  );
}

// 11. Voice Assistant with live browser Speech Recognition + Text-to-Speech + Name Customization
export function Screen13VoiceAssistant({
  contacts = [],
  onNavigate,
  onAddTask,
  onDeleteTask,
  assistantName = 'Nova',
  onUpdateAssistantName,
  tasks = [],
}: ContactsAndAIProps) {
  const [name, setName] = useState(assistantName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [customNameInput, setCustomNameInput] = useState(assistantName);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [typedInput, setTypedInput] = useState('');
  const [statusMessage, setStatusMessage] = useState(`Tap microphone to speak to ${name}`);
  const [createdTask, setCreatedTask] = useState<NimoraTask | null>(null);

  const transcriptRef = useRef('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nimora_assistant_name');
      if (saved) {
        setName(saved);
        setCustomNameInput(saved);
      }
    } catch {}
  }, []);

  useEffect(() => {
    setName(assistantName);
    setCustomNameInput(assistantName);
  }, [assistantName]);

  const speakFeedback = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('SpeechSynthesis error:', e);
      }
    }
  };

  const handleSaveAssistantName = (newName: string) => {
    const trimmed = newName.trim() || 'Nova';
    setName(trimmed);
    setCustomNameInput(trimmed);
    setIsEditingName(false);
    try {
      localStorage.setItem('nimora_assistant_name', trimmed);
    } catch {}
    onUpdateAssistantName?.(trimmed);
    setStatusMessage(`Voice assistant renamed to ${trimmed}!`);
    speakFeedback(`Hello, I am ${trimmed}. What can I organize for you today?`);
  };

  const computeEndTime = (startStr: string, durMins: number = 45): string => {
    try {
      const match = startStr.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
      if (!match) return '11:45 AM';
      let hours = parseInt(match[1], 10);
      const minutes = match[2] ? parseInt(match[2], 10) : 0;
      const meridiem = (match[3] || '').toUpperCase();
      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
      const total = hours * 60 + minutes + durMins;
      let endH = Math.floor(total / 60) % 24;
      const endM = total % 60;
      const endMeridiem = endH >= 12 ? 'PM' : 'AM';
      endH = endH % 12 || 12;
      return `${endH}:${endM.toString().padStart(2, '0')} ${endMeridiem}`;
    } catch {
      return '11:45 AM';
    }
  };

  const processVoiceCommand = (text: string) => {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();
    const lower = cleanText.toLowerCase();
    transcriptRef.current = ''; // prevent duplicate execution
    setStatusMessage(`Processing: "${cleanText}"`);

    // 1. Clean Title: strip assistant invocation and polite prefixes
    let cleanTitle = cleanText
      .replace(
        new RegExp(`^(hey\\s+)?(${name}|assistant|nova|jarvis|aria|friday|gemini|atlas)\\s*[,.:]?\\s*`, 'i'),
        ''
      )
      .replace(
        /^(can\s+you\s+|please\s+|could\s+you\s+)?(remind\s+me\s+to\s+|i\s+need\s+to\s+|don't\s+forget\s+to\s+|remember\s+to\s+|schedule\s+a\s+|schedule\s+|add\s+a\s+task\s+to\s+|add\s+a\s+|add\s+task\s+|add\s+|create\s+a\s+|create\s+task\s+|create\s+|book\s+a\s+|book\s+|make\s+a\s+note\s+to\s+|set\s+a\s+reminder\s+to\s+|set\s+up\s+a\s+|set\s+up\s+)?/i,
        ''
      )
      .trim();

    if (!cleanTitle) cleanTitle = cleanText;

    // 2. Extract Category
    let category: NimoraTask['category'] = 'task';
    let color: NimoraTask['color'] = 'green';
    if (lower.includes('call') || lower.includes('phone') || lower.includes('ring') || lower.includes('contact')) {
      category = 'call';
      color = 'blue';
    } else if (lower.includes('follow') || lower.includes('status update') || lower.includes('check in')) {
      category = 'followup';
      color = 'orange';
    } else if (lower.includes('meeting') || lower.includes('meet') || lower.includes('discuss') || lower.includes('appointment')) {
      category = 'task';
      color = 'coral';
    } else if (lower.includes('note') || lower.includes('remember') || lower.includes('idea') || lower.includes('write down')) {
      category = 'note';
      color = 'gray';
    }

    // 3. Extract Time
    let startTime = '11:00 AM';
    const timeMatch = cleanText.match(/\b(?:at\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/i);
    if (timeMatch && timeMatch[1]) {
      let rawT = timeMatch[1].trim().toUpperCase();
      if (!rawT.includes('AM') && !rawT.includes('PM')) {
        const num = parseInt(rawT);
        rawT = num >= 8 && num <= 11 ? `${num}:00 AM` : `${num}:00 PM`;
      }
      startTime = rawT;
    }

    // 4. Extract Date
    let dateStr = new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    if (lower.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateStr = tomorrow.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }

    // 5. Match Contact
    const matchedContact = (contacts || []).find((c) =>
      lower.includes(c.name.toLowerCase().split(' ')[0]) ||
      lower.includes(c.company.toLowerCase().split(' ')[0])
    );

    const newTask: NimoraTask = {
      id: `t_voice_${Date.now()}`,
      title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
      subtitle: matchedContact
        ? `${matchedContact.name} · ${matchedContact.company}`
        : `Created via ${name} Voice Assistant`,
      category,
      date: dateStr,
      startTime,
      endTime: computeEndTime(startTime, 45),
      durationMinutes: 45,
      priority: lower.includes('urgent') || lower.includes('high') || lower.includes('asap') ? 'high' : 'medium',
      status: 'upcoming',
      color,
      relatedContactId: matchedContact?.id,
      notes: `Voice input: "${cleanText}"`,
    };

    onAddTask?.(newTask);
    setCreatedTask(newTask);
    haptics.success();
    setStatusMessage(`✓ Added to Schedule: ${newTask.title}`);
    speakFeedback(`Added ${newTask.title} to your schedule for ${startTime}.`);
  };

  const handleCommandExecution = async (text: string) => {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();
    transcriptRef.current = '';
    setStatusMessage(`Thinking with ${name} AI...`);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: cleanText,
          assistantName: name,
          tasks: (tasks || []).map((t) => ({
            id: t.id,
            title: t.title,
            startTime: t.startTime,
            endTime: t.endTime,
            priority: t.priority,
            status: t.status,
          })),
          contacts: (contacts || []).map((c) => ({
            name: c.name,
            company: c.company,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.task) {
          const generatedTask: NimoraTask = {
            id: `t_ai_${Date.now()}`,
            title: data.task.title || cleanText,
            subtitle: data.task.subtitle || `Generated via ${name} (Vertex/Gemini AI)`,
            category: data.task.category || 'task',
            date: data.task.date || new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            startTime: data.task.startTime || '11:00 AM',
            endTime: data.task.endTime || computeEndTime(data.task.startTime || '11:00 AM', data.task.durationMinutes || 45),
            durationMinutes: data.task.durationMinutes || 45,
            priority: data.task.priority || 'medium',
            status: 'upcoming',
            color: data.task.color || 'green',
            notes: data.task.notes || `AI prompt: "${cleanText}"`,
          };
          onAddTask?.(generatedTask);
          setCreatedTask(generatedTask);
          setStatusMessage(`✓ ${data.source === 'google-vertex-gemini' ? 'Gemini 1.5' : name}: ${generatedTask.title}`);
          haptics.success();
          speakFeedback(data.spokenResponse || `Added ${generatedTask.title} to your schedule.`);
          return;
        } else if (data.spokenResponse) {
          setStatusMessage(data.spokenResponse);
          speakFeedback(data.spokenResponse);
          haptics.tick();
          return;
        }
      }
    } catch (err) {
      console.warn('AI Assistant API call error, falling back to local processing:', err);
    }

    processVoiceCommand(cleanText);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsRecording(false);
    const spoken = transcriptRef.current.trim();
    if (spoken) {
      handleCommandExecution(spoken);
    }
  };

  const toggleRecording = () => {
    if (typeof window === 'undefined') return;

    haptics.tick();

    if (isRecording) {
      stopRecording();
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Browser fallback simulation if speech recognition is not supported
      setIsRecording(true);
      setStatusMessage(`${name} is listening...`);
      setTimeout(() => {
        const sample = 'Schedule site inspection with Arun Mehta at 2 PM';
        setTranscript(sample);
        transcriptRef.current = sample;
        setIsRecording(false);
        handleCommandExecution(sample);
      }, 1600);
      return;
    }

    try {
      transcriptRef.current = '';
      setTranscript('');

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setStatusMessage(`${name} is listening to your voice...`);
      };

      recognition.onresult = (event: any) => {
        let full = '';
        for (let i = 0; i < event.results.length; i++) {
          full += event.results[i][0].transcript;
        }
        const current = full.trim();
        transcriptRef.current = current;
        setTranscript(current);
      };

      recognition.onerror = (e: any) => {
        console.warn('SpeechRecognition error:', e);
        setIsRecording(false);
        if (e.error === 'not-allowed') {
          setStatusMessage('Microphone access blocked. Allow mic or type your command below.');
        } else if (e.error === 'no-speech') {
          setStatusMessage('No speech detected. Tap mic to try again or type below.');
        } else {
          setStatusMessage(`Speech error (${e.error}). Tap mic or type command below.`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        const captured = transcriptRef.current.trim();
        if (captured) {
          handleCommandExecution(captured);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('SpeechRecognition start failed:', err);
      setIsRecording(false);
      setStatusMessage('Tap mic to retry or type command below');
    }
  };

  const handleSendTypedCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    const text = typedInput.trim();
    setTypedInput('');
    setTranscript(text);
    handleCommandExecution(text);
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-[#0c0f0d] text-[#ededec] flex flex-col justify-between p-5 select-none rounded-[32px] relative overflow-hidden shadow-2xl border border-white/[0.08]">
      {/* Top Bar with Name Customizer (Minimalist Editorial) */}
      <div className="flex justify-between items-center text-xs text-[#a1d1bd] z-10 pb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="font-semibold font-['Space_Grotesk'] text-[#ededec]">
            {name} AI Assistant
          </span>
          <button
            onClick={() => setIsEditingName(!isEditingName)}
            className="px-2 py-0.5 rounded-full minimal-btn-secondary text-[#e9c349] text-[9px] font-mono flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            title="Change voice assistant name"
          >
            <span className="material-symbols-outlined text-[12px]">edit</span>
            Rename
          </button>
        </div>
        <button
          onClick={() => onNavigate?.(6)}
          className="text-[#e9c349] hover:underline flex items-center gap-1 font-semibold text-xs cursor-pointer font-mono"
        >
          Daily Schedule ›
        </button>
      </div>

      {/* Name Customization Drawer / Modal */}
      {isEditingName && (
        <div className="p-3 minimal-card rounded-2xl shadow-2xl z-20 space-y-2.5 my-2 border border-white/[0.12]">
          <div className="flex justify-between items-center">
            <span className="text-[9px] uppercase font-mono font-bold text-[#e9c349] tracking-wider">
              Change Assistant Name
            </span>
            <button
              onClick={() => setIsEditingName(false)}
              className="text-[#8a938e] hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customNameInput}
              onChange={(e) => setCustomNameInput(e.target.value)}
              placeholder="e.g. Jarvis, Friday, Aria..."
              className="flex-1 bg-[#161a17] border border-white/[0.12] rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#e9c349]"
            />
            <button
              onClick={() => handleSaveAssistantName(customNameInput)}
              className="px-3 py-1.5 rounded-xl minimal-btn-primary text-xs cursor-pointer active:scale-95 transition-all"
            >
              Save
            </button>
          </div>
          {/* Quick Preset Names */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] text-[#8a938e] font-mono">Presets:</span>
            {['Nova', 'Jarvis', 'Aria', 'Friday', 'Atlas', 'Gemini'].map((preset) => (
              <button
                key={preset}
                onClick={() => handleSaveAssistantName(preset)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer font-mono ${
                  name === preset
                    ? 'bg-[#e9c349] text-gray-950 font-bold border-[#e9c349]'
                    : 'bg-[#161a17] text-[#c0c8c3] border-white/[0.08] hover:border-[#a1d1bd]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Central Visualizer (20% Liquid Glass Hero Orb) */}
      <div className="my-auto flex flex-col items-center text-center z-10 space-y-3">
        <span className="text-[9px] uppercase font-mono tracking-widest text-[#e9c349] font-medium bg-[#161a17] px-3 py-1 rounded-full border border-white/[0.08]">
          VOICE INTELLIGENCE
        </span>

        <h3 className="text-base font-semibold text-[#ededec] font-['Space_Grotesk'] max-w-[280px]">
          {statusMessage}
        </h3>

        {transcript && (
          <div className="minimal-card p-3 rounded-xl max-w-[280px] text-xs text-[#a1d1bd] italic border border-white/[0.10]">
            &ldquo;{transcript}&rdquo;
          </div>
        )}

        {/* Created Task Confirmation Card */}
        {createdTask && (
          <div className="minimal-card p-3.5 rounded-2xl max-w-[310px] w-full border border-white/20 text-left shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-[9px] font-mono text-[#e9c349] font-semibold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                TASK ADDED
              </span>
              <span className="bg-[#1b201d] px-1.5 py-0.5 rounded text-[#e9c349] uppercase border border-white/[0.06]">
                {createdTask.startTime}
              </span>
            </div>
            <h4 className="font-semibold text-sm text-[#ededec] mt-1.5">
              {createdTask.title}
            </h4>
            <p className="text-[11px] text-[#9b9f9c] mt-0.5">
              {createdTask.subtitle}
            </p>
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => onNavigate?.(6)}
                className="flex-1 py-1.5 px-3 rounded-lg minimal-btn-primary text-xs font-semibold text-center flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <span>View Schedule</span>
                <span>›</span>
              </button>
              {onDeleteTask && (
                <button
                  type="button"
                  onClick={() => {
                    if (createdTask) {
                      onDeleteTask(createdTask.id);
                      setCreatedTask(null);
                      setStatusMessage('Task removed from schedule.');
                      speakFeedback('Task deleted.');
                    }
                  }}
                  className="py-1.5 px-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium cursor-pointer active:scale-95 transition-all flex items-center gap-1"
                  title="Delete this task"
                >
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                  <span>Delete</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setCreatedTask(null);
                  setStatusMessage(`Tap microphone to speak to ${name}`);
                }}
                className="py-1.5 px-2.5 rounded-lg minimal-btn-secondary text-xs font-medium cursor-pointer active:scale-95 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Audio Wave Visuals & Liquid Glass Mic Button */}
        <div className="relative w-40 h-40 flex items-center justify-center my-2">
          <div
            className={`absolute inset-0 rounded-full bg-[#4edea3]/10 blur-2xl ${
              isRecording ? 'animate-ping' : 'animate-pulse'
            }`}
          />

          {/* Sound Wave Bars */}
          <div className="flex items-center gap-1.5 h-16">
            {[35, 65, 95, 55, 85, 45, 75, 50, 30].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-[#4edea3] to-[#e9c349] transition-all"
                style={{
                  height: isRecording ? `${h}%` : '20%',
                  transitionDuration: '300ms',
                }}
              />
            ))}
          </div>

          {/* Center Mic Button (Liquid Glass Hero Orb) */}
          <button
            onClick={toggleRecording}
            className={`absolute w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all cursor-pointer ${
              isRecording
                ? 'bg-rose-500 text-white scale-110 shadow-[0_0_30px_rgba(244,63,94,0.6)] animate-pulse'
                : 'liquid-glass-pill border-2 border-white/40 text-[#e9c349] hover:scale-105 active:scale-95 shadow-[0_0_36px_rgba(78,222,163,0.25)]'
            }`}
          >
            <span className="material-symbols-outlined text-[30px]">
              {isRecording ? 'mic' : 'mic_none'}
            </span>
          </button>
        </div>

        <p className="text-[10px] text-[#8a938e] font-mono">
          {isRecording ? `Tap mic to finish speaking to ${name}` : `Tap mic to speak or select a command below`}
        </p>

        {/* Quick Voice Shortcuts (Minimalist Bento Card) */}
        <div className="minimal-card rounded-xl p-3 max-w-[300px] text-left space-y-1.5 border border-white/[0.08]">
          <p className="text-[9px] font-mono text-[#e9c349] uppercase font-bold tracking-wider">
            Quick commands:
          </p>
          <button
            onClick={() => processVoiceCommand('Schedule site inspection with Arun at 10 AM')}
            className="text-[11px] text-[#c0c8c3] hover:text-[#e9c349] block text-left transition-colors cursor-pointer"
          >
            • &ldquo;Schedule site inspection with Arun at 10 AM&rdquo;
          </button>
          <button
            onClick={() => processVoiceCommand('Add call with Priya Desai regarding revision drawings')}
            className="text-[11px] text-[#c0c8c3] hover:text-[#e9c349] block text-left transition-colors cursor-pointer"
          >
            • &ldquo;Add call with Priya Desai regarding revision drawings&rdquo;
          </button>
          <button
            onClick={() => processVoiceCommand('Review foundation load calculations tomorrow at 3 PM')}
            className="text-[11px] text-[#c0c8c3] hover:text-[#e9c349] block text-left transition-colors cursor-pointer"
          >
            • &ldquo;Review foundation load calculations tomorrow at 3 PM&rdquo;
          </button>
        </div>
      </div>

      {/* Typed Command Fallback Input (Liquid Glass Dock) */}
      <form onSubmit={handleSendTypedCommand} className="pt-2 z-10 space-y-1">
        <div className="flex items-center gap-2 p-1.5 liquid-glass-pill rounded-xl border border-white/20">
          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder={`Or type a command for ${name}...`}
            className="flex-1 bg-transparent px-2 py-1 text-xs text-[#ededec] outline-none placeholder-[#8a938e]"
          />
          <button
            type="submit"
            disabled={!typedInput.trim()}
            className="p-1.5 rounded-lg minimal-btn-primary text-xs disabled:opacity-30 cursor-pointer flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
        <p className="text-[9px] font-mono text-[#8a938e] text-center">
          Spoken voice intelligence powered by {name} & Vertex AI
        </p>
      </form>
    </div>
  );
}

// 12. Smart AI Task Suggestions
export function Screen14AISuggestions({ suggestions, onNavigate, onAddTask }: ContactsAndAIProps) {
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const handleAdd = (s: AISuggestion) => {
    setAddedIds((prev) => [...prev, s.id]);
    onAddTask?.({
      id: `t_ai_${Date.now()}`,
      title: s.title,
      subtitle: s.subtitle,
      category: 'task',
      date: 'Today',
      startTime: '11:00 AM',
      endTime: '11:30 AM',
      durationMinutes: 30,
      priority: 'medium',
      status: 'upcoming',
      color: 'green',
      notes: `Suggested by NIMORA AI (${s.tag})`,
    });
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-[#121412] text-[#e3e2e0] flex flex-col justify-between select-none rounded-[38px] overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-[#121412]/90 border-b border-[#414945]/30 flex items-center justify-between">
        <button onClick={() => onNavigate?.(5)} className="text-[#c0c8c3] hover:text-white text-xs font-semibold flex items-center gap-1">
          ‹ Back
        </button>
        <div className="flex items-center gap-1.5 text-[#e9c349]">
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          <span className="text-sm font-bold text-[#e3e2e0] font-['Space_Grotesk']">AI Suggestions</span>
        </div>
        <span className="text-xs text-[#8a938e]">• Live</span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <p className="text-xs text-[#c0c8c3] leading-relaxed">
          Proactive milestones identified from your interactions and project timeline:
        </p>

        <div className="space-y-2.5">
          {suggestions.map((suggestion) => {
            const isAdded = addedIds.includes(suggestion.id);
            return (
              <div
                key={suggestion.id}
                className="glass-card specular-border rounded-2xl p-3.5 shadow-sm flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#e3e2e0] font-['Space_Grotesk']">{suggestion.title}</h4>
                  <p className="text-[11px] text-[#c0c8c3] mt-0.5">{suggestion.subtitle}</p>
                </div>

                <button
                  onClick={() => handleAdd(suggestion)}
                  disabled={isAdded}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isAdded
                      ? 'bg-[#10B981]/20 text-[#4edea3] border border-[#4edea3]/40'
                      : 'bg-gradient-to-r from-[#0e3e30] to-[#0A2E24] border border-[#e9c349]/50 text-[#e9c349] hover:brightness-110 shadow-sm active:scale-95'
                  }`}
                >
                  {isAdded ? 'Added ✓' : suggestion.actionText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

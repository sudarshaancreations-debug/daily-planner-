'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Contact, AISuggestion, NimoraTask } from '../data';

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
}

// 9. Contacts & Follow-ups
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
    <div className="w-full h-full min-h-[680px] bg-[#121412] text-[#e3e2e0] flex flex-col justify-between select-none rounded-[38px] overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-[#121412]/90 border-b border-[#414945]/30">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e9c349] text-[20px]">group</span>
            <h2 className="text-base font-bold text-[#e3e2e0] font-['Space_Grotesk']">CRM & Contacts</h2>
          </div>
          <span className="text-xs text-[#a1d1bd] font-semibold">{filtered.length} Contacts</span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients, architects, vendors..."
            className="w-full bg-[#1f201e] border border-[#414945]/40 rounded-xl pl-9 pr-3 py-2 text-xs text-[#e3e2e0] outline-none focus:border-[#e9c349] placeholder-[#8a938e]"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-[#8a938e]">search</span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['all', 'client', 'lead', 'team'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold capitalize whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-[#0e3e30] text-[#e9c349] border border-[#e9c349]/40 shadow-sm'
                  : 'bg-[#1f201e] text-[#c0c8c3] border border-[#414945]/20 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Contacts' : `${cat}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Contact Cards List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {filtered.map((contact) => (
          <div
            key={contact.id}
            onClick={() => {
              onSelectContact?.(contact);
              onNavigate?.(10);
            }}
            className="glass-card specular-border p-3.5 rounded-2xl flex items-center justify-between hover:border-[#e9c349]/50 transition-all shadow-sm cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${contact.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow-md ring-2 ring-white/10 font-['Space_Grotesk']`}>
                {contact.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#e3e2e0] font-['Space_Grotesk']">{contact.name}</h4>
                <p className="text-[10px] text-[#c0c8c3]">{contact.company} · {contact.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {contact.followUpCount > 0 ? (
                    <span className="text-[9px] font-bold text-[#e9c349] bg-[#0e3e30] border border-[#e9c349]/30 px-1.5 py-0.5 rounded">
                      {contact.followUpCount} {contact.followUpCount === 1 ? 'follow-up' : 'follow-ups'}
                    </span>
                  ) : (
                    <span className="text-[9px] text-[#8a938e]">Up to date</span>
                  )}
                  <span className="text-[9px] text-[#8a938e]">• Last: {contact.lastCall}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                onClick={(e) => e.stopPropagation()}
                href={`tel:${contact.phone}`}
                className="w-7 h-7 rounded-lg bg-[#1f201e] flex items-center justify-center text-[#a1d1bd] border border-[#414945]/30 hover:border-[#a1d1bd]/50"
                title="Call"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
              </a>
              <span className="text-[#8a938e] text-sm">›</span>
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
    <div className="w-full h-full min-h-[680px] bg-[#121412] text-[#e3e2e0] flex flex-col justify-between select-none rounded-[38px] overflow-hidden">
      {/* Header Profile Card */}
      <div className="p-4 bg-[#121412]/90 border-b border-[#414945]/30">
        <div className="flex justify-between items-center mb-3">
          <button onClick={() => onNavigate?.(9)} className="text-[#c0c8c3] hover:text-white text-xs font-semibold flex items-center gap-1">
            ‹ Contacts
          </button>
          <span className="text-[10px] uppercase font-bold text-[#e9c349] bg-[#0e3e30] px-2 py-0.5 rounded-full border border-[#e9c349]/30">
            {contact.category}
          </span>
        </div>

        <div className="flex items-center gap-3.5 mb-4">
          <div className={`w-12 h-12 rounded-full ${contact.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-md ring-2 ring-white/10 font-['Space_Grotesk']`}>
            {contact.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-base font-bold text-[#e3e2e0] font-['Space_Grotesk']">{contact.name}</h3>
            <p className="text-xs text-[#c0c8c3]">{contact.title} · {contact.company}</p>
          </div>
        </div>

        {/* Quick contact actions */}
        <div className="flex gap-2">
          <a
            href={`tel:${contact.phone}`}
            className="flex-1 py-2 bg-[#1f201e] border border-[#414945]/40 rounded-xl text-xs font-semibold text-[#a1d1bd] flex items-center justify-center gap-1.5 hover:bg-[#292a29] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">call</span> Call
          </a>
          <a
            href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2 bg-[#0e3e30] border border-[#4edea3]/40 rounded-xl text-xs font-semibold text-[#4edea3] flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span> WhatsApp
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="flex-1 py-2 bg-[#1f201e] border border-[#414945]/40 rounded-xl text-xs font-semibold text-[#e9c349] flex items-center justify-center gap-1.5 hover:bg-[#292a29] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">mail</span> Email
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
      endTime: '11:45 AM',
      durationMinutes: 45,
      priority: lower.includes('urgent') || lower.includes('high') || lower.includes('asap') ? 'high' : 'medium',
      status: 'upcoming',
      color,
      relatedContactId: matchedContact?.id,
      notes: `Voice input: "${cleanText}"`,
    };

    onAddTask?.(newTask);
    setCreatedTask(newTask);
    setStatusMessage(`✓ Added to Schedule: ${newTask.title}`);
    speakFeedback(`Added ${newTask.title} to your schedule for ${startTime}.`);
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
      processVoiceCommand(spoken);
    }
  };

  const toggleRecording = () => {
    if (typeof window === 'undefined') return;

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
        processVoiceCommand(sample);
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
          processVoiceCommand(captured);
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
    processVoiceCommand(text);
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-gradient-to-b from-[#022C22] via-[#07241A] to-[#121412] text-white flex flex-col justify-between p-5 select-none rounded-[38px] relative overflow-hidden shadow-2xl">
      {/* Top Bar with Name Customizer */}
      <div className="flex justify-between items-center text-xs text-[#a1d1bd] z-10 pb-2 border-b border-[#414945]/30">
        <div className="flex items-center gap-2">
          <span className="font-semibold font-['Space_Grotesk'] text-[#e3e2e0]">
            {name} AI Voice
          </span>
          <button
            onClick={() => setIsEditingName(!isEditingName)}
            className="px-2 py-0.5 rounded-full bg-[#1f201e] border border-[#e9c349]/40 text-[#e9c349] text-[10px] font-bold flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            title="Change voice assistant name"
          >
            <span className="material-symbols-outlined text-[12px]">edit</span>
            Rename
          </button>
        </div>
        <button
          onClick={() => onNavigate?.(6)}
          className="text-[#e9c349] hover:underline flex items-center gap-1 font-semibold text-xs cursor-pointer"
        >
          Daily Schedule ›
        </button>
      </div>

      {/* Name Customization Drawer / Modal */}
      {isEditingName && (
        <div className="p-3 bg-[#121412]/95 border border-[#e9c349]/50 rounded-2xl shadow-2xl z-20 space-y-2.5 my-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-[#e9c349] tracking-wider">
              Change Assistant Name
            </span>
            <button
              onClick={() => setIsEditingName(false)}
              className="text-[#8a938e] hover:text-white text-xs"
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
              className="flex-1 bg-[#1f201e] border border-[#414945]/50 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#e9c349]"
            />
            <button
              onClick={() => handleSaveAssistantName(customNameInput)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0e3e30] to-[#0A2E24] border border-[#e9c349]/60 text-[#e9c349] font-bold text-xs cursor-pointer active:scale-95 transition-all"
            >
              Save
            </button>
          </div>
          {/* Quick Preset Names */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] text-[#8a938e]">Presets:</span>
            {['Nova', 'Jarvis', 'Aria', 'Friday', 'Atlas', 'Gemini'].map((preset) => (
              <button
                key={preset}
                onClick={() => handleSaveAssistantName(preset)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                  name === preset
                    ? 'bg-[#e9c349] text-gray-950 font-bold border-[#e9c349]'
                    : 'bg-[#1f201e] text-[#c0c8c3] border-[#414945]/30 hover:border-[#a1d1bd]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Central Visualizer */}
      <div className="my-auto flex flex-col items-center text-center z-10 space-y-3">
        <span className="text-[10px] uppercase tracking-widest text-[#e9c349] font-bold bg-[#0e3e30] px-3 py-1 rounded-full border border-[#e9c349]/30">
          NIMORA VOICE INTELLIGENCE
        </span>

        <h3 className="text-base font-bold text-[#e3e2e0] font-['Space_Grotesk'] max-w-[280px]">
          {statusMessage}
        </h3>

        {transcript && (
          <div className="glass-card specular-border p-3 rounded-2xl max-w-[280px] text-xs text-[#a1d1bd] italic shadow-sm">
            &ldquo;{transcript}&rdquo;
          </div>
        )}

        {/* Created Task Confirmation Card */}
        {createdTask && (
          <div className="glass-card specular-border p-3.5 rounded-2xl max-w-[300px] w-full border-2 border-[#e9c349]/70 bg-[#0e3e30]/90 text-left shadow-2xl">
            <div className="flex items-center justify-between text-[10px] text-[#e9c349] font-bold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                TASK ADDED TO SCHEDULE
              </span>
              <span className="bg-[#e9c349]/20 px-1.5 py-0.5 rounded text-[#e9c349] uppercase">
                {createdTask.startTime}
              </span>
            </div>
            <h4 className="font-bold text-sm text-[#e3e2e0] mt-1.5">
              {createdTask.title}
            </h4>
            <p className="text-[11px] text-[#a1d1bd] mt-0.5">
              {createdTask.subtitle}
            </p>
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#414945]/40">
              <button
                type="button"
                onClick={() => onNavigate?.(6)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#e9c349] to-[#af8d11] text-gray-950 text-xs font-bold text-center flex items-center justify-center gap-1 shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>View in Schedule</span>
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
                  className="py-1.5 px-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-400 hover:bg-rose-900/40 text-xs font-semibold cursor-pointer active:scale-95 transition-all flex items-center gap-1"
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
                className="py-1.5 px-2.5 rounded-xl bg-[#1f201e] border border-[#414945]/40 text-[#c0c8c3] hover:text-white text-xs font-semibold cursor-pointer active:scale-95 transition-all"
              >
                + Next
              </button>
            </div>
          </div>
        )}

        {/* Audio Wave Visuals & Mic Button */}
        <div className="relative w-40 h-40 flex items-center justify-center my-2">
          <div
            className={`absolute inset-0 rounded-full bg-[#10B981]/15 blur-2xl ${
              isRecording ? 'animate-ping' : 'animate-pulse'
            }`}
          />
          <div
            className="absolute inset-4 rounded-full border border-[#e9c349]/30 opacity-40 animate-spin"
            style={{ animationDuration: '8s' }}
          />

          {/* Sound Wave Bars */}
          <div className="flex items-center gap-1.5 h-16">
            {[35, 65, 95, 55, 85, 45, 75, 50, 30].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-[#10B981] to-[#e9c349] transition-all"
                style={{
                  height: isRecording ? `${h}%` : '20%',
                  transitionDuration: '300ms',
                }}
              />
            ))}
          </div>

          {/* Center Mic Button */}
          <button
            onClick={toggleRecording}
            className={`absolute w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-2xl transition-all cursor-pointer ${
              isRecording
                ? 'bg-rose-500 text-white scale-110 shadow-rose-900/80 animate-pulse'
                : 'bg-gradient-to-tr from-[#0e3e30] to-[#0A2E24] border-2 border-[#e9c349] text-[#e9c349] hover:scale-105 active:scale-95 shadow-[#022C22]'
            }`}
          >
            <span className="material-symbols-outlined text-[32px]">
              {isRecording ? 'mic' : 'mic_none'}
            </span>
          </button>
        </div>

        <p className="text-[10px] text-[#c0c8c3]">
          {isRecording ? `Tap mic to finish speaking to ${name}` : `Tap mic to speak or use shortcuts`}
        </p>

        {/* Quick Voice Shortcuts */}
        <div className="glass-card specular-border rounded-2xl p-3 max-w-[300px] text-left backdrop-blur space-y-1.5 border border-[#414945]/30">
          <p className="text-[10px] text-[#e9c349] uppercase font-bold tracking-wider font-['Space_Grotesk']">
            Quick commands for {name}:
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

      {/* Typed Command Fallback Input */}
      <form onSubmit={handleSendTypedCommand} className="pt-2 z-10 space-y-1">
        <div className="flex items-center gap-2 p-1.5 bg-[#1f201e]/80 border border-[#414945]/40 rounded-xl">
          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder={`Or type a command for ${name}...`}
            className="flex-1 bg-transparent px-2 py-1 text-xs text-[#e3e2e0] outline-none placeholder-[#8a938e]"
          />
          <button
            type="submit"
            disabled={!typedInput.trim()}
            className="p-1.5 rounded-lg bg-[#0e3e30] text-[#e9c349] hover:brightness-110 disabled:opacity-40 cursor-pointer flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
        <p className="text-[10px] text-[#8a938e] text-center">
          Voice Speech-to-Text & spoken voice feedback powered by {name}
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

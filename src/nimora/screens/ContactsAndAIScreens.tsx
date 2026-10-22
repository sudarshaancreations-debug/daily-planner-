'use client';

import React, { useState } from 'react';
import { Contact, AISuggestion, NimoraTask } from '../data';

export interface ContactsAndAIProps {
  contacts: Contact[];
  suggestions: AISuggestion[];
  onNavigate?: (screenNumber: number) => void;
  onSelectContact?: (contact: Contact) => void;
  selectedContact?: Contact;
  onAddTask?: (task: NimoraTask) => void;
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

// 11. Voice Assistant with live browser Speech Recognition + Text-to-Speech
export function Screen13VoiceAssistant({ onNavigate, onAddTask }: ContactsAndAIProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Tap microphone to start speaking');

  const speakFeedback = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const processVoiceCommand = (text: string) => {
    const lower = text.toLowerCase();
    setStatusMessage(`Processing: "${text}"`);

    // Natural Language intent parsing
    if (lower.includes('add') || lower.includes('schedule') || lower.includes('create') || lower.includes('task') || lower.includes('call')) {
      const cleanTitle = text.replace(/^(add|create|schedule)\s+(a\s+)?(task\s+)?(to\s+)?/i, '').trim() || text;
      const newTask: NimoraTask = {
        id: `t_voice_${Date.now()}`,
        title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
        subtitle: 'Created via Nova Voice Assistant',
        category: lower.includes('call') ? 'call' : 'task',
        date: new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
        startTime: '11:00 AM',
        endTime: '11:30 AM',
        durationMinutes: 30,
        priority: lower.includes('urgent') || lower.includes('high') ? 'high' : 'medium',
        status: 'upcoming',
        color: lower.includes('call') ? 'blue' : 'green',
        notes: `Voice transcript: "${text}"`,
      };

      onAddTask?.(newTask);
      setStatusMessage('✓ Task Added to Agenda!');
      speakFeedback(`Added ${newTask.title} to your schedule.`);
      setTimeout(() => onNavigate?.(6), 1200);
    } else {
      setStatusMessage('✓ Command processed.');
      speakFeedback(`Received: ${text}`);
    }
  };

  const toggleRecording = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback simulation if browser blocks speech recognition
      setIsRecording(true);
      setStatusMessage('Listening (Microphone active)...');
      setTimeout(() => {
        const sample = 'Schedule site visit with Arun Mehta at 2 PM';
        setTranscript(sample);
        setIsRecording(false);
        processVoiceCommand(sample);
      }, 1800);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setStatusMessage('Listening to your voice...');
      };

      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setTranscript(text);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setStatusMessage('Microphone access closed. Tap to retry.');
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (transcript) {
          processVoiceCommand(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-gradient-to-b from-[#022C22] via-[#07241A] to-[#121412] text-white flex flex-col justify-between p-6 select-none rounded-[38px] relative overflow-hidden">
      {/* Top bar */}
      <div className="flex justify-between items-center text-xs text-[#a1d1bd] z-10">
        <span className="font-semibold font-['Space_Grotesk']">Nova AI Voice</span>
        <button onClick={() => onNavigate?.(5)} className="text-white hover:text-[#e9c349] font-bold text-sm">
          ✕
        </button>
      </div>

      {/* Central Visualizer */}
      <div className="my-auto flex flex-col items-center text-center z-10 space-y-4">
        <span className="text-[10px] uppercase tracking-widest text-[#e9c349] font-bold bg-[#0e3e30] px-3 py-1 rounded-full border border-[#e9c349]/30">
          NIMORA VOICE INTELLIGENCE
        </span>

        <h3 className="text-lg font-bold text-[#e3e2e0] font-['Space_Grotesk'] max-w-[280px]">
          {statusMessage}
        </h3>

        {transcript && (
          <div className="glass-card specular-border p-3 rounded-2xl max-w-[280px] text-xs text-[#a1d1bd] italic">
            &ldquo;{transcript}&rdquo;
          </div>
        )}

        {/* Audio Wave Visuals */}
        <div className="relative w-44 h-44 flex items-center justify-center my-4">
          <div className={`absolute inset-0 rounded-full bg-[#10B981]/15 blur-2xl ${isRecording ? 'animate-ping' : 'animate-pulse'}`} />
          <div className="absolute inset-4 rounded-full border border-[#e9c349]/30 opacity-40 animate-spin" style={{ animationDuration: '8s' }} />

          {/* Sound wave bars */}
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
            <span className="material-symbols-outlined text-[32px]">mic</span>
          </button>
        </div>

        {/* Shortcuts */}
        <div className="glass-card specular-border rounded-2xl p-3.5 max-w-[290px] text-left backdrop-blur space-y-2 border border-[#414945]/30">
          <p className="text-[10px] text-[#e9c349] uppercase font-bold tracking-wider font-['Space_Grotesk']">
            Tap a shortcut or speak:
          </p>
          <button
            onClick={() => processVoiceCommand('Schedule site inspection with Arun at 10 AM')}
            className="text-xs text-[#c0c8c3] hover:text-[#e9c349] block text-left transition-colors"
          >
            • &ldquo;Schedule site inspection with Arun at 10 AM&rdquo;
          </button>
          <button
            onClick={() => processVoiceCommand('Add call with Priya Desai regarding revision drawings')}
            className="text-xs text-[#c0c8c3] hover:text-[#e9c349] block text-left transition-colors"
          >
            • &ldquo;Add call with Priya Desai regarding revision drawings&rdquo;
          </button>
          <button
            onClick={() => processVoiceCommand('Review foundation load calculations tomorrow')}
            className="text-xs text-[#c0c8c3] hover:text-[#e9c349] block text-left transition-colors"
          >
            • &ldquo;Review foundation load calculations tomorrow&rdquo;
          </button>
        </div>
      </div>

      <div className="text-center pb-2 z-10">
        <p className="text-[11px] text-[#8a938e]">Speech-to-Text with device-native speech synthesis</p>
      </div>
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

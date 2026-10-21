'use client';

import React, { useState } from 'react';
import { Contact, AISuggestion, NimoraTask } from '../data';

interface ContactsAndAIProps {
  contacts: Contact[];
  suggestions: AISuggestion[];
  onNavigate?: (screenNumber: number) => void;
  onSelectContact?: (contact: Contact) => void;
  selectedContact?: Contact;
  onAddTask?: (task: NimoraTask) => void;
}

// 11. Contacts & Follow-ups
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
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between select-none rounded-[38px] overflow-hidden">
      {/* Top Header */}
      <div className="p-5 pb-3 bg-white border-b border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold text-gray-900">Contacts</h2>
          <button className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center text-sm font-bold shadow-sm">
            +
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 outline-none focus:border-emerald-600"
          />
          <span className="absolute left-2.5 top-2 text-xs text-gray-400">🔍</span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['all', 'client', 'lead', 'team'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold capitalize whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-emerald-800 text-white'
                  : 'bg-gray-100 text-gray-500 hover:text-gray-900'
              }`}
            >
              {cat === 'all' ? 'All' : `${cat}s`}
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
              onNavigate?.(12);
            }}
            className="p-3.5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:border-emerald-300 transition-all shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${contact.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow-sm`}>
                {contact.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{contact.name}</h4>
                <p className="text-[10px] text-gray-400">{contact.company}</p>
                <div className="flex items-center gap-2 mt-1">
                  {contact.followUpCount > 0 ? (
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      {contact.followUpCount} {contact.followUpCount === 1 ? 'follow-up' : 'follow-ups'}
                    </span>
                  ) : (
                    <span className="text-[9px] text-gray-400">No follow-ups</span>
                  )}
                  <span className="text-[9px] text-gray-400">• {contact.lastCall}</span>
                </div>
              </div>
            </div>

            <span className="text-gray-300 text-sm">›</span>
          </div>
        ))}
      </div>

      {/* Bottom Nav Bar */}
      <div className="bg-white border-t border-gray-100 px-5 py-2.5 flex justify-between items-center text-[10px] font-semibold text-gray-400">
        <button onClick={() => onNavigate?.(7)} className="flex flex-col items-center hover:text-gray-900">
          <span className="text-base">🏠</span>
          <span>Home</span>
        </button>
        <button onClick={() => onNavigate?.(8)} className="flex flex-col items-center hover:text-gray-900">
          <span className="text-base">📋</span>
          <span>Tasks</span>
        </button>
        <button className="flex flex-col items-center text-emerald-800">
          <span className="text-base">👥</span>
          <span>Contacts</span>
        </button>
        <button onClick={() => onNavigate?.(14)} className="flex flex-col items-center hover:text-gray-900">
          <span className="text-base">✨</span>
          <span>AI</span>
        </button>
        <button onClick={() => onNavigate?.(18)} className="flex flex-col items-center hover:text-gray-900">
          <span className="text-base">⋯</span>
          <span>More</span>
        </button>
      </div>
    </div>
  );
}

// 12. Contact Details & History
export function Screen12ContactDetails({ contacts, onNavigate, selectedContact }: ContactsAndAIProps) {
  const contact = selectedContact || contacts[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'followups' | 'notes'>('history');

  return (
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between select-none rounded-[38px] overflow-hidden">
      {/* Header Profile Card */}
      <div className="p-5 bg-white border-b border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <button onClick={() => onNavigate?.(11)} className="text-gray-600 hover:text-gray-900 text-xs font-semibold">
            ‹ Contacts
          </button>
          <span className="text-gray-400 text-xs">⋯</span>
        </div>

        <div className="flex items-center gap-3.5 mb-4">
          <div className={`w-12 h-12 rounded-full ${contact.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
            {contact.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">{contact.name}</h3>
            <p className="text-[11px] text-gray-400">{contact.company}</p>
          </div>
        </div>

        {/* Quick contact actions */}
        <div className="flex gap-2">
          <button className="flex-1 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 flex items-center justify-center gap-1.5 hover:bg-gray-100">
            <span>📞</span> Call
          </button>
          <button
            onClick={() => onNavigate?.(17)}
            className="flex-1 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-800 flex items-center justify-center gap-1.5 hover:bg-emerald-100"
          >
            <span>💬</span> WhatsApp
          </button>
          <button className="flex-1 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 flex items-center justify-center gap-1.5 hover:bg-gray-100">
            <span>✉️</span> Email
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-4 text-xs font-semibold">
        {(['overview', 'history', 'followups', 'notes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-3 border-b-2 capitalize transition-all ${
              activeTab === tab
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Contact Info Box */}
        <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm space-y-2 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <span>📞</span> <span>{contact.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span>✉️</span> <span>{contact.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span>📍</span> <span>{contact.location}</span>
          </div>
        </div>

        {/* Recent Interactions List */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Recent Interactions
          </h4>
          <div className="space-y-2">
            {contact.interactions.map((interaction, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span>{interaction.type === 'whatsapp' ? '💬' : interaction.type === 'call' ? '📞' : '📌'}</span>
                    <span>{interaction.title}</span>
                  </span>
                  <span className="text-[10px] text-gray-400">{interaction.date}</span>
                </div>
                <p className="text-[11px] text-gray-500">{interaction.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <button
          onClick={() => onNavigate?.(9)}
          className="w-full py-3 rounded-2xl bg-[#0F382C] text-white font-semibold text-xs shadow-md hover:bg-[#13493A] transition-all"
        >
          + Add Follow-up
        </button>
      </div>
    </div>
  );
}

// 13. Voice Assistant
export function Screen13VoiceAssistant({ onNavigate, onAddTask }: ContactsAndAIProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [statusText, setStatusText] = useState('Listening...');

  const handleSimulate = () => {
    setIsSimulating(true);
    setStatusText('“Add a task to call Arun tomorrow at 10 AM”');
    setTimeout(() => {
      onAddTask?.({
        id: `t_voice_${Date.now()}`,
        title: 'Call Arun Mehta',
        subtitle: 'ABC Constructions',
        category: 'call',
        date: 'Wed, 21 Oct 2026',
        startTime: '10:00 AM',
        endTime: '10:30 AM',
        durationMinutes: 30,
        priority: 'high',
        status: 'upcoming',
        color: 'blue',
        relatedContactId: 'c1',
        notes: 'Created via NIMORA Voice Assistant',
      });
      setStatusText('Task Created Successfully! ✓');
      setTimeout(() => {
        setIsSimulating(false);
        onNavigate?.(8);
      }, 900);
    }, 1200);
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-gradient-to-b from-[#041610] via-[#09251D] to-[#03120C] text-white flex flex-col justify-between p-7 select-none rounded-[38px] relative overflow-hidden">
      {/* Top bar */}
      <div className="flex justify-between items-center text-xs text-emerald-200/60 pt-2 z-10">
        <span>9:41</span>
        <button onClick={() => onNavigate?.(7)} className="text-white hover:text-emerald-300 font-bold text-sm">
          ✕
        </button>
      </div>

      {/* Central Visualizer */}
      <div className="my-auto flex flex-col items-center text-center z-10">
        <h3 className="text-xl font-bold mb-8 text-emerald-100">{statusText}</h3>

        {/* Audio Wave Visuals */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          {/* Animated glow rings */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />
          <div className="absolute inset-4 rounded-full border border-emerald-400/30 animate-ping opacity-30" />

          {/* Sound wave bars */}
          <div className="flex items-center gap-1.5 h-16">
            {[40, 70, 100, 60, 90, 45, 80, 55, 30].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-emerald-400 to-teal-200 animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>

          {/* Center Mic Button */}
          <button
            onClick={handleSimulate}
            className={`absolute w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-2xl transition-all ${
              isSimulating
                ? 'bg-rose-500 text-white scale-110 shadow-rose-900/50'
                : 'bg-gradient-to-tr from-[#10B981] to-[#34D399] text-gray-950 hover:scale-105 active:scale-95 shadow-emerald-950/80'
            }`}
          >
            🎙️
          </button>
        </div>

        <div className="bg-emerald-950/60 border border-emerald-800/40 rounded-2xl p-4 max-w-[260px] text-center backdrop-blur">
          <p className="text-[11px] text-emerald-300/80 uppercase font-semibold tracking-wider mb-1">
            Try saying:
          </p>
          <p className="text-xs text-white font-medium italic">
            “Add a task to call Arun tomorrow at 10 AM”
          </p>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="text-center pb-2 z-10">
        <p className="text-[11px] text-emerald-400/60">Tap microphone to speak or test voice action</p>
      </div>
    </div>
  );
}

// 14. AI Suggestions
export function Screen14AISuggestions({ suggestions, onNavigate, onAddTask }: ContactsAndAIProps) {
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const handleAdd = (s: AISuggestion) => {
    setAddedIds((prev) => [...prev, s.id]);
    onAddTask?.({
      id: `t_ai_${Date.now()}`,
      title: s.title,
      subtitle: s.subtitle,
      category: 'task',
      date: 'Tue, 20 Oct 2026',
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
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between select-none rounded-[38px] overflow-hidden">
      {/* Top Header */}
      <div className="p-5 pb-3 bg-white border-b border-gray-100 flex items-center justify-between">
        <button onClick={() => onNavigate?.(7)} className="text-gray-600 hover:text-gray-900 text-xs font-semibold">
          ‹ Back
        </button>
        <div className="flex items-center gap-1.5 text-emerald-800">
          <span className="text-base">✨</span>
          <span className="text-sm font-bold text-gray-900">AI Suggestions</span>
        </div>
        <span className="text-xs text-gray-400">⋯</span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <p className="text-xs text-gray-500 leading-relaxed">
          Based on your calendar, emails and recent activity, here are some suggestions:
        </p>

        <div className="space-y-3">
          {suggestions.map((suggestion) => {
            const isAdded = addedIds.includes(suggestion.id);
            return (
              <div
                key={suggestion.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between"
              >
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1.5">
                    {suggestion.tag}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900">{suggestion.title}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{suggestion.subtitle}</p>
                </div>

                <button
                  onClick={() => handleAdd(suggestion)}
                  disabled={isAdded}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isAdded
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#0F382C] text-white hover:bg-[#13493A] shadow-sm'
                  }`}
                >
                  {isAdded ? 'Added ✓' : suggestion.actionText}
                </button>
              </div>
            );
          })}
        </div>

        <button className="w-full py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50">
          View More Suggestions
        </button>
      </div>

      {/* Bottom Nav Bar */}
      <div className="bg-white border-t border-gray-100 px-5 py-2.5 flex justify-between items-center text-[10px] font-semibold text-gray-400">
        <button onClick={() => onNavigate?.(7)} className="flex flex-col items-center hover:text-gray-900">
          <span className="text-base">🏠</span>
          <span>Home</span>
        </button>
        <button onClick={() => onNavigate?.(8)} className="flex flex-col items-center hover:text-gray-900">
          <span className="text-base">📋</span>
          <span>Tasks</span>
        </button>
        <button onClick={() => onNavigate?.(11)} className="flex flex-col items-center hover:text-gray-900">
          <span className="text-base">👥</span>
          <span>Contacts</span>
        </button>
        <button className="flex flex-col items-center text-emerald-800">
          <span className="text-base">✨</span>
          <span>AI</span>
        </button>
        <button onClick={() => onNavigate?.(18)} className="flex flex-col items-center hover:text-gray-900">
          <span className="text-base">⋯</span>
          <span>More</span>
        </button>
      </div>
    </div>
  );
}

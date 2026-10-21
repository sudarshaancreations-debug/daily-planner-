'use client';

import React, { useState } from 'react';
import { NimoraTask, NimoraNotification } from '../data';

interface WidgetAndSettingsProps {
  tasks: NimoraTask[];
  notifications: NimoraNotification[];
  onNavigate?: (screenNumber: number) => void;
  onAddTask?: (task: NimoraTask) => void;
}

// 15. Home Screen Widget
export function Screen15Widget({ tasks, onNavigate }: WidgetAndSettingsProps) {
  const nextTask = tasks.find((t) => t.status !== 'completed') || tasks[0];
  const upcomingTasks = tasks.filter((t) => t.id !== nextTask?.id).slice(0, 2);

  return (
    <div className="w-full h-full min-h-[680px] bg-cover bg-center text-white flex flex-col justify-between p-6 select-none rounded-[38px] relative overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at top right, #134e4a, #042f2e, #022c22, #000000)`,
      }}
    >
      {/* iOS Status Bar */}
      <div className="flex justify-between items-center text-xs text-white/80 pt-2 z-10 font-semibold">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Main Home Screen Widget Container */}
      <div className="my-auto z-10 space-y-4">
        {/* iOS Glassmorphic Dark Widget */}
        <div
          onClick={() => onNavigate?.(7)}
          className="cursor-pointer bg-[#0A2E24]/85 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-5 shadow-2xl hover:scale-[1.02] transition-all"
        >
          {/* Widget Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 text-xs">🔥</span>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-200">
                NIMORA
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.(13);
                }}
                className="w-7 h-7 rounded-full bg-emerald-600/60 hover:bg-emerald-500 flex items-center justify-center text-xs text-white transition-colors"
                title="Voice"
              >
                🎙️
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.(8);
                }}
                className="w-7 h-7 rounded-full bg-emerald-700/60 hover:bg-emerald-600 flex items-center justify-center text-xs text-white transition-colors"
                title="Play / Focus"
              >
                ▶
              </button>
            </div>
          </div>

          {/* Next Task Focus Box */}
          <div className="mb-4">
            <p className="text-[10px] uppercase font-bold text-emerald-300/80 tracking-wider">
              Next Task
            </p>
            <h3 className="text-sm font-extrabold text-white mt-0.5">{nextTask?.title}</h3>
            <p className="text-[11px] text-emerald-200/90 font-medium">
              {nextTask?.startTime} – {nextTask?.endTime}
            </p>
          </div>

          {/* Upcoming Section */}
          <div className="border-t border-emerald-700/40 pt-2.5 space-y-1.5">
            <p className="text-[9px] uppercase font-bold text-emerald-400/60 tracking-wider">
              Upcoming
            </p>
            {upcomingTasks.map((t) => (
              <div key={t.id} className="flex justify-between items-center text-xs">
                <span className="text-white/90 font-medium truncate max-w-[150px]">{t.title}</span>
                <span className="text-[11px] text-emerald-300 font-semibold">{t.startTime}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* iOS App Dock */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-3 flex justify-around items-center z-10 border border-white/10">
        <button onClick={() => onNavigate?.(7)} className="w-11 h-11 rounded-2xl bg-emerald-800 flex items-center justify-center text-xl shadow-md">
          📅
        </button>
        <button onClick={() => onNavigate?.(17)} className="w-11 h-11 rounded-2xl bg-green-500 flex items-center justify-center text-xl shadow-md">
          💬
        </button>
        <button onClick={() => onNavigate?.(11)} className="w-11 h-11 rounded-2xl bg-blue-500 flex items-center justify-center text-xl shadow-md">
          👥
        </button>
        <button onClick={() => onNavigate?.(14)} className="w-11 h-11 rounded-2xl bg-purple-600 flex items-center justify-center text-xl shadow-md">
          ✨
        </button>
      </div>
    </div>
  );
}

// 16. Notifications Center
export function Screen16Notifications({ notifications, onNavigate }: WidgetAndSettingsProps) {
  return (
    <div className="w-full h-full min-h-[680px] bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white flex flex-col justify-between p-6 select-none rounded-[38px] relative overflow-hidden">
      {/* Top Header */}
      <div>
        <div className="flex justify-between items-center text-xs text-white/60 pt-2 mb-6">
          <button onClick={() => onNavigate?.(7)} className="text-white hover:text-emerald-300 font-medium">
            ‹ Back
          </button>
          <span className="font-bold">Notifications</span>
          <span className="text-xs text-white/40">Clear</span>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 shadow-lg space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-md bg-emerald-700 flex items-center justify-center text-[10px]">
                    N
                  </span>
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                    NIMORA
                  </span>
                </div>
                <span className="text-[10px] text-white/50">{n.timeAgo}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white">{n.title}</h4>
                <p className="text-[11px] text-white/80 mt-0.5">{n.body}</p>
              </div>

              <div className="flex gap-2 pt-1">
                {n.actions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => onNavigate?.(8)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      act.primary
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pb-2">
        <p className="text-[10px] text-white/40">Swipe up to dismiss</p>
      </div>
    </div>
  );
}

// 17. WhatsApp Integration (Click to Chat)
export function Screen17WhatsApp({ onNavigate }: WidgetAndSettingsProps) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'me',
      text: "Hi Arun, just confirming tomorrow's site visit at 11 AM.",
      time: '11:41 AM',
      read: true,
    },
  ]);
  const [input, setInput] = useState('');

  const send = (customText?: string) => {
    const txt = customText || input;
    if (!txt.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'me',
        text: txt.trim(),
        time: 'Just now',
        read: true,
      },
    ]);
    setInput('');
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-[#0C151D] text-white flex flex-col justify-between select-none rounded-[38px] overflow-hidden">
      {/* WhatsApp Header */}
      <div className="bg-[#1F2C34] px-4 py-3 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate?.(12)} className="text-gray-300 text-sm">
            ‹
          </button>
          <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
            AM
          </div>
          <div>
            <h3 className="text-xs font-bold text-white leading-tight">Arun Mehta</h3>
            <p className="text-[10px] text-emerald-400">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-300 text-sm">
          <span>📹</span>
          <span>📞</span>
          <span>⋮</span>
        </div>
      </div>

      {/* WhatsApp Wallpaper Chat Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{
          backgroundImage: `radial-gradient(#1B2730 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      >
        <div className="text-center">
          <span className="text-[9px] bg-[#182229] text-gray-400 px-2 py-1 rounded-md">TODAY</span>
        </div>

        {messages.map((m) => (
          <div key={m.id} className="flex justify-end">
            <div className="max-w-[80%] bg-[#005C4B] rounded-2xl rounded-tr-none px-3.5 py-2 shadow text-white">
              <p className="text-xs leading-relaxed">{m.text}</p>
              <div className="flex items-center justify-end gap-1 text-[9px] text-white/60 mt-1">
                <span>{m.time}</span>
                <span className="text-cyan-300 font-bold">✓✓</span>
              </div>
            </div>
          </div>
        ))}

        {/* Quick action templates */}
        <div className="pt-4 flex flex-wrap gap-1.5 justify-end">
          <button
            onClick={() => send('Sending the revised drawings PDF now.')}
            className="text-[10px] bg-[#1F2C34] hover:bg-[#2A3942] text-gray-200 px-2.5 py-1 rounded-full border border-gray-700"
          >
            + Send Drawings PDF
          </button>
          <button
            onClick={() => send('Can we reschedule our call to 2 PM?')}
            className="text-[10px] bg-[#1F2C34] hover:bg-[#2A3942] text-gray-200 px-2.5 py-1 rounded-full border border-gray-700"
          >
            + Reschedule Call
          </button>
        </div>
      </div>

      {/* Input bar */}
      <div className="bg-[#1F2C34] p-2 flex items-center gap-2">
        <span className="text-gray-400 text-sm px-1">😊</span>
        <span className="text-gray-400 text-sm">📎</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Message"
          className="flex-1 bg-[#2A3942] text-white text-xs rounded-full px-3.5 py-2 outline-none placeholder-gray-400"
        />
        <button
          onClick={() => send()}
          className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center text-xs"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

// 18. Profile & Settings
export function Screen18ProfileSettings({ onNavigate }: WidgetAndSettingsProps) {
  return (
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between select-none rounded-[38px] overflow-hidden">
      <div>
        {/* Header */}
        <div className="p-5 pb-3 bg-white border-b border-gray-100 flex items-center justify-between">
          <button onClick={() => onNavigate?.(7)} className="text-gray-600 hover:text-gray-900 text-xs font-semibold">
            ‹ Back
          </button>
          <h2 className="text-sm font-bold text-gray-900">Settings</h2>
          <span className="w-5" />
        </div>

        {/* User Card */}
        <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-900 text-amber-200 font-bold flex items-center justify-center text-base shadow-sm ring-2 ring-emerald-600/20">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-gray-900">Sudarshan</h3>
                <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                  PRO
                </span>
              </div>
              <p className="text-xs text-gray-400">sudarshan@example.com</p>
            </div>
          </div>
          <span className="text-xs text-gray-300">›</span>
        </div>

        {/* Options List */}
        <div className="p-4 space-y-2">
          <div
            onClick={() => onNavigate?.(4)}
            className="p-3 bg-white border border-gray-200/80 rounded-2xl flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">✳️</span>
              <span className="text-xs font-semibold text-gray-800">AI Assistant</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
              Claude (Connected) <span className="text-gray-300">›</span>
            </span>
          </div>

          <div
            onClick={() => onNavigate?.(5)}
            className="p-3 bg-white border border-gray-200/80 rounded-2xl flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">🔌</span>
              <span className="text-xs font-semibold text-gray-800">Connected Apps</span>
            </div>
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              4 Active <span className="text-gray-300">›</span>
            </span>
          </div>

          <div
            onClick={() => onNavigate?.(6)}
            className="p-3 bg-white border border-gray-200/80 rounded-2xl flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">⚙️</span>
              <span className="text-xs font-semibold text-gray-800">Preferences</span>
            </div>
            <span className="text-gray-300 text-xs">›</span>
          </div>

          <div
            onClick={() => onNavigate?.(16)}
            className="p-3 bg-white border border-gray-200/80 rounded-2xl flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">🔔</span>
              <span className="text-xs font-semibold text-gray-800">Notifications</span>
            </div>
            <span className="text-gray-300 text-xs">›</span>
          </div>

          <div className="p-3 bg-white border border-gray-200/80 rounded-2xl flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm">🔒</span>
              <span className="text-xs font-semibold text-gray-800">Privacy & Security</span>
            </div>
            <span className="text-gray-300 text-xs">›</span>
          </div>

          <div className="p-3 bg-white border border-gray-200/80 rounded-2xl flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm">💳</span>
              <span className="text-xs font-semibold text-gray-800">Subscription</span>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Pro Plan ›
            </span>
          </div>

          <div className="p-3 bg-white border border-gray-200/80 rounded-2xl flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm">❓</span>
              <span className="text-xs font-semibold text-gray-800">Help & Support</span>
            </div>
            <span className="text-gray-300 text-xs">›</span>
          </div>

          <div
            onClick={() => onNavigate?.(1)}
            className="p-3 bg-white border border-gray-200/80 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-rose-50 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3 text-rose-600">
              <span className="text-sm">🚪</span>
              <span className="text-xs font-semibold">Sign Out</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pb-4">
        <p className="text-[10px] text-gray-400">NIMORA v1.0.0 • Build 2026.10</p>
      </div>
    </div>
  );
}

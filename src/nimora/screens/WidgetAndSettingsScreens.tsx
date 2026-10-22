'use client';

import React, { useState } from 'react';
import { NimoraTask, NimoraNotification } from '../data';

interface WidgetAndSettingsProps {
  tasks: NimoraTask[];
  notifications: NimoraNotification[];
  onNavigate?: (screenNumber: number) => void;
  onAddTask?: (task: NimoraTask) => void;
}

// 13. iOS Home Screen Widget
export function Screen15Widget({ tasks, onNavigate }: WidgetAndSettingsProps) {
  const nextTask = tasks.find((t) => t.status !== 'completed') || tasks[0];
  const upcomingTask = tasks.filter((t) => t.id !== nextTask?.id)[0] || tasks[1];

  return (
    <div
      className="w-full h-full min-h-[680px] text-white flex flex-col justify-between p-6 select-none rounded-[38px] relative overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at top right, #134e4a, #042f2e, #022c22, #000000)`,
      }}
    >
      {/* iOS Status Bar */}
      <div className="flex justify-between items-center text-xs text-white/80 pt-2 z-10 font-semibold">
        <span>9:01</span>
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
          onClick={() => onNavigate?.(5)}
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
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-700/40">
              NOW
            </span>
          </div>

          {/* Current Focus Task */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-emerald-300/80 tracking-wider">
                Now
              </p>
              <h3 className="text-sm font-extrabold text-white mt-0.5">{nextTask?.title}</h3>
              <p className="text-[11px] text-emerald-200/90 font-medium">
                {nextTask?.startTime} – {nextTask?.endTime}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.(6);
              }}
              className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 flex items-center justify-center text-xs font-bold transition-all shadow-md shadow-emerald-900/50"
            >
              ▶
            </button>
          </div>

          {/* Next Task Section */}
          <div className="border-t border-emerald-700/40 pt-2.5 flex items-center justify-between text-xs">
            <div>
              <p className="text-[9px] uppercase font-bold text-emerald-400/60 tracking-wider">
                Next
              </p>
              <p className="text-white/90 font-semibold">{upcomingTask?.title}</p>
            </div>
            <span className="text-[11px] text-emerald-300 font-semibold">
              {upcomingTask?.startTime} – {upcomingTask?.endTime}
            </span>
          </div>
        </div>

        {/* Quick Mic Bar */}
        <div className="flex justify-center">
          <button
            onClick={() => onNavigate?.(11)}
            className="w-12 h-12 rounded-full bg-emerald-800/80 backdrop-blur border border-emerald-600/40 flex items-center justify-center text-xl text-white shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            🎙️
          </button>
        </div>
      </div>

      {/* iOS App Dock */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-3 flex justify-around items-center z-10 border border-white/10">
        <button onClick={() => onNavigate?.(5)} className="w-11 h-11 rounded-2xl bg-emerald-800 flex items-center justify-center text-xl shadow-md">
          📅
        </button>
        <button onClick={() => onNavigate?.(15)} className="w-11 h-11 rounded-2xl bg-green-500 flex items-center justify-center text-xl shadow-md">
          💬
        </button>
        <button onClick={() => onNavigate?.(9)} className="w-11 h-11 rounded-2xl bg-blue-500 flex items-center justify-center text-xl shadow-md">
          👥
        </button>
        <button onClick={() => onNavigate?.(12)} className="w-11 h-11 rounded-2xl bg-purple-600 flex items-center justify-center text-xl shadow-md">
          ✨
        </button>
      </div>
    </div>
  );
}

// 14. Notifications & Snooze
export function Screen16Notifications({ notifications, onNavigate }: WidgetAndSettingsProps) {
  return (
    <div className="w-full h-full min-h-[680px] bg-gradient-to-b from-[#111827] via-[#0F172A] to-black text-white flex flex-col justify-between p-6 select-none rounded-[38px] relative overflow-hidden">
      <div>
        {/* iOS Lock Screen Header Clock */}
        <div className="text-center pt-4 mb-6">
          <span className="text-xs text-white/50 block">🔒</span>
          <h1 className="text-5xl font-extralight tracking-tight text-white/95 mt-1">9:00</h1>
          <p className="text-xs text-white/70 font-medium mt-1">Tue, 20 Oct</p>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-3.5 shadow-lg space-y-2 hover:bg-white/15 transition-all cursor-pointer"
              onClick={() => onNavigate?.(6)}
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
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pb-2">
        <button
          onClick={() => onNavigate?.(5)}
          className="text-xs text-white/60 hover:text-white px-4 py-1.5 bg-white/10 rounded-full border border-white/10"
        >
          Swipe up to unlock ›
        </button>
      </div>
    </div>
  );
}

// 15. WhatsApp Click-to-Chat
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
          <button onClick={() => onNavigate?.(10)} className="text-gray-300 text-sm">
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

      {/* Chat Area */}
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
            <div className="max-w-[85%] bg-[#005C4B] rounded-2xl rounded-tr-none px-3.5 py-2 shadow text-white">
              <p className="text-xs leading-relaxed">{m.text}</p>
              <div className="flex items-center justify-end gap-1 text-[9px] text-white/60 mt-1">
                <span>{m.time}</span>
                <span className="text-cyan-300 font-bold">✓✓</span>
              </div>
            </div>
          </div>
        ))}

        {/* Click to Chat Promo Card */}
        <div className="bg-[#182229]/90 border border-gray-700/60 rounded-2xl p-3 text-center space-y-2 mt-4">
          <span className="text-xl">💬</span>
          <h4 className="text-xs font-bold text-emerald-300">Click to Chat</h4>
          <p className="text-[10px] text-gray-300 leading-relaxed">
            Opens WhatsApp with the selected contact. (We do not read your personal messages).
          </p>
          <button
            onClick={() => send("Hi Arun, looking forward to our review meeting.")}
            className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-gray-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <span>💬</span>
            <span>Open in WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Input bar */}
      <div className="bg-[#1F2C34] p-2 flex items-center gap-2">
        <span className="text-gray-400 text-sm px-1">😊</span>
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

// 16. Settings & Privacy
export function Screen18ProfileSettings({ onNavigate }: WidgetAndSettingsProps) {
  return (
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between select-none rounded-[38px] overflow-hidden">
      <div className="overflow-y-auto">
        {/* Header */}
        <div className="p-5 pb-3 bg-white border-b border-gray-100 flex items-center justify-between">
          <button onClick={() => onNavigate?.(5)} className="text-gray-600 hover:text-gray-900 text-xs font-semibold">
            ‹ Back
          </button>
          <h2 className="text-sm font-bold text-gray-900">Settings & Privacy</h2>
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
            onClick={() => onNavigate?.(3)}
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
            onClick={() => onNavigate?.(4)}
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

          <div className="p-3 bg-white border border-gray-200/80 rounded-2xl flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm">⚙️</span>
              <span className="text-xs font-semibold text-gray-800">Preferences</span>
            </div>
            <span className="text-gray-300 text-xs">›</span>
          </div>

          <div
            onClick={() => onNavigate?.(14)}
            className="p-3 bg-white border border-gray-200/80 rounded-2xl flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">🔔</span>
              <span className="text-xs font-semibold text-gray-800">Notifications</span>
            </div>
            <span className="text-gray-300 text-xs">›</span>
          </div>

          {/* Go Premium – Google Pay / Apple Pay */}
          <a
            href="/payments"
            className="p-3 bg-gradient-to-r from-emerald-600 to-teal-500 border border-emerald-400/40 rounded-2xl flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">💎</span>
              <span className="text-xs font-bold text-white">Go Premium</span>
            </div>
            <span className="text-[11px] font-semibold text-white/80 flex items-center gap-1">
              Google Pay · Apple Pay <span className="text-white/60">›</span>
            </span>
          </a>
        </div>

        {/* Privacy Callout Cards matching right column of Screen 16 */}
        <div className="p-4 pt-1 space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Your Data. Your Control.
          </h4>

          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-start gap-2.5">
            <span className="text-base">🛡️</span>
            <div>
              <h5 className="text-xs font-bold text-emerald-950">Secure & Private</h5>
              <p className="text-[10px] text-emerald-800/80">Your data is encrypted and under your control.</p>
            </div>
          </div>

          <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-2xl flex items-start gap-2.5">
            <span className="text-base">🎯</span>
            <div>
              <h5 className="text-xs font-bold text-teal-950">Connect Only What You Need</h5>
              <p className="text-[10px] text-teal-800/80">Data minimization principle built-in.</p>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-2xl flex items-start gap-2.5">
            <span className="text-base">🔒</span>
            <div>
              <h5 className="text-xs font-bold text-amber-950">Clear Permissions</h5>
              <p className="text-[10px] text-amber-800/80">Manage or revoke app access anytime.</p>
            </div>
          </div>

          <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-2xl flex items-start gap-2.5">
            <span className="text-base">🗑️</span>
            <div>
              <h5 className="text-xs font-bold text-sky-950">Data Deletion</h5>
              <p className="text-[10px] text-sky-800/80">Request to delete your data whenever you want.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-3 border-t border-gray-100 bg-white">
        <button
          onClick={() => onNavigate?.(1)}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800"
        >
          Sign Out of Sudarshan Account
        </button>
      </div>
    </div>
  );
}

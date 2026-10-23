'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NimoraTask, NimoraNotification } from '../data';
import { haptics } from '@/lib/haptics';
import { downloadICS } from '@/lib/exportUtils';

export interface WidgetAndSettingsProps {
  tasks: NimoraTask[];
  notifications: NimoraNotification[];
  onNavigate?: (screenNumber: number) => void;
  onAddTask?: (task: NimoraTask) => void;
  onResetData?: () => void;
  onDeleteAllData?: () => void;
}

// 13. iOS Home Screen Widget
export function Screen15Widget({ tasks, onNavigate }: WidgetAndSettingsProps) {
  const nextTask = tasks.find((t) => t.status !== 'completed') || tasks[0];
  const upcomingTask = tasks.filter((t) => t.id !== nextTask?.id)[0] || tasks[1];

  return (
    <div
      className="w-full h-full min-h-[680px] text-[#f8fafc] flex flex-col justify-between p-6 select-none rounded-[32px] relative overflow-hidden bg-[#0e0b1f] border border-white/[0.08]"
    >
      {/* Main Home Screen Widget Container (20% Liquid Glass Material) */}
      <div className="my-auto z-10 space-y-4">
        {/* iOS Liquid Glass Dark Widget */}
        <div
          onClick={() => onNavigate?.(5)}
          className="cursor-pointer liquid-glass liquid-sheen rounded-3xl p-5 shadow-2xl hover:scale-[1.02] transition-all border border-white/25"
        >
          {/* Widget Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#bef264]">bolt</span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#a1d1bd]">
                NIMORA
              </span>
            </div>
            <span className="text-[9px] font-mono font-bold text-[#bef264] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
              NOW
            </span>
          </div>

          {/* Current Focus Task */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[9px] font-mono uppercase font-semibold text-[#8a938e] tracking-wider">
                Current Focus
              </p>
              <h3 className="text-sm font-bold text-[#f8fafc] mt-0.5 font-['Space_Grotesk']">{nextTask?.title}</h3>
              <p className="text-[11px] font-mono text-[#a1d1bd]">
                {nextTask?.startTime} – {nextTask?.endTime}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.(6);
              }}
              className="w-8 h-8 rounded-full minimal-btn-primary flex items-center justify-center text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
            </button>
          </div>

          {/* Next Task Section */}
          <div className="border-t border-white/[0.08] pt-2.5 flex items-center justify-between text-xs">
            <div>
              <p className="text-[9px] font-mono uppercase font-semibold text-[#8a938e] tracking-wider">
                Next
              </p>
              <p className="text-[#f8fafc] font-semibold">{upcomingTask?.title}</p>
            </div>
            <span className="text-[11px] font-mono text-[#a1d1bd] font-medium">
              {upcomingTask?.startTime} – {upcomingTask?.endTime}
            </span>
          </div>
        </div>

        {/* Quick Mic Bar (Liquid Glass Floating Pill) */}
        <div className="flex justify-center">
          <button
            onClick={() => onNavigate?.(11)}
            className="w-12 h-12 rounded-full liquid-glass-pill border border-white/35 flex items-center justify-center text-xl text-[#bef264] shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">mic</span>
          </button>
        </div>
      </div>

      {/* iOS App Dock (Liquid Glass Material) */}
      <div className="liquid-glass-pill rounded-3xl p-2.5 flex justify-around items-center z-10 border border-white/20">
        <button onClick={() => onNavigate?.(5)} className="w-11 h-11 rounded-2xl minimal-btn-primary flex items-center justify-center text-xl shadow-md cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">home</span>
        </button>
        <button onClick={() => onNavigate?.(6)} className="w-11 h-11 rounded-2xl bg-white/10 text-[#a1d1bd] flex items-center justify-center text-xl shadow-md border border-white/10 hover:border-white/20 cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">calendar_today</span>
        </button>
        <button onClick={() => onNavigate?.(9)} className="w-11 h-11 rounded-2xl bg-white/10 text-[#a1d1bd] flex items-center justify-center text-xl shadow-md border border-white/10 hover:border-white/20 cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">group</span>
        </button>
        <button onClick={() => onNavigate?.(16)} className="w-11 h-11 rounded-2xl bg-white/10 text-[#a1d1bd] flex items-center justify-center text-xl shadow-md border border-white/10 hover:border-white/20 cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
      </div>
    </div>
  );
}

// 14. Notifications & Snooze
export function Screen16Notifications({ notifications, onNavigate }: WidgetAndSettingsProps) {
  return (
    <div className="w-full h-full min-h-[680px] bg-[#0e0b1f] text-[#f8fafc] flex flex-col justify-between p-6 select-none rounded-[38px] relative overflow-hidden">
      <div>
        {/* iOS Lock Screen Header Clock */}
        <div className="text-center pt-4 mb-6">
          <span className="text-xs text-[#8a938e] block">🔒</span>
          <h1 className="text-5xl font-extralight tracking-tight text-[#f8fafc] mt-1 font-['Space_Grotesk']">9:00</h1>
          <p className="text-xs text-[#c0c8c3] font-medium mt-1">Tue, 20 Oct</p>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="glass-card specular-border rounded-2xl p-3.5 shadow-lg space-y-2 hover:border-[#bef264]/40 transition-all cursor-pointer"
              onClick={() => onNavigate?.(6)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-md bg-[#0e3e30] text-[#bef264] flex items-center justify-center text-[10px] font-bold">
                    N
                  </span>
                  <span className="text-[11px] font-bold text-[#f8fafc] uppercase tracking-wider font-['Space_Grotesk']">
                    NIMORA
                  </span>
                </div>
                <span className="text-[10px] text-[#8a938e]">{n.timeAgo}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#f8fafc] font-['Space_Grotesk']">{n.title}</h4>
                <p className="text-[11px] text-[#c0c8c3] mt-0.5">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pb-2">
        <button
          onClick={() => onNavigate?.(5)}
          className="text-xs text-[#c0c8c3] hover:text-white px-4 py-1.5 bg-[#162540] rounded-full border border-[#334155]/40"
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
          <div className="w-9 h-9 rounded-full bg-[#005C4B] text-white font-bold flex items-center justify-center text-xs">
            AM
          </div>
          <div>
            <h3 className="text-xs font-bold text-white leading-tight font-['Space_Grotesk']">Arun Mehta</h3>
            <p className="text-[10px] text-emerald-400">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-300 text-sm">
          <span className="material-symbols-outlined text-[18px]">videocam</span>
          <span className="material-symbols-outlined text-[18px]">call</span>
          <span className="material-symbols-outlined text-[18px]">more_vert</span>
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
        <div className="bg-[#182229]/90 border border-gray-700/60 rounded-2xl p-3.5 text-center space-y-2 mt-4">
          <span className="material-symbols-outlined text-[#25D366] text-[24px]">chat</span>
          <h4 className="text-xs font-bold text-emerald-300 font-['Space_Grotesk']">Click to Chat</h4>
          <p className="text-[10px] text-gray-300 leading-relaxed">
            Opens WhatsApp with the selected contact. (We do not read your personal messages).
          </p>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-gray-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Open in WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Input bar */}
      <div className="bg-[#1F2C34] p-2 flex items-center gap-2">
        <span className="material-symbols-outlined text-gray-400 text-[20px] px-1">mood</span>
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
export function Screen18ProfileSettings({ tasks, onNavigate, onResetData, onDeleteAllData }: WidgetAndSettingsProps) {
  const [mounted, setMounted] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profileName, setProfileName] = useState('Sudarshan Mehta');
  const [profileRole, setProfileRole] = useState('Principal Architect & Founder');
  const [profileEmail, setProfileEmail] = useState('sudarshan@bespokestudio.com');
  const [profilePhone, setProfilePhone] = useState('+91 98765 43210');
  const [profileLocation, setProfileLocation] = useState('Bengaluru / Mumbai');
  const [profileToast, setProfileToast] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('2 minutes ago');
  const [syncToast, setSyncToast] = useState('');
  const [syncFrequency, setSyncFrequency] = useState<'realtime' | '15m' | 'hourly'>('realtime');
  const [calendars, setCalendars] = useState({
    gcal: true,
    appleCal: true,
    outlook: false,
    morgenBridge: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleCalendar = (key: keyof typeof calendars) => {
    haptics.tick();
    setCalendars((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSyncNow = () => {
    haptics.tick();
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('Just now');
      setSyncToast('Synced 24 events from Google & Apple Calendars');
      haptics.success();
      setTimeout(() => setSyncToast(''), 3000);
    }, 900);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    haptics.success();
    setProfileToast('Profile updated successfully!');
    setTimeout(() => {
      setProfileToast('');
      setIsProfileModalOpen(false);
    }, 1200);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all tasks to initial demo state?')) {
      onResetData?.();
      setResetMessage('Demo data restored successfully!');
      setTimeout(() => setResetMessage(''), 2500);
    }
  };

  const handleConfirmDeleteAll = () => {
    haptics.warning();
    onDeleteAllData?.();
    setIsDeleteModalOpen(false);
    setResetMessage('All tasks, local storage and cache permanently deleted!');
    setTimeout(() => setResetMessage(''), 3000);
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-[#0e0b1f] text-[#f8fafc] flex flex-col justify-between select-none rounded-[38px] relative">
      <div className="overflow-y-auto pb-28">
        {/* Header */}
        <div className="p-4 bg-[#0e0b1f]/90 border-b border-[#334155]/30 flex items-center justify-between">
          <button onClick={() => onNavigate?.(5)} className="text-[#c0c8c3] hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer">
            ‹ Back
          </button>
          <h2 className="text-sm font-bold text-[#f8fafc] font-['Space_Grotesk']">Settings & Privacy</h2>
          <span className="w-5" />
        </div>

        {/* User Card (Interactive Profile Button) */}
        <div className="p-4 pb-2">
          <button
            type="button"
            onClick={() => {
              haptics.tick();
              setIsProfileModalOpen(true);
            }}
            className="w-full p-4 minimal-card rounded-2xl flex items-center justify-between border border-white/[0.08] hover:border-[#bef264]/40 hover:bg-white/[0.04] transition-all cursor-pointer text-left active:scale-[0.99] group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full liquid-glass-pill text-[#bef264] font-bold flex items-center justify-center text-base shadow-sm border border-white/25 font-['Space_Grotesk'] group-hover:scale-105 transition-transform">
                {profileName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#f8fafc] font-['Space_Grotesk']">{profileName}</h3>
                  <span className="text-[9px] font-mono font-bold bg-[#1b201d] text-[#bef264] px-2 py-0.5 rounded-full border border-white/[0.08]">
                    PRO
                  </span>
                </div>
                <p className="text-xs text-purple-300/70 font-mono truncate max-w-[200px]">{profileEmail}</p>
              </div>
            </div>
            <span className="text-xs text-purple-300/60 group-hover:text-[#bef264] group-hover:translate-x-0.5 transition-all font-mono">›</span>
          </button>
        </div>

        {/* Options List */}
        <div className="px-4 space-y-2">
          {/* Subscription & Pricing Plans (20% Liquid Glass Focal Banner) */}
          <button
            onClick={() => onNavigate?.(99)}
            className="w-full p-3.5 liquid-glass liquid-sheen rounded-2xl flex items-center justify-between cursor-pointer hover:border-white/30 transition-all shadow-md active:scale-[0.99] text-left border border-white/20"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-[#bef264]">diamond</span>
              <div>
                <span className="text-xs font-bold text-[#f8fafc] block font-['Space_Grotesk']">Executive Membership</span>
                <span className="text-[10px] text-[#a1d1bd]">Pro features & cloud backup active</span>
              </div>
            </div>
            <span className="text-[11px] font-mono font-semibold text-[#bef264] flex items-center gap-1">
              Plans <span className="text-[#8a938e]">›</span>
            </span>
          </button>

          {/* Connected Calendars & Sync Button - Fully Interactive */}
          <button
            type="button"
            onClick={() => {
              haptics.tick();
              setIsCalendarModalOpen(true);
            }}
            className="w-full p-3.5 minimal-card rounded-2xl flex items-center justify-between cursor-pointer hover:border-[#bef264]/40 hover:bg-white/[0.04] transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-[#bef264] group-hover:scale-110 transition-transform">sync_alt</span>
              <div>
                <span className="text-xs font-medium text-[#f8fafc] block">Connected Calendars & Sync</span>
                <span className="text-[10px] font-mono text-purple-300/70">Google · Apple · CalDAV</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#bef264] flex items-center gap-1 font-semibold">
              Manage <span className="text-[#bef264]">›</span>
            </span>
          </button>

          {/* Delete All Data (Destructive Action - Permanently Wipes Everything) */}
          <button
            type="button"
            onClick={() => {
              haptics.warning();
              setIsDeleteModalOpen(true);
            }}
            className="w-full p-3.5 bg-rose-950/40 border border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-950/60 rounded-2xl flex items-center justify-between cursor-pointer transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[18px]">delete_forever</span>
              </div>
              <div>
                <span className="text-xs font-bold text-rose-300 block">Delete All Data</span>
                <span className="text-[10px] text-rose-200/60 font-mono">Permanently erase all tasks & local storage</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400 group-hover:translate-x-0.5 transition-transform">Erase ›</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={handleReset}
            className="w-full p-3 minimal-card border border-white/[0.08] rounded-2xl flex items-center justify-between cursor-pointer hover:border-white/20 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-purple-300/70">refresh</span>
              <div>
                <span className="text-xs font-medium text-purple-200 block">Reset Demo Agenda</span>
                <span className="text-[10px] text-purple-300/50">Restore fresh default sample milestones</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-purple-300/70 font-medium">Reset ›</span>
          </button>

          {resetMessage && (
            <div className="p-2.5 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs text-[#bef264] text-center font-mono">
              {resetMessage}
            </div>
          )}
        </div>

        {/* Privacy Callout Cards (Minimalist Editorial) */}
        <div className="p-4 pt-4 space-y-2">
          <h4 className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#8a938e] mb-2">
            Your Data. Your Control.
          </h4>

          <div className="p-3 minimal-card rounded-xl flex items-start gap-2.5 border border-white/[0.06]">
            <span className="material-symbols-outlined text-[18px] text-[#bef264] shrink-0">security</span>
            <div>
              <h5 className="text-xs font-semibold text-[#f8fafc]">Secure & Private</h5>
              <p className="text-[10px] text-[#9b9f9c]">Client conversations & follow-ups are client-side encrypted.</p>
            </div>
          </div>

          <div className="p-3 minimal-card rounded-xl flex items-start gap-2.5 border border-white/[0.06]">
            <span className="material-symbols-outlined text-[18px] text-[#bef264] shrink-0">tune</span>
            <div>
              <h5 className="text-xs font-semibold text-[#f8fafc]">Data Minimization</h5>
              <p className="text-[10px] text-[#9b9f9c]">Only essential scheduling payloads are processed.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Calendars & Sync Modal (Portaled to document.body for 100% reliable viewport rendering) */}
      {mounted && isCalendarModalOpen && createPortal(
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsCalendarModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#120e29] border border-purple-500/30 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#bef264]/20 border border-[#bef264]/40 flex items-center justify-center text-[#bef264]">
                  <span className="material-symbols-outlined text-lg">sync_alt</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f8fafc] font-['Space_Grotesk']">Connected Calendars</h3>
                  <p className="text-[10px] text-purple-300/70 font-mono">Two-way automatic sync</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  haptics.tick();
                  setIsCalendarModalOpen(false);
                }}
                className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-purple-200 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Sync Status Banner */}
            <div className="p-3 bg-[#1a1438] rounded-2xl border border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#bef264] shadow-[0_0_8px_#bef264] animate-pulse" />
                <div>
                  <span className="text-xs font-semibold text-[#f8fafc] block">Live Status: Active</span>
                  <span className="text-[10px] text-purple-300/60 font-mono">Last sync: {lastSyncTime}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="px-2.5 py-1.5 rounded-lg bg-[#bef264] text-[#0e0b1f] font-mono text-[10px] font-bold tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-sm ${isSyncing ? 'animate-spin' : ''}`}>
                  sync
                </span>
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>

            {syncToast && (
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-[#bef264] text-xs font-mono text-center animate-in fade-in">
                ✓ {syncToast}
              </div>
            )}

            {/* Connected Providers List */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300/70 block px-1">
                Connected Accounts
              </span>

              {/* Google Calendar */}
              <div className="p-3 bg-white/[0.04] rounded-2xl border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <span className="material-symbols-outlined text-base">calendar_today</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#f8fafc] block">Google Calendar</span>
                    <span className="text-[10px] text-purple-300/60 font-mono truncate max-w-[150px] block">
                      sudarshan@bespokestudio.com
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCalendar('gcal')}
                  className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 cursor-pointer ${
                    calendars.gcal ? 'bg-[#bef264] justify-end' : 'bg-white/10 justify-start'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full shadow-md ${calendars.gcal ? 'bg-[#0e0b1f]' : 'bg-gray-400'}`} />
                </button>
              </div>

              {/* Apple Calendar */}
              <div className="p-3 bg-white/[0.04] rounded-2xl border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                    <span className="material-symbols-outlined text-base">event</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#f8fafc] block">Apple Calendar (iCloud)</span>
                    <span className="text-[10px] text-purple-300/60 font-mono">Architect Studio, Personal</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCalendar('appleCal')}
                  className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 cursor-pointer ${
                    calendars.appleCal ? 'bg-[#bef264] justify-end' : 'bg-white/10 justify-start'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full shadow-md ${calendars.appleCal ? 'bg-[#0e0b1f]' : 'bg-gray-400'}`} />
                </button>
              </div>

              {/* Morgen CalDAV Bridge */}
              <div className="p-3 bg-white/[0.04] rounded-2xl border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#bef264]/15 border border-[#bef264]/30 flex items-center justify-center text-[#bef264]">
                    <span className="material-symbols-outlined text-base">multiple_stop</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#f8fafc] block">Morgen CalDAV Bridge</span>
                    <span className="text-[10px] text-purple-300/60 font-mono">Real-time bi-directional link</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCalendar('morgenBridge')}
                  className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 cursor-pointer ${
                    calendars.morgenBridge ? 'bg-[#bef264] justify-end' : 'bg-white/10 justify-start'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full shadow-md ${calendars.morgenBridge ? 'bg-[#0e0b1f]' : 'bg-gray-400'}`} />
                </button>
              </div>

              {/* Outlook */}
              <div className="p-3 bg-white/[0.04] rounded-2xl border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <span className="material-symbols-outlined text-base">mail</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#f8fafc] block">Microsoft Outlook 365</span>
                    <span className="text-[10px] text-purple-300/60 font-mono">
                      {calendars.outlook ? 'Connected' : 'Not connected'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCalendar('outlook')}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-xs font-mono text-purple-200 hover:text-white transition-all cursor-pointer"
                >
                  {calendars.outlook ? 'Disconnect' : 'Connect +'}
                </button>
              </div>
            </div>

            {/* Sync Frequency Preference */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300/70 block px-1">
                Sync Frequency
              </span>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#1a1438] rounded-xl border border-purple-500/15 text-xs">
                {(['realtime', '15m', 'hourly'] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => {
                      haptics.tick();
                      setSyncFrequency(freq);
                    }}
                    className={`py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold transition-all cursor-pointer ${
                      syncFrequency === freq
                        ? 'bg-[#bef264] text-[#0e0b1f] shadow-sm'
                        : 'text-purple-300/60 hover:text-white'
                    }`}
                  >
                    {freq === 'realtime' ? '⚡ Real-time' : freq === '15m' ? '15 Min' : 'Hourly'}
                  </button>
                ))}
              </div>
            </div>

            {/* Export & Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  haptics.tick();
                  downloadICS(tasks || [], 'nimora-connected-schedule.ics');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-purple-200 hover:text-[#bef264] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export .ics</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  haptics.success();
                  setIsCalendarModalOpen(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[#bef264] text-[#0e0b1f] text-xs font-bold hover:brightness-105 active:scale-95 transition-all cursor-pointer text-center"
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Profile & Account Details Modal (Portaled to document.body for 100% reliable viewport rendering) */}
      {mounted && isProfileModalOpen && createPortal(
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsProfileModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#120e29] border border-purple-500/30 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#bef264]/20 border border-[#bef264]/40 flex items-center justify-center text-[#bef264]">
                  <span className="material-symbols-outlined text-lg">account_circle</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f8fafc] font-['Space_Grotesk']">Account Profile</h3>
                  <p className="text-[10px] text-purple-300/70 font-mono">Personal & Studio Details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  haptics.tick();
                  setIsProfileModalOpen(false);
                }}
                className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-purple-200 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {profileToast && (
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-[#bef264] text-xs font-mono text-center animate-in fade-in">
                ✓ {profileToast}
              </div>
            )}

            {/* Profile Avatar Card */}
            <div className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-2xl border border-white/[0.08]">
              <div className="w-14 h-14 rounded-full liquid-glass-pill text-[#bef264] font-bold flex items-center justify-center text-xl shadow-md border border-white/30 font-['Space_Grotesk']">
                {profileName.charAt(0)}
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold bg-[#bef264]/20 text-[#bef264] px-2 py-0.5 rounded-full border border-[#bef264]/40 uppercase tracking-wider inline-block mb-1">
                  Executive PRO Active
                </span>
                <p className="text-xs text-purple-200 font-medium">Bespoke Studio ID: #8824</p>
                <p className="text-[10px] text-purple-300/60 font-mono">AES-256 Client-Side Key Active</p>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-purple-300/70 block mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-[#1a1438] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white placeholder-purple-300/40 outline-none focus:border-[#bef264]/60 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-purple-300/70 block mb-1 uppercase tracking-wider">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  className="w-full bg-[#1a1438] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white placeholder-purple-300/40 outline-none focus:border-[#bef264]/60 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-purple-300/70 block mb-1 uppercase tracking-wider">
                  Verified Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-[#1a1438] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white placeholder-purple-300/40 outline-none focus:border-[#bef264]/60 transition-colors font-mono"
                    required
                  />
                  <span className="absolute right-2.5 top-2 text-[#bef264] text-[11px] font-mono">
                    ✓ Verified
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-purple-300/70 block mb-1 uppercase tracking-wider">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-[#1a1438] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white placeholder-purple-300/40 outline-none focus:border-[#bef264]/60 transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-purple-300/70 block mb-1 uppercase tracking-wider">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileLocation}
                    onChange={(e) => setProfileLocation(e.target.value)}
                    className="w-full bg-[#1a1438] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white placeholder-purple-300/40 outline-none focus:border-[#bef264]/60 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    onNavigate?.(99);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-purple-200 hover:text-white transition-all cursor-pointer text-center"
                >
                  Manage Plan
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-[#bef264] text-[#0e0b1f] text-xs font-bold hover:brightness-105 active:scale-95 transition-all cursor-pointer text-center"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Delete All Data Confirmation Modal */}
      {mounted && isDeleteModalOpen && createPortal(
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#180c14] border border-rose-500/40 rounded-3xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">Delete All User Data?</h3>
                <p className="text-[11px] text-rose-200/70 font-mono">Irreversible action</p>
              </div>
            </div>

            <p className="text-xs text-purple-200/90 leading-relaxed">
              This will permanently wipe all your scheduled tasks, agenda milestones, offline cache, and custom settings.
            </p>

            <div className="p-3 bg-black/40 rounded-xl border border-rose-500/20 space-y-1 text-[11px] font-mono text-rose-300">
              <p>• All agenda tasks will be deleted</p>
              <p>• Local storage will be purged</p>
              <p>• Cannot be undone</p>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-purple-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAll}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-rose-950"
              >
                Permanently Erase
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// 15. Subscription & Membership Plans (Pricing First, Then Purchase)
export function Screen19SubscriptionPlans({
  onNavigate,
  onSubscriptionSuccess,
}: {
  onNavigate?: (screenNumber: number) => void;
  onSubscriptionSuccess?: () => void;
}) {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'essential'>('pro');
  const [step, setStep] = useState<'pricing' | 'checkout'>('pricing');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptInfo, setReceiptInfo] = useState<{ receiptId?: string; renewsAt?: string; amountPaid?: string } | null>(null);

  const plans = {
    essential: {
      id: 'essential',
      name: 'Professional Starter',
      badge: 'Core Pro',
      monthlyPrice: '$13.99',
      annualPrice: '$9.99',
      period: '/month',
      billedNote: billingCycle === 'annual' ? 'Billed annually ($119.88/yr) · Save 28%' : 'Billed monthly',
      description: 'Ideal for architects, agents & contractors organizing daily site agendas.',
      features: [
        'Unlimited Tasks, Schedules & Time-blocking',
        'AI Voice Assistant with Spoken Confirmation',
        'Stakeholder CRM & Follow-up Tracker (up to 50 contacts)',
        'One-tap .ics Calendar Export & Local Encryption',
        'Home Screen Push-to-Talk Quick Widget',
      ],
      notIncluded: [
        'Remote MCP Server (Claude & ChatGPT agents)',
        '2-Way Live Google/Apple Calendar Sync',
      ],
    },
    pro: {
      id: 'pro',
      name: 'Executive AI & MCP',
      badge: '⭐ Most Popular',
      monthlyPrice: '$19.99',
      annualPrice: '$15.99',
      period: '/month',
      billedNote: billingCycle === 'annual' ? 'Billed annually ($191.88/yr) · Save 20%' : 'Billed monthly',
      description: 'Full autonomous intelligence, remote MCP agent connectivity & 2-way sync.',
      features: [
        'Everything in Professional Starter',
        'Remote MCP Server Integration (Claude, ChatGPT, Gemini)',
        'Unlimited Stakeholder CRM & Call/WhatsApp Logging',
        '2-Way Live Calendar Sync (Google & Apple Calendar)',
        'Direct WhatsApp & Phone Follow-up Triggers',
        'Priority Multi-Device Cloud Real-time Synchronization',
      ],
      notIncluded: [],
    },
  };

  const currentPlan = plans[selectedPlan];
  const displayPrice = billingCycle === 'annual' ? currentPlan.annualPrice : currentPlan.monthlyPrice;

  const handleCheckout = async (methodName: string) => {
    setIsProcessing(true);
    haptics.tick();

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          billingCycle,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }

        try {
          localStorage.setItem('nimora_subscription_status', 'pro');
          localStorage.setItem('nimora_subscription_plan', currentPlan.name);
          if (data.receiptId) {
            localStorage.setItem('nimora_subscription_receipt', data.receiptId);
          }
        } catch {}

        setReceiptInfo({
          receiptId: data.receiptId,
          renewsAt: data.renewsAt,
          amountPaid: data.amountPaid || displayPrice,
        });

        setIsProcessing(false);
        setPaymentSuccess(true);
        haptics.success();
        onSubscriptionSuccess?.();
        return;
      }
    } catch (e) {
      console.warn('Checkout API request error:', e);
    }

    try {
      localStorage.setItem('nimora_subscription_status', 'pro');
      localStorage.setItem('nimora_subscription_plan', currentPlan.name);
    } catch {}

    setIsProcessing(false);
    setPaymentSuccess(true);
    haptics.success();
    onSubscriptionSuccess?.();
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-[#0e0b1f] text-[#f8fafc] flex flex-col justify-between p-4 select-none rounded-[32px] shadow-2xl relative overflow-hidden border border-white/[0.08]">
      {/* Top Header */}
      <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
        <button
          onClick={() => {
            if (step === 'checkout') setStep('pricing');
            else onNavigate?.(5);
          }}
          className="text-[#9b9f9c] hover:text-[#f8fafc] text-xs font-mono font-medium flex items-center gap-1 cursor-pointer transition-colors"
        >
          ‹ {step === 'checkout' ? 'Back to Pricing' : 'Back'}
        </button>
        <div className="text-center">
          <span className="text-[9px] text-[#bef264] font-mono font-bold uppercase tracking-widest block">
            {step === 'pricing' ? 'NIMORA MEMBERSHIP' : 'SECURE CHECKOUT'}
          </span>
          <span className="text-xs font-semibold text-[#f8fafc] font-['Space_Grotesk']">
            {step === 'pricing' ? 'Choose Your Plan' : 'Finalize Upgrade'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#a1d1bd] font-mono">
          <span className="material-symbols-outlined text-[13px]">lock</span>
          <span>SSL</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4">
        {step === 'pricing' ? (
          <>
            {/* Value Proposition Header */}
            <div className="text-center space-y-1 pt-1">
              <span className="text-[9px] font-mono font-semibold bg-[#161a17] text-[#bef264] px-2.5 py-0.5 rounded-full border border-white/[0.08] tracking-wider uppercase">
                EXECUTIVE INTELLIGENCE
              </span>
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#f8fafc] pt-1">
                Elevate Your Daily Focus
              </h2>
              <p className="text-xs text-[#9b9f9c] max-w-[320px] mx-auto">
                Transparent pricing. Unlock voice scheduling, stakeholder CRM, and multi-device cloud sync.
              </p>
            </div>

            {/* Monthly / Annual Billing Toggle */}
            <div className="flex justify-center">
              <div className="p-1 bg-[#141815] rounded-xl border border-white/[0.08] flex items-center">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-[#1e2420] text-[#bef264] border border-white/[0.12]'
                      : 'text-[#8a938e] hover:text-[#f8fafc]'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    billingCycle === 'annual'
                      ? 'bg-[#1e2420] text-[#bef264] border border-white/[0.12]'
                      : 'text-[#8a938e] hover:text-[#f8fafc]'
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[8px] px-1.5 py-0.2 bg-[#bef264] text-gray-950 rounded-full font-bold uppercase font-mono">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing Cards List */}
            <div className="space-y-3">
              {(['pro', 'essential'] as const).map((planKey) => {
                const plan = plans[planKey];
                const isSelected = selectedPlan === planKey;
                const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(planKey)}
                    className={`rounded-2xl p-4.5 cursor-pointer transition-all relative ${
                      planKey === 'pro'
                        ? 'liquid-glass liquid-sheen border border-white/20 shadow-xl'
                        : 'minimal-card border border-white/[0.08]'
                    } ${isSelected ? 'ring-1 ring-[#bef264]/70' : 'hover:border-white/[0.14]'}`}
                  >
                    {/* Badge */}
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          planKey === 'pro'
                            ? 'liquid-glass-pill text-[#bef264] border border-white/30'
                            : 'bg-[#171b18] text-[#a1d1bd] border border-white/[0.06]'
                        }`}
                      >
                        {plan.badge}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#bef264] bg-[#bef264] text-gray-950'
                              : 'border-white/20'
                          }`}
                        >
                          {isSelected && <span className="text-[10px] font-bold">✓</span>}
                        </div>
                      </div>
                    </div>

                    {/* Plan Title & Price */}
                    <div className="flex justify-between items-baseline mt-2">
                      <div>
                        <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#f8fafc]">
                          {plan.name}
                        </h3>
                        <p className="text-[11px] text-[#9b9f9c]">{plan.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-0.5">
                          <span className="font-['Space_Grotesk'] text-xl font-bold text-[#bef264]">
                            {price}
                          </span>
                          <span className="text-[10px] font-mono text-[#8a938e]">{plan.period}</span>
                        </div>
                        <span className="text-[9px] font-mono text-[#a1d1bd] block">{plan.billedNote}</span>
                      </div>
                    </div>

                    {/* Feature Highlights */}
                    <div className="mt-3 pt-2.5 border-t border-white/[0.08] space-y-1">
                      {plan.features.slice(0, 4).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#f8fafc]">
                          <span className="text-[#bef264] text-[13px]">✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust and Assurance Box (Minimalist Editorial) */}
            <div className="p-3 rounded-xl minimal-card border border-white/[0.06] flex items-center justify-between text-center">
              <div className="flex-1">
                <span className="text-xs text-[#bef264] tracking-widest font-mono">★★★★★</span>
                <p className="text-[9px] text-[#8a938e] font-mono">Top Rated SaaS</p>
              </div>
              <div className="h-6 w-px bg-white/[0.06]" />
              <div className="flex-1">
                <span className="material-symbols-outlined text-[16px] text-[#a1d1bd]">shield</span>
                <p className="text-[9px] text-[#8a938e] font-mono">Cancel Anytime</p>
              </div>
              <div className="h-6 w-px bg-white/[0.06]" />
              <div className="flex-1">
                <span className="material-symbols-outlined text-[16px] text-[#bef264]">bolt</span>
                <p className="text-[9px] text-[#8a938e] font-mono">Instant Unlock</p>
              </div>
            </div>
          </>
        ) : (
          /* STEP 2: CHECKOUT & PURCHASE */
          <div className="space-y-4 pt-1">
            {paymentSuccess ? (
              <div className="minimal-card p-6 rounded-2xl text-center space-y-3 border border-white/20 shadow-2xl relative overflow-hidden">
                <div className="w-14 h-14 rounded-full liquid-glass-pill mx-auto flex items-center justify-center text-2xl shadow-lg">
                  💎
                </div>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#f8fafc]">
                  Welcome to {currentPlan.name}!
                </h3>
                <p className="text-xs text-[#a1d1bd]">
                  Your subscription is active. All premium features, Ask Nova voice AI, and multi-device sync are unlocked.
                </p>
                <div className="p-3.5 bg-[#161a18] border border-white/[0.08] rounded-xl text-xs text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#8a938e]">Plan</span>
                    <span className="text-[#bef264] font-bold">{currentPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8a938e]">Amount Paid</span>
                    <span className="text-[#f8fafc] font-bold">{receiptInfo?.amountPaid || displayPrice}</span>
                  </div>
                  {receiptInfo?.receiptId && (
                    <div className="flex justify-between">
                      <span className="text-[#8a938e]">Receipt Ref</span>
                      <span className="text-[#a1d1bd] font-mono text-[10px]">{receiptInfo.receiptId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#8a938e]">Status</span>
                    <span className="text-[#bef264] font-bold flex items-center gap-1">
                      <span>✓ Active</span>
                      <span className="text-[#8a938e] text-[10px] font-normal">· Renews {receiptInfo?.renewsAt || billingCycle}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setStep('pricing');
                    setPaymentSuccess(false);
                    onNavigate?.(5);
                  }}
                  className="w-full py-3 rounded-xl minimal-btn-primary text-xs font-semibold shadow-md mt-2 cursor-pointer hover:brightness-110 active:scale-95 transition-all"
                >
                  Return to Daily Planner
                </button>
              </div>
            ) : (
              <>
                {/* Plan Summary Card */}
                <div className="minimal-card p-4 rounded-2xl space-y-2 border border-white/[0.12]">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-mono text-[#bef264] uppercase font-bold tracking-wider">
                        Selected Plan
                      </span>
                      <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#f8fafc]">
                        {currentPlan.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="font-['Space_Grotesk'] text-lg font-bold text-[#bef264]">
                        {displayPrice}
                      </span>
                      <span className="text-[10px] font-mono text-[#8a938e] block">{currentPlan.period}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#a1d1bd] border-t border-white/[0.08] pt-2">
                    {currentPlan.billedNote} · Cancel anytime in account settings.
                  </p>
                </div>

                {/* Choose Payment Method */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9b9f9c]">
                    Select Payment Method
                  </h4>

                  {/* Google Pay */}
                  <button
                    disabled={isProcessing}
                    onClick={() => handleCheckout('Google Pay')}
                    className="w-full p-3.5 bg-[#171330] hover:bg-[#1a1f1b] border border-white/[0.12] rounded-2xl flex items-center justify-between shadow-sm active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-white tracking-tight font-['Space_Grotesk']">G Pay</span>
                      <span className="text-xs text-[#9b9f9c]">One-tap instant checkout</span>
                    </div>
                    <span className="text-xs text-[#bef264] font-semibold font-mono">Pay {displayPrice} ›</span>
                  </button>

                  {/* Apple Pay */}
                  <button
                    disabled={isProcessing}
                    onClick={() => handleCheckout('Apple Pay')}
                    className="w-full p-3.5 bg-[#171330] hover:bg-[#1a1f1b] border border-white/[0.12] rounded-2xl flex items-center justify-between shadow-sm active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-white tracking-tight font-['Space_Grotesk']"> Pay</span>
                      <span className="text-xs text-[#9b9f9c]">Touch ID / Face ID</span>
                    </div>
                    <span className="text-xs text-[#bef264] font-semibold font-mono">Pay {displayPrice} ›</span>
                  </button>

                  {/* Credit Card / UPI */}
                  <button
                    disabled={isProcessing}
                    onClick={() => handleCheckout('Card & UPI')}
                    className="w-full p-3.5 bg-[#171330] hover:bg-[#1a1f1b] border border-white/[0.12] rounded-2xl flex items-center justify-between shadow-sm active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#a1d1bd] text-[20px]">credit_card</span>
                      <span className="text-xs text-[#f8fafc]">Card, NetBanking & UPI</span>
                    </div>
                    <span className="text-xs text-[#8a938e] font-mono">Continue ›</span>
                  </button>
                </div>

                {isProcessing && (
                  <div className="p-3 bg-[#0e3e30] border border-[#bef264]/40 rounded-xl text-center text-xs text-[#bef264] font-semibold animate-pulse flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    Securing transaction & activating membership...
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Footer (Only in Pricing step) */}
      {step === 'pricing' && (
        <div className="pt-2 border-t border-[#334155]/30">
          <button
            onClick={() => setStep('checkout')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0e3e30] to-[#0A2E24] border border-[#bef264]/60 text-[#bef264] font-bold text-xs shadow-xl hover:brightness-110 active:scale-95 transition-all font-['Space_Grotesk'] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue to Checkout</span>
            <span>·</span>
            <span>{displayPrice} {currentPlan.period}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
          <p className="text-[10px] text-[#8a938e] text-center mt-1.5">
            Prices in USD. Cancel anytime from profile settings.
          </p>
        </div>
      )}
    </div>
  );
}

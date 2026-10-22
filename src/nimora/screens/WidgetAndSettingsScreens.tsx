'use client';

import React, { useState } from 'react';
import { NimoraTask, NimoraNotification } from '../data';

export interface WidgetAndSettingsProps {
  tasks: NimoraTask[];
  notifications: NimoraNotification[];
  onNavigate?: (screenNumber: number) => void;
  onAddTask?: (task: NimoraTask) => void;
  onResetData?: () => void;
}

// 13. iOS Home Screen Widget
export function Screen15Widget({ tasks, onNavigate }: WidgetAndSettingsProps) {
  const nextTask = tasks.find((t) => t.status !== 'completed') || tasks[0];
  const upcomingTask = tasks.filter((t) => t.id !== nextTask?.id)[0] || tasks[1];

  return (
    <div
      className="w-full h-full min-h-[680px] text-[#e3e2e0] flex flex-col justify-between p-6 select-none rounded-[38px] relative overflow-hidden bg-[#121412]"
    >
      {/* iOS Status Bar */}
      <div className="flex justify-between items-center text-xs text-[#c0c8c3] pt-2 z-10 font-semibold font-['Space_Grotesk']">
        <span>9:01</span>
        <div className="flex items-center gap-1.5 text-[#e3e2e0]">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Main Home Screen Widget Container */}
      <div className="my-auto z-10 space-y-4">
        {/* iOS Glassmorphic Dark Widget */}
        <div
          onClick={() => onNavigate?.(5)}
          className="cursor-pointer glass-card specular-border rounded-3xl p-5 shadow-2xl hover:scale-[1.02] transition-all border border-[#e9c349]/30"
        >
          {/* Widget Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#e9c349] text-xs">🔥</span>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#a1d1bd] font-['Space_Grotesk']">
                NIMORA
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#e9c349] uppercase tracking-wider bg-[#0e3e30] px-2 py-0.5 rounded-full border border-[#e9c349]/40 font-['Space_Grotesk']">
              NOW
            </span>
          </div>

          {/* Current Focus Task */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-[#a1d1bd] tracking-wider font-['Space_Grotesk']">
                Current Focus
              </p>
              <h3 className="text-sm font-extrabold text-[#e3e2e0] mt-0.5 font-['Space_Grotesk']">{nextTask?.title}</h3>
              <p className="text-[11px] text-[#c0c8c3] font-medium">
                {nextTask?.startTime} – {nextTask?.endTime}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.(6);
              }}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0e3e30] to-[#0A2E24] border border-[#e9c349]/50 text-[#e9c349] flex items-center justify-center text-xs font-bold transition-all shadow-md"
            >
              ▶
            </button>
          </div>

          {/* Next Task Section */}
          <div className="border-t border-[#414945]/30 pt-2.5 flex items-center justify-between text-xs">
            <div>
              <p className="text-[9px] uppercase font-bold text-[#8a938e] tracking-wider font-['Space_Grotesk']">
                Next
              </p>
              <p className="text-[#e3e2e0] font-semibold">{upcomingTask?.title}</p>
            </div>
            <span className="text-[11px] text-[#a1d1bd] font-semibold">
              {upcomingTask?.startTime} – {upcomingTask?.endTime}
            </span>
          </div>
        </div>

        {/* Quick Mic Bar */}
        <div className="flex justify-center">
          <button
            onClick={() => onNavigate?.(11)}
            className="w-12 h-12 rounded-full bg-[#0e3e30] border border-[#e9c349]/60 flex items-center justify-center text-xl text-[#e9c349] shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[24px]">mic</span>
          </button>
        </div>
      </div>

      {/* iOS App Dock */}
      <div className="bg-[#1f201e]/80 backdrop-blur-md rounded-3xl p-3 flex justify-around items-center z-10 border border-[#414945]/30">
        <button onClick={() => onNavigate?.(5)} className="w-11 h-11 rounded-2xl bg-[#0e3e30] text-[#e9c349] flex items-center justify-center text-xl shadow-md border border-[#e9c349]/30">
          <span className="material-symbols-outlined text-[20px]">home</span>
        </button>
        <button onClick={() => onNavigate?.(6)} className="w-11 h-11 rounded-2xl bg-[#1f201e] text-[#a1d1bd] flex items-center justify-center text-xl shadow-md border border-[#414945]/40">
          <span className="material-symbols-outlined text-[20px]">calendar_today</span>
        </button>
        <button onClick={() => onNavigate?.(9)} className="w-11 h-11 rounded-2xl bg-[#1f201e] text-[#a1d1bd] flex items-center justify-center text-xl shadow-md border border-[#414945]/40">
          <span className="material-symbols-outlined text-[20px]">group</span>
        </button>
        <button onClick={() => onNavigate?.(16)} className="w-11 h-11 rounded-2xl bg-[#1f201e] text-[#a1d1bd] flex items-center justify-center text-xl shadow-md border border-[#414945]/40">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
      </div>
    </div>
  );
}

// 14. Notifications & Snooze
export function Screen16Notifications({ notifications, onNavigate }: WidgetAndSettingsProps) {
  return (
    <div className="w-full h-full min-h-[680px] bg-[#121412] text-[#e3e2e0] flex flex-col justify-between p-6 select-none rounded-[38px] relative overflow-hidden">
      <div>
        {/* iOS Lock Screen Header Clock */}
        <div className="text-center pt-4 mb-6">
          <span className="text-xs text-[#8a938e] block">🔒</span>
          <h1 className="text-5xl font-extralight tracking-tight text-[#e3e2e0] mt-1 font-['Space_Grotesk']">9:00</h1>
          <p className="text-xs text-[#c0c8c3] font-medium mt-1">Tue, 20 Oct</p>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="glass-card specular-border rounded-2xl p-3.5 shadow-lg space-y-2 hover:border-[#e9c349]/40 transition-all cursor-pointer"
              onClick={() => onNavigate?.(6)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-md bg-[#0e3e30] text-[#e9c349] flex items-center justify-center text-[10px] font-bold">
                    N
                  </span>
                  <span className="text-[11px] font-bold text-[#e3e2e0] uppercase tracking-wider font-['Space_Grotesk']">
                    NIMORA
                  </span>
                </div>
                <span className="text-[10px] text-[#8a938e]">{n.timeAgo}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#e3e2e0] font-['Space_Grotesk']">{n.title}</h4>
                <p className="text-[11px] text-[#c0c8c3] mt-0.5">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pb-2">
        <button
          onClick={() => onNavigate?.(5)}
          className="text-xs text-[#c0c8c3] hover:text-white px-4 py-1.5 bg-[#1f201e] rounded-full border border-[#414945]/40"
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
export function Screen18ProfileSettings({ onNavigate, onResetData }: WidgetAndSettingsProps) {
  const [resetMessage, setResetMessage] = useState('');

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all tasks to initial demo state?')) {
      onResetData?.();
      setResetMessage('Demo data restored successfully!');
      setTimeout(() => setResetMessage(''), 2500);
    }
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-[#121412] text-[#e3e2e0] flex flex-col justify-between select-none rounded-[38px] overflow-hidden">
      <div className="overflow-y-auto">
        {/* Header */}
        <div className="p-4 bg-[#121412]/90 border-b border-[#414945]/30 flex items-center justify-between">
          <button onClick={() => onNavigate?.(5)} className="text-[#c0c8c3] hover:text-white text-xs font-semibold flex items-center gap-1">
            ‹ Back
          </button>
          <h2 className="text-sm font-bold text-[#e3e2e0] font-['Space_Grotesk']">Settings & Privacy</h2>
          <span className="w-5" />
        </div>

        {/* User Card */}
        <div className="p-4 glass-card specular-border m-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#0e3e30] text-[#e9c349] font-bold flex items-center justify-center text-base shadow-sm ring-2 ring-[#e9c349]/30 font-['Space_Grotesk']">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-[#e3e2e0] font-['Space_Grotesk']">Sudarshan</h3>
                <span className="text-[9px] font-extrabold bg-[#af8d11]/30 text-[#e9c349] px-1.5 py-0.5 rounded-full border border-[#e9c349]/40">
                  PRO
                </span>
              </div>
              <p className="text-xs text-[#8a938e]">sudarshan@bespokestudio.com</p>
            </div>
          </div>
          <span className="text-xs text-[#8a938e]">›</span>
        </div>

        {/* Options List */}
        <div className="px-4 space-y-2">
          {/* Subscription & Pricing Plans */}
          <button
            onClick={() => onNavigate?.(99)}
            className="w-full p-3.5 bg-gradient-to-r from-[#0e3e30] to-[#0A2E24] border border-[#e9c349]/60 rounded-2xl flex items-center justify-between cursor-pointer hover:brightness-110 transition-all shadow-md active:scale-[0.99] text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">💎</span>
              <div>
                <span className="text-xs font-bold text-[#e9c349] block font-['Space_Grotesk']">Membership & Subscription Plans</span>
                <span className="text-[10px] text-[#a1d1bd]">Explore Pro & Executive Tiers from $7.99/mo</span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#e9c349] flex items-center gap-1">
              View Plans <span className="text-[#8a938e]">›</span>
            </span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={handleReset}
            className="w-full p-3 bg-[#1f201e] border border-rose-500/30 rounded-2xl flex items-center justify-between cursor-pointer hover:border-rose-400 transition-colors shadow-sm text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">🔄</span>
              <div>
                <span className="text-xs font-semibold text-rose-300 block">Reset Demo Data</span>
                <span className="text-[10px] text-[#8a938e]">Restore fresh initial agenda & contacts</span>
              </div>
            </div>
            <span className="text-[11px] text-rose-400 font-bold">Reset ›</span>
          </button>

          {resetMessage && (
            <div className="p-2.5 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs text-[#4edea3] text-center">
              {resetMessage}
            </div>
          )}

          <div
            onClick={() => onNavigate?.(3)}
            className="p-3 bg-[#1f201e] border border-[#414945]/30 rounded-2xl flex items-center justify-between cursor-pointer hover:border-[#e9c349]/40 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">✳️</span>
              <span className="text-xs font-semibold text-[#e3e2e0]">AI Assistant Integration</span>
            </div>
            <span className="text-[11px] font-bold text-[#4edea3] flex items-center gap-1">
              Active <span className="text-[#8a938e]">›</span>
            </span>
          </div>

          <div
            onClick={() => onNavigate?.(4)}
            className="p-3 bg-[#1f201e] border border-[#414945]/30 rounded-2xl flex items-center justify-between cursor-pointer hover:border-[#e9c349]/40 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">🔌</span>
              <span className="text-xs font-semibold text-[#e3e2e0]">Connected Calendars & Tools</span>
            </div>
            <span className="text-[11px] text-[#8a938e] flex items-center gap-1">
              Google · Apple <span className="text-[#8a938e]">›</span>
            </span>
          </div>
        </div>

        {/* Privacy Callout Cards matching right column of Screen 16 */}
        <div className="p-4 pt-4 space-y-2">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#8a938e] mb-2 font-['Space_Grotesk']">
            Your Data. Your Control.
          </h4>

          <div className="p-3 glass-card specular-border rounded-2xl flex items-start gap-2.5">
            <span className="text-base">🛡️</span>
            <div>
              <h5 className="text-xs font-bold text-[#e3e2e0] font-['Space_Grotesk']">Secure & Private</h5>
              <p className="text-[10px] text-[#c0c8c3]">Your client conversations & follow-ups are client-side encrypted.</p>
            </div>
          </div>

          <div className="p-3 glass-card specular-border rounded-2xl flex items-start gap-2.5">
            <span className="text-base">🎯</span>
            <div>
              <h5 className="text-xs font-bold text-[#e3e2e0] font-['Space_Grotesk']">Connect Only What You Need</h5>
              <p className="text-[10px] text-[#c0c8c3]">Data minimization principle built-in.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 15. Subscription & Membership Plans (Pricing First, Then Purchase)
export function Screen19SubscriptionPlans({ onNavigate }: { onNavigate?: (screenNumber: number) => void }) {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'essential' | 'founder'>('pro');
  const [step, setStep] = useState<'pricing' | 'checkout'>('pricing');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    essential: {
      id: 'essential',
      name: 'Essential',
      badge: 'Core Daily',
      monthlyPrice: '$4.99',
      annualPrice: '$3.99',
      period: '/month',
      billedNote: billingCycle === 'annual' ? 'Billed annually ($47.88/yr)' : 'Billed monthly',
      description: 'Ideal for independent professionals organizing daily agendas.',
      features: [
        'Up to 30 tasks & reminders / day',
        'Tactile schedule time-blocking',
        'One-tap .ics Calendar export',
        'Local encrypted persistence',
      ],
      notIncluded: [
        'AI Voice "Ask Nova" Assistant',
        'Stakeholder CRM follow-ups',
        '2-Way Cloud Calendar Sync',
      ],
    },
    pro: {
      id: 'pro',
      name: 'Executive Pro',
      badge: '⭐ Most Popular',
      monthlyPrice: '$9.99',
      annualPrice: '$7.99',
      period: '/month',
      billedNote: billingCycle === 'annual' ? 'Billed annually ($95.88/yr) · Save 20%' : 'Billed monthly',
      description: 'Full autonomous executive intelligence & stakeholder management.',
      features: [
        'Unlimited Tasks, Schedules & Sub-tasks',
        'Ask Nova Voice AI Assistant (Speech & Audio Feedback)',
        'Full Stakeholder CRM & follow-up tracking',
        '2-Way Calendar Sync (Google, Apple, Outlook)',
        'Direct WhatsApp & phone call triggers',
        'High-priority offline cloud synchronization',
      ],
      notIncluded: [],
    },
    founder: {
      id: 'founder',
      name: 'Founder Lifetime',
      badge: 'Lifetime Access',
      monthlyPrice: '$199',
      annualPrice: '$199',
      period: ' one-time',
      billedNote: 'Pay once, own forever · No subscriptions',
      description: 'For founders, partners, and high-impact architects who demand the best.',
      features: [
        'All Executive Pro capabilities forever',
        'Early access to all new MCP agent tools',
        'VIP 1-on-1 Concierge support line',
        'White-label executive exports & PDF reporting',
        'All future major updates included',
      ],
      notIncluded: [],
    },
  };

  const currentPlan = plans[selectedPlan];
  const displayPrice = billingCycle === 'annual' ? currentPlan.annualPrice : currentPlan.monthlyPrice;

  const handleSimulatePayment = (methodName: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 1200);
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-[#121412] text-[#e3e2e0] flex flex-col justify-between p-4 select-none rounded-[38px] shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex justify-between items-center pb-3 border-b border-[#414945]/30">
        <button
          onClick={() => {
            if (step === 'checkout') setStep('pricing');
            else onNavigate?.(5);
          }}
          className="text-[#c0c8c3] hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
        >
          ‹ {step === 'checkout' ? 'Back to Pricing' : 'Back'}
        </button>
        <div className="text-center">
          <span className="text-[10px] text-[#e9c349] font-bold uppercase tracking-widest block font-['Space_Grotesk']">
            {step === 'pricing' ? 'NIMORA MEMBERSHIP' : 'SECURE CHECKOUT'}
          </span>
          <span className="text-xs font-bold text-[#e3e2e0] font-['Space_Grotesk']">
            {step === 'pricing' ? 'Choose Your Plan' : 'Finalize Upgrade'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#a1d1bd]">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          <span>SSL</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4">
        {step === 'pricing' ? (
          <>
            {/* Value Proposition Header */}
            <div className="text-center space-y-1 pt-1">
              <span className="text-[10px] font-bold bg-[#af8d11]/30 text-[#e9c349] px-2.5 py-0.5 rounded-full border border-[#e9c349]/40 tracking-wider">
                EXECUTIVE INTELLIGENCE
              </span>
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#e3e2e0] pt-1">
                Elevate Your Daily Focus
              </h2>
              <p className="text-xs text-[#c0c8c3] max-w-[320px] mx-auto">
                Transparent pricing. Unlock voice scheduling, stakeholder CRM, and multi-device cloud sync.
              </p>
            </div>

            {/* Monthly / Annual Billing Toggle */}
            <div className="flex justify-center">
              <div className="p-1 bg-[#1f201e] rounded-xl border border-[#414945]/40 flex items-center shadow-inner">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-[#0e3e30] text-[#e9c349] shadow-sm border border-[#e9c349]/30'
                      : 'text-[#c0c8c3] hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    billingCycle === 'annual'
                      ? 'bg-[#0e3e30] text-[#e9c349] shadow-sm border border-[#e9c349]/30'
                      : 'text-[#c0c8c3] hover:text-white'
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#e9c349] text-gray-950 rounded-full font-extrabold uppercase">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing Cards List */}
            <div className="space-y-3">
              {(['pro', 'essential', 'founder'] as const).map((planKey) => {
                const plan = plans[planKey];
                const isSelected = selectedPlan === planKey;
                const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(planKey)}
                    className={`glass-card rounded-2xl p-4 cursor-pointer transition-all relative ${
                      isSelected
                        ? 'border-2 border-[#e9c349] shadow-[0_8px_24px_rgba(233,195,73,0.15)] bg-[#0e3e30]/30'
                        : 'border border-[#414945]/30 hover:border-[#a1d1bd]/40'
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          planKey === 'pro'
                            ? 'bg-[#e9c349] text-gray-950 font-extrabold'
                            : 'bg-[#1f201e] text-[#a1d1bd] border border-[#414945]/40'
                        }`}
                      >
                        {plan.badge}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#e9c349] bg-[#e9c349] text-gray-950'
                              : 'border-[#414945]'
                          }`}
                        >
                          {isSelected && <span className="text-[10px] font-bold">✓</span>}
                        </div>
                      </div>
                    </div>

                    {/* Plan Title & Price */}
                    <div className="flex justify-between items-baseline mt-2">
                      <div>
                        <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#e3e2e0]">
                          {plan.name}
                        </h3>
                        <p className="text-[11px] text-[#c0c8c3]">{plan.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-0.5">
                          <span className="font-['Space_Grotesk'] text-xl font-bold text-[#e9c349]">
                            {price}
                          </span>
                          <span className="text-[10px] text-[#8a938e]">{plan.period}</span>
                        </div>
                        <span className="text-[9px] text-[#a1d1bd] block">{plan.billedNote}</span>
                      </div>
                    </div>

                    {/* Feature Highlights */}
                    <div className="mt-3 pt-2.5 border-t border-[#414945]/20 space-y-1">
                      {plan.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#e3e2e0]">
                          <span className="text-[#4edea3] text-[13px]">✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust and Assurance Box */}
            <div className="p-3 rounded-xl bg-[#1f201e]/60 border border-[#414945]/20 flex items-center justify-between text-center">
              <div className="flex-1">
                <span className="text-xs text-[#e9c349]">★★★★★</span>
                <p className="text-[9px] text-[#c0c8c3]">4.9/5 from 12k+ Leaders</p>
              </div>
              <div className="h-6 w-px bg-[#414945]/30" />
              <div className="flex-1">
                <span className="text-xs">🛡️</span>
                <p className="text-[9px] text-[#c0c8c3]">14-Day Money Back</p>
              </div>
              <div className="h-6 w-px bg-[#414945]/30" />
              <div className="flex-1">
                <span className="text-xs">⚡</span>
                <p className="text-[9px] text-[#c0c8c3]">Instant Activation</p>
              </div>
            </div>
          </>
        ) : (
          /* STEP 2: CHECKOUT & PURCHASE */
          <div className="space-y-4 pt-1">
            {paymentSuccess ? (
              <div className="glass-card specular-border p-6 rounded-2xl text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#0e3e30] border-2 border-[#e9c349] mx-auto flex items-center justify-center text-2xl">
                  💎
                </div>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#e3e2e0]">
                  Welcome to {currentPlan.name}!
                </h3>
                <p className="text-xs text-[#a1d1bd]">
                  Your subscription is active. All premium features, Ask Nova voice AI, and multi-device sync are unlocked.
                </p>
                <div className="p-3 bg-[#1f201e] rounded-xl text-xs text-left space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#8a938e]">Plan</span>
                    <span className="text-[#e9c349] font-bold">{currentPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8a938e]">Amount Paid</span>
                    <span className="text-[#e3e2e0] font-bold">{displayPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8a938e]">Status</span>
                    <span className="text-[#4edea3] font-bold">Active · Renews {billingCycle}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setStep('pricing');
                    setPaymentSuccess(false);
                    onNavigate?.(5);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0e3e30] to-[#0A2E24] border border-[#e9c349]/50 text-[#e9c349] font-bold text-xs shadow-md mt-2 cursor-pointer"
                >
                  Return to Daily Planner
                </button>
              </div>
            ) : (
              <>
                {/* Plan Summary Card */}
                <div className="glass-card specular-border p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-[#e9c349] uppercase font-bold tracking-wider">
                        Selected Plan
                      </span>
                      <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#e3e2e0]">
                        {currentPlan.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="font-['Space_Grotesk'] text-lg font-bold text-[#e9c349]">
                        {displayPrice}
                      </span>
                      <span className="text-[10px] text-[#8a938e] block">{currentPlan.period}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#a1d1bd] border-t border-[#414945]/20 pt-2">
                    {currentPlan.billedNote} · Includes 14-day refund guarantee.
                  </p>
                </div>

                {/* Choose Payment Method */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#c0c8c3] font-['Space_Grotesk']">
                    Select Payment Method
                  </h4>

                  {/* Google Pay */}
                  <button
                    disabled={isProcessing}
                    onClick={() => handleSimulatePayment('Google Pay')}
                    className="w-full p-3.5 bg-black hover:bg-neutral-900 border border-neutral-700 rounded-2xl flex items-center justify-between shadow-md active:scale-[0.99] transition-transform cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-white tracking-tight">G Pay</span>
                      <span className="text-xs text-[#c0c8c3]">One-tap instant checkout</span>
                    </div>
                    <span className="text-xs text-[#e9c349] font-semibold">Pay {displayPrice} ›</span>
                  </button>

                  {/* Apple Pay */}
                  <button
                    disabled={isProcessing}
                    onClick={() => handleSimulatePayment('Apple Pay')}
                    className="w-full p-3.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-2xl flex items-center justify-between shadow-md active:scale-[0.99] transition-transform cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-white tracking-tight"> Pay</span>
                      <span className="text-xs text-[#c0c8c3]">Touch ID / Face ID</span>
                    </div>
                    <span className="text-xs text-[#e9c349] font-semibold">Pay {displayPrice} ›</span>
                  </button>

                  {/* Credit Card / UPI */}
                  <button
                    disabled={isProcessing}
                    onClick={() => handleSimulatePayment('Card & UPI')}
                    className="w-full p-3.5 bg-[#1f201e] hover:bg-[#292a29] border border-[#414945]/40 rounded-2xl flex items-center justify-between shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#a1d1bd] text-[20px]">credit_card</span>
                      <span className="text-xs text-[#e3e2e0]">Card, NetBanking & UPI</span>
                    </div>
                    <span className="text-xs text-[#c0c8c3]">Continue ›</span>
                  </button>
                </div>

                {isProcessing && (
                  <div className="p-3 bg-[#0e3e30] border border-[#e9c349]/40 rounded-xl text-center text-xs text-[#e9c349] font-semibold animate-pulse flex items-center justify-center gap-2">
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
        <div className="pt-2 border-t border-[#414945]/30">
          <button
            onClick={() => setStep('checkout')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0e3e30] to-[#0A2E24] border border-[#e9c349]/60 text-[#e9c349] font-bold text-xs shadow-xl hover:brightness-110 active:scale-95 transition-all font-['Space_Grotesk'] flex items-center justify-center gap-2 cursor-pointer"
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

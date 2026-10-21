'use client';

import React, { useState } from 'react';

interface ScreenProps {
  onNavigate?: (screenNumber: number) => void;
}

// 1. Splash Screen
export function Screen01Splash({ onNavigate }: ScreenProps) {
  return (
    <div className="relative w-full h-full min-h-[680px] bg-gradient-to-b from-[#062017] via-[#0A3326] to-[#041610] text-white flex flex-col items-center justify-between p-8 select-none overflow-hidden rounded-[38px]">
      {/* Decorative ambient swirls */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      {/* Top minimal header */}
      <div className="w-full flex justify-between items-center text-xs text-emerald-200/60 pt-2">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center text-center my-auto">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#B38F24] p-[2px] shadow-2xl shadow-emerald-950/80">
            <div className="w-full h-full bg-[#07241A] rounded-[22px] flex items-center justify-center">
              {/* Gold Flame/Leaf Emblem */}
              <svg className="w-14 h-14 text-[#E6C665]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C9.5 5 7 8 7 12a5 5 0 0 0 10 0c0-4-2.5-7-5-10zm0 17a3 3 0 0 1-3-3c0-2.2 1.8-4.5 3-6.5 1.2 2 3 4.3 3 6.5a3 3 0 0 1-3 3z" />
              </svg>
            </div>
          </div>
          {/* Subtle glow ring */}
          <div className="absolute inset-0 rounded-3xl border border-[#D4AF37]/30 animate-ping opacity-20" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400">
          NIMORA
        </h1>
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/80 mt-2 font-medium">
          Your Day. Intelligently Organized.
        </p>
      </div>

      {/* Bottom action */}
      <div className="w-full pb-4">
        <button
          onClick={() => onNavigate?.(2)}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B89327] text-gray-950 font-bold text-sm shadow-lg shadow-amber-900/40 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Begin Experience</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

// 2. Onboarding
export function Screen02Onboarding({ onNavigate }: ScreenProps) {
  return (
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between p-7 select-none rounded-[38px]">
      <div className="w-full flex justify-between items-center text-xs text-gray-400 pt-2">
        <span>9:41</span>
        <span>•••</span>
      </div>

      {/* 3D Calendar Illustration Art */}
      <div className="my-auto flex flex-col items-center text-center">
        <div className="relative w-44 h-44 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-100/60 rounded-full blur-2xl" />
          <div className="relative w-36 h-36 bg-white rounded-3xl shadow-xl border border-emerald-50 flex flex-col p-4 transform -rotate-3 hover:rotate-0 transition-transform">
            <div className="w-full h-5 bg-emerald-700 rounded-t-xl mb-3 flex items-center justify-around px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
            </div>
            <div className="grid grid-cols-4 gap-1.5 my-auto">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`h-4 rounded ${
                    i === 5
                      ? 'bg-emerald-600'
                      : i === 7
                      ? 'bg-amber-400'
                      : 'bg-emerald-100/70'
                  }`}
                />
              ))}
            </div>
            <div className="mt-2 text-right">
              <span className="text-[10px] font-bold text-emerald-800">20 OCT</span>
            </div>
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-2 -right-1 bg-emerald-800 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-emerald-700 flex items-center gap-1">
            <span>✓</span> Done
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 leading-tight max-w-[260px]">
          Turn your busy day into meaningful progress.
        </h2>

        {/* Feature checklist */}
        <div className="mt-6 space-y-3 w-full max-w-[250px] text-left">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">✓</span>
            <span>Plan smarter</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">✓</span>
            <span>Stay focused</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">✓</span>
            <span>Never miss a follow-up</span>
          </div>
        </div>
      </div>

      <div className="w-full pb-4">
        <button
          onClick={() => onNavigate?.(3)}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#0F382C] text-white font-semibold text-sm shadow-md hover:bg-[#13493A] active:scale-[0.98] transition-all"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

// 3. Create Account
export function Screen03CreateAccount({ onNavigate }: ScreenProps) {
  const [name, setName] = useState('Sudarshan');
  const [email, setEmail] = useState('sudarshan@example.com');
  const [password, setPassword] = useState('••••••••••••');

  return (
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between p-7 select-none rounded-[38px]">
      <div>
        <div className="w-full flex justify-between items-center text-xs text-gray-400 pt-2 mb-6">
          <button onClick={() => onNavigate?.(2)} className="text-gray-600 hover:text-gray-900 font-medium">← Back</button>
          <span>Step 1 of 4</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
        <p className="text-xs text-gray-500 mt-1">Start organizing your day with NIMORA</p>

        {/* Inputs */}
        <div className="mt-6 space-y-3.5">
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Full Name</label>
            <div className="flex items-center border border-gray-200 bg-white rounded-xl px-3.5 py-2.5 focus-within:border-emerald-600 transition-colors shadow-sm">
              <span className="text-gray-400 mr-2.5 text-sm">👤</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm outline-none bg-transparent text-gray-900"
                placeholder="Full Name"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Email Address</label>
            <div className="flex items-center border border-gray-200 bg-white rounded-xl px-3.5 py-2.5 focus-within:border-emerald-600 transition-colors shadow-sm">
              <span className="text-gray-400 mr-2.5 text-sm">✉️</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm outline-none bg-transparent text-gray-900"
                placeholder="Email Address"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Password</label>
            <div className="flex items-center border border-gray-200 bg-white rounded-xl px-3.5 py-2.5 focus-within:border-emerald-600 transition-colors shadow-sm">
              <span className="text-gray-400 mr-2.5 text-sm">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm outline-none bg-transparent text-gray-900"
                placeholder="Password"
              />
              <span className="text-gray-400 text-xs">👁️</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate?.(4)}
            className="w-full mt-4 py-3.5 rounded-2xl bg-[#0F382C] text-white font-semibold text-sm shadow-md hover:bg-[#13493A] transition-all"
          >
            Create Account
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <span className="relative bg-[#F9F8F5] px-3 text-[11px] text-gray-400">or continue with</span>
        </div>

        {/* SSO Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button className="flex items-center justify-center py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm text-sm">
            🍏
          </button>
          <button className="flex items-center justify-center py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm text-sm font-bold text-red-500">
            G
          </button>
          <button className="flex items-center justify-center py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm text-xs">
            🪟
          </button>
        </div>
      </div>

      <p className="text-[10px] text-center text-gray-400 pb-2">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}

// 4. Choose AI Assistant
export function Screen04ChooseAI({ onNavigate }: ScreenProps) {
  const [selectedAI, setSelectedAI] = useState<'claude' | 'chatgpt' | 'gemini'>('claude');

  return (
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between p-7 select-none rounded-[38px]">
      <div>
        <div className="w-full flex justify-between items-center text-xs text-gray-400 pt-2 mb-6">
          <button onClick={() => onNavigate?.(3)} className="text-gray-600 hover:text-gray-900 font-medium">← Back</button>
          <span>Step 2 of 4</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Choose Your AI Assistant</h2>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Use your favourite AI to help plan your day inside NIMORA.
        </p>

        {/* Cards */}
        <div className="mt-8 space-y-3.5">
          {/* Claude Card */}
          <div
            onClick={() => setSelectedAI('claude')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between shadow-sm ${
              selectedAI === 'claude'
                ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/20'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl">
                ✳️
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Claude</h3>
                <p className="text-[11px] text-gray-400">Anthropic Claude 3.5 & 3.7</p>
              </div>
            </div>
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              {selectedAI === 'claude' && <span>Connected ✓</span>}
              <span className="text-gray-300">›</span>
            </div>
          </div>

          {/* ChatGPT Card */}
          <div
            onClick={() => setSelectedAI('chatgpt')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between shadow-sm ${
              selectedAI === 'chatgpt'
                ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/20'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-xl">
                🌀
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">ChatGPT</h3>
                <p className="text-[11px] text-gray-400">OpenAI GPT-4o & o1</p>
              </div>
            </div>
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              {selectedAI === 'chatgpt' && <span>Connected ✓</span>}
              <span className="text-gray-300">›</span>
            </div>
          </div>

          {/* Gemini Card */}
          <div
            onClick={() => setSelectedAI('gemini')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between shadow-sm ${
              selectedAI === 'gemini'
                ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/20'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                ✨
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Gemini</h3>
                <p className="text-[11px] text-gray-400">Google Gemini 2.0 Flash</p>
              </div>
            </div>
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              {selectedAI === 'gemini' && <span>Connected ✓</span>}
              <span className="text-gray-300">›</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full pb-4">
        <p className="text-center text-[11px] text-gray-400 mb-3">You can change this anytime.</p>
        <button
          onClick={() => onNavigate?.(5)}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#0F382C] text-white font-semibold text-sm shadow-md hover:bg-[#13493A] transition-all"
        >
          Confirm Assistant
        </button>
      </div>
    </div>
  );
}

// 5. Connect Your Apps
export function Screen05ConnectApps({ onNavigate }: ScreenProps) {
  const [apps, setApps] = useState({
    gcal: true,
    appleCal: true,
    contacts: true,
    whatsapp: true,
    email: false,
    notion: false,
  });

  const toggle = (key: keyof typeof apps) => {
    setApps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between p-7 select-none rounded-[38px]">
      <div>
        <div className="w-full flex justify-between items-center text-xs text-gray-400 pt-2 mb-6">
          <button onClick={() => onNavigate?.(4)} className="text-gray-600 hover:text-gray-900 font-medium">← Back</button>
          <span>Step 3 of 4</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Connect Your Apps</h2>
        <p className="text-xs text-gray-500 mt-1">
          Bring your calendar, contacts and work tools together.
        </p>

        <div className="mt-6 space-y-3">
          {[
            { id: 'gcal', name: 'Google Calendar', icon: '📅', optional: false },
            { id: 'appleCal', name: 'Apple Calendar', icon: '📆', optional: false },
            { id: 'contacts', name: 'Contacts', icon: '👥', optional: false },
            { id: 'whatsapp', name: 'WhatsApp (Click to Chat)', icon: '💬', optional: false },
            { id: 'email', name: 'Email', icon: '✉️', optional: true },
            { id: 'notion', name: 'Notion', icon: '📓', optional: true },
          ].map((app) => {
            const enabled = apps[app.id as keyof typeof apps];
            return (
              <div
                key={app.id}
                onClick={() => toggle(app.id as keyof typeof apps)}
                className="cursor-pointer p-3.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{app.icon}</span>
                  <div>
                    <span className="text-sm font-medium text-gray-800">{app.name}</span>
                    {app.optional && <span className="text-[10px] text-gray-400 ml-1.5">(Optional)</span>}
                  </div>
                </div>
                {/* Switch toggle */}
                <div
                  className={`w-11 h-6 flex items-center rounded-full p-1 duration-200 ${
                    enabled ? 'bg-emerald-600 justify-end' : 'bg-gray-200 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full pb-4">
        <button
          onClick={() => onNavigate?.(6)}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#0F382C] text-white font-semibold text-sm shadow-md hover:bg-[#13493A] transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// 6. Set Preferences
export function Screen06SetPreferences({ onNavigate }: ScreenProps) {
  return (
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between p-7 select-none rounded-[38px]">
      <div>
        <div className="w-full flex justify-between items-center text-xs text-gray-400 pt-2 mb-6">
          <button onClick={() => onNavigate?.(5)} className="text-gray-600 hover:text-gray-900 font-medium">← Back</button>
          <span>Step 4 of 4</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Set Your Preferences</h2>
        <p className="text-xs text-gray-500 mt-1">Help NIMORA plan better for you.</p>

        <div className="mt-6 space-y-3">
          <div className="p-3.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">⏰</span>
              <span className="text-sm font-medium text-gray-800">Work Hours</span>
            </div>
            <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
              9:00 AM – 6:00 PM <span className="text-gray-300">›</span>
            </span>
          </div>

          <div className="p-3.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">⏱</span>
              <span className="text-sm font-medium text-gray-800">Default Task Duration</span>
            </div>
            <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
              30 minutes <span className="text-gray-300">›</span>
            </span>
          </div>

          <div className="p-3.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">☕</span>
              <span className="text-sm font-medium text-gray-800">Break Time</span>
            </div>
            <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
              10 mins / hour <span className="text-gray-300">›</span>
            </span>
          </div>

          <div className="p-3.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">🌐</span>
              <span className="text-sm font-medium text-gray-800">Timezone</span>
            </div>
            <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
              Asia/Kolkata (IST) <span className="text-gray-300">›</span>
            </span>
          </div>

          <div className="p-3.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">🔔</span>
              <span className="text-sm font-medium text-gray-800">Notification Preferences</span>
            </div>
            <span className="text-xs text-gray-400">›</span>
          </div>
        </div>
      </div>

      <div className="w-full pb-4">
        <button
          onClick={() => onNavigate?.(7)}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#0F382C] text-white font-semibold text-sm shadow-md hover:bg-[#13493A] transition-all"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

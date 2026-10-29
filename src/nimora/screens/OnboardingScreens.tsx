'use client';

import React, { useState } from 'react';

interface ScreenProps {
  onNavigate?: (screenNumber: number) => void;
}

// 1. Splash & Welcome
export function Screen01Splash({ onNavigate }: ScreenProps) {
  return (
    <div className="relative w-full h-full min-h-[680px] bg-gradient-to-b from-[#062017] via-[#0A3326] to-[#041610] text-white flex flex-col items-center justify-between p-8 select-none overflow-hidden rounded-[38px]">
      {/* Decorative ambient water-bubble swirls */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 -right-16 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-4 w-32 h-32 rounded-full bg-teal-300/10 blur-xl pointer-events-none" />

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center text-center my-auto z-10">
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
          <div className="absolute inset-0 rounded-3xl border border-[#D4AF37]/40 animate-ping opacity-25" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-[0.2em] text-[#F3E5AB] font-['Space_Grotesk']">
          NIMORA
        </h1>
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/90 mt-2 font-medium">
          Your Day. Intelligently Organized.
        </p>
      </div>

      {/* Bottom action */}
      <div className="w-full pb-4 z-10">
        <button
          onClick={() => onNavigate?.(2)}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B89327] text-gray-950 font-bold text-sm shadow-lg shadow-amber-900/40 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Get Started</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

// 2. Account Setup & Onboarding (Dual View)
export function Screen02Onboarding({ onNavigate }: ScreenProps) {
  const [subView, setSubView] = useState<'welcome' | 'signup'>('welcome');
  const [name, setName] = useState('Sudarshan');
  const [email, setEmail] = useState('sudarshan@example.com');
  const [password, setPassword] = useState('••••••••••••');

  return (
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between p-6 select-none rounded-[38px]">
      {/* Top Bar */}
      <div>
        <div className="w-full flex justify-between items-center text-xs text-gray-400 pt-2 mb-4">
          <button
            onClick={() => {
              if (subView === 'signup') setSubView('welcome');
              else onNavigate?.(1);
            }}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back
          </button>
          <div className="flex gap-1">
            <button
              onClick={() => setSubView('welcome')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                subView === 'welcome' ? 'bg-emerald-800 text-white' : 'text-gray-400'
              }`}
            >
              Intro
            </button>
            <button
              onClick={() => setSubView('signup')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                subView === 'signup' ? 'bg-emerald-800 text-white' : 'text-gray-400'
              }`}
            >
              Account
            </button>
          </div>
        </div>

        {subView === 'welcome' ? (
          /* Welcome View */
          <div className="flex flex-col items-center text-center my-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0F382C] flex items-center justify-center mb-4 text-amber-200 text-2xl shadow-md">
              <svg className="w-9 h-9 text-[#E6C665]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C9.5 5 7 8 7 12a5 5 0 0 0 10 0c0-4-2.5-7-5-10zm0 17a3 3 0 0 1-3-3c0-2.2 1.8-4.5 3-6.5 1.2 2 3 4.3 3 6.5a3 3 0 0 1-3 3z" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest text-emerald-800 font-bold mb-1">
              Welcome to
            </p>
            <h2 className="text-3xl font-extrabold tracking-wider text-gray-900 mb-6">NIMORA</h2>

            {/* Checklist */}
            <div className="space-y-3.5 w-full max-w-[260px] text-left">
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-700 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">✓</span>
                <span>Plan smarter</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-700 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">✓</span>
                <span>Stay focused</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-700 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">✓</span>
                <span>Manage follow-ups</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-700 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">✓</span>
                <span>Work and life in balance</span>
              </div>
            </div>
          </div>
        ) : (
          /* Sign Up View */
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create Your Account</h2>
            <p className="text-xs text-gray-500 mt-1">Get started in seconds</p>

            <div className="mt-5 space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
                <div className="flex items-center border border-gray-200 bg-white rounded-xl px-3 py-2 shadow-sm">
                  <span className="text-gray-400 mr-2 text-xs">👤</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs outline-none bg-transparent text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
                <div className="flex items-center border border-gray-200 bg-white rounded-xl px-3 py-2 shadow-sm">
                  <span className="text-gray-400 mr-2 text-xs">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs outline-none bg-transparent text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Password</label>
                <div className="flex items-center border border-gray-200 bg-white rounded-xl px-3 py-2 shadow-sm">
                  <span className="text-gray-400 mr-2 text-xs">🔒</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs outline-none bg-transparent text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <button className="flex items-center justify-center py-2 bg-white border border-gray-200 rounded-xl text-xs hover:bg-gray-50">🍏</button>
                <button className="flex items-center justify-center py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-red-500 hover:bg-gray-50">G</button>
                <button className="flex items-center justify-center py-2 bg-white border border-gray-200 rounded-xl text-xs hover:bg-gray-50">🪟</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full pb-2">
        {subView === 'welcome' ? (
          <button
            onClick={() => setSubView('signup')}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#0F382C] text-white font-semibold text-sm shadow-md hover:bg-[#13493A] transition-all"
          >
            Get Started
          </button>
        ) : (
          <button
            onClick={() => onNavigate?.(3)}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#0F382C] text-white font-semibold text-sm shadow-md hover:bg-[#13493A] transition-all"
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  );
}

// 3. Choose Your AI Assistant
export function Screen04ChooseAI({ onNavigate }: ScreenProps) {
  const [selectedAI, setSelectedAI] = useState<'claude' | 'chatgpt' | 'gemini'>('claude');

  return (
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between p-7 select-none rounded-[38px]">
      <div>
        <div className="w-full flex justify-between items-center text-xs text-gray-400 pt-2 mb-6">
          <button onClick={() => onNavigate?.(2)} className="text-gray-600 hover:text-gray-900 font-medium">← Back</button>
          <span>Screen 3 of 16</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Choose Your AI Assistant</h2>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Use your favourite AI to help plan, organize and manage your tasks.
        </p>

        {/* AI Cards */}
        <div className="mt-8 space-y-3.5">
          {/* Claude */}
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
                <p className="text-[11px] text-emerald-700 font-medium">Available</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700">›</span>
          </div>

          {/* ChatGPT */}
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
                <p className="text-[11px] text-emerald-700 font-medium">Available</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700">›</span>
          </div>

          {/* Gemini */}
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
                <p className="text-[10px] text-gray-400">Available (Region dependent)</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700">›</span>
          </div>
        </div>
      </div>

      <div className="w-full pb-4">
        <button
          onClick={() => onNavigate?.(4)}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#0F382C] text-white font-semibold text-sm shadow-md hover:bg-[#13493A] transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// 4. Connect Your Apps
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
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between p-6 select-none rounded-[38px] relative overflow-hidden">
      <div>
        <div className="w-full flex justify-between items-center text-xs text-gray-400 pt-2 mb-4">
          <button onClick={() => onNavigate?.(3)} className="text-gray-600 hover:text-gray-900 font-medium">← Back</button>
          <span>Screen 4 of 16</span>
        </div>

        <h2 className="text-xl font-bold text-gray-900">Connect Your Apps</h2>
        <p className="text-xs text-gray-500 mt-1">
          Bring your calendar, contacts and work tools together.
        </p>

        <div className="mt-5 space-y-2.5">
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
                className="cursor-pointer p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{app.icon}</span>
                  <div>
                    <span className="text-xs font-medium text-gray-800">{app.name}</span>
                    {app.optional && <span className="text-[10px] text-gray-400 ml-1">(Optional)</span>}
                  </div>
                </div>
                <div
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 duration-200 ${
                    enabled ? 'bg-emerald-600 justify-end' : 'bg-gray-200 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full pb-2">
        <button
          onClick={() => onNavigate?.(5)}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#0F382C] text-white font-semibold text-sm shadow-md hover:bg-[#13493A] transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  INITIAL_CONTACTS,
  INITIAL_TASKS,
  INITIAL_AI_SUGGESTIONS,
  INITIAL_NOTIFICATIONS,
  NimoraTask,
  Contact,
} from '@/nimora/data';

import {
  Screen01Splash,
  Screen02Onboarding,
  Screen03CreateAccount,
  Screen04ChooseAI,
  Screen05ConnectApps,
  Screen06SetPreferences,
} from '@/nimora/screens/OnboardingScreens';

import {
  Screen07HomeDashboard,
  Screen08DailyPlanner,
  Screen09AddTask,
  Screen10TaskDetails,
} from '@/nimora/screens/PlanningScreens';

import {
  Screen11Contacts,
  Screen12ContactDetails,
  Screen13VoiceAssistant,
  Screen14AISuggestions,
} from '@/nimora/screens/ContactsAndAIScreens';

import {
  Screen15Widget,
  Screen16Notifications,
  Screen17WhatsApp,
  Screen18ProfileSettings,
} from '@/nimora/screens/WidgetAndSettingsScreens';

const SCREEN_NAMES = [
  '1. Splash Screen',
  '2. Onboarding',
  '3. Create Account',
  '4. Choose AI Assistant',
  '5. Connect Your Apps',
  '6. Set Preferences',
  '7. Home Dashboard',
  '8. Daily Planner View',
  '9. Add New Task',
  '10. Task Details',
  '11. Contacts & Follow-ups',
  '12. Contact Details & History',
  '13. Voice Assistant',
  '14. AI Suggestions',
  '15. Home Screen Widget',
  '16. Notifications',
  '17. WhatsApp Integration',
  '18. Profile & Settings',
];

export default function NimoraApp() {
  const [currentScreen, setCurrentScreen] = useState<number>(7);
  const [viewMode, setViewMode] = useState<'device' | 'gallery'>('device');
  const [tasks, setTasks] = useState<NimoraTask[]>(INITIAL_TASKS);
  const [contacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [selectedTask, setSelectedTask] = useState<NimoraTask>(INITIAL_TASKS[0]);
  const [selectedContact, setSelectedContact] = useState<Contact>(INITIAL_CONTACTS[0]);

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'completed' ? 'upcoming' : 'completed' }
          : t
      )
    );
  };

  const handleAddTask = (newTask: NimoraTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const renderScreen = (screenNum: number) => {
    switch (screenNum) {
      case 1:
        return <Screen01Splash onNavigate={setCurrentScreen} />;
      case 2:
        return <Screen02Onboarding onNavigate={setCurrentScreen} />;
      case 3:
        return <Screen03CreateAccount onNavigate={setCurrentScreen} />;
      case 4:
        return <Screen04ChooseAI onNavigate={setCurrentScreen} />;
      case 5:
        return <Screen05ConnectApps onNavigate={setCurrentScreen} />;
      case 6:
        return <Screen06SetPreferences onNavigate={setCurrentScreen} />;
      case 7:
        return (
          <Screen07HomeDashboard
            tasks={tasks}
            contacts={contacts}
            onNavigate={setCurrentScreen}
            onToggleTask={handleToggleTask}
            onSelectTask={setSelectedTask}
          />
        );
      case 8:
        return (
          <Screen08DailyPlanner
            tasks={tasks}
            contacts={contacts}
            onNavigate={setCurrentScreen}
            onSelectTask={setSelectedTask}
          />
        );
      case 9:
        return (
          <Screen09AddTask
            tasks={tasks}
            contacts={contacts}
            onNavigate={setCurrentScreen}
            onAddTask={handleAddTask}
          />
        );
      case 10:
        return (
          <Screen10TaskDetails
            tasks={tasks}
            contacts={contacts}
            selectedTask={selectedTask}
            onNavigate={setCurrentScreen}
          />
        );
      case 11:
        return (
          <Screen11Contacts
            contacts={contacts}
            suggestions={INITIAL_AI_SUGGESTIONS}
            onNavigate={setCurrentScreen}
            onSelectContact={setSelectedContact}
          />
        );
      case 12:
        return (
          <Screen12ContactDetails
            contacts={contacts}
            suggestions={INITIAL_AI_SUGGESTIONS}
            selectedContact={selectedContact}
            onNavigate={setCurrentScreen}
          />
        );
      case 13:
        return (
          <Screen13VoiceAssistant
            contacts={contacts}
            suggestions={INITIAL_AI_SUGGESTIONS}
            onNavigate={setCurrentScreen}
            onAddTask={handleAddTask}
          />
        );
      case 14:
        return (
          <Screen14AISuggestions
            contacts={contacts}
            suggestions={INITIAL_AI_SUGGESTIONS}
            onNavigate={setCurrentScreen}
            onAddTask={handleAddTask}
          />
        );
      case 15:
        return (
          <Screen15Widget
            tasks={tasks}
            notifications={INITIAL_NOTIFICATIONS}
            onNavigate={setCurrentScreen}
          />
        );
      case 16:
        return (
          <Screen16Notifications
            tasks={tasks}
            notifications={INITIAL_NOTIFICATIONS}
            onNavigate={setCurrentScreen}
          />
        );
      case 17:
        return (
          <Screen17WhatsApp
            tasks={tasks}
            notifications={INITIAL_NOTIFICATIONS}
            onNavigate={setCurrentScreen}
          />
        );
      case 18:
        return (
          <Screen18ProfileSettings
            tasks={tasks}
            notifications={INITIAL_NOTIFICATIONS}
            onNavigate={setCurrentScreen}
          />
        );
      default:
        return <Screen07HomeDashboard tasks={tasks} contacts={contacts} onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-gray-900 font-sans flex flex-col">
      {/* Top Banner Header matching the design presentation */}
      <header className="bg-gradient-to-r from-[#07241A] via-[#0E3E30] to-[#061F16] text-white px-6 py-4 shadow-xl border-b border-emerald-900/60 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] p-[2px] shadow-lg shadow-black/40">
              <div className="w-full h-full bg-[#07241A] rounded-[14px] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#E6C665]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C9.5 5 7 8 7 12a5 5 0 0 0 10 0c0-4-2.5-7-5-10zm0 17a3 3 0 0 1-3-3c0-2.2 1.8-4.5 3-6.5 1.2 2 3 4.3 3 6.5a3 3 0 0 1-3 3z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-[0.18em] text-amber-200">
                  NIMORA
                </span>
                <span className="text-[10px] bg-emerald-800/80 text-emerald-200 font-bold px-2 py-0.5 rounded-full border border-emerald-700/50">
                  v1.0 Design System
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 tracking-wider">
                Your Day. Intelligently Organized.
              </p>
            </div>
          </div>

          {/* Feature Badges from the banner */}
          <div className="hidden lg:flex items-center gap-2">
            {[
              { icon: '🤖', title: 'AI-Powered Planning' },
              { icon: '📅', title: 'Calendar & Apps' },
              { icon: '💼', title: 'Business Follow-ups' },
              { icon: '🎙️', title: 'Voice Assistant' },
              { icon: '📱', title: 'Smart Widget' },
              { icon: '⚖️', title: 'Work-Life Balance' },
            ].map((f, i) => (
              <div
                key={i}
                className="px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-[10px] font-semibold text-emerald-200/90 flex items-center gap-1.5 shadow-sm"
              >
                <span>{f.icon}</span>
                <span>{f.title}</span>
              </div>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-emerald-950/80 p-1 rounded-2xl border border-emerald-800/60">
            <button
              onClick={() => setViewMode('device')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'device'
                  ? 'bg-gradient-to-r from-amber-200 to-amber-400 text-gray-950 shadow-md'
                  : 'text-emerald-200/70 hover:text-white'
              }`}
            >
              <span>📱</span>
              <span>Interactive Phone</span>
            </button>
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'gallery'
                  ? 'bg-gradient-to-r from-amber-200 to-amber-400 text-gray-950 shadow-md'
                  : 'text-emerald-200/70 hover:text-white'
              }`}
            >
              <span>🖼️</span>
              <span>All 18 Screens</span>
            </button>
          </div>
        </div>
      </header>

      {/* Screen Navigator Strip */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-2 overflow-x-auto shadow-sm sticky top-[73px] z-20">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-2 whitespace-nowrap">
            Screens:
          </span>
          {SCREEN_NAMES.map((name, idx) => {
            const screenNum = idx + 1;
            const isActive = currentScreen === screenNum && viewMode === 'device';
            return (
              <button
                key={screenNum}
                onClick={() => {
                  setCurrentScreen(screenNum);
                  setViewMode('device');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#0F382C] text-white shadow-sm font-bold'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Presentation */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col items-center justify-center">
        {viewMode === 'device' ? (
          /* Interactive Device Mockup */
          <div className="flex flex-col md:flex-row items-center gap-8 my-auto">
            {/* Phone Device Shell */}
            <div className="relative w-[360px] h-[740px] bg-black rounded-[50px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] ring-1 ring-gray-700/50 flex flex-col">
              {/* Dynamic Island / Speaker notch */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-white/10" />
              </div>

              {/* Screen Content Window */}
              <div className="relative w-full h-full bg-[#F9F8F5] rounded-[40px] overflow-hidden shadow-inner flex flex-col">
                {renderScreen(currentScreen)}
              </div>
            </div>

            {/* Quick Helper Panel on the side */}
            <div className="max-w-xs space-y-4 text-left">
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-2">
                  Screen {currentScreen} of 18
                </span>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {SCREEN_NAMES[currentScreen - 1]}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Interactive simulation matching the uploaded NIMORA specification sheet. Click buttons on the phone to navigate or choose from the top bar.
                </p>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-2">
                <h4 className="text-xs font-bold text-gray-800">Quick Navigation Shortcuts</h4>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => setCurrentScreen(7)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-emerald-900 font-semibold text-left border border-gray-100"
                  >
                    🏠 Dashboard (7)
                  </button>
                  <button
                    onClick={() => setCurrentScreen(8)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-emerald-900 font-semibold text-left border border-gray-100"
                  >
                    📅 Planner (8)
                  </button>
                  <button
                    onClick={() => setCurrentScreen(13)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-emerald-900 font-semibold text-left border border-gray-100"
                  >
                    🎙️ Voice (13)
                  </button>
                  <button
                    onClick={() => setCurrentScreen(15)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-emerald-900 font-semibold text-left border border-gray-100"
                  >
                    📱 Widget (15)
                  </button>
                  <button
                    onClick={() => setCurrentScreen(11)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-emerald-900 font-semibold text-left border border-gray-100"
                  >
                    👥 Contacts (11)
                  </button>
                  <button
                    onClick={() => setCurrentScreen(17)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-emerald-900 font-semibold text-left border border-gray-100"
                  >
                    💬 WhatsApp (17)
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* All 18 Screens Gallery Mode */
          <div className="w-full space-y-6">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900">
                NIMORA Full 18-Screen Design Specification
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Rendered live from the exact design guidelines with interactive components.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {SCREEN_NAMES.map((name, idx) => {
                const num = idx + 1;
                return (
                  <div key={num} className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-gray-700 mb-2 truncate max-w-[200px]">
                      {name}
                    </span>
                    <div
                      onClick={() => {
                        setCurrentScreen(num);
                        setViewMode('device');
                      }}
                      className="cursor-pointer relative w-[240px] h-[480px] bg-black rounded-[36px] p-2 shadow-lg ring-1 ring-gray-300 hover:ring-2 hover:ring-emerald-600 transition-all transform hover:-translate-y-1"
                    >
                      <div className="relative w-full h-full bg-[#F9F8F5] rounded-[28px] overflow-hidden flex flex-col transform scale-[0.68] origin-top-left w-[352px] h-[705px] pointer-events-none select-none">
                        {renderScreen(num)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-500 bg-white">
        NIMORA — Your Day. Intelligently Organized. Built with Next.js, TypeScript & Tailwind CSS.
      </footer>
    </div>
  );
}

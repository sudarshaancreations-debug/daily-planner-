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
  Screen04ChooseAI,
  Screen05ConnectApps,
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

const MODULES = [
  { id: 1, title: '1. Splash & Welcome', subtitle: 'A smarter way to plan your day.' },
  { id: 2, title: '2. Account Setup & Onboarding', subtitle: 'Get started in seconds.' },
  { id: 3, title: '3. Choose Your AI Assistant', subtitle: 'Use your favourite AI to plan your day.' },
  { id: 4, title: '4. Connect Your Apps', subtitle: 'Bring your calendar, contacts and work tools together.' },
  { id: 5, title: '5. Home Dashboard', subtitle: 'Your day at a glance.' },
  { id: 6, title: '6. Daily Planner Timeline', subtitle: 'Stay on track, all day.' },
  { id: 7, title: '7. Create New Task', subtitle: 'Add tasks quickly.' },
  { id: 8, title: '8. Task Details & Edit', subtitle: 'All information in one place.' },
  { id: 9, title: '9. Contacts & Follow-ups', subtitle: 'Manage your business relationships.' },
  { id: 10, title: '10. Contact Details & History', subtitle: 'Keep track of every interaction.' },
  { id: 11, title: '11. Voice Assistant', subtitle: 'Hands-free productivity.' },
  { id: 12, title: '12. Smart AI Task Suggestions', subtitle: 'Turn conversations into action.' },
  { id: 13, title: '13. iOS Home Screen Widget', subtitle: 'Your next task, always visible.' },
  { id: 14, title: '14. Notifications & Snooze', subtitle: 'Never miss what matters.' },
  { id: 15, title: '15. WhatsApp Click-to-Chat', subtitle: 'Start a conversation instantly.' },
  { id: 16, title: '16. Settings & Privacy', subtitle: 'Your data. Your control.' },
];

export default function NimoraApp() {
  const [currentModule, setCurrentModule] = useState<number>(5);
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

  const renderModuleScreen = (modId: number) => {
    switch (modId) {
      case 1:
        return <Screen01Splash onNavigate={setCurrentModule} />;
      case 2:
        return <Screen02Onboarding onNavigate={setCurrentModule} />;
      case 3:
        return <Screen04ChooseAI onNavigate={setCurrentModule} />;
      case 4:
        return <Screen05ConnectApps onNavigate={setCurrentModule} />;
      case 5:
        return (
          <Screen07HomeDashboard
            tasks={tasks}
            contacts={contacts}
            onNavigate={setCurrentModule}
            onToggleTask={handleToggleTask}
            onSelectTask={setSelectedTask}
          />
        );
      case 6:
        return (
          <Screen08DailyPlanner
            tasks={tasks}
            contacts={contacts}
            onNavigate={setCurrentModule}
            onSelectTask={setSelectedTask}
          />
        );
      case 7:
        return (
          <Screen09AddTask
            tasks={tasks}
            contacts={contacts}
            onNavigate={setCurrentModule}
            onAddTask={handleAddTask}
          />
        );
      case 8:
        return (
          <Screen10TaskDetails
            tasks={tasks}
            contacts={contacts}
            selectedTask={selectedTask}
            onNavigate={setCurrentModule}
          />
        );
      case 9:
        return (
          <Screen11Contacts
            contacts={contacts}
            suggestions={INITIAL_AI_SUGGESTIONS}
            onNavigate={setCurrentModule}
            onSelectContact={setSelectedContact}
          />
        );
      case 10:
        return (
          <Screen12ContactDetails
            contacts={contacts}
            suggestions={INITIAL_AI_SUGGESTIONS}
            selectedContact={selectedContact}
            onNavigate={setCurrentModule}
          />
        );
      case 11:
        return (
          <Screen13VoiceAssistant
            contacts={contacts}
            suggestions={INITIAL_AI_SUGGESTIONS}
            onNavigate={setCurrentModule}
            onAddTask={handleAddTask}
          />
        );
      case 12:
        return (
          <Screen14AISuggestions
            contacts={contacts}
            suggestions={INITIAL_AI_SUGGESTIONS}
            onNavigate={setCurrentModule}
            onAddTask={handleAddTask}
          />
        );
      case 13:
        return (
          <Screen15Widget
            tasks={tasks}
            notifications={INITIAL_NOTIFICATIONS}
            onNavigate={setCurrentModule}
          />
        );
      case 14:
        return (
          <Screen16Notifications
            tasks={tasks}
            notifications={INITIAL_NOTIFICATIONS}
            onNavigate={setCurrentModule}
          />
        );
      case 15:
        return (
          <Screen17WhatsApp
            tasks={tasks}
            notifications={INITIAL_NOTIFICATIONS}
            onNavigate={setCurrentModule}
          />
        );
      case 16:
        return (
          <Screen18ProfileSettings
            tasks={tasks}
            notifications={INITIAL_NOTIFICATIONS}
            onNavigate={setCurrentModule}
          />
        );
      default:
        return <Screen07HomeDashboard tasks={tasks} contacts={contacts} onNavigate={setCurrentModule} />;
    }
  };

  const activeModule = MODULES.find((m) => m.id === currentModule) || MODULES[4];

  return (
    <div className="min-h-screen bg-[#F0EDE6] text-gray-900 font-sans flex flex-col antialiased">
      {/* Top Banner Header */}
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
                  v1.0 Production
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 tracking-wider">
                Your Day. Intelligently Organized.
              </p>
            </div>
          </div>

          {/* Tagline from the board */}
          <div className="hidden lg:flex items-center gap-3 text-xs font-semibold text-emerald-200/90 tracking-wide">
            <span>Plan Smarter</span>
            <span className="text-emerald-500">•</span>
            <span>Stay Focused</span>
            <span className="text-emerald-500">•</span>
            <span>Never Miss a Follow-up</span>
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
              <span>All 16 Modules</span>
            </button>
          </div>
        </div>
      </header>

      {/* Module Navigation Strip */}
      <div className="bg-white/85 backdrop-blur border-b border-gray-200 px-6 py-2 overflow-x-auto shadow-sm sticky top-[73px] z-20">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-2 whitespace-nowrap">
            Modules:
          </span>
          {MODULES.map((m) => {
            const isActive = currentModule === m.id && viewMode === 'device';
            return (
              <button
                key={m.id}
                onClick={() => {
                  setCurrentModule(m.id);
                  setViewMode('device');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#0F382C] text-white shadow-sm font-bold'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {m.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Presentation Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col items-center justify-center">
        {viewMode === 'device' ? (
          /* Interactive Device Mockup */
          <div className="flex flex-col lg:flex-row items-center gap-8 my-auto">
            {/* Phone Device Shell */}
            <div className="relative w-[360px] h-[740px] bg-black rounded-[50px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] ring-1 ring-gray-700/50 flex flex-col">
              {/* Dynamic Island / Speaker notch */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-white/10" />
              </div>

              {/* Screen Content Window */}
              <div className="relative w-full h-full bg-[#F9F8F5] rounded-[40px] overflow-hidden shadow-inner flex flex-col">
                {renderModuleScreen(currentModule)}
              </div>
            </div>

            {/* Quick Helper Panel on the side */}
            <div className="max-w-sm space-y-4 text-left">
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-2">
                  Module {currentModule} of 16
                </span>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {activeModule.title}
                </h3>
                <p className="text-xs text-emerald-700 font-semibold mb-2">
                  {activeModule.subtitle}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Interactive simulation matching the 16-feature NIMORA board. You can tap buttons inside the phone to transition across workflows, mark tasks complete, test the voice assistant, or inspect WhatsApp chat templates.
                </p>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-2">
                <h4 className="text-xs font-bold text-gray-800">Key Feature Shortcuts</h4>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => setCurrentModule(5)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-emerald-900 font-semibold text-left border border-gray-100"
                  >
                    🏠 Home Dashboard (5)
                  </button>
                  <button
                    onClick={() => setCurrentModule(6)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-emerald-900 font-semibold text-left border border-gray-100"
                  >
                    📅 Daily Timeline (6)
                  </button>
                  <button
                    onClick={() => setCurrentModule(11)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-emerald-900 font-semibold text-left border border-gray-100"
                  >
                    🎙️ Voice Assistant (11)
                  </button>
                  <button
                    onClick={() => setCurrentModule(12)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-emerald-900 font-semibold text-left border border-gray-100"
                  >
                    ✨ AI Suggestions (12)
                  </button>
                  <button
                    onClick={() => setCurrentModule(13)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-emerald-900 font-semibold text-left border border-gray-100"
                  >
                    📱 iOS Widget (13)
                  </button>
                  <button
                    onClick={() => setCurrentModule(15)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-emerald-900 font-semibold text-left border border-gray-100"
                  >
                    💬 WhatsApp Chat (15)
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* All 16 Modules Gallery Mode */
          <div className="w-full space-y-6">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900">
                NIMORA 16-Module Feature Architecture
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Plan Smarter • Stay Focused • Never Miss a Follow-up
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MODULES.map((m) => (
                <div key={m.id} className="flex flex-col items-center">
                  <div className="w-full text-left mb-2 px-1">
                    <span className="text-[11px] font-bold text-gray-900 block truncate">
                      {m.title}
                    </span>
                    <span className="text-[10px] text-gray-500 block truncate">
                      {m.subtitle}
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      setCurrentModule(m.id);
                      setViewMode('device');
                    }}
                    className="cursor-pointer relative w-[260px] h-[520px] bg-black rounded-[40px] p-2.5 shadow-xl ring-1 ring-gray-300 hover:ring-2 hover:ring-emerald-600 transition-all transform hover:-translate-y-1"
                  >
                    <div className="relative w-full h-full bg-[#F9F8F5] rounded-[30px] overflow-hidden flex flex-col transform scale-[0.73] origin-top-left w-[345px] h-[690px] pointer-events-none select-none">
                      {renderModuleScreen(m.id)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-500 bg-white">
        NIMORA — Your Day. Intelligently Organized. • Plan Smarter • Stay Focused • Never Miss a Follow-up
      </footer>
    </div>
  );
}

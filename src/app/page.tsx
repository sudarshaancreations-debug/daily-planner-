'use client';

import React, { useState, useEffect } from 'react';
import {
  INITIAL_CONTACTS,
  INITIAL_TASKS,
  INITIAL_AI_SUGGESTIONS,
  INITIAL_NOTIFICATIONS,
  NimoraTask,
  Contact,
} from '@/nimora/data';
import { downloadICS } from '@/lib/exportUtils';
import {
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

export default function NimoraApp() {
  const [activeTab, setActiveTab] = useState<
    | 'home'
    | 'schedule'
    | 'voice'
    | 'contacts'
    | 'settings'
    | 'add_task'
    | 'task_details'
    | 'contact_details'
    | 'notifications'
    | 'widget'
    | 'ai_suggestions'
  >('home');
  const [tasks, setTasks] = useState<NimoraTask[]>(INITIAL_TASKS);
  const [contacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [selectedTask, setSelectedTask] = useState<NimoraTask>(INITIAL_TASKS[0]);
  const [selectedContact, setSelectedContact] = useState<Contact>(INITIAL_CONTACTS[0]);
  const [isListening, setIsListening] = useState(false);
  const [currentTime, setCurrentTime] = useState('9:41');

  // True persistent storage across reloads and mobile sessions
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nimora_planner_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
          setSelectedTask(parsed[0]);
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('nimora_planner_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.warn('Could not write to localStorage', e);
    }
  }, [tasks]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

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
    setActiveTab('home');
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setActiveTab('schedule');
  };

  const handleResetData = () => {
    setTasks(INITIAL_TASKS);
    setSelectedTask(INITIAL_TASKS[0]);
    try {
      localStorage.removeItem('nimora_planner_tasks');
    } catch {}
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const remainingCount = tasks.filter((t) => t.status !== 'completed').length;

  // Active high priority task
  const activeFocusTask = tasks.find((t) => t.priority === 'high' && t.status !== 'completed') || tasks[0];

  return (
    <div className="bg-[#121412] text-[#e3e2e0] min-h-screen antialiased selection:bg-[#a1d1bd] selection:text-[#05382a] relative pb-32 max-w-md mx-auto shadow-2xl">
      {/* Native iOS Status Bar Simulation */}
      <header className="fixed top-0 left-0 w-full z-[60] flex justify-between items-center px-4 pt-2.5 pb-1 bg-[#121412]/90 backdrop-blur-md text-[#e3e2e0] select-none max-w-md left-1/2 -translate-x-1/2">
        <span className="font-['Space_Grotesk'] text-xs font-semibold tracking-tight text-[#e3e2e0]">
          {currentTime}
        </span>
        <div className="flex items-center space-x-1.5 text-[#e3e2e0]">
          <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-[16px]">wifi</span>
          <span className="material-symbols-outlined text-[20px] rotate-90">battery_full</span>
        </div>
      </header>

      {/* Top Navigation Shell */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-14 mt-7 bg-[#121412]/80 backdrop-blur-md shadow-sm max-w-md left-1/2 -translate-x-1/2 border-b border-[#414945]/30">
        <div className="flex items-center space-x-2">
          {/* NIMORA Brand Logo with Asset Placeholder */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0e3e30] to-[#0A2E24] border border-[#e9c349]/40 flex items-center justify-center shadow-sm">
            <span className="text-[#e9c349] font-bold text-base">N</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="font-['Space_Grotesk'] text-lg tracking-wider text-[#a1d1bd] font-bold">
              NIMORA
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#af8d11]/30 text-[#e9c349] border border-[#e9c349]/30 tracking-widest">
              PRO
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('notifications')}
            aria-label="Notifications"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#c0c8c3] hover:text-[#a1d1bd] transition-colors duration-150 active:scale-95 border border-[#414945]/30 bg-[#1f201e]/60 relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e9c349]"></span>
          </button>
          <div
            onClick={() => setActiveTab('settings')}
            className="w-9 h-9 rounded-full p-0.5 border border-[#e9c349]/40 overflow-hidden bg-[#0e3e30] cursor-pointer"
          >
            <div className="w-full h-full rounded-full bg-[#1f201e] flex items-center justify-center text-[#e9c349] font-['Space_Grotesk'] text-xs font-bold">
              SM
            </div>
          </div>
        </div>
      </nav>

      {/* Main View Area */}
      {activeTab === 'home' && (
        <main className="pt-24 px-4 space-y-4">
          {/* Executive Greeting & Persona Hierarchy */}
          <section className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#e9c349] tracking-widest uppercase flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e9c349]"></span> Principal Architect
                </span>
                <h1 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#e3e2e0] mt-0.5">
                  Good Morning, Sudarshan
                </h1>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#c0c8c3] block font-semibold">WED, OCT 24</span>
                <span className="text-xs text-[#a1d1bd] font-medium">Bespoke Studio</span>
              </div>
            </div>

            {/* Inspirational Daily Quote Badge */}
            <div className="glass-card specular-border rounded-xl px-4 py-2.5 mt-2 flex items-center gap-2.5 shadow-sm">
              <span className="material-symbols-outlined text-[#e9c349] text-[20px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                lightbulb
              </span>
              <p className="text-xs text-[#c0c8c3] italic">
                &ldquo;A focused day creates bigger opportunities.&rdquo;
              </p>
            </div>
          </section>

          {/* Daily Progress Gauge & Operational Metrics Bento Grid */}
          <section className="glass-card specular-border rounded-xl p-4 shadow-lg relative overflow-hidden">
            {/* Subtle Ambient Glow Behind Gauge */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#e9c349]/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center justify-between">
              {/* Radial Gauge Indicator */}
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background Ring */}
                    <path
                      className="text-[#292a29]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    {/* Progress Arc */}
                    <path
                      className="text-[#e9c349] stroke-current transition-all duration-700"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeDasharray={`${progressPercent}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-['Space_Grotesk'] text-lg font-bold text-[#e3e2e0] leading-none">
                      {progressPercent}%
                    </span>
                    <span className="text-[8px] text-[#c0c8c3] uppercase tracking-wider mt-0.5">
                      Done
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="font-['Space_Grotesk'] text-base text-[#e3e2e0] font-semibold">
                    Today&apos;s Progress
                  </h2>
                  <p className="text-xs text-[#c0c8c3]">
                    {completedCount} of {tasks.length} milestones finalized
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#4edea3]"></span>
                    <span className="text-xs text-[#4edea3] tracking-wide font-medium">
                      {remainingCount} Tasks Remaining
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => downloadICS(tasks, 'nimora-daily-schedule.ics')}
                aria-label="Export iCalendar"
                className="p-2 rounded-lg bg-[#1f201e]/60 border border-[#414945]/30 text-[#c0c8c3] hover:text-[#e9c349] active:scale-95 transition-all"
                title="Download Calendar (.ics)"
              >
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              </button>
            </div>

            {/* Quick Metrics Counters */}
            <div className="grid grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-[#414945]/20">
              <div className="bg-[#0d0f0d]/60 rounded-lg p-2.5 text-center border border-[#414945]/15">
                <span className="font-['Space_Grotesk'] text-base font-bold text-[#a1d1bd] block">3</span>
                <span className="text-[10px] text-[#c0c8c3] uppercase tracking-wide">Calls</span>
              </div>
              <div className="bg-[#0d0f0d]/60 rounded-lg p-2.5 text-center border border-[#414945]/15">
                <span className="font-['Space_Grotesk'] text-base font-bold text-[#e9c349] block">2</span>
                <span className="text-[10px] text-[#c0c8c3] uppercase tracking-wide">Site Visits</span>
              </div>
              <div className="bg-[#0d0f0d]/60 rounded-lg p-2.5 text-center border border-[#414945]/15">
                <span className="font-['Space_Grotesk'] text-base font-bold text-[#4edea3] block">1</span>
                <span className="text-[10px] text-[#c0c8c3] uppercase tracking-wide">Review</span>
              </div>
            </div>
          </section>

          {/* Active Now Focus Block */}
          {activeFocusTask && (
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] uppercase tracking-widest text-[#c0c8c3] font-bold flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  Active Today&apos;s Plan
                </h2>
                <span className="text-[11px] text-[#a1d1bd] font-medium">Live Feed</span>
              </div>

              {/* High Priority Focus Card */}
              <div
                onClick={() => {
                  setSelectedTask(activeFocusTask);
                  setActiveTab('task_details');
                }}
                className="glass-card specular-border rounded-xl p-4 border-l-4 border-l-rose-500 shadow-xl relative overflow-hidden cursor-pointer hover:border-r hover:border-r-[#e9c349]/40 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/60 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                        High Priority
                      </span>
                      <span className="text-[11px] text-[#e9c349] font-semibold">
                        NOW · {activeFocusTask.startTime} – {activeFocusTask.endTime}
                      </span>
                    </div>
                    <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#e3e2e0] leading-tight mt-1">
                      {activeFocusTask.title}
                    </h3>
                    <p className="text-xs text-[#c0c8c3] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#8a938e]">location_city</span>
                      {activeFocusTask.subtitle || 'Arun Mehta (Apex Builders) · Skyline Tower B'}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[#e9c349] text-[24px]">engineering</span>
                </div>

                {/* Quick Interaction Actions */}
                <div
                  className="flex items-center gap-2.5 mt-4 pt-3 border-t border-[#414945]/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    className="flex-1 py-2 px-3 rounded-lg bg-[#1f201e] hover:bg-[#292a29] flex items-center justify-center gap-2 text-[#a1d1bd] border border-[#414945]/40 text-xs font-semibold active:scale-95 transition-transform"
                    href="tel:+919876543210"
                  >
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    Call Arun
                  </a>
                  <a
                    className="flex-1 py-2 px-3 rounded-lg bg-[#0e3e30]/80 hover:bg-[#0e3e30] flex items-center justify-center gap-2 text-[#4edea3] border border-[#4edea3]/40 text-xs font-semibold active:scale-95 transition-transform"
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    WhatsApp
                  </a>
                  <button
                    onClick={() => handleToggleTask(activeFocusTask.id)}
                    aria-label="Mark completed"
                    className={`p-2 rounded-lg border border-[#414945]/30 active:scale-95 transition-transform ${
                      activeFocusTask.status === 'completed'
                        ? 'bg-[#10B981] text-gray-950'
                        : 'bg-[#292a29] text-[#c0c8c3] hover:text-[#4edea3]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">check</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Upcoming Tasks Section */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] uppercase tracking-widest text-[#c0c8c3] font-bold">
                Upcoming Schedule
              </h2>
              <button
                onClick={() => setActiveTab('add_task')}
                className="text-xs text-[#e9c349] hover:underline flex items-center gap-1"
              >
                + Add Task
              </button>
            </div>

            {tasks.map((task) => {
              const isCompleted = task.status === 'completed';
              const borderColors: Record<string, string> = {
                blue: 'border-l-blue-500',
                green: 'border-l-emerald-500',
                coral: 'border-l-orange-400',
                orange: 'border-l-orange-400',
                gray: 'border-l-gray-400',
              };

              return (
                <article
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setActiveTab('task_details');
                  }}
                  className={`glass-card specular-border rounded-xl p-4 border-l-[3px] ${
                    borderColors[task.color] || 'border-l-emerald-500'
                  } shadow-sm flex items-start justify-between gap-3 transition-all cursor-pointer ${
                    isCompleted ? 'opacity-50' : 'hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Tactile Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTask(task.id);
                      }}
                      aria-label="Complete Task"
                      className={`mt-0.5 w-5 h-5 rounded border border-[#e9c349]/50 flex items-center justify-center hover:bg-[#e9c349]/20 transition-colors ${
                        isCompleted ? 'bg-[#e9c349] text-gray-950' : ''
                      }`}
                    >
                      {isCompleted && (
                        <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                      )}
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#a1d1bd]">
                          {task.startTime}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-[#0e3e30] text-[#a1d1bd] border border-[#a1d1bd]/30 uppercase">
                          {task.category}
                        </span>
                      </div>
                      <h4
                        className={`font-['Space_Grotesk'] text-sm font-bold text-[#e3e2e0] ${
                          isCompleted ? 'line-through' : ''
                        }`}
                      >
                        {task.title}
                      </h4>
                      {task.subtitle && (
                        <p className="text-xs text-[#c0c8c3]">{task.subtitle}</p>
                      )}
                    </div>
                  </div>

                  {/* Fast Action */}
                  <a
                    aria-label="WhatsApp quick trigger"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg bg-[#1f201e] text-[#a1d1bd] border border-[#414945]/30 hover:border-[#a1d1bd]/50 active:scale-95 transition-all self-center"
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </a>
                </article>
              );
            })}
          </section>
        </main>
      )}

      {/* Schedule View */}
      {activeTab === 'schedule' && (
        <div className="pt-20 px-4">
          <Screen08DailyPlanner
            tasks={tasks}
            contacts={contacts}
            onNavigate={(mod) => {
              if (mod === 5) setActiveTab('home');
              if (mod === 7) setActiveTab('add_task');
            }}
            onSelectTask={(task) => {
              setSelectedTask(task);
              setActiveTab('task_details');
            }}
            onToggleTask={handleToggleTask}
          />
        </div>
      )}

      {/* Add Task View */}
      {activeTab === 'add_task' && (
        <div className="pt-20 px-4">
          <Screen09AddTask
            tasks={tasks}
            contacts={contacts}
            onNavigate={() => setActiveTab('home')}
            onAddTask={handleAddTask}
          />
        </div>
      )}

      {/* Task Details View */}
      {activeTab === 'task_details' && selectedTask && (
        <div className="pt-20 px-4">
          <Screen10TaskDetails
            tasks={tasks}
            contacts={contacts}
            selectedTask={selectedTask}
            onNavigate={(mod) => {
              if (mod === 5) setActiveTab('home');
              else setActiveTab('schedule');
            }}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      )}

      {/* Voice Assistant View */}
      {activeTab === 'voice' && (
        <div className="pt-20 px-4">
          <Screen13VoiceAssistant
            contacts={contacts}
            suggestions={INITIAL_AI_SUGGESTIONS}
            onNavigate={() => setActiveTab('home')}
            onAddTask={handleAddTask}
          />
        </div>
      )}

      {/* CRM & Contacts View */}
      {activeTab === 'contacts' && (
        <div className="pt-20 px-4">
          <Screen11Contacts
            contacts={contacts}
            suggestions={INITIAL_AI_SUGGESTIONS}
            onNavigate={(mod) => {
              if (mod === 5) setActiveTab('home');
            }}
            onSelectContact={(c) => {
              setSelectedContact(c);
              setActiveTab('contact_details');
            }}
          />
        </div>
      )}

      {/* Contact Details View */}
      {activeTab === 'contact_details' && selectedContact && (
        <div className="pt-20 px-4">
          <Screen12ContactDetails
            contacts={contacts}
            suggestions={INITIAL_AI_SUGGESTIONS}
            selectedContact={selectedContact}
            onNavigate={() => setActiveTab('contacts')}
          />
        </div>
      )}

      {/* Notifications View */}
      {activeTab === 'notifications' && (
        <div className="pt-20 px-4">
          <Screen16Notifications
            tasks={tasks}
            notifications={INITIAL_NOTIFICATIONS}
            onNavigate={() => setActiveTab('home')}
          />
        </div>
      )}

      {/* Widget Preview View */}
      {activeTab === 'widget' && (
        <div className="pt-20 px-4">
          <Screen15Widget
            tasks={tasks}
            notifications={INITIAL_NOTIFICATIONS}
            onNavigate={() => setActiveTab('home')}
          />
        </div>
      )}

      {/* AI Suggestions View */}
      {activeTab === 'ai_suggestions' && (
        <div className="pt-20 px-4">
          <Screen14AISuggestions
            contacts={contacts}
            suggestions={INITIAL_AI_SUGGESTIONS}
            onNavigate={() => setActiveTab('home')}
            onAddTask={handleAddTask}
          />
        </div>
      )}

      {/* Settings View */}
      {activeTab === 'settings' && (
        <div className="pt-20 px-4">
          <Screen18ProfileSettings
            tasks={tasks}
            notifications={INITIAL_NOTIFICATIONS}
            onNavigate={(mod) => {
              if (mod === 12) setActiveTab('widget');
              else if (mod === 13) setActiveTab('notifications');
              else setActiveTab('home');
            }}
            onResetData={handleResetData}
          />
        </div>
      )}

      {/* Push-to-Talk Voice Command Dock ("Ask Nova...") */}
      <div className="fixed bottom-20 left-0 w-full px-4 z-40 flex justify-center pointer-events-none max-w-md left-1/2 -translate-x-1/2">
        <div
          onClick={() => setActiveTab('voice')}
          className="pointer-events-auto voice-pulse glass-pill border border-[#e9c349]/50 rounded-full py-2.5 px-5 flex items-center space-x-3 shadow-[0_12px_32px_rgba(2,44,34,0.85)] backdrop-blur-xl cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-[#0e3e30] flex items-center justify-center text-[#e9c349] border border-[#e9c349]/40 shadow-inner">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              mic
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#e3e2e0] font-semibold">Ask Nova...</span>
            <div className="flex space-x-0.5 items-center">
              <span className="w-1 h-3 bg-[#4edea3] rounded-full animate-bounce"></span>
              <span className="w-1 h-5 bg-[#e9c349] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
              <span className="w-1 h-2 bg-[#a1d1bd] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            </div>
          </div>
          <span className="text-[9px] text-[#e9c349] font-bold uppercase tracking-wider bg-[#af8d11]/20 px-1.5 py-0.5 rounded border border-[#e9c349]/20">
            AI
          </span>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-16 bg-[#1f201e]/95 backdrop-blur-xl rounded-t-2xl shadow-2xl border-t border-[#414945]/30 max-w-md left-1/2 -translate-x-1/2">
        {/* Home Destination */}
        <button
          onClick={() => setActiveTab('home')}
          aria-label="Home"
          className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 ${
            activeTab === 'home' ? 'text-[#e9c349]' : 'text-[#c0c8c3] hover:text-[#e3e2e0]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}>
            home
          </span>
          {activeTab === 'home' && (
            <span className="w-1 h-1 bg-[#e9c349] rounded-full mt-0.5"></span>
          )}
        </button>

        {/* Timeline / Schedule Destination */}
        <button
          onClick={() => setActiveTab('schedule')}
          aria-label="Schedule"
          className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 ${
            activeTab === 'schedule' ? 'text-[#e9c349]' : 'text-[#c0c8c3] hover:text-[#e3e2e0]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">calendar_today</span>
          {activeTab === 'schedule' && (
            <span className="w-1 h-1 bg-[#e9c349] rounded-full mt-0.5"></span>
          )}
        </button>

        {/* Nova Mic Voice Node */}
        <button
          onClick={() => setActiveTab('voice')}
          aria-label="Voice Nova"
          className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 ${
            activeTab === 'voice' ? 'text-[#e9c349]' : 'text-[#c0c8c3] hover:text-[#e3e2e0]'
          }`}
        >
          <div className="w-10 h-10 -mt-5 rounded-full bg-[#0e3e30] border border-[#e9c349]/50 flex items-center justify-center text-[#e9c349] shadow-lg shadow-black/50">
            <span className="material-symbols-outlined text-[22px]">mic</span>
          </div>
        </button>

        {/* CRM / Stakeholders Destination */}
        <button
          onClick={() => setActiveTab('contacts')}
          aria-label="Network"
          className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 ${
            activeTab === 'contacts' ? 'text-[#e9c349]' : 'text-[#c0c8c3] hover:text-[#e3e2e0]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">group</span>
          {activeTab === 'contacts' && (
            <span className="w-1 h-1 bg-[#e9c349] rounded-full mt-0.5"></span>
          )}
        </button>

        {/* Settings / Profile Destination */}
        <button
          onClick={() => setActiveTab('settings')}
          aria-label="Settings"
          className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 ${
            activeTab === 'settings' ? 'text-[#e9c349]' : 'text-[#c0c8c3] hover:text-[#e3e2e0]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">settings</span>
          {activeTab === 'settings' && (
            <span className="w-1 h-1 bg-[#e9c349] rounded-full mt-0.5"></span>
          )}
        </button>
      </nav>
    </div>
  );
}

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
import { haptics } from '@/lib/haptics';
import {
  Screen08DailyPlanner,
  Screen09AddTask,
  Screen10TaskDetails,
  SwipeableScheduleCard,
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
  Screen19SubscriptionPlans,
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
    | 'pricing'
  >('home');
  const [tasks, setTasks] = useState<NimoraTask[]>(INITIAL_TASKS);
  const [contacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [selectedTask, setSelectedTask] = useState<NimoraTask>(INITIAL_TASKS[0]);
  const [selectedContact, setSelectedContact] = useState<Contact>(INITIAL_CONTACTS[0]);
  const [assistantName, setAssistantName] = useState('Nova');
  const [isListening, setIsListening] = useState(false);
  const [currentTime, setCurrentTime] = useState('9:41');
  const [isProUser, setIsProUser] = useState(false);

  // True persistent storage across reloads and mobile sessions
  useEffect(() => {
    try {
      const savedStatus = localStorage.getItem('nimora_subscription_status');
      if (savedStatus === 'pro') {
        setIsProUser(true);
      }
      const savedName = localStorage.getItem('nimora_assistant_name');
      if (savedName) {
        setAssistantName(savedName);
      }
      const saved = localStorage.getItem('nimora_planner_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const active = parsed.filter((t: NimoraTask) => t.status !== 'completed');
          const completed = parsed.filter((t: NimoraTask) => t.status === 'completed');
          const sorted = [...active, ...completed];
          setTasks(sorted);
          setSelectedTask(sorted[0]);
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  }, []);

  const handleUpdateAssistantName = (newName: string) => {
    setAssistantName(newName);
    try {
      localStorage.setItem('nimora_assistant_name', newName);
    } catch (e) {
      console.warn('Could not save assistant name', e);
    }
  };

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
    setTasks((prev) => {
      const target = prev.find((t) => t.id === id);
      if (target) {
        if (target.status === 'completed') {
          haptics.tick();
        } else {
          haptics.success();
        }
      }
      const updated = prev.map((t) =>
        t.id === id
          ? { ...t, status: (t.status === 'completed' ? 'upcoming' : 'completed') as NimoraTask['status'] }
          : t
      );
      // Auto move completed tasks to the bottom, active tasks stay on top
      const active = updated.filter((t) => t.status !== 'completed');
      const completed = updated.filter((t) => t.status === 'completed');
      const reordered = [...active, ...completed];
      try {
        localStorage.setItem('nimora_planner_tasks', JSON.stringify(reordered));
      } catch (e) {
        console.warn('Could not write to localStorage', e);
      }
      return reordered;
    });
  };

  const handleAddTask = (newTask: NimoraTask) => {
    haptics.success();
    setTasks((prev) => {
      const combined = [newTask, ...prev];
      const active = combined.filter((t) => t.status !== 'completed');
      const completed = combined.filter((t) => t.status === 'completed');
      const reordered = [...active, ...completed];
      try {
        localStorage.setItem('nimora_planner_tasks', JSON.stringify(reordered));
      } catch (e) {
        console.warn('Could not write to localStorage', e);
      }
      return reordered;
    });
    setSelectedTask(newTask);
  };

  const handleDeleteTask = (id: string) => {
    haptics.warning();
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem('nimora_planner_tasks', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not write to localStorage', e);
      }
      return updated;
    });
  };

  const handleUpdateTask = (updatedTask: NimoraTask) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === updatedTask.id ? updatedTask : t));
      const active = updated.filter((t) => t.status !== 'completed');
      const completed = updated.filter((t) => t.status === 'completed');
      const reordered = [...active, ...completed];
      try {
        localStorage.setItem('nimora_planner_tasks', JSON.stringify(reordered));
      } catch (e) {
        console.warn('Could not write to localStorage', e);
      }
      return reordered;
    });
    setSelectedTask(updatedTask);
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

  // Active high priority task: picks active high-priority task, then any active task, fallback to first task
  const activeFocusTask = tasks.find((t) => t.priority === 'high' && t.status !== 'completed')
    || tasks.find((t) => t.status !== 'completed')
    || tasks[0];

  return (
    <div className="bg-[#0c0f0d] text-[#ededec] min-h-screen antialiased selection:bg-[#4edea3]/20 selection:text-[#4edea3] relative pb-32 max-w-md mx-auto shadow-2xl">
      {/* Native iOS Status Bar Simulation */}
      <header className="fixed top-0 left-0 w-full z-[60] flex justify-between items-center px-4 pt-2.5 pb-1 liquid-glass-header text-[#ededec] select-none max-w-md left-1/2 -translate-x-1/2">
        <span className="font-['Space_Grotesk'] text-xs font-semibold tracking-tight text-[#ededec]">
          {currentTime}
        </span>
        <div className="flex items-center space-x-1.5 text-[#ededec]">
          <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-[16px]">wifi</span>
          <span className="material-symbols-outlined text-[20px] rotate-90">battery_full</span>
        </div>
      </header>

      {/* Top Navigation Shell (Liquid Glass Material) */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-14 mt-7 liquid-glass-header shadow-sm max-w-md left-1/2 -translate-x-1/2 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2">
          {/* NIMORA Brand Logo with Asset Placeholder */}
          <div className="w-8 h-8 rounded-lg liquid-glass-pill border border-white/25 flex items-center justify-center shadow-sm">
            <span className="text-[#e9c349] font-bold text-sm font-['Space_Grotesk']">N</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-['Space_Grotesk'] text-base tracking-wider text-[#ededec] font-bold">
              NIMORA
            </span>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1 ${
                isProUser
                  ? 'liquid-glass-pill text-[#e9c349] border-white/30 font-bold shadow-[0_0_12px_rgba(233,195,73,0.3)]'
                  : 'bg-[#181c19] text-[#e9c349] border border-[#e9c349]/30'
              }`}
              title={isProUser ? 'PRO Member Active' : 'View Membership Plans'}
            >
              {isProUser && <span className="text-[10px]">★</span>}
              <span>PRO</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('notifications')}
            aria-label="Notifications"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#c0c8c3] hover:text-[#ededec] transition-colors duration-150 active:scale-95 border border-white/[0.08] bg-[#141815] relative"
          >
            <span className="material-symbols-outlined text-[19px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#e9c349]"></span>
          </button>
          <div
            onClick={() => setActiveTab('settings')}
            className="w-9 h-9 rounded-full p-0.5 border border-white/20 overflow-hidden bg-[#161a17] cursor-pointer hover:border-[#e9c349]/50 transition-colors"
          >
            <div className="w-full h-full rounded-full bg-[#1b201d] flex items-center justify-center text-[#e9c349] font-['Space_Grotesk'] text-xs font-bold">
              SM
            </div>
          </div>
        </div>
      </nav>

      {/* Main View Area */}
      {activeTab === 'home' && (
        <main className="pt-24 px-4 space-y-4">
          {/* Executive Greeting & Persona Hierarchy (Utilitarian Minimalism) */}
          <section className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-[#a1d1bd] tracking-widest uppercase flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e9c349]"></span> Principal Architect
                </span>
                <h1 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#ededec] mt-0.5">
                  Good Morning, Sudarshan
                </h1>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-[#8a938e] block uppercase tracking-wider">WED, OCT 24</span>
                <span className="text-xs text-[#a1d1bd] font-medium">Bespoke Studio</span>
              </div>
            </div>

            {/* Daily Quote Badge (Minimalist Card) */}
            <div className="minimal-card rounded-xl px-3.5 py-2.5 mt-2 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#e9c349] text-[18px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                lightbulb
              </span>
              <p className="text-xs text-[#c0c8c3] italic">
                &ldquo;A focused day creates bigger opportunities.&rdquo;
              </p>
            </div>
          </section>

          {/* Daily Progress Gauge & Operational Metrics Bento Grid (80% Minimalist Bento) */}
          <section className="minimal-card rounded-2xl p-4.5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              {/* Radial Gauge Indicator */}
              <div className="flex items-center space-x-4">
                <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background Ring */}
                    <path
                      className="text-[#202522]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    {/* Progress Arc */}
                    <path
                      className="text-[#e9c349] stroke-current transition-all duration-700"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeDasharray={`${progressPercent}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-['Space_Grotesk'] text-base font-bold text-[#ededec] leading-none">
                      {progressPercent}%
                    </span>
                    <span className="text-[8px] font-mono text-[#8a938e] uppercase tracking-wider mt-0.5">
                      Done
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="font-['Space_Grotesk'] text-sm text-[#ededec] font-semibold">
                    Today&apos;s Agenda
                  </h2>
                  <p className="text-xs text-[#9b9f9c] mt-0.5">
                    {completedCount} of {tasks.length} milestones finalized
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                    <span className="text-xs text-[#4edea3] tracking-wide font-medium">
                      {remainingCount} Tasks Remaining
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => downloadICS(tasks, 'nimora-daily-schedule.ics')}
                aria-label="Export iCalendar"
                className="p-2 rounded-lg minimal-btn-secondary text-[#c0c8c3] hover:text-[#e9c349] active:scale-95 transition-all cursor-pointer"
                title="Download Calendar (.ics)"
              >
                <span className="material-symbols-outlined text-[19px]">calendar_today</span>
              </button>
            </div>

            {/* Quick Metrics Bento Counters */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/[0.06]">
              <div className="bg-[#171b18] rounded-xl p-2.5 text-center border border-white/[0.05]">
                <span className="font-['Space_Grotesk'] text-base font-bold text-[#a1d1bd] block">3</span>
                <span className="text-[9px] font-mono text-[#8a938e] uppercase tracking-wider">Calls</span>
              </div>
              <div className="bg-[#171b18] rounded-xl p-2.5 text-center border border-white/[0.05]">
                <span className="font-['Space_Grotesk'] text-base font-bold text-[#e9c349] block">2</span>
                <span className="text-[9px] font-mono text-[#8a938e] uppercase tracking-wider">Site Visits</span>
              </div>
              <div className="bg-[#171b18] rounded-xl p-2.5 text-center border border-white/[0.05]">
                <span className="font-['Space_Grotesk'] text-base font-bold text-[#4edea3] block">1</span>
                <span className="text-[9px] font-mono text-[#8a938e] uppercase tracking-wider">Review</span>
              </div>
            </div>
          </section>

          {/* Active Now Focus Block (20% Liquid Glass Focal Centerpiece!) */}
          {activeFocusTask && (
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-mono uppercase tracking-widest text-[#9b9f9c] font-semibold flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  Active Focus
                </h2>
                <span className="text-[10px] font-mono text-[#a1d1bd] font-medium">Live Priority</span>
              </div>

              {/* High Priority Liquid Glass Card */}
              <div
                onClick={() => {
                  setSelectedTask(activeFocusTask);
                  setActiveTab('task_details');
                }}
                className="liquid-glass liquid-sheen rounded-2xl p-4.5 border-l-4 border-l-rose-500 shadow-2xl cursor-pointer hover:border-white/30 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-950/70 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                        High Priority
                      </span>
                      <span className="text-[11px] font-mono text-[#e9c349] font-medium">
                        NOW · {activeFocusTask.startTime} – {activeFocusTask.endTime}
                      </span>
                    </div>
                    <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#ededec] leading-tight mt-1">
                      {activeFocusTask.title}
                    </h3>
                    <p className="text-xs text-[#c0c8c3] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#8a938e]">location_city</span>
                      {activeFocusTask.subtitle || 'Arun Mehta (Apex Builders) · Skyline Tower B'}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[#e9c349] text-[22px]">engineering</span>
                </div>

                {/* Quick Interaction Actions */}
                <div
                  className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.12]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    className="flex-1 py-2 px-3 rounded-xl minimal-btn-secondary flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer"
                    href="tel:+919876543210"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    Call Contact
                  </a>
                  <a
                    className="flex-1 py-2 px-3 rounded-xl liquid-glass-pill flex items-center justify-center gap-1.5 text-[#4edea3] text-xs font-semibold cursor-pointer hover:brightness-110"
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    WhatsApp
                  </a>
                  <button
                    onClick={() => handleToggleTask(activeFocusTask.id)}
                    aria-label="Mark completed"
                    className={`p-2 rounded-xl border border-white/20 active:scale-95 transition-all cursor-pointer ${
                      activeFocusTask.status === 'completed'
                        ? 'bg-[#10B981] text-gray-950'
                        : 'bg-[#1a1f1c] text-[#c0c8c3] hover:text-[#4edea3]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Upcoming Tasks Section (80% Utilitarian Minimalism) */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-mono uppercase tracking-widest text-[#9b9f9c] font-semibold">
                Upcoming Schedule
              </h2>
              <button
                onClick={() => setActiveTab('add_task')}
                className="text-xs font-semibold text-[#e9c349] hover:underline flex items-center gap-1 cursor-pointer"
              >
                + Add Task
              </button>
            </div>

            {/* Swipe instruction hint */}
            <div className="p-2 minimal-card-subtle rounded-xl flex items-center justify-between text-[10px] text-[#8a938e] font-mono">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px] text-[#e9c349]">swipe</span>
                <span>Slide card horizontally to reveal actions</span>
              </span>
              <span className="text-[#e9c349] font-bold">‹ ›</span>
            </div>

            {tasks.map((task) => (
              <SwipeableScheduleCard
                key={task.id}
                task={task}
                borderColors={{
                  blue: 'border-l-blue-500',
                  green: 'border-l-emerald-500',
                  coral: 'border-l-orange-400',
                  orange: 'border-l-orange-400',
                  gray: 'border-l-gray-400',
                }}
                showWhatsApp={true}
                onToggleTask={handleToggleTask}
                onSelectTask={(t) => {
                  setSelectedTask(t);
                  setActiveTab('task_details');
                }}
                onDeleteTask={handleDeleteTask}
                onNavigate={(mod) => {
                  if (mod === 8) setActiveTab('task_details');
                }}
              />
            ))}
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
              if (mod === 8) setActiveTab('task_details');
            }}
            onSelectTask={(task) => {
              setSelectedTask(task);
              setActiveTab('task_details');
            }}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      )}

      {/* Add Task View */}
      {activeTab === 'add_task' && (
        <div className="pt-20 px-4">
          <Screen09AddTask
            tasks={tasks}
            contacts={contacts}
            onNavigate={(mod) => {
              if (mod === 6) setActiveTab('schedule');
              else setActiveTab('home');
            }}
            onAddTask={(task) => {
              handleAddTask(task);
              setActiveTab('schedule');
            }}
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
            onUpdateTask={handleUpdateTask}
          />
        </div>
      )}

      {/* Voice Assistant View */}
      {activeTab === 'voice' && (
        <div className="pt-20 px-4">
          <Screen13VoiceAssistant
            contacts={contacts}
            tasks={tasks}
            suggestions={INITIAL_AI_SUGGESTIONS}
            assistantName={assistantName}
            onUpdateAssistantName={handleUpdateAssistantName}
            onNavigate={(mod) => {
              if (mod === 6) {
                setActiveTab('schedule');
              } else {
                setActiveTab('home');
              }
            }}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
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
              else if (mod === 99) setActiveTab('pricing');
              else setActiveTab('home');
            }}
            onResetData={handleResetData}
          />
        </div>
      )}

      {/* Subscription & Pricing Plans View */}
      {activeTab === 'pricing' && (
        <div className="pt-20 px-4">
          <Screen19SubscriptionPlans
            onNavigate={() => setActiveTab('settings')}
            onSubscriptionSuccess={() => setIsProUser(true)}
          />
        </div>
      )}

      {/* Push-to-Talk Voice Command Dock ("Ask Nova...") [20% Liquid Glass Material] */}
      <div className="fixed bottom-20 left-0 w-full px-4 z-40 flex justify-center pointer-events-none max-w-md left-1/2 -translate-x-1/2">
        <div
          onClick={() => setActiveTab('voice')}
          className="pointer-events-auto voice-pulse liquid-glass-pill rounded-full py-2.5 px-5 flex items-center space-x-3 cursor-pointer hover:scale-[1.03] active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-[#e9c349] shadow-inner">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              mic
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#ededec] font-semibold tracking-tight">Ask {assistantName}...</span>
            <div className="flex space-x-0.5 items-center">
              <span className="w-1 h-3 bg-[#4edea3] rounded-full animate-bounce"></span>
              <span className="w-1 h-5 bg-[#e9c349] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
              <span className="w-1 h-2 bg-[#a1d1bd] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            </div>
          </div>
          <span className="text-[9px] font-mono text-[#e9c349] font-bold uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded border border-white/20">
            AI
          </span>
        </div>
      </div>

      {/* Bottom Navigation Bar [20% Elevated Liquid Glass Panel] */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-16 liquid-glass-nav rounded-t-2xl max-w-md left-1/2 -translate-x-1/2">
        {/* Home Destination */}
        <button
          onClick={() => setActiveTab('home')}
          aria-label="Home"
          className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 cursor-pointer ${
            activeTab === 'home' ? 'text-[#e9c349]' : 'text-[#8a938e] hover:text-[#ededec]'
          }`}
        >
          <span className="material-symbols-outlined text-[23px]" style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}>
            home
          </span>
          {activeTab === 'home' && (
            <span className="w-1 h-1 bg-[#e9c349] rounded-full mt-0.5 shadow-[0_0_6px_#e9c349]"></span>
          )}
        </button>

        {/* Timeline / Schedule Destination */}
        <button
          onClick={() => setActiveTab('schedule')}
          aria-label="Schedule"
          className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 cursor-pointer ${
            activeTab === 'schedule' ? 'text-[#e9c349]' : 'text-[#8a938e] hover:text-[#ededec]'
          }`}
        >
          <span className="material-symbols-outlined text-[23px]">calendar_today</span>
          {activeTab === 'schedule' && (
            <span className="w-1 h-1 bg-[#e9c349] rounded-full mt-0.5 shadow-[0_0_6px_#e9c349]"></span>
          )}
        </button>

        {/* Nova Mic Voice Node (Liquid Glass Interactive Centerpiece) */}
        <button
          onClick={() => setActiveTab('voice')}
          aria-label="Voice Nova"
          className="flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 cursor-pointer"
        >
          <div className="w-11 h-11 -mt-6 rounded-full liquid-glass-pill border border-white/35 flex items-center justify-center text-[#e9c349] shadow-lg shadow-black/60 hover:brightness-110">
            <span className="material-symbols-outlined text-[22px]">mic</span>
          </div>
        </button>

        {/* CRM / Stakeholders Destination */}
        <button
          onClick={() => setActiveTab('contacts')}
          aria-label="Network"
          className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 cursor-pointer ${
            activeTab === 'contacts' ? 'text-[#e9c349]' : 'text-[#8a938e] hover:text-[#ededec]'
          }`}
        >
          <span className="material-symbols-outlined text-[23px]">group</span>
          {activeTab === 'contacts' && (
            <span className="w-1 h-1 bg-[#e9c349] rounded-full mt-0.5 shadow-[0_0_6px_#e9c349]"></span>
          )}
        </button>

        {/* Settings / Profile Destination */}
        <button
          onClick={() => setActiveTab('settings')}
          aria-label="Settings"
          className={`flex flex-col items-center justify-center relative active:scale-90 transition-transform duration-150 cursor-pointer ${
            activeTab === 'settings' ? 'text-[#e9c349]' : 'text-[#8a938e] hover:text-[#ededec]'
          }`}
        >
          <span className="material-symbols-outlined text-[23px]">settings</span>
          {activeTab === 'settings' && (
            <span className="w-1 h-1 bg-[#e9c349] rounded-full mt-0.5 shadow-[0_0_6px_#e9c349]"></span>
          )}
        </button>
      </nav>
    </div>
  );
}

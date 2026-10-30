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
  MorgenWeekStrip,
  AnyDoMomentModal,
  AnyDoQuickAddBar,
  isDateMatching,
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
  ThemeMode,
} from '@/nimora/screens/WidgetAndSettingsScreens';

interface ThumbSliderNavProps {
  activeTab: string;
  onSelectTab: (tabId: 'home' | 'schedule' | 'voice' | 'contacts' | 'settings') => void;
  remainingCount: number;
}

function ThumbSliderNav({ activeTab, onSelectTab }: ThumbSliderNavProps) {
  const tabs = React.useMemo(() => [
    { id: 'home' as const, label: 'Today', icon: 'home' },
    { id: 'schedule' as const, label: 'Schedule', icon: 'calendar_today' },
    { id: 'voice' as const, label: 'Nova AI', icon: 'mic' },
    { id: 'contacts' as const, label: 'Clients', icon: 'group' },
    { id: 'settings' as const, label: 'Settings', icon: 'settings' },
  ], []);

  // Map sub-tabs to their parent root slider index
  const getIndexForTab = (tab: string) => {
    switch (tab) {
      case 'home': return 0;
      case 'schedule':
      case 'add_task':
      case 'task_details': return 1;
      case 'voice': return 2;
      case 'contacts':
      case 'contact_details': return 3;
      case 'settings':
      case 'notifications':
      case 'widget':
      case 'pricing':
      case 'ai_suggestions': return 4;
      default: return 0;
    }
  };

  const activeIndex = getIndexForTab(activeTab);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPos, setSliderPos] = useState(activeIndex); // 0 to 4 continuous
  const lastTickRef = React.useRef(activeIndex);

  useEffect(() => {
    if (!isDragging) {
      setSliderPos(activeIndex);
      lastTickRef.current = activeIndex;
    }
  }, [activeIndex, isDragging]);

  const calculateSlotFromCoord = (clientX: number) => {
    if (!trackRef.current) return activeIndex;
    const rect = trackRef.current.getBoundingClientRect();
    // Inner track has 6px padding (p-1.5) on left and right
    const innerLeft = rect.left + 6;
    const innerWidth = rect.width - 12;
    const relativeX = clientX - innerLeft;
    const clampedX = Math.max(0, Math.min(innerWidth, relativeX));
    const continuous = (clampedX / innerWidth) * 5;
    return Math.max(0, Math.min(4, continuous - 0.5));
  };

  const handlePointerDown = (clientX: number) => {
    setIsDragging(true);
    const pos = calculateSlotFromCoord(clientX);
    setSliderPos(pos);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging) return;
    const pos = calculateSlotFromCoord(clientX);
    setSliderPos(pos);
    const nearest = Math.max(0, Math.min(4, Math.round(pos)));
    if (nearest !== lastTickRef.current) {
      lastTickRef.current = nearest;
      haptics.tabChange();
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const finalIndex = Math.max(0, Math.min(4, Math.round(sliderPos)));
    setSliderPos(finalIndex);
    onSelectTab(tabs[finalIndex].id);
    haptics.sliderSnap();
  };

  const currentHoveredTab = tabs[Math.max(0, Math.min(4, Math.round(sliderPos)))];

  return (
    <div className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-md z-50 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-auto select-none">
      {/* Slider Interactive Guide Badge - Appears ONLY during active sliding gesture to keep UI clean */}
      {isDragging && (
        <div className="flex justify-center mb-1.5 pointer-events-none transition-opacity duration-150">
          <div className="px-3 py-0.5 rounded-full liquid-glass text-[9px] font-mono tracking-widest text-[#bef264] uppercase flex items-center gap-1.5 shadow-md border border-purple-500/20">
            <span>{currentHoveredTab.label.toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* Main Thumb Slider Track */}
      <div
        ref={trackRef}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={handlePointerUp}
        onMouseDown={(e) => handlePointerDown(e.clientX)}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onMouseUp={handlePointerUp}
        className="thumb-slider-track relative h-16 rounded-full p-1.5 shadow-2xl cursor-grab active:cursor-grabbing"
      >
        <div className="relative w-full h-full">
          {/* Sliding Elevated Liquid Glass Thumb Capsule (Perfect sub-pixel centering with inner grid) */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none transition-all p-0.5"
            style={{
              width: '20%',
              left: 0,
              transform: `translateX(${sliderPos * 100}%)`,
              transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="w-full h-full rounded-full thumb-slider-capsule" />
          </div>

          {/* 5 Destination Slots */}
          <div className="relative z-10 w-full h-full grid grid-cols-5">
            {tabs.map((tab, idx) => {
              const isSlotActive = Math.round(sliderPos) === idx;
              return (
                <button
                  key={tab.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSliderPos(idx);
                    onSelectTab(tab.id);
                    haptics.sliderSnap();
                  }}
                  aria-label={tab.label}
                  aria-current={isSlotActive ? 'page' : undefined}
                  className={`w-full h-full flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer rounded-full ${
                    isSlotActive ? 'nav-slot-active text-[#bef264]' : 'nav-slot-inactive text-purple-300/60 hover:text-purple-200'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] transition-all duration-150 ${
                      isSlotActive ? 'nav-icon-active text-[#bef264] drop-shadow-[0_0_8px_rgba(190,242,100,0.5)] scale-105' : 'nav-icon-inactive text-purple-300/60'
                    }`}
                    style={{
                      fontVariationSettings: isSlotActive ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {tab.icon}
                  </span>
                  <span
                    className={`text-[9px] font-mono tracking-tight uppercase mt-0.5 transition-colors ${
                      isSlotActive ? 'nav-label-active text-[#bef264] font-extrabold underline decoration-2 underline-offset-2' : 'nav-label-inactive text-purple-300/60 font-medium'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [isProUser, setIsProUser] = useState(false);
  const [isAnyDoMomentOpen, setIsAnyDoMomentOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('2026-10-24');
  const [todayIso, setTodayIso] = useState('2026-10-24');
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [globalToast, setGlobalToast] = useState<{ message: string; onUndo?: () => void } | string | null>(null);

  // Live Day / Night / Auto Theme Mode
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<'day' | 'night'>('night');

  // Load theme preference on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('nimora_theme_mode') as ThemeMode | null;
      if (savedTheme && (savedTheme === 'auto' || savedTheme === 'day' || savedTheme === 'night')) {
        setThemeMode(savedTheme);
      }
    } catch {}
  }, []);

  // Compute resolved theme and update document element attribute
  useEffect(() => {
    const computeTheme = (): 'day' | 'night' => {
      if (themeMode === 'auto') {
        const h = new Date().getHours();
        return h >= 6 && h < 18 ? 'day' : 'night';
      }
      return themeMode;
    };
    const active = computeTheme();
    setResolvedTheme(active);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', active);
      document.body.setAttribute('data-theme', active);
    }
  }, [themeMode]);

  const handleSetThemeMode = (mode: ThemeMode) => {
    haptics.tick();
    setThemeMode(mode);
    try {
      localStorage.setItem('nimora_theme_mode', mode);
    } catch {}
    showGlobalToast(
      mode === 'auto'
        ? '⚡ Auto theme: Solar Day (6 AM - 6 PM), Midnight (6 PM - 6 AM)'
        : mode === 'day'
        ? '☀️ Day Mode activated'
        : '🌙 Night Mode activated'
    );
  };

  const handleToggleTheme = () => {
    const nextMode: ThemeMode =
      themeMode === 'auto' ? 'day' : themeMode === 'day' ? 'night' : 'auto';
    handleSetThemeMode(nextMode);
  };

  useEffect(() => {
    try {
      const now = new Date().toISOString().split('T')[0];
      setTodayIso(now);
      setSelectedCalendarDate(now);
    } catch {}
  }, []);

  const showGlobalToast = (toast: { message: string; onUndo?: () => void } | string) => {
    setGlobalToast(toast);
    const duration = typeof toast === 'object' && toast.onUndo ? 4500 : 2800;
    setTimeout(() => {
      setGlobalToast((prev) => (prev === toast ? null : prev));
    }, duration);
  };

  const handleShareAvailability = () => {
    haptics.success();
    const bookingUrl = 'https://nimora.app/book/sudarshan';
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(bookingUrl).catch(() => {});
    }
    showGlobalToast('✓ Availability Link copied! Share with clients.');
  };

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
    } finally {
      setIsLoadingTasks(false);
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
    const taskToDelete = tasks.find((t) => t.id === id);
    if (taskToDelete) {
      showGlobalToast({
        message: `Deleted "${taskToDelete.title.length > 20 ? taskToDelete.title.slice(0, 20) + '…' : taskToDelete.title}"`,
        onUndo: () => {
          haptics.success();
          handleAddTask(taskToDelete);
          setGlobalToast(null);
        },
      });
    }
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
    setGlobalToast('Demo agenda restored.');
  };

  const handleDeleteAllData = () => {
    setTasks([]);
    try {
      localStorage.removeItem('nimora_planner_tasks');
      localStorage.removeItem('daily-planner-data');
    } catch {}
    setGlobalToast('All agenda tasks permanently deleted.');
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const remainingCount = tasks.filter((t) => t.status !== 'completed').length;

  const isSelectedDateToday = !selectedCalendarDate || selectedCalendarDate === todayIso;

  // If a specific date is selected, filter tasks for that date; otherwise show active schedule
  const displayedTasks = tasks.filter((t) => {
    if (isSelectedDateToday) return true;
    return isDateMatching(t.date, selectedCalendarDate);
  });

  const formattedSelectedDate = (() => {
    try {
      const [y, m, d] = (selectedCalendarDate || '').split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return selectedCalendarDate;
    }
  })();

  // Active high priority task: picks active high-priority task, then any active task, fallback to first task
  const activeFocusTask = tasks.find((t) => t.priority === 'high' && t.status !== 'completed')
    || tasks.find((t) => t.status !== 'completed')
    || tasks[0];

  return (
    <div
      data-theme={resolvedTheme}
      className="bg-[#0e0b1f] text-[#f8fafc] min-h-screen antialiased selection:bg-[#bef264]/30 selection:text-[#bef264] relative pb-32 max-w-md mx-auto shadow-2xl transition-colors duration-200"
    >
      {/* Top Navigation Shell (Liquid Glass Material) */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-14 liquid-glass-header shadow-sm max-w-md left-1/2 -translate-x-1/2 border-b border-purple-500/20">
        <div className="flex items-center space-x-2">
          {/* NIMORA Brand Logo with Asset Placeholder */}
          <div className="w-8 h-8 rounded-lg liquid-glass-pill border border-purple-400/30 flex items-center justify-center shadow-sm">
            <span className="text-[#bef264] font-bold text-sm font-['Space_Grotesk']">N</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-['Space_Grotesk'] text-base tracking-wider text-[#f8fafc] font-bold">
              NIMORA
            </span>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1 ${
                isProUser
                  ? 'liquid-glass-pill text-[#bef264] border-purple-300/40 font-bold shadow-[0_0_12px_rgba(190,242,100,0.35)]'
                  : 'bg-[#1f1940] text-[#bef264] border border-[#bef264]/30'
              }`}
              title={isProUser ? 'PRO Member Active' : 'View Membership Plans'}
            >
              {isProUser && <span className="text-[10px]">★</span>}
              <span>PRO</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Day / Night Theme Switcher Pill */}
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label="Toggle Day / Night Mode"
            className="px-2.5 h-8 rounded-full flex items-center justify-center gap-1 text-[11px] font-mono font-bold transition-all duration-150 active:scale-95 border border-purple-500/20 bg-[#171330] hover:border-[#bef264]/40 cursor-pointer shadow-sm"
            title={`Current mode: ${themeMode.toUpperCase()} (${resolvedTheme} active). Tap to cycle: Auto → Day → Night.`}
          >
            <span className="text-sm">{resolvedTheme === 'day' ? '☀️' : '🌙'}</span>
            <span className="text-[9px] text-[#bef264] font-mono tracking-wider">
              {themeMode === 'auto' ? 'AUTO' : themeMode === 'day' ? 'DAY' : 'NIGHT'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            aria-label="Notifications"
            className="w-9 h-9 rounded-full flex items-center justify-center text-purple-200/80 hover:text-white transition-colors duration-150 active:scale-95 border border-purple-500/20 bg-[#171330] relative"
          >
            <span className="material-symbols-outlined text-[19px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#bef264] shadow-[0_0_6px_#bef264]"></span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            aria-label="Open User Settings"
            className="w-9 h-9 rounded-full p-0.5 border border-purple-400/30 overflow-hidden bg-[#171330] cursor-pointer hover:border-[#bef264]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#bef264]"
          >
            <div className="w-full h-full rounded-full bg-[#251e4d] flex items-center justify-center text-[#bef264] font-['Space_Grotesk'] text-xs font-bold">
              SM
            </div>
          </button>
        </div>
      </nav>

      {/* Main View Area */}
      {activeTab === 'home' && (
        <main className="pt-16 px-4 pb-36 space-y-4">
          {/* Executive Greeting & Persona Hierarchy (Utilitarian Minimalism) */}
          <section className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-purple-300 tracking-wide flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bef264] shadow-[0_0_6px_#bef264]"></span> Principal Architect
                </span>
                <h1 className="font-['Space_Grotesk'] text-3xl font-extrabold tracking-tight text-[#f8fafc] mt-1">
                  Good Morning, Sudarshan
                </h1>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-purple-300/60 block uppercase tracking-wider">WED, OCT 24</span>
                <span className="text-xs text-[#bef264] font-medium">Bespoke Studio</span>
              </div>
            </div>

            {/* Daily Quote Badge (Minimalist Card) */}
            <div className="minimal-card rounded-xl px-3.5 py-2.5 mt-2 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#bef264] text-[18px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                lightbulb
              </span>
              <p className="text-xs text-purple-200/90 italic font-medium quote-text">
                &ldquo;A focused day creates bigger opportunities.&rdquo;
              </p>
            </div>

            {/* Morgen 7-Day Interactive Week Density Strip */}
            <div className="pt-2">
              <MorgenWeekStrip
                selectedDate={selectedCalendarDate}
                onSelectDate={(newDate) => {
                  setSelectedCalendarDate(newDate);
                }}
                tasks={tasks}
              />
            </div>
          </section>

          {/* Daily Progress Gauge & Operational Metrics Bento Grid (80% Minimalist Bento) */}
          <section className="minimal-card rounded-2xl p-4.5 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              {/* Radial Gauge Indicator */}
              <div className="flex items-center space-x-3.5">
                <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background Ring */}
                    <path
                      className="text-[#251e4d]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    {/* Progress Arc (Gen Z Acid Lime) */}
                    <path
                      className="text-[#bef264] stroke-current transition-all duration-700"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeDasharray={`${progressPercent}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-['Space_Grotesk'] text-base font-bold text-[#f8fafc] leading-none">
                      {progressPercent}%
                    </span>
                    <span className="text-[8px] font-mono text-purple-300/60 uppercase tracking-wider mt-0.5">
                      Done
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="font-['Space_Grotesk'] text-sm text-[#f8fafc] font-semibold">
                    Today&apos;s Agenda
                  </h2>
                  <p className="text-xs text-purple-200/70 mt-0.5">
                    {completedCount} of {tasks.length} milestones finalized
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#bef264]"></span>
                    <span className="text-xs text-[#bef264] tracking-wide font-medium">
                      {remainingCount} Tasks Remaining
                    </span>
                  </div>
                </div>
              </div>

              {/* Nimora Quick Actions - Aligned with Header Baseline */}
              <div className="flex items-center gap-1.5 pt-1 shrink-0">
                <button
                  onClick={() => setIsAnyDoMomentOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#bef264] text-[#0e0b1f] font-mono text-[10px] font-bold tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 cursor-pointer shadow-[0_0_12px_rgba(190,242,100,0.3)]"
                  title="Start Daily Focus Ritual"
                >
                  <span>⚡</span>
                  <span>Plan Day</span>
                </button>
                <button
                  onClick={handleShareAvailability}
                  aria-label="Share Booking Slots"
                  className="p-2 rounded-lg minimal-btn-secondary text-purple-200 hover:text-[#bef264] active:scale-95 transition-all cursor-pointer"
                  title="Share Booking & Availability Link"
                >
                  <span className="material-symbols-outlined text-[17px]">share</span>
                </button>
                <button
                  onClick={() => downloadICS(tasks, 'nimora-daily-schedule.ics')}
                  aria-label="Export iCalendar"
                  className="p-2 rounded-lg minimal-btn-secondary text-purple-200 hover:text-[#bef264] active:scale-95 transition-all cursor-pointer"
                  title="Download Calendar (.ics)"
                >
                  <span className="material-symbols-outlined text-[17px]">calendar_today</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bento Counters */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-purple-500/15">
              <div className="bg-[#1f1940] rounded-xl p-2.5 text-center border border-purple-500/20">
                <span className="font-['Space_Grotesk'] text-base font-bold text-[#bef264] block">3</span>
                <span className="text-[9px] font-mono text-purple-300/60 uppercase tracking-wider">Calls</span>
              </div>
              <div className="bg-[#1f1940] rounded-xl p-2.5 text-center border border-purple-500/20">
                <span className="font-['Space_Grotesk'] text-base font-bold text-[#c084fc] block">2</span>
                <span className="text-[9px] font-mono text-purple-300/60 uppercase tracking-wider">Site Visits</span>
              </div>
              <div className="bg-[#1f1940] rounded-xl p-2.5 text-center border border-purple-500/20">
                <span className="font-['Space_Grotesk'] text-base font-bold text-[#38bdf8] block">1</span>
                <span className="text-[9px] font-mono text-purple-300/60 uppercase tracking-wider">Review</span>
              </div>
            </div>
          </section>

          {/* Active Now Focus Block (20% Liquid Glass Focal Centerpiece!) */}
          {activeFocusTask && (
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-mono uppercase tracking-widest text-[#c084fc] font-semibold flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#bef264] animate-ping"></span>
                  Active Focus
                </h2>
                <span className="text-[10px] font-mono text-[#bef264] font-medium">Live Priority</span>
              </div>

              {/* High Priority Liquid Glass Card */}
              <div
                onClick={() => {
                  setSelectedTask(activeFocusTask);
                  setActiveTab('task_details');
                }}
                className="liquid-glass liquid-sheen rounded-2xl p-5 pb-5 border border-[#bef264]/40 shadow-2xl cursor-pointer hover:border-[#bef264]/80 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider">
                        High Priority
                      </span>
                      <span className="text-xs font-mono text-[#bef264] font-semibold">
                        NOW · {activeFocusTask.startTime} – {activeFocusTask.endTime}
                      </span>
                    </div>
                    <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#f8fafc] leading-tight mt-1">
                      {activeFocusTask.title}
                    </h3>
                    <p className="text-xs text-purple-200/80 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#c084fc]">location_city</span>
                      {activeFocusTask.subtitle || 'Arun Mehta (Apex Builders) · Skyline Tower B'}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[#bef264] text-[22px]">engineering</span>
                </div>

                {/* Quick Interaction Actions - Unified secondary buttons & high-contrast Done affordance */}
                <div
                  className="flex items-center gap-2 mt-4 pt-3.5 pb-1 border-t border-purple-500/20"
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
                    className="flex-1 py-2 px-3 rounded-xl minimal-btn-secondary flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer hover:border-[#bef264]/40"
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-emerald-400">chat</span>
                    WhatsApp
                  </a>
                  <button
                    onClick={() => handleToggleTask(activeFocusTask.id)}
                    aria-label={activeFocusTask.status === 'completed' ? 'Completed' : 'Mark task as completed'}
                    title={activeFocusTask.status === 'completed' ? 'Completed' : 'Mark completed'}
                    className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold active:scale-95 transition-all flex items-center gap-1 cursor-pointer ${
                      activeFocusTask.status === 'completed'
                        ? 'bg-[#bef264] text-[#0e0b1f] border-[#bef264]'
                        : 'bg-[#221b44] text-[#bef264] border-[#bef264]/40 hover:bg-[#bef264]/20 hover:border-[#bef264]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {activeFocusTask.status === 'completed' ? 'check_circle' : 'check'}
                    </span>
                    <span className="text-[10px]">DONE</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Express Quick Add Inline Bar */}
          <section>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-purple-200/80 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bef264]"></span>
                Quick Capture
              </span>
              <span className="text-[10px] font-mono text-[#bef264]">Instant Save</span>
            </div>
            <AnyDoQuickAddBar onAddTask={handleAddTask} selectedDate={selectedCalendarDate} />
          </section>

          {/* Upcoming Tasks Section (80% Utilitarian Minimalism) */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-[#f8fafc]">
                  {isSelectedDateToday ? "Today's Schedule" : `Schedule for ${formattedSelectedDate}`}
                </h2>
                {!isSelectedDateToday && (
                  <p className="text-[11px] font-mono text-[#bef264]">
                    {displayedTasks.length} milestone{displayedTasks.length === 1 ? '' : 's'} scheduled
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!isSelectedDateToday && (
                  <button
                    onClick={() => {
                      haptics.tick();
                      setSelectedCalendarDate(new Date().toISOString().split('T')[0]);
                    }}
                    className="text-xs font-mono text-purple-300/70 hover:text-white underline cursor-pointer"
                  >
                    View Today
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('add_task')}
                  className="text-xs font-semibold text-[#bef264] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  + Add Task
                </button>
              </div>
            </div>

            {/* Swipe instruction hint */}
            <div className="p-2.5 minimal-card-subtle rounded-xl flex items-center justify-between text-xs text-purple-200/80 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#bef264]">swipe</span>
                <span>Slide card horizontally to reveal actions</span>
              </span>
              <span className="text-[#bef264] font-bold">‹ ›</span>
            </div>

            {isLoadingTasks ? (
              /* Skeleton screen placeholder cards */
              <div className="space-y-3 my-2 animate-pulse" aria-busy="true" aria-label="Loading schedule">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="rounded-2xl p-4 bg-white/[0.04] border border-white/[0.06] space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div className="h-3.5 bg-white/15 rounded w-1/4" />
                      <div className="h-3.5 bg-white/10 rounded w-16" />
                    </div>
                    <div className="h-5 bg-white/20 rounded w-4/5" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : displayedTasks.length === 0 ? (
              <div className="minimal-card rounded-2xl p-6 text-center space-y-3 border border-dashed border-white/10 my-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#bef264]/10 text-[#bef264] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">event_available</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#f8fafc] font-['Space_Grotesk']">
                    No tasks scheduled for {formattedSelectedDate}
                  </p>
                  <p className="text-xs text-purple-300/60 mt-0.5 font-mono">
                    Type above in Quick Capture or click below to schedule
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('add_task')}
                  className="px-4 py-2 rounded-xl bg-[#bef264] text-[#0e0b1f] text-xs font-bold font-mono hover:brightness-110 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-[0_0_12px_rgba(190,242,100,0.3)]"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>+ Plan Task for {formattedSelectedDate}</span>
                </button>
              </div>
            ) : (
              displayedTasks.map((task) => (
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
              ))
            )}
          </section>
        </main>
      )}

      {/* Schedule View */}
      {activeTab === 'schedule' && (
        <div className="pt-16 px-4 pb-36">
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
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
          />
        </div>
      )}

      {/* Add Task View */}
      {activeTab === 'add_task' && (
        <div className="pt-16 px-4 pb-36">
          <Screen09AddTask
            tasks={tasks}
            contacts={contacts}
            selectedDate={selectedCalendarDate}
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
        <div className="pt-16 px-4 pb-36">
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
        <div className="pt-16 px-4 pb-36">
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
            onToggleTask={handleToggleTask}
            onUpdateTask={handleUpdateTask}
          />
        </div>
      )}

      {/* CRM & Contacts View */}
      {activeTab === 'contacts' && (
        <div className="pt-16 px-4 pb-36">
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
        <div className="pt-16 px-4 pb-36">
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
        <div className="pt-16 px-4 pb-36">
          <Screen16Notifications
            tasks={tasks}
            notifications={INITIAL_NOTIFICATIONS}
            onNavigate={() => setActiveTab('home')}
          />
        </div>
      )}

      {/* Widget Preview View */}
      {activeTab === 'widget' && (
        <div className="pt-16 px-4 pb-36">
          <Screen15Widget
            tasks={tasks}
            notifications={INITIAL_NOTIFICATIONS}
            onNavigate={() => setActiveTab('home')}
          />
        </div>
      )}

      {/* AI Suggestions View */}
      {activeTab === 'ai_suggestions' && (
        <div className="pt-16 px-4 pb-36">
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
        <div className="pt-16 px-4 pb-36">
          <Screen18ProfileSettings
            tasks={tasks}
            notifications={INITIAL_NOTIFICATIONS}
            themeMode={themeMode}
            onThemeChange={handleSetThemeMode}
            onNavigate={(mod) => {
              if (mod === 12) setActiveTab('widget');
              else if (mod === 13) setActiveTab('notifications');
              else if (mod === 99) setActiveTab('pricing');
              else if (mod === 3) setActiveTab('voice');
              else if (mod === 5) setActiveTab('home');
              else setActiveTab('home');
            }}
            onResetData={handleResetData}
            onDeleteAllData={handleDeleteAllData}
          />
        </div>
      )}

      {/* Subscription & Pricing Plans View */}
      {activeTab === 'pricing' && (
        <div className="pt-16 px-4 pb-36">
          <Screen19SubscriptionPlans
            onNavigate={() => setActiveTab('settings')}
            onSubscriptionSuccess={() => setIsProUser(true)}
          />
        </div>
      )}

      {/* Push-to-Talk Voice Command Dock ("Ask Nova...") [20% Liquid Glass Material] */}
      {activeTab !== 'voice' && (
        <div className="fixed bottom-20 left-0 w-full px-4 z-40 flex justify-center pointer-events-none max-w-md left-1/2 -translate-x-1/2">
          <div
            onClick={() => setActiveTab('voice')}
            className="pointer-events-auto voice-pulse liquid-glass-pill rounded-full py-2.5 px-5 flex items-center space-x-3 cursor-pointer hover:scale-[1.03] active:scale-95 transition-all shadow-xl"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 border border-purple-400/30 flex items-center justify-center text-[#bef264] shadow-inner">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                mic
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#f8fafc] font-semibold tracking-tight">Ask {assistantName}...</span>
              <div className="flex space-x-0.5 items-center">
                <span className="w-1 h-3 bg-[#bef264] rounded-full animate-pulse"></span>
                <span className="w-1 h-5 bg-[#c084fc] rounded-full animate-pulse" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-1 h-2 bg-[#38bdf8] rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-[#bef264] font-bold uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded border border-purple-400/25">
              AI
            </span>
          </div>
        </div>
      )}

      {/* Global Toast Notification with Undo Action */}
      {globalToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="liquid-glass rounded-xl px-3.5 py-2.5 border border-[#bef264]/50 text-xs text-[#bef264] font-mono flex items-center justify-between gap-2 shadow-2xl">
            <span className="flex items-center gap-1.5 min-w-0 truncate">
              <span className="material-symbols-outlined text-[15px] shrink-0">check_circle</span>
              <span className="truncate">
                {typeof globalToast === 'string' ? globalToast : globalToast.message}
              </span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {typeof globalToast === 'object' && globalToast?.onUndo && (
                <button
                  type="button"
                  onClick={() => {
                    globalToast.onUndo?.();
                  }}
                  className="px-2 py-0.5 rounded bg-[#bef264] text-[#0e0b1f] font-bold text-[10px] uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  Undo
                </button>
              )}
              <button
                type="button"
                onClick={() => setGlobalToast(null)}
                aria-label="Dismiss notification"
                className="p-1 min-w-[24px] min-h-[24px] flex items-center justify-center text-purple-300/60 hover:text-white cursor-pointer rounded"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Any.do Moment Planning Modal */}
      <AnyDoMomentModal
        isOpen={isAnyDoMomentOpen}
        onClose={() => setIsAnyDoMomentOpen(false)}
        tasks={tasks}
        onToggleTask={handleToggleTask}
        onUpdateTask={handleUpdateTask}
      />

      {/* Thumb Slider Bottom Navigation [Interactive Sliding Capsule Bar] */}
      <ThumbSliderNav
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        remainingCount={remainingCount}
      />
    </div>
  );
}

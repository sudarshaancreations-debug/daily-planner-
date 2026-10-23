'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { NimoraTask, Contact } from '../data';
import { downloadICS } from '@/lib/exportUtils';
import { haptics } from '@/lib/haptics';

export interface PlanningProps {
  tasks: NimoraTask[];
  contacts: Contact[];
  onNavigate?: (screenNumber: number) => void;
  onAddTask?: (task: NimoraTask) => void;
  onToggleTask?: (id: string) => void;
  onSelectTask?: (task: NimoraTask) => void;
  onDeleteTask?: (id: string) => void;
  onUpdateTask?: (task: NimoraTask) => void;
  selectedTask?: NimoraTask;
  selectedDate?: string;
}

// ============================================================================
// MORGEN REFERENCE: SLIDABLE INTERACTIVE DATE STRIP WITH DENSITY DOTS
// ============================================================================
export interface MorgenWeekStripProps {
  selectedDate: string;
  onSelectDate: (dateIso: string) => void;
  tasks?: NimoraTask[];
}

export interface MorgenDayItem {
  iso: string;
  weekdayNarrow: string;
  weekdayShort: string;
  dayNum: number;
  monthShort: string;
  monthLong: string;
  year: number;
  isToday: boolean;
}

export function isDateMatching(taskDate: string | undefined, targetIso: string): boolean {
  if (!taskDate) return false;
  if (taskDate === targetIso || taskDate.includes(targetIso)) return true;
  try {
    const [y, m, d] = targetIso.split('-').map(Number);
    const targetDate = new Date(y, m - 1, d);
    const parsed = new Date(taskDate);
    if (!isNaN(parsed.getTime())) {
      return (
        parsed.getFullYear() === targetDate.getFullYear() &&
        parsed.getMonth() === targetDate.getMonth() &&
        parsed.getDate() === targetDate.getDate()
      );
    }
  } catch {}
  return false;
}

function generateDaysWindow(centerIso: string, todayIso: string): MorgenDayItem[] {
  try {
    const [cy, cm, cd] = (centerIso || todayIso).split('-').map(Number);
    const centerDate = new Date(cy, cm - 1, cd);
    // Spanning 14 days in the past and 75 days in the future for planning anytime
    const startDate = new Date(centerDate);
    startDate.setDate(startDate.getDate() - 14);

    const result: MorgenDayItem[] = [];
    for (let i = 0; i < 90; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      result.push({
        iso,
        weekdayNarrow: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
        weekdayShort: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthShort: d.toLocaleDateString('en-US', { month: 'short' }),
        monthLong: d.toLocaleDateString('en-US', { month: 'long' }),
        year: d.getFullYear(),
        isToday: iso === todayIso,
      });
    }
    return result;
  } catch {
    return [];
  }
}

export function MorgenWeekStrip({ selectedDate, onSelectDate, tasks = [] }: MorgenWeekStripProps) {
  const [todayIso, setTodayIso] = useState('2026-10-24');
  const [days, setDays] = useState<MorgenDayItem[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    try {
      const nowIso = new Date().toISOString().split('T')[0];
      setTodayIso(nowIso);
      const initialCenter = selectedDate || nowIso;
      setDays(generateDaysWindow(initialCenter, nowIso));
    } catch {}
  }, []);

  // Ensure selectedDate is included in days range
  useEffect(() => {
    if (!selectedDate || days.length === 0) return;
    const exists = days.some((d) => d.iso === selectedDate);
    if (!exists) {
      setDays(generateDaysWindow(selectedDate, todayIso));
    }
  }, [selectedDate, days, todayIso]);

  // Smoothly center the selected date in the horizontal viewport
  useEffect(() => {
    if (!scrollContainerRef.current || !selectedDate) return;
    const timer = setTimeout(() => {
      const target = scrollContainerRef.current?.querySelector<HTMLElement>(`[data-date="${selectedDate}"]`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [selectedDate, days]);

  const currentMonthYear = useMemo(() => {
    try {
      if (!selectedDate) return 'October 2026';
      const [y, m, d] = selectedDate.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return 'October 2026';
    }
  }, [selectedDate]);

  const handleSlideLeft = () => {
    haptics.tick();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const handleSlideRight = () => {
    haptics.tick();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const handleSelectDay = (iso: string) => {
    if (hasDraggedRef.current) return;
    haptics.tick();
    onSelectDate(iso);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 6) {
      hasDraggedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 60);
  };

  // Calculate task density count for each day
  const getDotCount = (dayIso: string) => {
    const matching = tasks.filter((t) => isDateMatching(t.date, dayIso));
    if (matching.length > 0) return Math.min(3, matching.length);
    return 0;
  };

  return (
    <div className="w-full select-none">
      {/* Month, Year, and Slide Controls Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[17px] text-[#bef264]">date_range</span>
          <span className="text-xs font-bold text-white font-['Space_Grotesk'] tracking-wide">
            {currentMonthYear}
          </span>
          {/* Quick Date Picker to jump to any date to plan ahead */}
          <label
            className="cursor-pointer text-purple-300/60 hover:text-[#bef264] transition-colors relative flex items-center p-1 rounded-md hover:bg-white/[0.06]"
            title="Jump to any date in calendar"
          >
            <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  haptics.tick();
                  onSelectDate(e.target.value);
                }
              }}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </label>
        </div>

        <div className="flex items-center gap-1.5">
          {selectedDate !== todayIso && (
            <button
              type="button"
              onClick={() => {
                haptics.tick();
                onSelectDate(todayIso);
              }}
              className="text-[11px] font-mono text-[#bef264] hover:underline flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#bef264]/10 border border-[#bef264]/20 cursor-pointer transition-all active:scale-95"
            >
              <span>Today</span>
              <span className="material-symbols-outlined text-xs">restart_alt</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleSlideLeft}
            aria-label="Previous days"
            className="w-7 h-7 rounded-lg bg-[#171330] border border-purple-500/20 hover:border-[#bef264]/40 text-purple-200 hover:text-[#bef264] flex items-center justify-center text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Slide previous days"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleSlideRight}
            aria-label="Next days"
            className="w-7 h-7 rounded-lg bg-[#171330] border border-purple-500/20 hover:border-[#bef264]/40 text-purple-200 hover:text-[#bef264] flex items-center justify-center text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Slide next days"
          >
            ›
          </button>
        </div>
      </div>

      {/* Slidable Dates Container */}
      <div className="relative group">
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-[#171330] to-transparent z-10 pointer-events-none rounded-l-2xl" />
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-[#171330] to-transparent z-10 pointer-events-none rounded-r-2xl" />

        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex items-center gap-1.5 p-1.5 bg-[#171330] rounded-2xl border border-purple-500/20 overflow-x-auto scroll-smooth select-none cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x',
          }}
        >
          {days.map((day) => {
            const isSelected = selectedDate === day.iso;
            const dotCount = getDotCount(day.iso);

            return (
              <button
                key={day.iso}
                data-date={day.iso}
                type="button"
                onClick={() => handleSelectDay(day.iso)}
                className={`w-[48px] min-w-[48px] py-2 px-1 rounded-xl flex flex-col items-center justify-center shrink-0 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#bef264] text-[#0e0b1f] font-bold shadow-[0_0_14px_rgba(190,242,100,0.4)] scale-105 z-10'
                    : day.isToday
                    ? 'text-[#f8fafc] bg-[#221b44] border border-[#bef264]/50 hover:bg-[#2c2358]'
                    : 'text-purple-200/80 hover:bg-[#221b44] hover:text-white'
                }`}
              >
                <span
                  className={`text-[9px] font-mono uppercase tracking-wider ${
                    isSelected
                      ? 'text-[#0e0b1f] font-extrabold'
                      : day.isToday
                      ? 'text-[#bef264] font-bold'
                      : 'text-purple-300/60'
                  }`}
                >
                  {day.weekdayNarrow}
                </span>
                <span
                  className={`text-xs font-['Space_Grotesk'] font-bold mt-0.5 ${
                    isSelected ? 'text-[#0e0b1f]' : 'text-[#f8fafc]'
                  }`}
                >
                  {day.dayNum}
                </span>
                {/* Density dots in Morgen signature style */}
                <div className="flex items-center gap-0.5 mt-1 h-1">
                  {dotCount > 0 ? (
                    Array.from({ length: dotCount }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-1 h-1 rounded-full ${isSelected ? 'bg-[#0e0b1f]' : 'bg-[#bef264]'}`}
                      />
                    ))
                  ) : day.isToday ? (
                    <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-[#0e0b1f]' : 'bg-purple-400/40'}`} />
                  ) : (
                    <span className="w-1 h-1" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between px-1.5 mt-1 text-[10px] font-mono text-purple-300/50">
        <span>‹ Drag or swipe to slide dates ›</span>
        <span>Tap any date to plan</span>
      </div>
    </div>
  );
}

// ============================================================================
// ANY.DO REFERENCE: EXPRESS INLINE QUICK ADD BAR WITH SMART CHIPS
// ============================================================================
export interface AnyDoQuickAddBarProps {
  onAddTask?: (task: NimoraTask) => void;
  selectedDate?: string;
}

export function AnyDoQuickAddBar({ onAddTask, selectedDate }: AnyDoQuickAddBarProps) {
  const [inputVal, setInputVal] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTimeChip, setSelectedTimeChip] = useState('09:00 AM');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const chips = [
    { label: '⚡ 9:00 AM', time: '09:00 AM', priority: 'medium' as const },
    { label: '☀️ 2:00 PM', time: '02:00 PM', priority: 'medium' as const },
    { label: '🌙 6:00 PM', time: '06:00 PM', priority: 'low' as const },
    { label: '🔥 Urgent', time: '11:00 AM', priority: 'high' as const },
  ];

  const handleQuickSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputVal.trim()) return;

    haptics.success();
    const dateStr = selectedDate || new Date().toISOString().split('T')[0];

    const newTask: NimoraTask = {
      id: `t_${Date.now()}`,
      title: inputVal.trim(),
      category: 'task',
      date: dateStr,
      startTime: selectedTimeChip,
      endTime: '10:00 AM',
      durationMinutes: 45,
      priority,
      status: 'upcoming',
      color: priority === 'high' ? 'coral' : 'blue',
      notes: 'Quick added via Any.do express bar',
    };

    onAddTask?.(newTask);
    setInputVal('');
    setIsFocused(false);
  };

  return (
    <div className="w-full select-none my-2">
      <form
        onSubmit={handleQuickSubmit}
        className={`p-2 bg-[#171330] rounded-xl border transition-all ${
          isFocused ? 'border-[#bef264]/60 shadow-[0_0_14px_rgba(190,242,100,0.15)]' : 'border-purple-500/20'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#bef264]">add_circle</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="＋ Quick add task (e.g. Client call at 4pm)..."
            className="w-full bg-transparent text-xs text-[#f8fafc] placeholder-purple-300/40 outline-none font-mono"
          />
          {inputVal.trim() && (
            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-[#bef264] text-[#0e0b1f] font-mono text-[10px] font-bold tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              ADD
            </button>
          )}
        </div>

        {/* Any.do Smart Express Chips */}
        {(isFocused || inputVal) && (
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-purple-500/15 overflow-x-auto">
            <span className="text-[8px] font-mono uppercase text-purple-300/50 shrink-0">Time:</span>
            {chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  haptics.tick();
                  setSelectedTimeChip(chip.time);
                  if (chip.priority) setPriority(chip.priority);
                }}
                className={`text-[9px] font-mono px-2 py-0.5 rounded-md transition-all shrink-0 cursor-pointer ${
                  selectedTimeChip === chip.time
                    ? 'bg-[#251e4d] text-[#bef264] border border-[#bef264]/40 font-bold'
                    : 'bg-[#1f1940] text-purple-200/70 hover:text-white border border-purple-500/10'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}

// ============================================================================
// ANY.DO REFERENCE: "ANY.DO MOMENT" DAILY PLANNING RITUAL MODAL
// ============================================================================
export interface AnyDoMomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: NimoraTask[];
  onToggleTask?: (id: string) => void;
  onUpdateTask?: (task: NimoraTask) => void;
}

export function AnyDoMomentModal({
  isOpen,
  onClose,
  tasks,
  onToggleTask,
  onUpdateTask,
}: AnyDoMomentModalProps) {
  const activeTasks = useMemo(() => tasks.filter((t) => t.status !== 'completed'), [tasks]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompletedFlow, setIsCompletedFlow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsCompletedFlow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTask = activeTasks[currentIndex];

  const handleAction = (action: 'today' | 'tomorrow' | 'someday' | 'done') => {
    if (!currentTask) return;

    if (action === 'done') {
      haptics.success();
      onToggleTask?.(currentTask.id);
    } else if (action === 'tomorrow') {
      haptics.tick();
      const d = new Date();
      d.setDate(d.getDate() + 1);
      onUpdateTask?.({ ...currentTask, date: d.toISOString().split('T')[0] });
    } else if (action === 'someday') {
      haptics.tick();
      onUpdateTask?.({ ...currentTask, priority: 'low' });
    } else {
      haptics.tick();
    }

    if (currentIndex + 1 < activeTasks.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompletedFlow(true);
      haptics.success();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0b1f]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-[#171330] border border-purple-400/30 shadow-2xl p-5 relative overflow-hidden select-none">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#bef264]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        {isCompletedFlow || !currentTask ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#bef264]/20 border border-[#bef264]/40 text-[#bef264] flex items-center justify-center mx-auto text-2xl shadow-[0_0_20px_rgba(190,242,100,0.3)]">
              ✨
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#f8fafc]">
                You&apos;re All Planned!
              </h3>
              <p className="text-xs text-purple-200/80 mt-1 max-w-xs mx-auto">
                Any.do Moment complete. Your day is streamlined and prioritized for high productivity.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#bef264] text-[#0e0b1f] font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg"
            >
              Start My Day 🚀
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header with Step Counter */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-purple-500/20 text-[#bef264] border border-[#bef264]/30 font-semibold flex items-center gap-1">
                <span>⚡</span> ANY.DO MOMENT
              </span>
              <span className="text-[10px] font-mono text-purple-300/70">
                {currentIndex + 1} of {activeTasks.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-[#251e4d] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#bef264] transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / activeTasks.length) * 100}%` }}
              />
            </div>

            {/* Current Task Review Card */}
            <div className="p-4 rounded-2xl bg-[#1f1940] border border-purple-500/20 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#bef264] font-semibold">
                  {currentTask.startTime} – {currentTask.endTime}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-purple-900/50 text-purple-200 uppercase text-[8px] border border-purple-500/20">
                  {currentTask.category}
                </span>
              </div>
              <h4 className="font-['Space_Grotesk'] text-base font-bold text-[#f8fafc] leading-snug">
                {currentTask.title}
              </h4>
              {currentTask.subtitle && (
                <p className="text-xs text-purple-200/70">{currentTask.subtitle}</p>
              )}
              {currentTask.notes && (
                <p className="text-[11px] text-purple-300/60 italic font-mono">{currentTask.notes}</p>
              )}
            </div>

            <p className="text-center text-[10px] font-mono text-purple-300/70">
              When would you like to tackle this?
            </p>

            {/* 4 Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleAction('today')}
                className="p-3 rounded-xl bg-[#251e4d] hover:bg-[#2e265c] text-[#bef264] border border-[#bef264]/30 font-mono text-xs font-semibold flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <span className="text-base">⚡</span>
                <span>Keep Today</span>
              </button>
              <button
                type="button"
                onClick={() => handleAction('tomorrow')}
                className="p-3 rounded-xl bg-[#1f1940] hover:bg-[#251e4d] text-purple-200 border border-purple-500/20 font-mono text-xs font-semibold flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <span className="text-base">⏭</span>
                <span>Tomorrow</span>
              </button>
              <button
                type="button"
                onClick={() => handleAction('someday')}
                className="p-3 rounded-xl bg-[#1f1940] hover:bg-[#251e4d] text-purple-200 border border-purple-500/20 font-mono text-xs font-semibold flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <span className="text-base">🗓</span>
                <span>Someday</span>
              </button>
              <button
                type="button"
                onClick={() => handleAction('done')}
                className="p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-semibold flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <span className="text-base">✓</span>
                <span>Mark Done</span>
              </button>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-[10px] font-mono text-purple-300/50 hover:text-white"
              >
                Skip Planning Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MORGEN REFERENCE: SMART FREE FOCUS BUFFER INDICATOR
// ============================================================================
export interface MorgenFocusBufferProps {
  durationText: string;
  onQuickAdd?: () => void;
}

export function MorgenFocusBuffer({ durationText, onQuickAdd }: MorgenFocusBufferProps) {
  return (
    <div className="my-2 p-3 rounded-xl border border-dashed border-[#bef264]/40 bg-[#171330]/80 flex items-center justify-between select-none hover:border-[#bef264]/70 transition-colors">
      <div className="flex items-center gap-2.5 text-[#bef264]">
        <span className="material-symbols-outlined text-base">hourglass_top</span>
        <div>
          <span className="font-mono text-xs font-bold block text-white">{durationText} Free Focus Slot</span>
          <span className="text-xs font-mono text-purple-200/80">No meetings · Ideal for deep work</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          haptics.tick();
          onQuickAdd?.();
        }}
        className="px-3 py-1.5 rounded-lg bg-[#bef264]/20 hover:bg-[#bef264] text-[#bef264] hover:text-[#0e0b1f] text-xs font-mono font-bold tracking-tight transition-all cursor-pointer border border-[#bef264]/40"
      >
        + Slot
      </button>
    </div>
  );
}

// 5. Home Dashboard
export function Screen07HomeDashboard({ tasks, onNavigate, onToggleTask, onSelectTask }: PlanningProps) {
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  return (
    <div className="w-full h-full min-h-[680px] bg-[#0e0b1f] text-[#f8fafc] flex flex-col justify-between select-none rounded-[38px] overflow-hidden">
      {/* Top Header */}
      <div className="p-5 pb-3 bg-[#0e0b1f]/80 border-b border-[#334155]/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0e3e30] text-[#bef264] font-bold flex items-center justify-center text-sm ring-2 ring-[#bef264]/30 shadow-sm font-['Space_Grotesk']">
              S
            </div>
            <div>
              <p className="text-[10px] text-[#bef264] uppercase tracking-wider font-semibold">Good Morning,</p>
              <h2 className="text-sm font-bold text-[#f8fafc] font-['Space_Grotesk']">Sudarshan</h2>
            </div>
          </div>
          <button
            onClick={() => onNavigate?.(16)}
            className="w-8 h-8 rounded-full bg-[#162540] hover:bg-[#2b2257] flex items-center justify-center text-[#c0c8c3] text-sm border border-[#334155]/30"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Main Scroll Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Quote Card */}
        <div className="glass-card specular-border rounded-2xl p-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm">✨</span>
            <p className="text-xs font-semibold text-[#bef264] italic">
              &ldquo;A focused day creates bigger opportunities.&rdquo;
            </p>
          </div>
        </div>

        {/* Today's Progress Card */}
        <div className="glass-card specular-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#f8fafc] font-['Space_Grotesk']">Today&apos;s Progress</h3>
            <p className="text-xs text-[#c0c8c3] mt-0.5">
              {completedCount} of {tasks.length} tasks completed
            </p>
          </div>

          {/* Progress Circular Gauge */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#2b2257]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#bef264]"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-[#f8fafc] font-['Space_Grotesk']">{progressPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface SwipeableScheduleCardProps {
  task: NimoraTask;
  borderColors: Record<string, string>;
  onToggleTask?: (id: string) => void;
  onSelectTask?: (task: NimoraTask) => void;
  onDeleteTask?: (id: string) => void;
  onNavigate?: (screenNumber: number) => void;
  showWhatsApp?: boolean;
}

export function SwipeableScheduleCard({
  task,
  borderColors,
  onToggleTask,
  onSelectTask,
  onDeleteTask,
  onNavigate,
  showWhatsApp = false,
}: SwipeableScheduleCardProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const hasMovedRef = useRef(false);

  const isCompleted = task.status === 'completed';

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = offsetX;
    setIsDragging(true);
    hasMovedRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasMovedRef.current = true;
    }
    const targetOffset = currentXRef.current + deltaX;
    setOffsetX(Math.max(-140, Math.min(140, targetOffset)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (offsetX > 45) {
      setOffsetX(130);
      haptics.slideReveal();
    } else if (offsetX < -45) {
      setOffsetX(-130);
      haptics.slideReveal();
    } else {
      setOffsetX(0);
    }
  };

  // Mouse drag support for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    currentXRef.current = offsetX;
    setIsDragging(true);
    hasMovedRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasMovedRef.current = true;
    }
    const targetOffset = currentXRef.current + deltaX;
    setOffsetX(Math.max(-140, Math.min(140, targetOffset)));
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (offsetX > 45) {
      setOffsetX(130);
      haptics.slideReveal();
    } else if (offsetX < -45) {
      setOffsetX(-130);
      haptics.slideReveal();
    } else {
      setOffsetX(0);
    }
  };

  const handleCardClick = () => {
    if (hasMovedRef.current || Math.abs(offsetX) > 0) {
      setOffsetX(0);
      return;
    }
    onSelectTask?.(task);
    onNavigate?.(8);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptics.tick();
    setOffsetX(0);
    onSelectTask?.(task);
    onNavigate?.(8);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptics.warning();
    setOffsetX(0);
    onDeleteTask?.(task.id);
  };

  const showLeftActions = offsetX > 0;
  const showRightActions = offsetX < 0;

  return (
    <div className="relative overflow-hidden rounded-xl select-none my-2 bg-[#0e0b1f]">
      {/* Background Action Buttons Layer (Revealed upon swipe) */}
      <div
        className={`absolute inset-0 flex items-center justify-between px-2 bg-[#130e26] rounded-xl border border-white/[0.06] transition-opacity duration-150 ${
          offsetX !== 0 ? 'opacity-100' : 'opacity-0 pointer-events-none invisible'
        }`}
      >
        {/* Left Side Actions (Revealed ONLY when Swiping Right) */}
        <div
          className={`flex items-center gap-1.5 transition-all duration-150 ${
            showLeftActions ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none invisible'
          }`}
        >
          <button
            type="button"
            onClick={handleEdit}
            className="w-14 h-11 px-2 rounded-lg bg-[#162540] border border-white/[0.12] text-[#bef264] text-xs flex flex-col items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer"
            title="Edit Task"
          >
            <span className="material-symbols-outlined text-[17px]">edit</span>
            <span className="text-[9px] font-semibold tracking-wider uppercase font-mono">Edit</span>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-14 h-11 px-2 rounded-lg bg-rose-950/70 border border-rose-500/30 text-rose-300 text-xs flex flex-col items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer"
            title="Delete Task"
          >
            <span className="material-symbols-outlined text-[17px]">delete</span>
            <span className="text-[9px] font-semibold tracking-wider uppercase font-mono">Delete</span>
          </button>
        </div>

        {/* Right Side Actions (Revealed ONLY when Swiping Left) */}
        <div
          className={`flex items-center gap-1.5 ml-auto transition-all duration-150 ${
            showRightActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none invisible'
          }`}
        >
          <button
            type="button"
            onClick={handleEdit}
            className="w-14 h-11 px-2 rounded-lg bg-[#162540] border border-white/[0.12] text-[#bef264] text-xs flex flex-col items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer"
            title="Edit Task"
          >
            <span className="material-symbols-outlined text-[17px]">edit</span>
            <span className="text-[9px] font-semibold tracking-wider uppercase font-mono">Edit</span>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-14 h-11 px-2 rounded-lg bg-rose-950/70 border border-rose-500/30 text-rose-300 text-xs flex flex-col items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer"
            title="Delete Task"
          >
            <span className="material-symbols-outlined text-[17px]">delete</span>
            <span className="text-[9px] font-semibold tracking-wider uppercase font-mono">Delete</span>
          </button>
        </div>
      </div>

      {/* Foreground Sliding Card (Solid Minimalist Obsidian Surface) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCardClick}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className={`relative z-10 p-3.5 rounded-xl border border-white/[0.08] border-l-[3px] ${
          borderColors[task.color] || 'border-l-emerald-500'
        } flex items-start justify-between cursor-pointer bg-[#171330] hover:border-white/[0.16] active:scale-[0.99] transition-all touch-pan-y`}
      >
        <div className={`flex items-start gap-3 flex-1 min-w-0 pr-2 ${isCompleted ? 'opacity-50' : ''}`}>
          {/* Tactile Checkbox */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isCompleted) {
                haptics.tick();
              } else {
                haptics.success();
              }
              onToggleTask?.(task.id);
            }}
            className={`mt-0.5 w-5 h-5 rounded-lg border border-white/25 flex items-center justify-center hover:border-[#bef264] transition-colors shrink-0 ${
              isCompleted ? 'bg-[#bef264] text-gray-950 border-[#bef264]' : 'bg-[#162540]'
            }`}
          >
            {isCompleted && <span className="material-symbols-outlined text-[13px] font-bold">check</span>}
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-mono font-medium text-purple-200">
                {task.startTime} – {task.endTime}
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-lg bg-purple-900/40 text-purple-200 border border-purple-500/20">
                {task.category}
              </span>
            </div>
            <h3
              className={`text-xs font-semibold leading-tight mt-0.5 truncate tracking-tight ${
                isCompleted ? 'line-through text-purple-300/50' : 'text-[#f8fafc]'
              }`}
            >
              {task.title}
            </h3>
            {task.subtitle && (
              <p className="text-xs text-purple-200/70 mt-0.5 truncate">{task.subtitle}</p>
            )}
          </div>
        </div>

        <div className="text-right flex items-center gap-2.5 shrink-0">
          <div className={`flex flex-col items-end gap-0.5 ${isCompleted ? 'opacity-50' : ''}`}>
            {task.priority === 'high' && (
              <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                High
              </span>
            )}
            <span className="text-xs font-mono text-purple-200/80 font-medium">{task.durationMinutes}m</span>
          </div>

          {showWhatsApp && (
            <a
              aria-label="WhatsApp quick trigger"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-lg bg-[#221b44] text-emerald-400 border border-purple-500/20 hover:border-emerald-400/40 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              title="WhatsApp contact"
            >
              <span className="material-symbols-outlined text-base">chat</span>
            </a>
          )}

          {/* Explicit accessible card action button (avoids relying solely on swipe discovery) */}
          <button
            type="button"
            aria-label={`Actions for ${task.title}`}
            onClick={(e) => {
              e.stopPropagation();
              haptics.tick();
              onSelectTask?.(task);
            }}
            className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 hover:border-[#bef264]/50 hover:bg-white/[0.10] text-purple-200 hover:text-[#bef264] flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            title="Task options (or swipe)"
          >
            <span className="material-symbols-outlined text-base">more_vert</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 6. Daily Planner Timeline (Enhanced with Any.do + Morgen)
export function Screen08DailyPlanner({
  tasks,
  contacts,
  onNavigate,
  onSelectTask,
  onToggleTask,
  onDeleteTask,
  onAddTask,
  onUpdateTask,
}: PlanningProps) {
  const [selectedDate, setSelectedDate] = useState('2026-10-24');
  const [todayIso, setTodayIso] = useState('2026-10-24');
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  const [isAnyDoMomentOpen, setIsAnyDoMomentOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCompletedList, setShowCompletedList] = useState(true);

  useEffect(() => {
    try {
      const nowIso = new Date().toISOString().split('T')[0];
      setSelectedDate(nowIso);
      setTodayIso(nowIso);
    } catch {}
  }, []);

  const borderColors: Record<string, string> = {
    blue: 'border-l-blue-500',
    green: 'border-l-emerald-500',
    coral: 'border-l-orange-400',
    orange: 'border-l-orange-400',
    gray: 'border-l-gray-400',
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleShareAvailability = () => {
    haptics.success();
    const bookingUrl = 'https://nimora.app/book/sudarshan';
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(bookingUrl).catch(() => {});
    }
    showToast('✓ Morgen Booking Link copied! Share with clients.');
  };

  const handleQuickAddSlot = (slotTime: string) => {
    haptics.tick();
    const newTask: NimoraTask = {
      id: `t_${Date.now()}`,
      title: 'Deep Focus Block',
      category: 'task',
      date: selectedDate,
      startTime: slotTime,
      endTime: '11:00 AM',
      durationMinutes: 45,
      priority: 'medium',
      status: 'upcoming',
      color: 'green',
      notes: 'Scheduled into Morgen free focus slot',
    };
    onAddTask?.(newTask);
    showToast(`✓ Added 45m Focus Slot at ${slotTime}`);
  };

  // Filter tasks by selected date (or show all if today)
  const dateFilteredTasks = tasks.filter((t) => {
    if (!t.date) return true;
    if (selectedDate === todayIso) return true;
    return isDateMatching(t.date, selectedDate);
  });

  const activeTasks = dateFilteredTasks.filter((t) => t.status !== 'completed');
  const completedTasks = dateFilteredTasks.filter((t) => t.status === 'completed');
  const orderedTasks = [...activeTasks, ...completedTasks];

  // Any.do grouped buckets
  const priorityTasks = activeTasks.filter((t) => t.priority === 'high');
  const agendaTasks = activeTasks.filter((t) => t.priority !== 'high');

  return (
    <div className="w-full h-full min-h-[680px] bg-[#0e0b1f] text-[#f8fafc] flex flex-col justify-between select-none rounded-[38px] overflow-hidden relative">
      {/* Toast Feedback Notification Banner */}
      {toastMessage && (
        <div className="absolute top-16 left-4 right-4 z-40 animate-bounce">
          <div className="liquid-glass rounded-xl px-3 py-2 border border-[#bef264]/40 text-xs text-[#bef264] font-mono flex items-center justify-between shadow-2xl">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              <span>{toastMessage}</span>
            </span>
            <button onClick={() => setToastMessage(null)} className="text-purple-300/60 hover:text-white cursor-pointer">✕</button>
          </div>
        </div>
      )}

      {/* Liquid Glass Floating Header with Any.do + Morgen controls */}
      <div className="liquid-glass-header px-4 py-3 flex items-center justify-between z-10 border-b border-purple-500/20">
        <button
          onClick={() => onNavigate?.(5)}
          className="text-purple-300/80 hover:text-white text-xs font-mono tracking-tight flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">arrow_back</span>
          <span>HOME</span>
        </button>

        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-[#f8fafc] font-['Space_Grotesk']">
            Planner & Agenda
          </h1>
          <p className="text-xs font-mono text-[#bef264] font-medium">
            {viewMode === 'timeline' ? 'Morgen Timeline' : 'Any.do Smart List'}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAnyDoMomentOpen(true)}
            className="minimal-btn-primary h-8 px-3 text-xs font-bold shadow-[0_0_12px_rgba(190,242,100,0.3)] cursor-pointer"
            title="Start Any.do Moment daily planning"
          >
            <span>⚡</span>
            <span>Plan Day</span>
          </button>
          <button
            onClick={handleShareAvailability}
            className="w-8 h-8 rounded-lg minimal-btn-secondary text-[#38bdf8] hover:text-[#bef264] flex items-center justify-center text-xs transition-all active:scale-95 cursor-pointer"
            title="Share Morgen Availability Link"
          >
            <span className="material-symbols-outlined text-base">share</span>
          </button>
          <button
            onClick={() => downloadICS(tasks, 'nimora-daily-agenda.ics')}
            className="w-8 h-8 rounded-lg minimal-btn-secondary text-purple-200 hover:text-[#bef264] flex items-center justify-center text-xs transition-all active:scale-95 cursor-pointer"
            title="Download Calendar .ics"
          >
            <span className="material-symbols-outlined text-base">calendar_today</span>
          </button>
          <button
            onClick={() => onNavigate?.(7)}
            className="w-8 h-8 rounded-lg bg-[#bef264] text-[#0e0b1f] flex items-center justify-center text-base font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            title="Add new task"
          >
            +
          </button>
        </div>
      </div>

      {/* Morgen 7-Day Interactive Week Strip */}
      <div className="px-4 pt-2.5">
        <MorgenWeekStrip
          selectedDate={selectedDate}
          onSelectDate={(newDate) => {
            setSelectedDate(newDate);
          }}
          tasks={tasks}
        />
      </div>

      {/* Dual View Mode Toggle: Morgen Timeline vs Any.do Smart List */}
      <div className="px-4 pt-2">
        <div className="flex items-center gap-1 p-1 bg-[#171330] rounded-xl border border-purple-500/20 text-xs">
          <button
            onClick={() => { setViewMode('timeline'); haptics.tick(); }}
            className={`flex-1 py-1 px-2 rounded-lg font-mono text-[9px] tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-[#251e4d] text-[#bef264] border border-[#bef264]/40 font-bold shadow-sm'
                : 'text-purple-300/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">view_timeline</span>
            <span>Morgen Timeline</span>
          </button>
          <button
            onClick={() => { setViewMode('list'); haptics.tick(); }}
            className={`flex-1 py-1 px-2 rounded-lg font-mono text-[9px] tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#251e4d] text-[#bef264] border border-[#bef264]/40 font-bold shadow-sm'
                : 'text-purple-300/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">checklist</span>
            <span>Any.do List</span>
          </button>
        </div>
      </div>

      {/* Any.do Express Inline Add Bar */}
      <div className="px-4 pt-1">
        <AnyDoQuickAddBar onAddTask={onAddTask} selectedDate={selectedDate} />
      </div>

      {/* Swipe instruction hint with accessible text size & clear affordance */}
      <div className="px-4">
        <div className="px-3.5 py-2 bg-[#171330]/80 border border-purple-500/20 rounded-xl flex items-center justify-between text-xs text-purple-200/80">
          <span className="flex items-center gap-2 font-mono">
            <span className="material-symbols-outlined text-sm text-[#bef264]">swipe</span>
            <span>Swipe task card to <span className="text-white font-semibold">Edit</span> or <span className="text-rose-400 font-semibold">Delete</span></span>
          </span>
          <span className="text-xs text-purple-300/70 font-mono">Tap ••• for menu</span>
        </div>
      </div>

      {/* Main Schedule Content: Timeline OR List - with pb-36 ensuring no overlap with bottom nav */}
      <div className="flex-1 overflow-y-auto px-4 py-2 pb-36 space-y-2">
        {orderedTasks.length === 0 ? (
          <div className="minimal-card rounded-2xl p-6 text-center space-y-3 border border-dashed border-white/10 my-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#bef264]/10 text-[#bef264] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">event_available</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#f8fafc] font-['Space_Grotesk']">
                No tasks planned for this date
              </p>
              <p className="text-xs text-purple-300/60 mt-0.5 font-mono">
                Your schedule is wide open for focused deep work
              </p>
            </div>
            <button
              onClick={() => onNavigate?.(7)}
              className="px-4 py-2 rounded-xl bg-[#bef264] text-[#0e0b1f] text-xs font-bold font-mono hover:brightness-110 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-[0_0_12px_rgba(190,242,100,0.3)]"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>+ Plan Task for this Day</span>
            </button>
          </div>
        ) : viewMode === 'timeline' ? (
          /* MORGEN TIMELINE VIEW WITH SMART FOCUS BUFFERS */
          <div className="space-y-1 relative">
            {orderedTasks.map((task, idx) => (
              <React.Fragment key={task.id}>
                {/* Morgen Timeline Hour Node & Task Card */}
                <div className="relative flex items-start gap-2.5">
                  <div className="w-12 pt-4 text-right shrink-0">
                    <span className="font-mono text-[9px] font-semibold text-purple-300/70 block">
                      {task.startTime.split(' ')[0]}
                    </span>
                    <span className="font-mono text-[8px] text-purple-400/50 block">
                      {task.startTime.split(' ')[1]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <SwipeableScheduleCard
                      task={task}
                      borderColors={borderColors}
                      onToggleTask={onToggleTask}
                      onSelectTask={onSelectTask}
                      onDeleteTask={onDeleteTask}
                      onNavigate={onNavigate}
                    />
                  </div>
                </div>

                {/* Morgen Smart Free Focus Buffer detected between scheduled blocks */}
                {idx === 0 && (
                  <div className="pl-14 pr-1">
                    <MorgenFocusBuffer
                      durationText="30m"
                      onQuickAdd={() => handleQuickAddSlot('09:30 AM')}
                    />
                  </div>
                )}
                {idx === 2 && (
                  <div className="pl-14 pr-1">
                    <MorgenFocusBuffer
                      durationText="1h 00m"
                      onQuickAdd={() => handleQuickAddSlot('01:00 PM')}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          /* ANY.DO SMART LIST VIEW */
          <div className="space-y-3">
            {/* Priority Focus Section */}
            {priorityTasks.length > 0 && (
              <div>
                <h3 className="text-[10px] font-mono uppercase tracking-wider text-[#bef264] font-semibold mb-1 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>Priority Focus ({priorityTasks.length})</span>
                </h3>
                {priorityTasks.map((task) => (
                  <SwipeableScheduleCard
                    key={task.id}
                    task={task}
                    borderColors={borderColors}
                    onToggleTask={onToggleTask}
                    onSelectTask={onSelectTask}
                    onDeleteTask={onDeleteTask}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            )}

            {/* Scheduled Agenda Section */}
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-[#c084fc] font-semibold mb-1 flex items-center gap-1.5">
                <span>🗓</span>
                <span>Scheduled Agenda ({agendaTasks.length})</span>
              </h3>
              {agendaTasks.map((task) => (
                <SwipeableScheduleCard
                  key={task.id}
                  task={task}
                  borderColors={borderColors}
                  onToggleTask={onToggleTask}
                  onSelectTask={onSelectTask}
                  onDeleteTask={onDeleteTask}
                  onNavigate={onNavigate}
                />
              ))}
            </div>

            {/* Completed Accordion */}
            {completedTasks.length > 0 && (
              <div className="pt-2 border-t border-purple-500/15">
                <button
                  type="button"
                  onClick={() => setShowCompletedList(!showCompletedList)}
                  className="w-full flex items-center justify-between text-[10px] font-mono uppercase text-purple-300/60 hover:text-white py-1 cursor-pointer"
                >
                  <span className="flex items-center gap-1">
                    <span>✓</span>
                    <span>Completed Today ({completedTasks.length})</span>
                  </span>
                  <span>{showCompletedList ? '▲' : '▼'}</span>
                </button>
                {showCompletedList && (
                  <div className="space-y-1 mt-1 opacity-75">
                    {completedTasks.map((task) => (
                      <SwipeableScheduleCard
                        key={task.id}
                        task={task}
                        borderColors={borderColors}
                        onToggleTask={onToggleTask}
                        onSelectTask={onSelectTask}
                        onDeleteTask={onDeleteTask}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Any.do Moment Planning Modal */}
      <AnyDoMomentModal
        isOpen={isAnyDoMomentOpen}
        onClose={() => setIsAnyDoMomentOpen(false)}
        tasks={tasks}
        onToggleTask={onToggleTask}
        onUpdateTask={onUpdateTask}
      />
    </div>
  );
}

// 7. Create New Task
export function Screen09AddTask({ contacts, onNavigate, onAddTask, selectedDate }: PlanningProps) {
  const [activeTab, setActiveTab] = useState<'task' | 'followup' | 'call' | 'note'>('task');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedContact, setSelectedContact] = useState(contacts[0]?.id || '');
  const [date, setDate] = useState(selectedDate || '2026-10-24');

  useEffect(() => {
    try {
      setDate(selectedDate || new Date().toISOString().split('T')[0]);
    } catch {}
  }, [selectedDate]);
  const [time, setTime] = useState('10:00 AM');
  const [duration, setDuration] = useState('30');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDictating, setIsDictating] = useState(false);

  const formatDisplayDate = (isoDate: string) => {
    try {
      const [y, m, d] = isoDate.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return isoDate;
    }
  };

  const calculateEndTime = (startTimeStr: string, durMins: number) => {
    try {
      const parts = startTimeStr.split(' ');
      const t = parts[0] || '10:00';
      const meridiem = parts[1] || 'AM';
      let [h, m] = t.split(':').map(Number);
      if (meridiem === 'PM' && h < 12) h += 12;
      if (meridiem === 'AM' && h === 12) h = 0;
      const total = h * 60 + (m || 0) + durMins;
      const endH = Math.floor(total / 60) % 24;
      const endM = total % 60;
      const endMeridiem = endH >= 12 ? 'PM' : 'AM';
      const dispH = endH % 12 || 12;
      return `${dispH}:${endM.toString().padStart(2, '0')} ${endMeridiem}`;
    } catch {
      return '10:30 AM';
    }
  };

  const handleStartDictation = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage('Voice recognition not supported in this browser');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsDictating(true);
        setErrorMessage('');
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        if (spoken) {
          setTitle(spoken);
          const lower = spoken.toLowerCase();
          if (lower.includes('call')) setActiveTab('call');
          else if (lower.includes('follow') || lower.includes('update')) setActiveTab('followup');
          else if (lower.includes('note') || lower.includes('remember')) setActiveTab('note');

          if (lower.includes('urgent') || lower.includes('high')) setPriority('high');

          // Check if contacts match spoken words
          const matchedContact = contacts.find((c) =>
            lower.includes(c.name.toLowerCase().split(' ')[0])
          );
          if (matchedContact) {
            setSelectedContact(matchedContact.id);
          }
        }
        setIsDictating(false);
      };

      recognition.onerror = () => {
        setIsDictating(false);
      };

      recognition.onend = () => {
        setIsDictating(false);
      };

      recognition.start();
    } catch {
      setIsDictating(false);
    }
  };

  const handleQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setDate(d.toISOString().split('T')[0]);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setErrorMessage('Please enter a task title to continue');
      return;
    }
    setErrorMessage('');
    const durNum = parseInt(duration) || 30;
    const contactObj = contacts.find((c) => c.id === selectedContact);
    const subtitleText = description.trim() || (contactObj ? `${contactObj.name} · ${contactObj.company}` : undefined);

    const newTask: NimoraTask = {
      id: `t_${Date.now()}`,
      title: title.trim(),
      subtitle: subtitleText,
      category: activeTab,
      date: formatDisplayDate(date),
      startTime: time,
      endTime: calculateEndTime(time, durNum),
      durationMinutes: durNum,
      priority,
      status: 'upcoming',
      color: activeTab === 'call' ? 'blue' : activeTab === 'followup' ? 'orange' : activeTab === 'note' ? 'gray' : 'green',
      relatedContactId: selectedContact || undefined,
      notes: description.trim(),
    };
    onAddTask?.(newTask);
    onNavigate?.(6);
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-[#0e0b1f] text-[#f8fafc] flex flex-col justify-between p-5 select-none rounded-[38px] shadow-2xl">
      <div>
        {/* Top bar - Liquid Glass Pill Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#bef264] text-[20px]">add_task</span>
            <h2 className="text-xs font-semibold tracking-wider uppercase text-[#f8fafc] font-['Space_Grotesk']">
              Add New Task
            </h2>
          </div>
          <button
            onClick={() => onNavigate?.(6)}
            className="w-7 h-7 rounded-full liquid-glass-pill flex items-center justify-center text-[#9b9f9c] hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Item type tabs - Utilitarian Minimal */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#171330] rounded-xl mb-4 border border-white/[0.08]">
          {(
            [
              { id: 'task', label: 'Task', icon: 'task_alt' },
              { id: 'followup', label: 'Follow-up', icon: 'history' },
              { id: 'call', label: 'Call', icon: 'call' },
              { id: 'note', label: 'Note', icon: 'edit_note' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 rounded-lg text-[10px] font-mono tracking-tight flex flex-col items-center gap-1 transition-all ${
                activeTab === tab.id
                  ? 'bg-[#251e4d] text-[#bef264] border border-[#bef264]/30 font-semibold'
                  : 'text-[#9b9f9c] hover:text-[#f8fafc]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Inputs - Clean 80% Utilitarian Minimal */}
        <div className="space-y-3">
          {/* Title with AI speech dictation button */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[9px] font-mono tracking-wider text-[#9b9f9c] uppercase block">
                Task Title *
              </label>
              <button
                type="button"
                onClick={handleStartDictation}
                className={`text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 transition-all font-mono tracking-wider ${
                  isDictating
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 animate-pulse'
                    : 'liquid-glass-pill text-[#bef264] hover:brightness-110'
                }`}
                title="Dictate with voice"
              >
                <span className="material-symbols-outlined text-[11px]">mic</span>
                {isDictating ? 'LISTENING...' : 'VOICE DICTATE'}
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g. Site inspection at Skyline Tower B"
              className={`w-full bg-[#171330] border rounded-xl px-3.5 py-2.5 text-xs text-[#f8fafc] outline-none shadow-sm placeholder-[#555d58] transition-colors ${
                errorMessage ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/[0.08] focus:border-[#bef264]/50'
              }`}
            />
            {errorMessage && (
              <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                <span className="material-symbols-outlined text-[12px]">error</span>
                {errorMessage}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-[9px] font-mono tracking-wider text-[#9b9f9c] uppercase block mb-1">
              Description & Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key milestones, deliverables or location notes..."
              className="w-full bg-[#171330] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-[#f8fafc] outline-none focus:border-[#bef264]/50 resize-none shadow-sm placeholder-[#555d58]"
            />
          </div>

          {/* Date Picker + Quick Chips */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[9px] font-mono tracking-wider text-[#9b9f9c] uppercase">
                Date
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickDate(0)}
                  className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#171330] hover:bg-[#162540] text-[#bef264] border border-white/[0.08]"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(1)}
                  className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#171330] hover:bg-[#162540] text-[#bef264] border border-white/[0.08]"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(7)}
                  className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#171330] hover:bg-[#162540] text-[#bef264] border border-white/[0.08]"
                >
                  +7d
                </button>
              </div>
            </div>
            <div className="p-2.5 bg-[#171330] border border-white/[0.08] rounded-xl shadow-sm">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ colorScheme: 'dark' }}
                className="text-xs font-mono font-medium text-[#f8fafc] outline-none bg-transparent w-full cursor-pointer"
              />
            </div>
          </div>

          {/* Time Picker + Quick Chips */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[9px] font-mono tracking-wider text-[#9b9f9c] uppercase">
                Start Time
              </label>
              <div className="flex items-center gap-1 overflow-x-auto">
                {[
                  { label: 'Morning 9am', val: '09:00 AM' },
                  { label: 'Noon 12pm', val: '12:00 PM' },
                  { label: 'Afternoon 2pm', val: '02:00 PM' },
                  { label: 'Evening 6pm', val: '06:00 PM' },
                ].map((tChip) => (
                  <button
                    key={tChip.val}
                    type="button"
                    onClick={() => setTime(tChip.val)}
                    className={`text-[9px] font-mono px-2 py-0.5 rounded border transition-all shrink-0 cursor-pointer ${
                      time === tChip.val
                        ? 'bg-[#251e4d] text-[#bef264] border-[#bef264]/40 font-bold'
                        : 'bg-[#171330] text-[#9b9f9c] border-white/[0.08] hover:text-white'
                    }`}
                  >
                    {tChip.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-2.5 bg-[#171330] border border-white/[0.08] rounded-xl shadow-sm flex items-center justify-between">
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:00 AM"
                className="text-xs font-mono font-medium text-[#f8fafc] outline-none bg-transparent w-full"
              />
              <span className="text-[9px] font-mono text-[#bef264] tracking-wider shrink-0 uppercase">
                End: {calculateEndTime(time, parseInt(duration) || 30)}
              </span>
            </div>
          </div>

          {/* Duration & Priority Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 bg-[#171330] border border-white/[0.08] rounded-xl shadow-sm">
              <span className="text-[9px] font-mono text-[#9b9f9c] uppercase block mb-0.5">Duration</span>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="text-xs font-mono font-medium text-[#f8fafc] bg-transparent outline-none w-full cursor-pointer"
              >
                <option className="bg-[#171330] text-[#f8fafc]" value="15">15 minutes</option>
                <option className="bg-[#171330] text-[#f8fafc]" value="30">30 minutes</option>
                <option className="bg-[#171330] text-[#f8fafc]" value="45">45 minutes</option>
                <option className="bg-[#171330] text-[#f8fafc]" value="60">1 hour</option>
                <option className="bg-[#171330] text-[#f8fafc]" value="90">1.5 hours</option>
                <option className="bg-[#171330] text-[#f8fafc]" value="120">2 hours</option>
              </select>
            </div>
            <div className="p-2.5 bg-[#171330] border border-white/[0.08] rounded-xl shadow-sm">
              <span className="text-[9px] font-mono text-[#9b9f9c] uppercase block mb-0.5">Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="text-xs font-mono font-medium text-[#f8fafc] bg-transparent outline-none w-full cursor-pointer"
              >
                <option className="bg-[#171330] text-[#f8fafc]" value="low">Low Priority</option>
                <option className="bg-[#171330] text-[#f8fafc]" value="medium">Medium Priority</option>
                <option className="bg-[#171330] text-rose-400" value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Related Contact */}
          <div>
            <label className="text-[9px] font-mono tracking-wider text-[#9b9f9c] uppercase block mb-1">
              Stakeholder / Contact (Optional)
            </label>
            <select
              value={selectedContact}
              onChange={(e) => setSelectedContact(e.target.value)}
              className="w-full bg-[#171330] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-[#f8fafc] font-mono outline-none shadow-sm cursor-pointer"
            >
              <option className="bg-[#171330] text-[#9b9f9c]" value="">No contact associated</option>
              {contacts.map((c) => (
                <option key={c.id} className="bg-[#171330] text-[#f8fafc]" value={c.id}>
                  {c.name} — {c.company} ({c.category.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Save Button - Liquid Glass Pill Primary CTA */}
      <button
        onClick={handleSubmit}
        className="w-full py-3.5 rounded-2xl liquid-glass-pill liquid-sheen text-[#bef264] font-medium text-xs tracking-wider uppercase shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-4 font-mono flex items-center justify-center gap-2 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[16px]">add_circle</span>
        <span>Save & Add to Schedule</span>
      </button>
    </div>
  );
}

// 8. Task Details & Edit
export function Screen10TaskDetails({
  tasks,
  contacts,
  onNavigate,
  selectedTask,
  onDeleteTask,
  onToggleTask,
  onUpdateTask,
}: PlanningProps) {
  const task = selectedTask || tasks[0];
  const contact = contacts.find((c) => c.id === task?.relatedContactId);

  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(task?.title || '');
  const [editSubtitle, setEditSubtitle] = React.useState(task?.subtitle || '');
  const [editTime, setEditTime] = React.useState(task?.startTime || '10:00 AM');
  const [editPriority, setEditPriority] = React.useState<NimoraTask['priority']>(task?.priority || 'medium');

  React.useEffect(() => {
    if (task) {
      setEditTitle(task.title || '');
      setEditSubtitle(task.subtitle || '');
      setEditTime(task.startTime || '10:00 AM');
      setEditPriority(task.priority || 'medium');
    }
  }, [task]);

  const handleSaveEdit = () => {
    if (!task) return;
    const updated: NimoraTask = {
      ...task,
      title: editTitle.trim() || task.title,
      subtitle: editSubtitle.trim() || undefined,
      startTime: editTime.trim() || task.startTime,
      priority: editPriority,
    };
    onUpdateTask?.(updated);
    setIsEditing(false);
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-[#0e0b1f] text-[#f8fafc] flex flex-col justify-between p-5 select-none rounded-[38px]">
      <div>
        {/* Header - Liquid Glass Pill Navigation */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => onNavigate?.(6)}
            className="text-[#9b9f9c] hover:text-white text-xs font-mono tracking-tight flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            <span>BACK</span>
          </button>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#f8fafc] font-['Space_Grotesk']">
            {isEditing ? 'Edit Task' : 'Task Details'}
          </span>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-[#bef264] hover:underline text-xs font-mono font-medium tracking-wider uppercase"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Task Title Header / Edit View */}
        {isEditing ? (
          <div className="minimal-card rounded-2xl p-4 shadow-sm mb-3 space-y-3">
            <div>
              <label className="text-[9px] uppercase font-mono tracking-wider text-[#bef264] block mb-1">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-[#171330] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-[#f8fafc] font-medium focus:border-[#bef264]/50 outline-none"
              />
            </div>
            <div>
              <label className="text-[9px] uppercase font-mono tracking-wider text-[#bef264] block mb-1">Notes / Subtitle</label>
              <input
                type="text"
                value={editSubtitle}
                onChange={(e) => setEditSubtitle(e.target.value)}
                placeholder="Details or notes..."
                className="w-full bg-[#171330] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#f8fafc] focus:border-[#bef264]/50 outline-none font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] uppercase font-mono tracking-wider text-[#bef264] block mb-1">Start Time</label>
                <input
                  type="text"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  placeholder="e.g. 2:00 PM"
                  className="w-full bg-[#171330] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#f8fafc] focus:border-[#bef264]/50 outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-mono tracking-wider text-[#bef264] block mb-1">Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as NimoraTask['priority'])}
                  className="w-full bg-[#171330] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#f8fafc] focus:border-[#bef264]/50 outline-none font-mono"
                >
                  <option className="bg-[#171330]" value="low">Low</option>
                  <option className="bg-[#171330]" value="medium">Medium</option>
                  <option className="bg-[#171330]" value="high">High</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="w-full py-2.5 rounded-xl liquid-glass-pill text-[#bef264] font-mono tracking-wider text-xs shadow-md active:scale-95 transition-transform"
            >
              SAVE CHANGES
            </button>
          </div>
        ) : (
          <div className="minimal-card rounded-2xl p-4 shadow-sm mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[18px] text-[#bef264]">task_alt</span>
              <h3 className="text-sm font-semibold text-[#f8fafc] font-['Space_Grotesk']">{task?.title || 'Client Call'}</h3>
            </div>
            <p className="text-xs text-[#9b9f9c]">{task?.subtitle || 'Reviewing project milestones'}</p>
          </div>
        )}

        {/* Details Grid - 80% Utilitarian Minimal */}
        <div className="minimal-card rounded-2xl p-4 shadow-sm space-y-3 mb-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#9b9f9c] font-mono text-[10px] uppercase">Date</span>
            <span className="font-mono text-xs text-[#f8fafc]">{task?.date || 'Today'}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#9b9f9c] font-mono text-[10px] uppercase">Time</span>
            <span className="font-mono text-xs text-[#f8fafc]">
              {task?.startTime} – {task?.endTime}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#9b9f9c] font-mono text-[10px] uppercase">Duration</span>
            <span className="font-mono text-xs text-[#f8fafc]">{task?.durationMinutes} min</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#9b9f9c] font-mono text-[10px] uppercase">Priority</span>
            <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full liquid-glass-pill text-[#bef264]">
              {task?.priority}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#9b9f9c] font-mono text-[10px] uppercase">Status</span>
            <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded-full ${
              task?.status === 'completed'
                ? 'bg-emerald-950/60 text-[#bef264] border border-[#bef264]/30'
                : 'bg-[#162540] text-[#9b9f9c] border border-white/[0.08]'
            }`}>
              {task?.status}
            </span>
          </div>
        </div>

        {/* Related Contact Card */}
        {contact && (
          <div
            onClick={() => onNavigate?.(10)}
            className="minimal-card rounded-2xl p-3.5 shadow-sm mb-3 cursor-pointer hover:border-[#bef264]/40 transition-colors"
          >
            <span className="text-[9px] font-mono text-[#9b9f9c] uppercase tracking-wider block mb-2">
              Related Contact
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${contact.avatarColor} text-white font-mono text-xs font-bold flex items-center justify-center`}>
                  {contact.name[0]}
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#f8fafc]">{contact.name}</h4>
                  <p className="text-[10px] text-[#9b9f9c] font-mono">{contact.company}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#bef264] flex items-center gap-0.5">
                <span>PROFILE</span>
                <span className="material-symbols-outlined text-[13px]">chevron_right</span>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 mt-2">
        <button
          onClick={() => {
            if (task && onToggleTask) {
              onToggleTask(task.id);
              onNavigate?.(6);
            }
          }}
          className={`w-full py-3 rounded-2xl font-mono text-xs tracking-wider uppercase transition-all cursor-pointer ${
            task?.status === 'completed'
              ? 'bg-[#171330] text-[#9b9f9c] border border-white/[0.08] hover:text-white'
              : 'liquid-glass-pill liquid-sheen text-[#bef264] font-semibold hover:scale-[1.02] shadow-lg'
          }`}
        >
          {task?.status === 'completed' ? 'Mark Incomplete' : 'Mark Completed ✓'}
        </button>

        <button
          type="button"
          onClick={() => {
            if (task && onDeleteTask) {
              onDeleteTask(task.id);
              onNavigate?.(6);
            }
          }}
          className="w-full py-2.5 rounded-xl font-mono text-[10px] tracking-wider uppercase bg-rose-950/20 border border-rose-500/20 text-rose-400 hover:bg-rose-950/40 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">delete</span>
          <span>Delete Task</span>
        </button>
      </div>
    </div>
  );
}

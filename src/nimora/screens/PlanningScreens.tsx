'use client';

import React, { useState, useRef } from 'react';
import { NimoraTask, Contact } from '../data';
import { downloadICS } from '@/lib/exportUtils';

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
}

// 5. Home Dashboard
export function Screen07HomeDashboard({ tasks, onNavigate, onToggleTask, onSelectTask }: PlanningProps) {
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  return (
    <div className="w-full h-full min-h-[680px] bg-[#121412] text-[#e3e2e0] flex flex-col justify-between select-none rounded-[38px] overflow-hidden">
      {/* Top Header */}
      <div className="p-5 pb-3 bg-[#121412]/80 border-b border-[#414945]/30">
        <div className="flex justify-between items-center text-xs text-[#c0c8c3] mb-3">
          <span className="font-semibold font-['Space_Grotesk']">9:41</span>
          <div className="flex items-center gap-1.5 text-[#e3e2e0]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>5G</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0e3e30] text-[#e9c349] font-bold flex items-center justify-center text-sm ring-2 ring-[#e9c349]/30 shadow-sm font-['Space_Grotesk']">
              S
            </div>
            <div>
              <p className="text-[10px] text-[#e9c349] uppercase tracking-wider font-semibold">Good Morning,</p>
              <h2 className="text-sm font-bold text-[#e3e2e0] font-['Space_Grotesk']">Sudarshan</h2>
            </div>
          </div>
          <button
            onClick={() => onNavigate?.(16)}
            className="w-8 h-8 rounded-full bg-[#1f201e] hover:bg-[#292a29] flex items-center justify-center text-[#c0c8c3] text-sm border border-[#414945]/30"
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
            <p className="text-xs font-semibold text-[#e9c349] italic">
              &ldquo;A focused day creates bigger opportunities.&rdquo;
            </p>
          </div>
        </div>

        {/* Today's Progress Card */}
        <div className="glass-card specular-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#e3e2e0] font-['Space_Grotesk']">Today&apos;s Progress</h3>
            <p className="text-xs text-[#c0c8c3] mt-0.5">
              {completedCount} of {tasks.length} tasks completed
            </p>
          </div>

          {/* Progress Circular Gauge */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#292a29]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#e9c349]"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-[#e3e2e0] font-['Space_Grotesk']">{progressPercent}%</span>
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
    } else if (offsetX < -45) {
      setOffsetX(-130);
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
    } else if (offsetX < -45) {
      setOffsetX(-130);
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
    setOffsetX(0);
    onSelectTask?.(task);
    onNavigate?.(8);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOffsetX(0);
    onDeleteTask?.(task.id);
  };

  const showLeftActions = offsetX > 0;
  const showRightActions = offsetX < 0;

  return (
    <div className="relative overflow-hidden rounded-2xl select-none my-1.5 bg-[#0f1411]">
      {/* Background Action Buttons Layer (Completely invisible when card is closed) */}
      <div
        className={`absolute inset-0 flex items-center justify-between px-2 bg-[#0c100d] rounded-2xl border border-[#414945]/30 transition-opacity duration-150 ${
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
            className="w-14 h-11 px-2 rounded-xl bg-gradient-to-br from-[#e9c349] to-[#c79e26] text-gray-950 font-bold text-xs flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer"
            title="Edit Task"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            <span className="text-[10px] font-bold">Edit</span>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-14 h-11 px-2 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer"
            title="Delete Task"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            <span className="text-[10px] font-bold">Delete</span>
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
            className="w-14 h-11 px-2 rounded-xl bg-gradient-to-br from-[#e9c349] to-[#c79e26] text-gray-950 font-bold text-xs flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer"
            title="Edit Task"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            <span className="text-[10px] font-bold">Edit</span>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-14 h-11 px-2 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer"
            title="Delete Task"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            <span className="text-[10px] font-bold">Delete</span>
          </button>
        </div>
      </div>

      {/* Foreground Sliding Card (100% Solid Opaque Background: NOTHING shines through) */}
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
        className={`relative z-10 p-3.5 rounded-2xl border border-[#414945]/40 border-l-[3px] ${
          borderColors[task.color] || 'border-l-emerald-500'
        } shadow-md flex items-start justify-between cursor-pointer bg-[#18241e] hover:brightness-105 active:scale-[0.99] transition-all touch-pan-y`}
      >
        <div className={`flex items-start gap-3 flex-1 min-w-0 pr-2 ${isCompleted ? 'opacity-55' : ''}`}>
          {/* Tactile Checkbox */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleTask?.(task.id);
            }}
            className={`mt-0.5 w-5 h-5 rounded border border-[#e9c349]/50 flex items-center justify-center hover:bg-[#e9c349]/20 transition-colors shrink-0 ${
              isCompleted ? 'bg-[#e9c349] text-gray-950' : ''
            }`}
          >
            {isCompleted && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-[#a1d1bd] font-['Space_Grotesk']">
                {task.startTime} – {task.endTime}
              </span>
              <span className="text-[8px] px-1 py-0.2 rounded bg-[#0e3e30] text-[#e9c349] border border-[#e9c349]/30 uppercase font-bold">
                {task.category}
              </span>
            </div>
            <h4
              className={`text-xs font-bold leading-tight font-['Space_Grotesk'] mt-0.5 truncate ${
                isCompleted ? 'line-through text-[#8a938e]' : 'text-[#e3e2e0]'
              }`}
            >
              {task.title}
            </h4>
            {task.subtitle && (
              <p className="text-[10px] text-[#c0c8c3] mt-0.5 truncate">{task.subtitle}</p>
            )}
          </div>
        </div>

        <div className="text-right flex items-center gap-2 shrink-0">
          <div className={`flex flex-col items-end gap-1 ${isCompleted ? 'opacity-55' : ''}`}>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0e3e30] text-[#e9c349] border border-[#e9c349]/30">
              {task.priority}
            </span>
            <span className="text-[10px] text-[#c0c8c3]">⏱ {task.durationMinutes}m</span>
          </div>

          {showWhatsApp && (
            <a
              aria-label="WhatsApp quick trigger"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-[#121412] text-[#a1d1bd] border border-[#414945]/30 hover:border-[#a1d1bd]/50 active:scale-95 transition-all"
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              title="WhatsApp contact"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
            </a>
          )}

          {/* Swipe indicator pill */}
          <span className="text-[10px] text-[#8a938e] opacity-60 group-hover:opacity-100 flex items-center" title="Slide right or left for actions">
            ‹ ›
          </span>
        </div>
      </div>
    </div>
  );
}

// 6. Daily Planner Timeline
export function Screen08DailyPlanner({
  tasks,
  onNavigate,
  onSelectTask,
  onToggleTask,
  onDeleteTask,
}: PlanningProps) {
  const borderColors: Record<string, string> = {
    blue: 'border-l-blue-500',
    green: 'border-l-emerald-500',
    coral: 'border-l-orange-400',
    orange: 'border-l-orange-400',
    gray: 'border-l-gray-400',
  };

  // Active tasks stay on top, completed tasks automatically move down to the bottom
  const activeTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const orderedTasks = [...activeTasks, ...completedTasks];

  return (
    <div className="w-full h-full min-h-[680px] bg-[#121412] text-[#e3e2e0] flex flex-col justify-between select-none rounded-[38px] overflow-hidden relative">
      {/* Top Header */}
      <div className="p-4 bg-[#121412]/90 border-b border-[#414945]/30 flex items-center justify-between">
        <button onClick={() => onNavigate?.(5)} className="text-[#c0c8c3] hover:text-white text-xs font-semibold flex items-center gap-1">
          ‹ Back
        </button>
        <div className="text-center">
          <h2 className="text-sm font-bold text-[#e3e2e0] font-['Space_Grotesk']">Daily Schedule</h2>
          <p className="text-[10px] text-[#e9c349]">Today&apos;s Agenda</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => downloadICS(tasks, 'nimora-daily-agenda.ics')}
            className="px-2.5 py-1 rounded-lg bg-[#0e3e30] hover:bg-[#134E3F] text-[#e9c349] text-[10px] font-bold border border-[#e9c349]/30 flex items-center gap-1 shadow-sm transition-colors"
            title="Download Calendar .ics"
          >
            <span>📅</span>
            <span>.ics</span>
          </button>
          <button
            onClick={() => onNavigate?.(7)}
            className="w-7 h-7 rounded-full bg-gradient-to-r from-[#0e3e30] to-[#0A2E24] border border-[#e9c349]/40 text-[#e9c349] flex items-center justify-center text-sm font-bold shadow-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* Swipe instruction pill */}
      <div className="px-4 pt-2">
        <div className="p-2 bg-[#1f201e]/60 border border-[#414945]/30 rounded-xl flex items-center justify-between text-[10px] text-[#c0c8c3]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#e9c349]">swipe</span>
            <span>Swipe left or right on any task to <strong>Edit</strong> or <strong>Delete</strong></span>
          </span>
          <span className="text-[#e9c349] font-bold">‹ ›</span>
        </div>
      </div>

      {/* Time blocked schedule list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {orderedTasks.map((task) => (
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

      {/* Floating Action Button */}
      <button
        onClick={() => onNavigate?.(7)}
        className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-tr from-[#0e3e30] to-[#0A2E24] border border-[#e9c349]/60 text-[#e9c349] flex items-center justify-center text-xl font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all z-10"
      >
        +
      </button>
    </div>
  );
}

// 7. Create New Task
export function Screen09AddTask({ contacts, onNavigate, onAddTask }: PlanningProps) {
  const [activeTab, setActiveTab] = useState<'task' | 'followup' | 'call' | 'note'>('task');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedContact, setSelectedContact] = useState(contacts[0]?.id || '');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
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
    <div className="w-full h-full min-h-[680px] bg-[#121412] text-[#e3e2e0] flex flex-col justify-between p-5 select-none rounded-[38px] shadow-2xl">
      <div>
        {/* Top bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e9c349] text-[22px]">add_task</span>
            <h2 className="text-base font-bold text-[#e3e2e0] font-['Space_Grotesk']">Add New Task</h2>
          </div>
          <button
            onClick={() => onNavigate?.(6)}
            className="w-8 h-8 rounded-full bg-[#1f201e] border border-[#414945]/40 flex items-center justify-center text-[#c0c8c3] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Item type tabs with rich icons */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#1f201e] rounded-xl mb-4 border border-[#414945]/30">
          {(
            [
              { id: 'task', label: 'Task', icon: 'task_alt', color: '#10B981' },
              { id: 'followup', label: 'Follow-up', icon: 'history', color: '#F59E0B' },
              { id: 'call', label: 'Call', icon: 'call', color: '#3B82F6' },
              { id: 'note', label: 'Note', icon: 'edit_note', color: '#8B5CF6' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 rounded-lg text-[11px] font-semibold flex flex-col items-center gap-1 transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0e3e30] text-[#e9c349] shadow-sm border border-[#e9c349]/40'
                  : 'text-[#c0c8c3] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Inputs */}
        <div className="space-y-3">
          {/* Title with AI speech dictation button */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-semibold text-[#c0c8c3] uppercase tracking-wider block">
                Task Title *
              </label>
              <button
                type="button"
                onClick={handleStartDictation}
                className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                  isDictating
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 animate-pulse'
                    : 'bg-[#0e3e30] text-[#a1d1bd] border border-[#a1d1bd]/30 hover:border-[#e9c349]'
                }`}
                title="Dictate with voice"
              >
                <span className="material-symbols-outlined text-[12px]">mic</span>
                {isDictating ? 'Listening...' : 'AI Voice Dictate'}
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
              className={`w-full bg-[#1f201e] border rounded-xl px-3.5 py-2.5 text-xs text-[#e3e2e0] outline-none shadow-sm placeholder-[#8a938e] transition-colors ${
                errorMessage ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#414945]/40 focus:border-[#e9c349]'
              }`}
            />
            {errorMessage && (
              <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">error</span>
                {errorMessage}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-semibold text-[#c0c8c3] uppercase tracking-wider block mb-1">
              Description & Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key milestones, deliverables or location notes..."
              className="w-full bg-[#1f201e] border border-[#414945]/40 rounded-xl px-3.5 py-2 text-xs text-[#e3e2e0] outline-none focus:border-[#e9c349] resize-none shadow-sm placeholder-[#8a938e]"
            />
          </div>

          {/* Date Picker + Quick Chips */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-semibold text-[#8a938e] uppercase tracking-wider">
                Date
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickDate(0)}
                  className="text-[9px] px-2 py-0.5 rounded bg-[#1f201e] hover:bg-[#292a29] text-[#a1d1bd] border border-[#414945]/30"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(1)}
                  className="text-[9px] px-2 py-0.5 rounded bg-[#1f201e] hover:bg-[#292a29] text-[#a1d1bd] border border-[#414945]/30"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(7)}
                  className="text-[9px] px-2 py-0.5 rounded bg-[#1f201e] hover:bg-[#292a29] text-[#a1d1bd] border border-[#414945]/30"
                >
                  +7d
                </button>
              </div>
            </div>
            <div className="p-2.5 bg-[#1f201e] border border-[#414945]/40 rounded-xl shadow-sm">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ colorScheme: 'dark' }}
                className="text-xs font-bold text-[#e3e2e0] outline-none bg-transparent w-full cursor-pointer"
              />
            </div>
          </div>

          {/* Time Picker + Quick Chips */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-semibold text-[#8a938e] uppercase tracking-wider">
                Start Time
              </label>
              <div className="flex items-center gap-1">
                {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map((tChip) => (
                  <button
                    key={tChip}
                    type="button"
                    onClick={() => setTime(tChip)}
                    className={`text-[9px] px-1.5 py-0.5 rounded border transition-all ${
                      time === tChip
                        ? 'bg-[#0e3e30] text-[#e9c349] border-[#e9c349]/50 font-bold'
                        : 'bg-[#1f201e] text-[#c0c8c3] border-[#414945]/30 hover:text-white'
                    }`}
                  >
                    {tChip.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-2.5 bg-[#1f201e] border border-[#414945]/40 rounded-xl shadow-sm flex items-center justify-between">
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:00 AM"
                className="text-xs font-bold text-[#e3e2e0] outline-none bg-transparent w-full"
              />
              <span className="text-[10px] text-[#e9c349] font-semibold shrink-0">
                End: {calculateEndTime(time, parseInt(duration) || 30)}
              </span>
            </div>
          </div>

          {/* Duration & Priority Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 bg-[#1f201e] border border-[#414945]/40 rounded-xl shadow-sm">
              <span className="text-[10px] text-[#8a938e] uppercase font-semibold block mb-0.5">Duration</span>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="text-xs font-bold text-[#e3e2e0] bg-transparent outline-none w-full cursor-pointer"
              >
                <option className="bg-[#1f201e] text-[#e3e2e0]" value="15">15 minutes</option>
                <option className="bg-[#1f201e] text-[#e3e2e0]" value="30">30 minutes</option>
                <option className="bg-[#1f201e] text-[#e3e2e0]" value="45">45 minutes</option>
                <option className="bg-[#1f201e] text-[#e3e2e0]" value="60">1 hour</option>
                <option className="bg-[#1f201e] text-[#e3e2e0]" value="90">1.5 hours</option>
                <option className="bg-[#1f201e] text-[#e3e2e0]" value="120">2 hours</option>
              </select>
            </div>
            <div className="p-2.5 bg-[#1f201e] border border-[#414945]/40 rounded-xl shadow-sm">
              <span className="text-[10px] text-[#8a938e] uppercase font-semibold block mb-0.5">Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="text-xs font-bold text-[#e3e2e0] bg-transparent outline-none w-full cursor-pointer"
              >
                <option className="bg-[#1f201e] text-[#e3e2e0]" value="low">Low Priority</option>
                <option className="bg-[#1f201e] text-[#e3e2e0]" value="medium">Medium Priority</option>
                <option className="bg-[#1f201e] text-rose-400" value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Related Contact */}
          <div>
            <label className="text-[10px] font-semibold text-[#c0c8c3] uppercase tracking-wider block mb-1">
              Stakeholder / Contact (Optional)
            </label>
            <select
              value={selectedContact}
              onChange={(e) => setSelectedContact(e.target.value)}
              className="w-full bg-[#1f201e] border border-[#414945]/40 rounded-xl px-3 py-2.5 text-xs text-[#e3e2e0] outline-none shadow-sm cursor-pointer"
            >
              <option className="bg-[#1f201e] text-[#8a938e]" value="">No contact associated</option>
              {contacts.map((c) => (
                <option key={c.id} className="bg-[#1f201e] text-[#e3e2e0]" value={c.id}>
                  {c.name} — {c.company} ({c.category.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0e3e30] to-[#0A2E24] border border-[#e9c349]/50 text-[#e9c349] font-bold text-xs shadow-xl hover:brightness-110 active:scale-95 transition-all mt-4 font-['Space_Grotesk'] flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">add_circle</span>
        Save & Add to Schedule
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
    <div className="w-full h-full min-h-[680px] bg-[#121412] text-[#e3e2e0] flex flex-col justify-between p-5 select-none rounded-[38px]">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => onNavigate?.(6)} className="text-[#c0c8c3] hover:text-white text-xs font-semibold flex items-center gap-1">
            ‹ Back
          </button>
          <span className="text-xs font-bold text-[#e3e2e0] font-['Space_Grotesk']">
            {isEditing ? 'Edit Task' : 'Task Details'}
          </span>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-[#e9c349] hover:underline text-xs font-bold"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Task Title Header / Edit View */}
        {isEditing ? (
          <div className="glass-card specular-border rounded-2xl p-4 shadow-sm mb-3 space-y-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#e9c349] block mb-1">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-[#18241e] border border-[#414945]/60 rounded-xl px-3 py-2 text-sm text-[#e3e2e0] font-bold focus:border-[#e9c349] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[#e9c349] block mb-1">Notes / Subtitle</label>
              <input
                type="text"
                value={editSubtitle}
                onChange={(e) => setEditSubtitle(e.target.value)}
                placeholder="Details or notes..."
                className="w-full bg-[#18241e] border border-[#414945]/60 rounded-xl px-3 py-2 text-xs text-[#e3e2e0] focus:border-[#e9c349] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#e9c349] block mb-1">Start Time</label>
                <input
                  type="text"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  placeholder="e.g. 2:00 PM"
                  className="w-full bg-[#18241e] border border-[#414945]/60 rounded-xl px-3 py-2 text-xs text-[#e3e2e0] focus:border-[#e9c349] outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#e9c349] block mb-1">Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as NimoraTask['priority'])}
                  className="w-full bg-[#18241e] border border-[#414945]/60 rounded-xl px-3 py-2 text-xs text-[#e3e2e0] focus:border-[#e9c349] outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e9c349] to-[#c79e26] text-gray-950 font-bold text-xs shadow-md active:scale-95 transition-transform"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="glass-card specular-border rounded-2xl p-4 shadow-sm mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">📋</span>
              <h3 className="text-base font-bold text-[#e3e2e0] font-['Space_Grotesk']">{task?.title || 'Client Call'}</h3>
            </div>
            <p className="text-xs text-[#c0c8c3]">{task?.subtitle || 'Reviewing project milestones'}</p>
          </div>
        )}

        {/* Details Grid */}
        <div className="glass-card specular-border rounded-2xl p-4 shadow-sm space-y-3 mb-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#8a938e]">Date</span>
            <span className="font-semibold text-[#e3e2e0]">{task?.date || 'Today'}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#8a938e]">Time</span>
            <span className="font-semibold text-[#e3e2e0]">
              {task?.startTime} – {task?.endTime}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#8a938e]">Duration</span>
            <span className="font-semibold text-[#e3e2e0]">{task?.durationMinutes} minutes</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#8a938e]">Priority</span>
            <span className="font-bold text-[#e9c349] bg-[#0e3e30] border border-[#e9c349]/30 px-2 py-0.5 rounded-full text-[10px] uppercase">
              {task?.priority}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#8a938e]">Status</span>
            <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase ${
              task?.status === 'completed'
                ? 'bg-emerald-950 text-[#4edea3] border border-[#4edea3]/30'
                : 'bg-[#1f201e] text-[#a1d1bd] border border-[#a1d1bd]/30'
            }`}>
              {task?.status}
            </span>
          </div>
        </div>

        {/* Related Contact Card */}
        {contact && (
          <div
            onClick={() => onNavigate?.(10)}
            className="glass-card specular-border rounded-2xl p-3.5 shadow-sm mb-3 cursor-pointer hover:border-[#e9c349]/50 transition-colors"
          >
            <span className="text-[10px] font-semibold text-[#8a938e] uppercase tracking-wider block mb-2">
              Related Contact
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${contact.avatarColor} text-white font-bold flex items-center justify-center text-xs`}>
                  {contact.name[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#e3e2e0]">{contact.name}</h4>
                  <p className="text-[10px] text-[#c0c8c3]">{contact.company}</p>
                </div>
              </div>
              <span className="text-xs text-[#a1d1bd]">View profile ›</span>
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
          className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            task?.status === 'completed'
              ? 'bg-[#1f201e] text-[#c0c8c3] border border-[#414945]/40 hover:bg-[#292a29]'
              : 'bg-[#10B981] text-gray-950 shadow-md hover:bg-[#059669]'
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
          className="w-full py-2.5 rounded-xl font-bold text-xs bg-rose-950/40 border border-rose-500/40 text-rose-400 hover:bg-rose-900/40 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
          <span>Delete Task</span>
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { NimoraTask, Contact } from '../data';
import { downloadICS } from '@/lib/exportUtils';

interface PlanningProps {
  tasks: NimoraTask[];
  contacts: Contact[];
  onNavigate?: (screenNumber: number) => void;
  onAddTask?: (task: NimoraTask) => void;
  onToggleTask?: (id: string) => void;
  onSelectTask?: (task: NimoraTask) => void;
  selectedTask?: NimoraTask;
}

// 5. Home Dashboard
export function Screen07HomeDashboard({ tasks, onNavigate, onToggleTask, onSelectTask }: PlanningProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'overdue'>('today');
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  return (
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between select-none rounded-[38px] overflow-hidden">
      {/* Top Header */}
      <div className="p-5 pb-3 bg-white border-b border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
          <span className="font-semibold">9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>5G</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-900 text-amber-200 font-bold flex items-center justify-center text-sm ring-2 ring-emerald-600/20 shadow-sm">
              S
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Good Morning,</p>
              <h2 className="text-sm font-bold text-gray-900">Sudarshan</h2>
            </div>
          </div>
          <button
            onClick={() => onNavigate?.(16)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-sm"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Main Scroll Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Quote Card */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">✨</span>
            <p className="text-xs font-semibold text-amber-900">
              A focused day creates bigger opportunities.
            </p>
          </div>
          <span className="text-xs text-amber-700/60">✕</span>
        </div>

        {/* Today's Progress Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Today&apos;s Progress</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {completedCount} of {tasks.length} tasks completed
            </p>
          </div>

          {/* Progress Circular Gauge */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-700"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-emerald-800">{progressPercent}%</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {(['today', 'upcoming', 'overdue'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Task Timeline List */}
        <div className="space-y-2.5">
          {tasks.slice(0, 4).map((task) => (
            <div
              key={task.id}
              onClick={() => {
                onSelectTask?.(task);
                onNavigate?.(8);
              }}
              className="p-3.5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:border-emerald-300 transition-all shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-gray-400 w-16">{task.startTime}</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div>
                  <h4
                    className={`text-xs font-bold text-gray-900 ${
                      task.status === 'completed' ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {task.title}
                  </h4>
                  {task.subtitle && <p className="text-[10px] text-gray-400">{task.subtitle}</p>}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTask?.(task.id);
                }}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                  task.status === 'completed'
                    ? 'bg-emerald-600 text-white'
                    : 'border border-gray-300 text-transparent hover:border-emerald-500'
                }`}
              >
                ✓
              </button>
            </div>
          ))}
        </div>

        {/* Voice Trigger Banner */}
        <div
          onClick={() => onNavigate?.(11)}
          className="p-3 bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl text-white flex items-center justify-between cursor-pointer shadow-md hover:brightness-105"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🎙️</span>
            <div>
              <p className="text-xs font-bold">Voice Assistant</p>
              <p className="text-[10px] text-emerald-200">Tap to plan by voice</p>
            </div>
          </div>
          <span className="text-xs bg-emerald-800 px-2 py-1 rounded-lg">Try ›</span>
        </div>
      </div>

      {/* Bottom Nav Bar */}
      <div className="bg-white border-t border-gray-100 px-5 py-2.5 flex justify-between items-center text-[10px] font-semibold text-gray-400">
        <button className="flex flex-col items-center text-emerald-800">
          <span className="text-base">🏠</span>
          <span>Home</span>
        </button>
        <button onClick={() => onNavigate?.(6)} className="flex flex-col items-center hover:text-gray-900">
          <span className="text-base">📋</span>
          <span>Tasks</span>
        </button>
        <button onClick={() => onNavigate?.(9)} className="flex flex-col items-center hover:text-gray-900">
          <span className="text-base">👥</span>
          <span>Contacts</span>
        </button>
        <button onClick={() => onNavigate?.(12)} className="flex flex-col items-center hover:text-gray-900">
          <span className="text-base">✨</span>
          <span>AI</span>
        </button>
        <button onClick={() => onNavigate?.(16)} className="flex flex-col items-center hover:text-gray-900">
          <span className="text-base">⋯</span>
          <span>More</span>
        </button>
      </div>
    </div>
  );
}

// 6. Daily Planner Timeline
export function Screen08DailyPlanner({ tasks, onNavigate, onSelectTask }: PlanningProps) {
  const colorMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    coral: 'bg-rose-50 border-rose-200 text-rose-900',
    orange: 'bg-amber-50 border-amber-200 text-amber-900',
    gray: 'bg-gray-50 border-gray-200 text-gray-900',
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between select-none rounded-[38px] overflow-hidden relative">
      {/* Top Header */}
      <div className="p-5 pb-3 bg-white border-b border-gray-100 flex items-center justify-between">
        <button onClick={() => onNavigate?.(5)} className="text-gray-600 hover:text-gray-900 text-xs font-semibold">
          ‹ Back
        </button>
        <div className="text-center">
          <h2 className="text-sm font-bold text-gray-900">Today</h2>
          <p className="text-[10px] text-gray-400">Tue, 20 Oct 2026</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => downloadICS(tasks, 'nimora-daily-agenda-2026-10-20.ics')}
            className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1 shadow-sm transition-colors"
            title="Download Calendar .ics"
          >
            <span>📅</span>
            <span>.ics</span>
          </button>
          <button
            onClick={() => onNavigate?.(7)}
            className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center text-sm font-bold shadow-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* Time blocked schedule list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => {
              onSelectTask?.(task);
              onNavigate?.(8);
            }}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-sm hover:brightness-95 flex items-start justify-between ${
              colorMap[task.color] || colorMap.blue
            }`}
          >
            <div>
              <span className="text-[10px] font-bold opacity-70 block mb-1">
                {task.startTime} – {task.endTime}
              </span>
              <h4 className="text-xs font-bold leading-tight">{task.title}</h4>
              {task.subtitle && <p className="text-[10px] opacity-75 mt-0.5">{task.subtitle}</p>}
            </div>

            <div className="text-right flex flex-col items-end gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/70">
                {task.priority}
              </span>
              <span className="text-[10px] opacity-60">⏱ {task.durationMinutes}m</span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => onNavigate?.(7)}
        className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-[#0F382C] text-white flex items-center justify-center text-xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all z-10"
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
  const [time, setTime] = useState('10:00 AM');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = () => {
    if (!title.trim()) return;
    const newTask: NimoraTask = {
      id: `t_${Date.now()}`,
      title: title.trim(),
      subtitle: description.trim() || undefined,
      category: activeTab,
      date: 'Tue, 20 Oct 2026',
      startTime: time,
      endTime: '10:30 AM',
      durationMinutes: 30,
      priority,
      status: 'upcoming',
      color: activeTab === 'call' ? 'blue' : activeTab === 'followup' ? 'orange' : 'green',
      relatedContactId: selectedContact || undefined,
      notes: description.trim(),
    };
    onAddTask?.(newTask);
    onNavigate?.(6);
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between p-6 select-none rounded-[38px]">
      <div>
        {/* Top bar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-gray-900">Add New Task</h2>
          <button onClick={() => onNavigate?.(6)} className="text-gray-400 hover:text-gray-700 text-sm">
            ✕
          </button>
        </div>

        {/* Item type tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-gray-200/70 rounded-xl mb-4">
          {(['task', 'followup', 'call', 'note'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                activeTab === tab ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              {tab === 'followup' ? 'Follow-up' : tab}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Review drawings"
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-emerald-600 shadow-sm"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, link or location..."
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-emerald-600 resize-none shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Date</span>
              <span className="text-xs font-bold text-gray-800">Tue, 20 Oct 2026 ›</span>
            </div>
            <div className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Time</span>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-xs font-bold text-gray-800 outline-none bg-transparent w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Duration</span>
              <span className="text-xs font-bold text-gray-800">30 minutes ›</span>
            </div>
            <div className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="text-xs font-bold text-gray-800 bg-transparent outline-none w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Related Contact (Optional)
            </label>
            <select
              value={selectedContact}
              onChange={(e) => setSelectedContact(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 outline-none shadow-sm"
            >
              <option value="">Search or select contact</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.company})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-2xl bg-[#0F382C] text-white font-semibold text-xs shadow-md hover:bg-[#13493A] transition-all"
      >
        Create Task
      </button>
    </div>
  );
}

// 8. Task Details & Edit
export function Screen10TaskDetails({ tasks, contacts, onNavigate, selectedTask }: PlanningProps) {
  const task = selectedTask || tasks[0];
  const contact = contacts.find((c) => c.id === task?.relatedContactId);

  return (
    <div className="w-full h-full min-h-[680px] bg-[#F9F8F5] text-gray-900 flex flex-col justify-between p-6 select-none rounded-[38px]">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <button onClick={() => onNavigate?.(6)} className="text-gray-600 hover:text-gray-900 text-xs font-semibold">
            ‹ Back
          </button>
          <span className="text-xs font-bold text-gray-900">Task Details</span>
          <span className="text-gray-400 text-xs">⋯</span>
        </div>

        {/* Task Title Header */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">📋</span>
            <h3 className="text-base font-bold text-gray-900">{task?.title || 'Client Call'}</h3>
          </div>
          <p className="text-xs text-gray-500">{task?.subtitle || 'ABC Constructions'}</p>
        </div>

        {/* Details Grid */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3 mb-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Date</span>
            <span className="font-semibold text-gray-800">{task?.date || 'Tue, 20 Oct 2026'}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Time</span>
            <span className="font-semibold text-gray-800">
              {task?.startTime} – {task?.endTime}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Duration</span>
            <span className="font-semibold text-gray-800">{task?.durationMinutes} minutes</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Priority</span>
            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full text-[10px] uppercase">
              {task?.priority}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Status</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] capitalize">
              {task?.status}
            </span>
          </div>
        </div>

        {/* Related Contact Card */}
        {contact && (
          <div
            onClick={() => onNavigate?.(10)}
            className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm mb-4 cursor-pointer hover:border-emerald-300 transition-colors"
          >
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
              Related Contact
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${contact.avatarColor} text-white font-bold flex items-center justify-center text-xs`}>
                  {contact.name[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{contact.name}</h4>
                  <p className="text-[10px] text-gray-400">{contact.company}</p>
                </div>
              </div>
              <span className="text-xs text-gray-300">›</span>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            Notes
          </span>
          <p className="text-xs text-gray-600 leading-relaxed">
            {task?.notes || 'Discuss new project requirements and timeline.'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-3">
        <button
          onClick={() => downloadICS([task], `nimora-task-${task.id}.ics`)}
          className="py-3 px-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs transition-all flex items-center justify-center gap-1 shadow-sm"
          title="Export to Calendar"
        >
          <span>📅</span>
        </button>
        <button
          onClick={() => onNavigate?.(15)}
          className="flex-1 py-3 rounded-2xl bg-emerald-100 text-emerald-900 font-semibold text-xs hover:bg-emerald-200 transition-all flex items-center justify-center gap-1.5"
        >
          <span>💬</span>
          <span>WhatsApp</span>
        </button>
        <button
          onClick={() => onNavigate?.(6)}
          className="flex-1 py-3 rounded-2xl bg-[#0F382C] text-white font-semibold text-xs shadow-md hover:bg-[#13493A] transition-all"
        >
          Edit Task
        </button>
      </div>
    </div>
  );
}

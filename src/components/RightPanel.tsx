'use client';
import { useState } from 'react';
import { Task } from '@/lib/types';
import { Widget } from './Widget';
import { db } from '@/lib/db';

interface RightPanelProps {
  tasks: Task[];
  date: string;
}

export function RightPanel({ tasks, date }: RightPanelProps) {
  const plan = db.getDayPlan(date);
  const [notes, setNotes] = useState(plan.notes);
  const [goals, setGoals] = useState(plan.goals.join('\n'));

  const handleSaveNotes = () => {
    db.saveDayPlan({ ...plan, date, notes, goals: goals.split('\n').filter(Boolean), tasks });
  };

  const stats = db.getStats(date);

  return (
    <aside className="w-80 bg-gray-50 border-l border-gray-200 h-screen overflow-y-auto flex flex-col">
      <div className="p-4">
        <Widget tasks={tasks} date={date} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">📊 Stats</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-lg p-2 text-center border">
            <p className="text-lg font-bold text-blue-600">{stats.total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="bg-white rounded-lg p-2 text-center border">
            <p className="text-lg font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs text-gray-500">Done</p>
          </div>
          <div className="bg-white rounded-lg p-2 text-center border">
            <p className="text-lg font-bold text-yellow-600">{stats.inProgress}</p>
            <p className="text-xs text-gray-500">In Progress</p>
          </div>
          <div className="bg-white rounded-lg p-2 text-center border">
            <p className="text-lg font-bold text-gray-600">{stats.todo}</p>
            <p className="text-xs text-gray-500">To Do</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex-1">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">🎯 Daily Goals</h3>
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          onBlur={handleSaveNotes}
          placeholder="One goal per line..."
          rows={4}
          className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">📝 Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleSaveNotes}
          placeholder="Daily notes..."
          rows={4}
          className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </aside>
  );
}

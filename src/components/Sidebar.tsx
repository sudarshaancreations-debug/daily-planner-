'use client';
import { useState } from 'react';
import { cn, getToday } from '@/lib/utils';

interface SidebarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
}

const defaultCategories = ['Work', 'Personal', 'Health', 'Learning', 'Errands'];

export function Sidebar({ selectedDate, onDateChange, categories, selectedCategory, onCategoryChange }: SidebarProps) {
  const allCategories = [...new Set([...defaultCategories, ...categories])];
  const today = getToday();

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          📅 Daily Planner
        </h1>
        <p className="text-xs text-gray-400 mt-1">MCP Hub v1.0</p>
      </div>

      <div className="p-4 border-b border-gray-800">
        <label className="text-xs text-gray-400 uppercase tracking-wider">Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full mt-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {selectedDate !== today && (
          <button
            onClick={() => onDateChange(today)}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300"
          >
            ↩ Back to today
          </button>
        )}
      </div>

      <div className="p-4 border-b border-gray-800">
        <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Categories</label>
        <button
          onClick={() => onCategoryChange(null)}
          className={cn(
            'w-full text-left px-3 py-1.5 rounded text-sm mb-1 transition-colors',
            selectedCategory === null ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
          )}
        >
          All Tasks
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={cn(
              'w-full text-left px-3 py-1.5 rounded text-sm mb-1 transition-colors',
              selectedCategory === cat ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500">
          <p>⌨️ Press <kbd className="bg-gray-800 px-1 rounded">V</kbd> for voice</p>
          <p className="mt-1">⌨️ Press <kbd className="bg-gray-800 px-1 rounded">N</kbd> for new task</p>
        </div>
      </div>
    </aside>
  );
}

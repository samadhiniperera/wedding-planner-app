'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTasksStore } from '@/lib/store/tasks-store';
import type { TabKey } from '@/types';

export function TaskBoard({ tab, title }: { tab: TabKey; title: string }) {
  const { itemsByTab, loading, error, fetchTab, addTask, updateTask, removeTask } =
    useTasksStore();
  const items = itemsByTab[tab] || [];

  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    fetchTab(tab);
  }, [tab, fetchTab]);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await addTask(tab, newTitle.trim(), newNotes.trim());
    setNewTitle('');
    setNewNotes('');
  };

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-slate-900">{title}</h1>
      <p className="mb-4 text-sm text-slate-500">
        Track what needs to happen and jot notes for {title.toLowerCase()}.
      </p>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="mb-6 flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-start">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Task, e.g. Book photographer"
          className="flex-1 rounded border border-slate-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
        />
        <input
          value={newNotes}
          onChange={(e) => setNewNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="flex-1 rounded border border-slate-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
        />
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
        >
          <Plus size={15} /> Add
        </button>
      </div>

      {loading && <p className="text-sm text-slate-400">Loading…</p>}

      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3"
          >
            <input
              type="checkbox"
              checked={item.is_done}
              onChange={(e) => updateTask(tab, item.id, { is_done: e.target.checked })}
              className="mt-1 h-4 w-4 accent-green-600"
            />
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  item.is_done ? 'text-slate-400 line-through' : 'text-slate-900'
                }`}
              >
                {item.title}
              </p>
              <textarea
                defaultValue={item.notes}
                key={item.notes}
                onBlur={(e) => updateTask(tab, item.id, { notes: e.target.value })}
                placeholder="Notes…"
                rows={1}
                className="mt-1 w-full resize-none rounded border border-transparent bg-transparent px-1 py-0.5 text-xs text-slate-500 focus:border-slate-200 focus:bg-slate-50 focus:outline-none"
              />
            </div>
            <button
              onClick={() => removeTask(tab, item.id)}
              className="text-slate-400 hover:text-red-500"
              aria-label="Delete task"
            >
              <Trash2 size={15} />
            </button>
          </li>
        ))}
        {items.length === 0 && !loading && (
          <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
            No tasks yet — add the first one above.
          </p>
        )}
      </ul>
    </div>
  );
}

import { create } from 'zustand';
import { api } from '@/lib/api';
import type { TabKey, TabTask } from '@/types';

interface TasksState {
  itemsByTab: Partial<Record<TabKey, TabTask[]>>;
  loading: boolean;
  error: string | null;
  fetchTab: (tab: TabKey) => Promise<void>;
  addTask: (tab: TabKey, title: string, notes: string) => Promise<void>;
  updateTask: (tab: TabKey, id: number, patch: Partial<TabTask>) => Promise<void>;
  removeTask: (tab: TabKey, id: number) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  itemsByTab: {},
  loading: false,
  error: null,

  fetchTab: async (tab) => {
    set({ loading: true, error: null });
    try {
      const data = await api.get<TabTask[]>(`/api/tasks/${tab}`);
      set((state) => ({ itemsByTab: { ...state.itemsByTab, [tab]: data }, loading: false }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  addTask: async (tab, title, notes) => {
    const created = await api.post<TabTask>(`/api/tasks/${tab}`, { title, notes });
    set((state) => ({
      itemsByTab: { ...state.itemsByTab, [tab]: [...(state.itemsByTab[tab] || []), created] },
    }));
  },

  updateTask: async (tab, id, patch) => {
    set((state) => ({
      itemsByTab: {
        ...state.itemsByTab,
        [tab]: (state.itemsByTab[tab] || []).map((t) => (t.id === id ? { ...t, ...patch } : t)),
      },
    }));
    try {
      await api.put(`/api/tasks/${tab}/${id}`, patch);
    } catch {
      get().fetchTab(tab);
    }
  },

  removeTask: async (tab, id) => {
    set((state) => ({
      itemsByTab: { ...state.itemsByTab, [tab]: (state.itemsByTab[tab] || []).filter((t) => t.id !== id) },
    }));
    await api.del(`/api/tasks/${tab}/${id}`);
  },
}));

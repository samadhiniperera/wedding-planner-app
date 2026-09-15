import { create } from 'zustand';
import { api } from '@/lib/api';
import type { Participant, ParticipantsResponse, PartySide } from '@/types';

interface ParticipantsState {
  bride: Participant[];
  groom: Participant[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  addRow: (side: PartySide) => Promise<void>;
  updateRow: (id: number, patch: Partial<Participant>) => Promise<void>;
  removeRow: (id: number, side: PartySide) => Promise<void>;
}

export const useParticipantsStore = create<ParticipantsState>((set, get) => ({
  bride: [],
  groom: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.get<ParticipantsResponse>('/api/participants');
      set({ bride: data.bride, groom: data.groom, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  addRow: async (side) => {
    const created = await api.post<Participant>('/api/participants', {
      party_side: side,
      relation: '',
    });
    set((state) => ({ [side]: [...state[side], created] } as Pick<ParticipantsState, PartySide>));
  },

  updateRow: async (id, patch) => {
    // optimistic update
    set((state) => ({
      bride: state.bride.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      groom: state.groom.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
    try {
      await api.put(`/api/participants/${id}`, patch);
    } catch (err) {
      // roll back by refetching on failure
      get().fetchAll();
    }
  },

  removeRow: async (id, side) => {
    set((state) => ({ [side]: state[side].filter((r) => r.id !== id) } as Pick<
      ParticipantsState,
      PartySide
    >));
    await api.del(`/api/participants/${id}`);
  },
}));

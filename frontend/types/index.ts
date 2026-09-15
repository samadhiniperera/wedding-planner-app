export type PartySide = 'bride' | 'groom';

export interface Participant {
  id: number;
  party_side: PartySide;
  relation: string;
  day1_estimated: number;
  day1_confirmed: number;
  day1_invited: boolean;
  day2_estimated: number;
  day2_confirmed: number;
  day2_invited: boolean;
  sort_order: number;
  created_at: string;
}

export interface ParticipantsResponse {
  bride: Participant[];
  groom: Participant[];
}

export type TabKey = 'photography' | 'flowers' | 'hall' | 'dressing';

export interface TabTask {
  id: number;
  tab_key: TabKey;
  title: string;
  notes: string;
  is_done: boolean;
  sort_order: number;
  created_at: string;
}

export interface TabDefinition {
  key: TabKey;
  label: string;
  href: string;
}

export const TABS: TabDefinition[] = [
  { key: 'photography', label: 'Photography', href: '/photography' },
  { key: 'flowers', label: 'Flower Decorations', href: '/flowers' },
  { key: 'hall', label: 'Hall Allocation', href: '/hall' },
  { key: 'dressing', label: 'Dressing', href: '/dressing' },
];

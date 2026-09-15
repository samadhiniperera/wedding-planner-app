'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Camera, Flower2, Building2, Shirt, HeartHandshake } from 'lucide-react';
import { TABS } from '@/types';

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  photography: Camera,
  flowers: Flower2,
  hall: Building2,
  dressing: Shirt,
};

export function Sidebar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      pathname === href
        ? 'bg-purple-100 text-purple-700'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white px-3 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <HeartHandshake className="text-purple-600" size={22} />
        <span className="text-lg font-semibold text-slate-900">Wedding Planner</span>
      </div>

      <nav className="flex flex-col gap-1">
        <Link href="/participants" className={linkClass('/participants')}>
          <Users size={18} />
          Participants
        </Link>

        <div className="mt-4 mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Planning
        </div>
        {TABS.map((tab) => {
          const Icon = ICONS[tab.key];
          return (
            <Link key={tab.key} href={tab.href} className={linkClass(tab.href)}>
              <Icon size={18} />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// import { Sidebar } from '@/components/sidebar';

// export function AppShell({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex h-screen w-full overflow-hidden">
//       <Sidebar />
//       <main className="flex-1 overflow-y-auto p-6 md:p-10">{children}</main>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Mobile top bar with hamburger toggle */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 md:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="text-slate-600 hover:text-slate-900"
        >
          <Menu size={22} />
        </button>
        <span className="text-base font-semibold text-slate-900">Wedding Planner</span>
      </div>

      {/* Backdrop, mobile only, closes the sidebar when tapped */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <Sidebar open={open} onClose={() => setOpen(false)} />

      <main className="flex-1 overflow-y-auto p-4 pt-20 md:p-10 md:pt-10">{children}</main>
    </div>
  );
}


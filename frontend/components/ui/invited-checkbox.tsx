'use client';

import { Check } from 'lucide-react';

export function InvitedCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
        checked ? 'border-green-600 bg-green-500' : 'border-slate-300 bg-white'
      }`}
    >
      {checked && <Check size={14} className="text-white" strokeWidth={3} />}
    </button>
  );
}

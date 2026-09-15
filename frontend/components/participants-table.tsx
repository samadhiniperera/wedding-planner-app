'use client';

import { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useParticipantsStore } from '@/lib/store/participants-store';
import { InvitedCheckbox } from '@/components/ui/invited-checkbox';
import type { Participant, PartySide } from '@/types';

const dayFields = (day: 1 | 2) => ({
  estimated: `day${day}_estimated` as const,
  confirmed: `day${day}_confirmed` as const,
  invited: `day${day}_invited` as const,
});

function NumberCell({
  value,
  onCommit,
}: {
  value: number;
  onCommit: (next: number) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      defaultValue={value}
      key={value}
      onBlur={(e) => onCommit(Number(e.target.value) || 0)}
      className="w-16 rounded border border-slate-200 bg-white px-2 py-1 text-center text-sm focus:border-purple-400 focus:outline-none"
    />
  );
}

function DayColumns({
  row,
  day,
  onUpdate,
}: {
  row: Participant;
  day: 1 | 2;
  onUpdate: (patch: Partial<Participant>) => void;
}) {
  const f = dayFields(day);
  return (
    <>
      <td className="border border-slate-200 px-2 py-1">
        <NumberCell value={row[f.estimated]} onCommit={(v) => onUpdate({ [f.estimated]: v })} />
      </td>
      <td className="border border-slate-200 px-2 py-1">
        <NumberCell value={row[f.confirmed]} onCommit={(v) => onUpdate({ [f.confirmed]: v })} />
      </td>
      <td className="border border-slate-200 px-2 py-1 text-center">
        <InvitedCheckbox
          checked={row[f.invited]}
          onChange={(v) => onUpdate({ [f.invited]: v })}
        />
      </td>
    </>
  );
}

function PartyRow({
  row,
  side,
  onUpdate,
  onRemove,
}: {
  row: Participant | undefined;
  side: PartySide;
  onUpdate: (id: number, patch: Partial<Participant>) => void;
  onRemove: (id: number, side: PartySide) => void;
}) {
  if (!row) {
    return (
      <>
        <td className="border border-slate-200 px-2 py-1" />
        <td className="border border-slate-200 px-2 py-1" />
        <td className="border border-slate-200 px-2 py-1" />
        <td className="border border-slate-200 px-2 py-1" />
        <td className="border border-slate-200 px-2 py-1" />
        <td className="border border-slate-200 px-2 py-1" />
        <td className="border border-slate-200 px-2 py-1" />
      </>
    );
  }

  return (
    <>
      <td className="border border-slate-200 px-2 py-1">
        <input
          type="text"
          defaultValue={row.relation}
          key={row.relation}
          onBlur={(e) => onUpdate(row.id, { relation: e.target.value })}
          placeholder="e.g. Uncle, Colleague"
          className="w-32 rounded border border-slate-200 bg-white px-2 py-1 text-sm focus:border-purple-400 focus:outline-none"
        />
      </td>
      <DayColumns row={row} day={1} onUpdate={(patch) => onUpdate(row.id, patch)} />
      <DayColumns row={row} day={2} onUpdate={(patch) => onUpdate(row.id, patch)} />
      <td className="border border-slate-200 px-1 py-1 text-center">
        <button
          onClick={() => onRemove(row.id, side)}
          className="text-slate-400 hover:text-red-500"
          aria-label="Delete row"
        >
          <Trash2 size={15} />
        </button>
      </td>
    </>
  );
}

const dayHeaderCells = (
  <>
    <th className="border border-slate-200 px-2 py-1 text-xs font-medium">Est. Count</th>
    <th className="border border-slate-200 px-2 py-1 text-xs font-medium">Confirmed</th>
    <th className="border border-slate-200 px-2 py-1 text-xs font-medium">Invited</th>
  </>
);

export function ParticipantsTable() {
  const { bride, groom, loading, error, fetchAll, addRow, updateRow, removeRow } =
    useParticipantsStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const rowCount = Math.max(bride.length, groom.length, 1);
  const rows = Array.from({ length: rowCount }, (_, i) => ({
    bride: bride[i],
    groom: groom[i],
  }));

  const totals = (list: Participant[], field: keyof Participant) =>
    list.reduce((sum, r) => sum + (Number(r[field]) || 0), 0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Participants</h1>
          <p className="text-sm text-slate-500">
            Bride&apos;s Party and Bridegroom&apos;s Party guest counts, split by Day 1 / Day 2.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => addRow('bride')}
            className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            <Plus size={15} /> Bride&apos;s row
          </button>
          <button
            onClick={() => addRow('groom')}
            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={15} /> Groom&apos;s row
          </button>
        </div>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {loading && <p className="mb-3 text-sm text-slate-400">Loading…</p>}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th
                colSpan={8}
                className="border border-slate-200 bg-bride-100 px-2 py-2 text-center text-sm font-semibold text-bride-600"
              >
                Bride&apos;s Party
              </th>
              <th
                colSpan={8}
                className="border border-slate-200 bg-groom-100 px-2 py-2 text-center text-sm font-semibold text-groom-600"
              >
                Bridegroom&apos;s Party
              </th>
            </tr>
            <tr>
              <th rowSpan={2} className="border border-slate-200 px-2 py-1 text-xs font-medium">
                Relation
              </th>
              <th colSpan={3} className="border border-slate-200 px-2 py-1 text-xs font-medium">
                Day 1
              </th>
              <th colSpan={3} className="border border-slate-200 px-2 py-1 text-xs font-medium">
                Day 2
              </th>
              <th rowSpan={2} className="border border-slate-200 px-2 py-1 text-xs font-medium">
                Relation
              </th>
              <th colSpan={3} className="border border-slate-200 px-2 py-1 text-xs font-medium">
                Day 1
              </th>
              <th colSpan={3} className="border border-slate-200 px-2 py-1 text-xs font-medium">
                Day 2
              </th>
              <th rowSpan={2} className="border border-slate-200 px-1 py-1" />
            </tr>
            <tr>
              {dayHeaderCells}
              {dayHeaderCells}
              {dayHeaderCells}
              {dayHeaderCells}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <PartyRow row={r.bride} side="bride" onUpdate={updateRow} onRemove={removeRow} />
                <PartyRow row={r.groom} side="groom" onUpdate={updateRow} onRemove={removeRow} />
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-medium">
              <td className="border border-slate-200 px-2 py-1 text-right">Totals</td>
              <td className="border border-slate-200 px-2 py-1 text-center">
                {totals(bride, 'day1_estimated')}
              </td>
              <td className="border border-slate-200 px-2 py-1 text-center">
                {totals(bride, 'day1_confirmed')}
              </td>
              <td className="border border-slate-200 px-2 py-1" />
              <td className="border border-slate-200 px-2 py-1 text-center">
                {totals(bride, 'day2_estimated')}
              </td>
              <td className="border border-slate-200 px-2 py-1 text-center">
                {totals(bride, 'day2_confirmed')}
              </td>
              <td className="border border-slate-200 px-2 py-1" />
              <td className="border border-slate-200 px-1 py-1" />
              <td className="border border-slate-200 px-2 py-1 text-right">Totals</td>
              <td className="border border-slate-200 px-2 py-1 text-center">
                {totals(groom, 'day1_estimated')}
              </td>
              <td className="border border-slate-200 px-2 py-1 text-center">
                {totals(groom, 'day1_confirmed')}
              </td>
              <td className="border border-slate-200 px-2 py-1" />
              <td className="border border-slate-200 px-2 py-1 text-center">
                {totals(groom, 'day2_estimated')}
              </td>
              <td className="border border-slate-200 px-2 py-1 text-center">
                {totals(groom, 'day2_confirmed')}
              </td>
              <td className="border border-slate-200 px-2 py-1" />
              <td className="border border-slate-200 px-1 py-1" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

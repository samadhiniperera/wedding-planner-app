-- Wedding Planner schema additions
-- Run this once against your Supabase/Postgres database (e.g. via the
-- Supabase SQL editor, or `psql $DATABASE_URL -f backend/db/schema.sql`)

-- Main "Participants" tab: one row per group/relation, split by which
-- side of the wedding they belong to (bride / groom), tracked per day.
CREATE TABLE IF NOT EXISTS participants (
  id              SERIAL PRIMARY KEY,
  party_side      TEXT NOT NULL CHECK (party_side IN ('bride', 'groom')),
  relation        TEXT NOT NULL,
  day1_estimated  INTEGER NOT NULL DEFAULT 0,
  day1_confirmed  INTEGER NOT NULL DEFAULT 0,
  day1_invited    BOOLEAN NOT NULL DEFAULT false,
  day2_estimated  INTEGER NOT NULL DEFAULT 0,
  day2_confirmed  INTEGER NOT NULL DEFAULT 0,
  day2_invited    BOOLEAN NOT NULL DEFAULT false,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Every other tab (Photography, Flower Decorations, Hall Allocation,
-- Dressing, and any future tab) shares this same simple task/notes table.
-- "tab_key" is what tells them apart.
CREATE TABLE IF NOT EXISTS tab_tasks (
  id          SERIAL PRIMARY KEY,
  tab_key     TEXT NOT NULL CHECK (tab_key IN ('photography', 'flowers', 'hall', 'dressing')),
  title       TEXT NOT NULL,
  notes       TEXT DEFAULT '',
  is_done     BOOLEAN NOT NULL DEFAULT false,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_participants_side ON participants(party_side);
CREATE INDEX IF NOT EXISTS idx_tab_tasks_tab_key ON tab_tasks(tab_key);

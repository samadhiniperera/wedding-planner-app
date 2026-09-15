# Wedding Planner (formerly Task Manager)

A Sri Lankan wedding planning app: guest participation tracking (Bride's
Party vs Bridegroom's Party, Day 1 / Day 2) plus task/notes tabs for
Photography, Flower Decorations, Hall Allocation and Dressing.

## Structure

```
backend/                Express + PostgreSQL (Supabase) API
  server.js              mounts all routers
  db.js                  Postgres connection pool
  routes/
    participants.js       Main tab: bride/groom x day1/day2 counts
    tasks.js               Photography / Flowers / Hall / Dressing tabs
  db/
    schema.sql             run this once to create the new tables

frontend/                Next.js (App Router) + TypeScript + Tailwind
  app/
    layout.tsx             root layout, wraps everything in <AppShell>
    participants/page.tsx  Main tab
    photography/page.tsx   |
    flowers/page.tsx       | all four reuse <TaskBoard tab="..." />
    hall/page.tsx          |
    dressing/page.tsx      |
  components/
    app-shell.tsx           sidebar + content area
    sidebar.tsx              left nav
    participants-table.tsx  the big two-party table
    task-board.tsx           generic add/notes/done list
    ui/invited-checkbox.tsx  green-tick checkbox
  lib/
    api.ts                   fetch wrapper
    store/                   zustand stores (participants, tasks)
  types/index.ts             shared TypeScript types + tab config
```

## 1. Database

1. Open the Supabase SQL editor for the project already referenced in
   `backend/.env` (or run `psql $DATABASE_URL -f backend/db/schema.sql`).
2. Run `backend/db/schema.sql`. It creates `participants` and
   `tab_tasks` — it won't touch your existing `tasks` table.

## 2. Backend

```bash
cd backend
npm install
npm run dev        # nodemon, http://localhost:5000
```

New endpoints:
- `GET/POST /api/participants`, `PUT/DELETE /api/participants/:id`
- `GET/POST /api/tasks/:tabKey`, `PUT/DELETE /api/tasks/:tabKey/:id`
  where `tabKey` is one of `photography | flowers | hall | dressing`

## 3. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # points at http://localhost:5000
npm run dev                         # http://localhost:3000
```

You'll land on `/participants`. The sidebar links to the four other tabs.

## Notes / assumptions made

- **Row pairing**: your sketch shows a bride-side row and a groom-side
  row on the same table line. Bride's Party and Groom's Party are
  really two independent lists (they don't have to be the same
  length), so the table pads the shorter side with blank cells and
  each side gets its own "Add row" button, matching the sketch's
  layout without forcing unrelated names to line up.
- **"3 attendance columns per day"** was built as Estimated Count,
  Confirmed Count, and an Invited checkbox (green tick when checked)
  — one set per Day 1 and Day 2, per side, exactly as in your table.
- Photography / Flowers / Hall / Dressing all share one `tab_tasks`
  table (a `title` + free-text `notes` + a done checkbox) rather than
  four separate tables, since you described the same "add a task,
  mention what they do, add notes" shape for all four. Easy to split
  into per-tab tables later if one of them grows extra fields.
- `frontend/` was empty in the uploaded project, so it was built from
  scratch as Next.js + TypeScript + Tailwind + Zustand, mirroring the
  `app/`, `components/`, `lib/store/`, `types/` layout from the
  CropFit project you referenced, rather than copying CropFit's IoT
  domain code.

## Security note

`backend/.env` has a live Supabase connection string with a real
password in it. Since it now lives in this shared project, treat that
password as compromised: **rotate it in the Supabase dashboard**
(Project Settings → Database → Reset password) and update `.env`
afterwards. Never commit `.env` to a public GitHub repo.

## Suggested next steps

- Auth (even a single shared PIN for the household is enough at this
  size) so "everyone using this app" isn't fully open.
- A dashboard tab summarizing totals across all five tabs.
- Per-tab file/photo attachments once you're past the MVP.

# Security Notes

This document records known security issues with the LogiSync deployment so
they are not forgotten. **Read this before any production / client deployment.**

## 1. Public-read Row Level Security (HIGH)

### What

The Supabase project ships its **publishable (anon) key** to the browser inside
`config.js`. That is normal and expected for a Supabase frontend — the key is
*not* a secret. The protection that actually matters is **Row Level Security
(RLS)** on each table.

As currently configured, the `tasks`, `weekly_numbers`, and `coaching_records`
tables are readable with the anon key — i.e. **anyone who loads the page (or
simply takes the public key and queries the REST API directly) can read all
rows.** Coaching records in particular contain sensitive employee performance
and disciplinary data (warnings, terminations, follow-ups).

### Why it matters

- The anon key is visible to every visitor (View Source → `config.js`), so
  "you need the key" is **not** access control.
- With public-read policies, the data is effectively public regardless of the
  login screen in the UI. The app's login does **not** protect the database.

### Impact

- Disclosure of internal QA scores and **employee disciplinary records**.

### What is *not* affected: writes

Writes are **not** done directly against the tables. The client has no
`INSERT`/`UPDATE`/`DELETE` RLS policies, so direct writes with the anon key are
rejected. Instead every mutation goes through a `SECURITY DEFINER` RPC
(`secure_add_task`, `secure_save_weekly`, `secure_save_coaching`,
`secure_start_aux`, …) that verifies the caller's PIN via `_auth_user(pin)`
before touching a table. This is a sound pattern: the database, not the UI, is
the gatekeeper for writes. The AUX Tracker follows the same model
(`secure_start_aux` / `secure_stop_aux` / `secure_delete_aux`); `aux_logs` is
read-only to the client.

The remaining gap is therefore **reads**, addressed below.

### Recommended remediation

1. **Enable RLS** on every table (it should already be on; confirm).
2. **Remove anonymous `SELECT` policies.** Require an authenticated role:

   ```sql
   -- Example: only authenticated users may read coaching records
   alter table public.coaching_records enable row level security;

   drop policy if exists "public read" on public.coaching_records;

   create policy "authenticated read"
     on public.coaching_records
     for select
     to authenticated
     using (true);
   ```

   Repeat for `tasks` and `weekly_numbers`, and scope `using (...)` further
   (e.g. by team / manager) where appropriate.
3. **Audit write policies** the same way — restrict `insert`/`update`/`delete`
   to authenticated (ideally privileged) roles.
4. Move the app to **real Supabase Auth** so `authenticated` actually means a
   signed-in user. The current client-side login gate is cosmetic from the
   database's perspective.

> Note: the task that produced this build explicitly scoped **login hardening
> out**, so the cosmetic login flow was intentionally left as-is. Fixing the RLS
> policies above is the real fix and is independent of the login UI.

### `aux_logs` table

The AUX Tracker uses a `public.aux_logs` table. It is **read-only to the client**
(anon `SELECT` only) and all writes go through PIN-verified `SECURITY DEFINER`
RPCs — the same model as the rest of the app (see "What is not affected: writes"
above). Like the other tables, its rows are publicly *readable* with the anon
key, so tighten the read policy when you move to real auth.

## 2. Secrets in `config.js`

`config.js` is git-ignored (`.gitignore`) and provided via `config.example.js`
so per-client values are not committed by accident. The only credential it holds
is the publishable key, which is safe to expose **once RLS is correct** (see #1).
Do **not** put the Supabase `service_role` key (or any server secret) in
`config.js` — it would be exposed to every browser.

## 3. Third-party CDN scripts

The app loads `supabase-js`, Chart.js, and SheetJS from public CDNs. For a
hardened deployment, consider pinning exact versions and adding
[Subresource Integrity](https://developer.mozilla.org/docs/Web/Security/Subresource_Integrity)
hashes, or self-hosting these assets.

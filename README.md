# LogiSync — Operations Command

A single-page operations command center for contact-center / shift teams.
It tracks **shift telemetry**, **weekly QA numbers**, and **coaching records**,
backed by [Supabase](https://supabase.com). The entire UI is a static app shell
(`index.html` + a prebuilt Tailwind stylesheet) with no build step required.

> Live reference deployment: https://stunning-octo-garbanzo90.vercel.app

## Features

- **Live operations feed** — log tasks, priorities, and active "threats".
- **Weekly numbers** — per-agent QA pass rates across 5 weeks with monthly reports.
- **Coaching records** — documentation, warnings, and follow-ups per agent.
- **Exports** — every data view exports to **Excel (.xlsx)** *and* **CSV**
  (CSV buttons sit next to each Excel button).
- **Import** — tasks and coaching records from Excel/CSV, with downloadable templates.
- **Offline-aware** — a throttled toast warns when the connection drops, so
  failed saves are noticed without spamming the user.
- **PWA** — installable, with a service worker that caches the static shell for
  fast / offline loads. Live data is always fetched fresh.

## Project structure

| File | Purpose |
|------|---------|
| `index.html` | The entire application (markup + styles + logic). |
| `config.js` | **Per-client config** (branding + Supabase URL/key). Git-ignored. |
| `config.example.js` | Template — copy to `config.js` and fill in. |
| `tailwind.build.css` | Prebuilt Tailwind stylesheet. |
| `logo.png` | App / PWA icon. |
| `manifest.webmanifest` | PWA manifest. |
| `sw.js` | Service worker — caches the static shell only. |
| `SECURITY_NOTES.md` | Known security issues (notably public-read RLS). |

## Getting started

This is a static site — no install or build step.

```bash
# 1. Configure
cp config.example.js config.js
#    edit config.js: set supabase.url, supabase.key, branding, agents…

# 2. Serve over HTTP (required for the service worker / PWA)
python3 -m http.server 8000
#    then open http://localhost:8000
```

> Open it over `http://`/`https://`, not `file://` — service workers and some
> browser APIs do not run from the filesystem.

### Configuration

All branding, agent lists, dropdown options, and the Supabase connection live in
`config.js` (see `config.example.js` for the full shape). The Supabase `key` is
the **publishable (anon) key** and ships to the browser — that is by design, but
it only stays safe with correct Row Level Security. **Read
[`SECURITY_NOTES.md`](./SECURITY_NOTES.md) before deploying.**

## Deploying

Any static host works (Vercel, Netlify, GitHub Pages, S3…). Make sure `config.js`
exists in the deployed bundle since it is git-ignored. Serve over HTTPS so the
PWA / service worker activates.

## Backend (Supabase)

The app expects three tables: `tasks`, `weekly_numbers`, and `coaching_records`.
Tighten their RLS policies before production — see `SECURITY_NOTES.md`.

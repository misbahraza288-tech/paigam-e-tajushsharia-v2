# Knowledge note — Paighaam-e-Tajushshariah v2 (Version A)

## How it is built
- Static site: `index.html` (public, hash routes like `#/library`), `admin.html` (hidden owner panel). No build step. Plain HTML, CSS and JS.
- `assets/js/seed.js` holds default content (site texts, stats, sample items). `assets/js/books.js` holds the 81 recovered book titles and their 372 volumes.
- `assets/js/store.js` is the only data layer. DEMO mode uses localStorage. LIVE mode (when `config.js` has a Supabase URL and anon key, and `DEMO` is false) uses Supabase REST and Auth. Everything else calls the store, so switching modes needs no page changes.
- Content by date: Aaj Ka Paigham and quizzes are keyed by date (YYYY-MM-DD, Asia/Kolkata). A day with no entry shows the placeholder. No cron is needed.
- Visual editor: admin opens `index.html?edit=1` in its own tab or in an iframe. Only signed-in admins get the pencils. Edits save to the site record.

## How to hand over to the owner
1. Owner signs up on Supabase (free) and runs `supabase/schema.sql` (see README steps 1–4).
2. Owner's UID goes into `admin_users`. From then on only that login can write.
3. Owner replaces every "sample" item in admin. Dashboard lists what is still sample.
4. Owner's photos: admin > Media. Owner's YouTube link: admin > Media > YouTube.

## How to switch demo mode off
- Edit `config.js`: fill `SUPABASE_URL` and `SUPABASE_ANON_KEY`, set `DEMO: false`. Commit. GitHub Pages redeploys.
- Demo data in one browser never reaches the live backend. Use admin > Settings > Backup to keep a copy first.

## Security notes
- No password, hash or service key in client code. The anon key is public by design; row-level security is what protects data.
- Admin login in DEMO mode is `demo / demo` on purpose and shown as a banner. Never use demo mode for the real owner.
- Public forms: honeypot field, 30-second rate limit per device, moderation queue (comments pending until approved).
- Quiz phone and address: visible only to the owner (RLS). Leaderboard view exposes first name and score only.

## Not built / not verified
- Live Supabase path: written against the documented REST and Auth endpoints but NOT run against a real project in this build.
- Push notifications: not built (browser alerts only).
- Telegram forwarding: function written, not deployed or tested.
- WhatsApp auto-forward: not possible without the Business API.
- Stats (1000+, 50K+, 700+) are the original's own claims and are unverified.
- Covers and Read links point at the original's external hosts (image host and Google Drive). If those go away, the cover falls back to a title tile and the Read link opens nothing; owner can re-upload covers in admin.
- Library reading is the original's Google Drive preview frame, so reading depends on that file staying shared.

## Template
`clients/_template-library` in the misbah-digital-computer repo is the reusable shape of this build (see that repo's notes if present).

# Paighaam-e-Tajushshariah v2 (Version A)

Premium, light-colour rebuild of the Paighaam-e-Tajushshariah site, built to Misbah's spec.
The original site at paigam-e-tajushsharia.pages.dev is NOT changed by this repo.

**Status: preview.** It runs fully in DEMO MODE (data stays in the browser, admin login `demo / demo`, bannered on every page).
Live backend (Supabase) is wired in but needs the owner's free project — see the steps below.

## Open it
- Site: https://misbahraza288-tech.github.io/paigam-e-tajushsharia-v2/
- Admin (hidden): `admin.html`. On the site, tap the footer brand 3 times quickly to open the login popup.

## What is in it
- Home: brand box, hero (swappable photo at `assets/img/hero.jpg`), count-up stats, Explore cards, Aaj Ka Paigham, Latest Updates (pulse dot), Media (video frame + gallery), About, Hamari Khidmat, Ta'awun bar, Share Your Thoughts form, Comments (moderated), Taj Scholar of the Day.
- Menu drawer (animated), settings sheet (light/dark, font size, language, notifications), legal modals (drafts).
- Taj Library: search, category chips, 81 book titles / 372 volumes recovered from the original, Read Now opens the original's own link in a clean frame, Resume Reading.
- Taj Quiz: countdown when no quiz, 4 rules, quiz form (name/phone/address stored privately), one question at a time, result animation, leaderboard (first name + score only).
- Aaj Ka Paigham: date-keyed (IST midnight switch), Hijri date, Listen (browser speech, not a Quran recitation), WhatsApp status poster (PNG download), text share.
- Gallery with masonry layout and lightbox. Videos page (YouTube embed in a light frame; no glass).
- Tawwun page (trust name and address recovered from the original, no payment handling, no bank/UPI details).
- Admin: dashboard, visual editor (pencil on the real page), sections on/off, text-size sliders, books, 30-day paigham scheduler, updates, quiz setter, media manager (phone photo compress, gallery/hero/cover), YouTube link auto title + thumbnail, messages tracker (read/unread, WhatsApp reply link), comment moderation, leaderboard, Ta'awun and stats, backup download.
- PWA: manifest + service worker (offline shell and last-viewed pages).

## Going live (owner, about 8 steps)
1. Make a free account at supabase.com and create a new project (choose a strong database password and keep it).
2. Open SQL Editor, paste `supabase/schema.sql`, press Run.
3. Authentication > Users > Add user: the owner types his own email and password. Nobody else needs to know them.
4. Copy the owner's user id (UID) from that user row. In SQL Editor run: `insert into public.admin_users (uid) values ('PASTE-UID');`
5. Project Settings > API: copy the Project URL and the `anon public` key into `config.js`, set `DEMO: false`. Never paste the `service_role` key anywhere.
6. Commit the changed `config.js` to the repo. Reload the site; the admin login now uses the owner's email and password.
7. (Optional) Telegram forwarding: create a bot with @BotFather, deploy `supabase/functions/forward-message/index.ts` as an Edge Function, set secrets `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `WEBHOOK_SECRET`, and add a Database Webhook on the `messages` table (INSERT) that sends `x-webhook-secret`.
8. Open admin, check the dashboard, replace every item tagged "sample", then add the real hero photo.

## Recovered vs filler
- Recovered from the original: book titles, writers (English and Urdu), volume numbers, Read links, cover image links, section names, the Tawwun trust name and address, Hamari Khidmat headings, the four Tawwun purposes.
- Filler, tagged "sample" in the UI: stats (1000+, 50K+, 700+, 24/7 are the original's own claims, unverified), updates, Aaj Ka Paigham texts, quiz questions, gallery tiles, comments, leaderboard entries, rules, mission and history text, Ta'awun amounts, legal drafts.
- Nothing here is a Quran or Hadees text. Owner writes the real Paigham text.
- The original site's quiz questions lived in its own Firebase database; they were not recoverable from the public files, so the quiz runs on sample questions until the owner adds real ones in admin.

## Notes for the handover
- The original site used a Firebase project. This v2 does not reuse it. Its config and data stay with the owner.
- Privacy: quiz phone/address and contact messages are readable only by the owner account (row-level security in `schema.sql`).
- Push notifications: not built. The "notify me" switch shows browser alerts only while the site is open.
- WhatsApp auto-forwarding of messages is not possible without the WhatsApp Business API. Use the admin tracker's WhatsApp reply link.
- Glass UI is not used anywhere; the video player is a clean light frame.

More detail: `docs/KNOWLEDGE.md`.

// Supabase Edge Function: forwards a new "Share Your Thoughts" message to the owner's Telegram.
// Deploy: Supabase Dashboard > Edge Functions > new function "forward-message" > paste this file.
// Secrets (Dashboard > Edge Functions > Secrets) — never put these in the website code:
//   TELEGRAM_BOT_TOKEN  — from @BotFather
//   TELEGRAM_CHAT_ID    — the owner's chat id (get it by messaging the bot and reading getUpdates)
//   WEBHOOK_SECRET      — any long random text; the Database Webhook must send it in x-webhook-secret
// Database Webhook: Database > Webhooks > table "messages", event INSERT, HTTP POST to this function,
// header x-webhook-secret = WEBHOOK_SECRET.
// WhatsApp auto-forwarding is NOT possible without the WhatsApp Business API; the admin tracker has a WhatsApp reply link instead.

Deno.serve(async (req: Request) => {
  if (req.headers.get("x-webhook-secret") !== Deno.env.get("WEBHOOK_SECRET")) {
    return new Response("forbidden", { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const rec = body.record ?? body;            // database webhook sends { type, table, record }
  const d = rec.data ?? rec;
  const text = [
    "Naya message — Paighaam site",
    "Naam: " + (d.name ?? ""),
    d.email ? "Email: " + d.email : "",
    d.phone ? "WhatsApp: " + d.phone : "",
    "",
    String(d.message ?? "").slice(0, 3500),
  ].filter(Boolean).join("\n");
  const url = `https://api.telegram.org/bot${Deno.env.get("TELEGRAM_BOT_TOKEN")}/sendMessage`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: Deno.env.get("TELEGRAM_CHAT_ID"), text }),
  });
  return new Response(r.ok ? "ok" : "telegram error " + r.status, { status: r.ok ? 200 : 502 });
});

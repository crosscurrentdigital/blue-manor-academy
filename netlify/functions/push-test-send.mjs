// Public, unauthenticated "send a test push to this exact subscription"
// endpoint — deliberately simpler than the Piesano's build's admin-gated
// broadcast function. This preview has one audience (whoever's testing it),
// so there's no segment/broadcast concept, and no admin token to manage for
// a demo. A real build would replace this with the admin-panel-driven send
// described in SCOPE.md.
//
// It's still not an open relay, though: the submitted subscription must
// match one already registered via push-subscribe (looked up by the same
// endpoint-derived key that function stores under). Without that check,
// anyone who obtained ANY web-push subscription object — not necessarily
// one this app ever issued — could get this deploy's VAPID identity to
// sign and deliver an arbitrary notification to it. Requiring a prior
// subscribe call keeps the demo's no-auth simplicity while closing that
// gap.

import { json, subscriptionsStore, vapidReady, webpush } from "./_push-shared.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, { status: 405 });

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, { status: 400 });
  }

  const { subscription, title, body: message } = body || {};
  if (!subscription || typeof subscription.endpoint !== "string") {
    return json({ error: "invalid_subscription" }, { status: 400 });
  }
  if (!title || !message) {
    return json({ error: "invalid_notification", detail: "title and body are required" }, { status: 400 });
  }

  const store = subscriptionsStore();
  const key = Buffer.from(subscription.endpoint).toString("base64url");
  const registered = await store.get(key, { type: "json" });
  if (!registered) {
    return json({ error: "not_subscribed", detail: "Call /api/push/subscribe with this subscription first." }, { status: 403 });
  }

  if (!vapidReady) {
    return json({ ok: true, transport: "mock" });
  }

  try {
    await webpush.sendNotification(subscription, JSON.stringify({ title, body: message }));
    return json({ ok: true, transport: "web-push" });
  } catch (err) {
    return json({ error: "send_failed", detail: String(err && err.message ? err.message : err) }, { status: 502 });
  }
};

export const config = { path: "/api/push/test-send" };

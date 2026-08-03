// Public, unauthenticated "send a test push to this exact subscription"
// endpoint — deliberately simpler than the Piesano's build's admin-gated
// broadcast function. This preview has one audience (whoever's testing it),
// so there's no segment/broadcast concept, and no admin token to manage for
// a demo. A real build would replace this with the admin-panel-driven send
// described in SCOPE.md, not expose an open broadcast endpoint.

import { json, vapidReady, webpush } from "./_push-shared.mjs";

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

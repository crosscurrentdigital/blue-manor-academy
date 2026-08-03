// Public endpoint: register a browser's PushSubscription. No account system
// here — this preview stores subscriptions keyed by endpoint only, purely
// so the "send me a test reminder" button on the Home page has something
// real to send to.

import { json, subscriptionsStore } from "./_push-shared.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, { status: 405 });

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, { status: 400 });
  }

  const { subscription } = body || {};
  if (!subscription || typeof subscription.endpoint !== "string") {
    return json({ error: "invalid_subscription", detail: "subscription.endpoint is required" }, { status: 400 });
  }

  const store = subscriptionsStore();
  const key = Buffer.from(subscription.endpoint).toString("base64url");
  await store.setJSON(key, { subscription, createdAt: new Date().toISOString() });

  return json({ ok: true }, { status: 201 });
};

export const config = { path: "/api/push/subscribe" };

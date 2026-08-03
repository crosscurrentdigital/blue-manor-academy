// Shared helpers for the push-notification functions — same pattern as the
// Piesano's build's netlify/functions/_push-shared.mjs, trimmed down: this
// preview has no customer segments or admin auth, since it's a single-user
// demo, not a multi-family product.

import { getStore } from "@netlify/blobs";
import webpush from "web-push";

export const SUBSCRIPTIONS_STORE = "bma-push-subscriptions";

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;

export const vapidReady = Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);

if (vapidReady) {
  webpush.setVapidDetails(
    VAPID_SUBJECT || "mailto:admin@example.com",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY,
  );
}

export { webpush };
export const vapidPublicKey = VAPID_PUBLIC_KEY || null;

export function subscriptionsStore() {
  return getStore(SUBSCRIPTIONS_STORE);
}

export function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "content-type": "application/json", ...(init.headers || {}) },
  });
}

// Thin fetch wrappers around netlify/functions/push-*.mjs. Simpler than the
// Piesano's build's version on purpose: this preview has one audience (the
// person testing it), not a segmented customer base, so there's no
// admin-token-gated broadcast — any subscribed device can trigger a test
// send to itself, which is all a pitch demo needs to prove the round trip
// is real.

export interface VapidKeyResponse {
  key: string | null;
  transport: "web-push" | "mock";
}

async function asJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `request failed: ${res.status}`);
  }
  return res.json();
}

export function fetchVapidKey(): Promise<VapidKeyResponse> {
  return fetch("/api/push/vapid-key").then((r) => asJson<VapidKeyResponse>(r));
}

export function subscribePush(subscription: PushSubscriptionJSON): Promise<{ ok: true }> {
  return fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ subscription }),
  }).then((r) => asJson(r));
}

export function sendTestPush(
  subscription: PushSubscriptionJSON,
  input: { title: string; body: string },
): Promise<{ ok: true; transport: "web-push" | "mock" }> {
  return fetch("/api/push/test-send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ subscription, ...input }),
  }).then((r) => asJson(r));
}

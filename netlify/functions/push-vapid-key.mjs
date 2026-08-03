import { json, vapidPublicKey, vapidReady } from "./_push-shared.mjs";

export default async () => {
  return json({ key: vapidPublicKey, transport: vapidReady ? "web-push" : "mock" });
};

export const config = { path: "/api/push/vapid-key" };

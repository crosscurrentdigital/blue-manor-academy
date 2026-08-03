// Custom service worker (vite-plugin-pwa injectManifest strategy). Handles
// three things: app-shell precaching, real Web Push (push/notificationclick
// — ported from the same pattern as the Piesano's and Elks Theatre builds),
// and an on-demand cache for the Library page's "save for offline" lesson
// content (a runtime cache the page populates itself via caches.open, not a
// precache — see src/pages/Library.tsx).

import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html")));

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("push", (event) => {
  let data = { title: "Blue Manor Academy Companion", body: "" };
  try {
    if (event.data) data = event.data.json();
  } catch {
    /* non-JSON payload — keep defaults */
  }
  const options = {
    body: data.body || "",
    tag: "bma-companion-notification",
    renotify: true,
  };
  event.waitUntil(self.registration.showNotification(data.title || "Blue Manor Academy Companion", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("/");
    }),
  );
});

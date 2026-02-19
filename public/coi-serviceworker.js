/**
 * COI Service Worker Logic
 * Enables Cross-Origin Isolation (COOP/COEP) for SharedArrayBuffer support.
 */
if (typeof window === 'undefined') {
  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

  self.addEventListener("message", (ev) => {
    if (ev.data && ev.data.type === "deregister") {
      self.registration
        .unregister()
        .then(() => self.clients.matchAll())
        .then((clients) => {
          clients.forEach((client) => client.navigate(client.url));
        });
    }
  });

  self.addEventListener("fetch", function (event) {
    if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
      return;
    }

    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 0) return response;

          const newHeaders = new Headers(response.headers);
          newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
          newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
          });
        })
        .catch((e) => console.error(e))
    );
  });
} else {
  (async function () {
    if (window.crossOriginIsolated) return;

    if (!window.isSecureContext) {
        console.warn("COOP/COEP Service Worker not registered, a secure context is required.");
        return;
    }

    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register("coi-serviceworker.js");
            console.log("COOP/COEP Service Worker registered", registration.scope);

            if (registration.active && !navigator.serviceWorker.controller) {
                console.log("Reloading page to make use of COOP/COEP Service Worker.");
                window.location.reload();
            }
        } catch (err) {
            console.error("COOP/COEP Service Worker failed to register:", err);
        }
    }
  })();
}

"use client";

import { useEffect } from "react";

const CACHE_VERSION = "dj-connect-v6";

export function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !window.location.protocol.startsWith("http")) return;

    async function clearOldCaches() {
      if (!("caches" in window)) return;
      const storedVersion = window.localStorage.getItem("dj-connect-cache-version");
      if (storedVersion === CACHE_VERSION) return;

      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key.startsWith("dj-connect-")).map((key) => caches.delete(key)));
      window.localStorage.setItem("dj-connect-cache-version", CACHE_VERSION);
    }

    clearOldCaches().catch(() => undefined);

    navigator.serviceWorker.register("/sw.js").then((registration) => {
      registration.update().catch(() => undefined);

      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            worker.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });
    }).catch(() => undefined);
  }, []);

  return null;
}

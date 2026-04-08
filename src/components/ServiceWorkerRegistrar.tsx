"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Dispatch is served from /dispatch on the Cloudflare Worker. The
      // service worker ships at /dispatch/sw.js and only controls
      // /dispatch/* — the marketing site at / is unaffected.
      navigator.serviceWorker
        .register("/dispatch/sw.js", { scope: "/dispatch/" })
        .catch(() => {
          // Service worker registration failed — non-critical
        });
    }
  }, []);

  return null;
}

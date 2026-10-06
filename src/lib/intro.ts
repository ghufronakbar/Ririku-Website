"use client";

import { useSyncExternalStore } from "react";

// Flips once the preloader has finished (or was skipped), so the hero can
// start its entrance instead of animating behind the overlay.
let ready = false;
const listeners = new Set<() => void>();

export function markIntroReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useIntroReady() {
  return useSyncExternalStore(
    subscribe,
    () => ready,
    () => false,
  );
}

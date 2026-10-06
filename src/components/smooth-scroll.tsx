"use client";

import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";

// The page's single Lenis instance, readable from any component.
let instance: Lenis | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLenis() {
  return useSyncExternalStore(
    subscribe,
    () => instance,
    () => null,
  );
}

/** Smooth scrolling for the whole page. Lenis honors reduced motion on its own. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    instance = new Lenis({ autoRaf: true, lerp: 0.09, anchors: true, stopInertiaOnNavigate: true });
    listeners.forEach((listener) => listener());
    return () => {
      instance?.destroy();
      instance = null;
      listeners.forEach((listener) => listener());
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

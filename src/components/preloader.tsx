"use client";

import { animate, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { site } from "@/content/site";
import { useLenis } from "@/components/smooth-scroll";
import { useI18n } from "@/i18n/provider";
import { Spectrum } from "@/components/ui/spectrum";
import { markIntroReady } from "@/lib/intro";

const COLUMNS = 6;

declare global {
  interface Window {
    __ririkuSkipIntro?: boolean;
  }
}

// Set before first paint by the script in layout.tsx.
const noSubscribe = () => () => {};
const readSkipped = () => window.__ririkuSkipIntro === true;
const MIN_DURATION = 1.7;

/**
 * First-visit intro: a counter and a spectrum, then the black lifts away in
 * columns. Skipped before first paint for repeat visits and reduced motion
 * (see the script in layout.tsx).
 */
export function Preloader() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading");
  const skipped = useSyncExternalStore(noSubscribe, readSkipped, () => false);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();

  // Hydration strips the html[data-intro] attribute that hides this overlay
  // before paint; restore it in the same commit so a skipped intro never flashes.
  useLayoutEffect(() => {
    if (readSkipped()) document.documentElement.dataset.intro = "skip";
  }, []);

  // Lenis scrolls programmatically, so overflow: hidden alone would not hold the page still.
  useEffect(() => {
    if (!lenis || skipped || phase === "done") return;
    lenis.stop();
    return () => lenis.start();
  }, [lenis, skipped, phase]);

  useEffect(() => {
    if (readSkipped()) {
      markIntroReady();
      return;
    }
    const root = document.documentElement;
    root.classList.add("overflow-hidden");

    const counter = animate(0, 100, {
      duration: MIN_DURATION,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        if (counterRef.current) counterRef.current.textContent = String(Math.round(v)).padStart(3, "0");
      },
    });

    const heroImage = document.querySelector<HTMLImageElement>("[data-hero-art] img");
    const imageReady = heroImage?.decode ? heroImage.decode().catch(() => undefined) : Promise.resolve();
    const timeout = new Promise((resolve) => setTimeout(resolve, 4000));
    const minimum = new Promise((resolve) => setTimeout(resolve, MIN_DURATION * 1000 + 150));

    let cancelled = false;
    const timers: number[] = [];
    Promise.all([minimum, Promise.race([Promise.all([document.fonts.ready, imageReady]), timeout])]).then(() => {
      if (cancelled) return;
      try {
        sessionStorage.setItem("ririku-intro", "1");
      } catch {}
      setPhase("leaving");
      timers.push(window.setTimeout(markIntroReady, 450));
      timers.push(
        window.setTimeout(() => {
          root.classList.remove("overflow-hidden");
          setPhase("done");
        }, 1500),
      );
    });

    return () => {
      cancelled = true;
      counter.stop();
      timers.forEach(clearTimeout);
      root.classList.remove("overflow-hidden");
    };
  }, []);

  if (skipped || phase === "done") return null;
  const leaving = phase === "leaving";

  return (
    <div data-preloader aria-hidden className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <motion.div
            key={i}
            className="h-full flex-1 bg-ink"
            style={{ marginLeft: i ? -1 : 0 }}
            animate={leaving ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1], delay: leaving ? 0.25 + i * 0.06 : 0 }}
          />
        ))}
      </div>

      <motion.div
        className="absolute inset-0 flex flex-col justify-between p-5 md:p-8"
        animate={leaving ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="flex justify-between font-mono text-[11px] tracking-[0.2em] text-mute uppercase">
          <span>
            {site.name} / {site.kana}
          </span>
          <span>v{site.version} — macOS</span>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Spectrum bars={9} className="h-16 gap-1.5 text-coral [&>span]:w-1.5" />
          <span className="font-jp text-2xl tracking-[0.3em] text-paper/90">{site.kana}</span>
        </div>

        <div className="flex items-end justify-between gap-6">
          <span ref={counterRef} lang="en" className="display text-[clamp(5rem,22vw,20rem)] leading-[0.78] text-paper tabular-nums">
            000
          </span>
          <span className="mb-3 hidden font-mono text-[11px] tracking-[0.2em] text-mute uppercase sm:block">{t.preloader}</span>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { Gauge, House, Inbox, LayoutGrid, Settings, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { demoSong } from "@/content/site";
import { Picture, type MediaSlug } from "@/components/picture";
import { Artwork, SeekBar, Transport } from "@/components/player";
import { Spectrum } from "@/components/ui/spectrum";
import { useIntroReady } from "@/lib/intro";
import { useLyricState } from "@/lib/lyric-clock";
import { cn } from "@/lib/cn";

const tabs: { label: string; icon: typeof House; image?: MediaSlug; alt?: string }[] = [
  { label: "Home", icon: House },
  { label: "System", icon: LayoutGrid, image: "panel-system", alt: "System page: CPU, memory and disk use, battery, and the clock" },
  { label: "Focus", icon: Gauge, image: "panel-focus", alt: "Focus page: Pomodoro, countdown and a note" },
  { label: "Today", icon: Sparkles, image: "panel-today", alt: "A page with the calendar and Shortcuts" },
  { label: "Tray", icon: Inbox, image: "panel-tray", alt: "The Tray, with AirDrop and a drop zone for files" },
];

// The screenshots are 1038 × 352 with a 64 px tab bar on top, which the
// island's own live tab bar replaces.
const SHOT_RATIO = 288 / 1038;
const TAB_BAR = 52;
const spring = { type: "spring", stiffness: 260, damping: 30, mass: 0.9 } as const;

function useViewportWidth() {
  const [width, setWidth] = useState(1280);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

/**
 * A working copy of Ririku's notch island, fixed under the top edge of the
 * page. It shows the demo song's lyrics, shrinks once you scroll, and expands
 * into the panel on hover or tap, with live tabs and playback controls.
 */
export function NotchIsland() {
  const ready = useIntroReady();
  const vw = useViewportWidth();
  const mobile = vw < 640;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number>(undefined);
  const { index, playing } = useLyricState();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > window.innerHeight * 0.55));

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const hover = (next: boolean) => (event: ReactPointerEvent) => {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpen(next), next ? 140 : 320);
  };

  const openWidth = Math.min(vw - 16, 540);
  const mode = open ? "open" : scrolled ? "mini" : "full";
  const box =
    mode === "open"
      ? { width: openWidth, height: tab === 0 ? (mobile ? 252 : 270) : TAB_BAR + Math.round(openWidth * SHOT_RATIO), radius: 34 }
      : mode === "full"
        ? mobile
          ? { width: 236, height: 80, radius: 24 }
          : { width: 352, height: 90, radius: 26 }
        : mobile
          ? { width: 188, height: 34, radius: 17 }
          : { width: 244, height: 36, radius: 18 };

  const line = demoSong.lines[index];
  const nextLine = demoSong.lines[(index + 1) % demoSong.lines.length];

  return (
    <motion.div
      ref={rootRef}
      role="region"
      aria-label="Demo of Ririku's notch island"
      className="fixed top-0 left-1/2 z-[60] -translate-x-1/2"
      initial={{ y: -140 }}
      animate={{ y: ready ? 0 : -140 }}
      transition={{ ...spring, delay: ready ? 0.9 : 0 }}
      onPointerEnter={hover(true)}
      onPointerLeave={hover(false)}
    >
      <motion.div
        className="relative bg-black text-paper shadow-[0_18px_50px_-12px_rgb(0_0_0/0.9)]"
        initial={false}
        animate={{ width: box.width, height: box.height, borderBottomLeftRadius: box.radius, borderBottomRightRadius: box.radius }}
        transition={spring}
      >
        {/* The concave "ears" where the notch meets the top edge. */}
        <span aria-hidden className="absolute top-0 right-full size-3 bg-[radial-gradient(circle_at_0_100%,transparent_11.5px,#000_12px)]" />
        <span aria-hidden className="absolute top-0 left-full size-3 bg-[radial-gradient(circle_at_100%_100%,transparent_11.5px,#000_12px)]" />

        <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
          <AnimatePresence initial={false} mode="popLayout">
            {mode !== "open" ? (
              <motion.div
                key="compact"
                className="absolute inset-x-0 top-0"
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 0.15 } }}
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                <div className={cn("flex items-center justify-between", mode === "mini" ? "h-[34px] px-2.5" : "h-[34px] px-3")}>
                  <Artwork size={mode === "mini" ? 20 : 22} />
                  <Spectrum playing={playing} className="h-3.5 text-coral" />
                </div>
                <AnimatePresence initial={false}>
                  {mode === "full" && (
                    <motion.div
                      className="relative h-11 px-3 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    >
                      <LyricPair line={line.jp} next={nextLine.jp} index={index} small={mobile} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="open"
                className="absolute inset-x-0 top-0"
                style={{ width: openWidth }}
                initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.12 } }}
                transition={{ duration: 0.4, delay: 0.08 }}
              >
                <div className="flex h-[52px] items-center justify-between px-3.5">
                  <div className="flex gap-1" role="tablist" aria-label="Panel pages">
                    {tabs.map((item, i) => (
                      <button
                        key={item.label}
                        type="button"
                        role="tab"
                        aria-selected={tab === i}
                        aria-label={item.label}
                        onClick={() => setTab(i)}
                        className={cn(
                          "grid size-9 place-items-center rounded-xl transition-colors",
                          tab === i ? "bg-white/14 text-paper" : "text-paper/70 hover:text-paper",
                        )}
                      >
                        <item.icon className="size-[19px]" strokeWidth={1.8} />
                      </button>
                    ))}
                  </div>
                  <a
                    href="#setup"
                    aria-label="Setup"
                    onClick={() => setOpen(false)}
                    className="grid size-9 place-items-center rounded-xl text-paper/80 hover:text-paper"
                  >
                    <Settings className="size-[19px]" strokeWidth={1.8} />
                  </a>
                </div>
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12, transition: { duration: 0.12 } }}
                    transition={{ duration: 0.3 }}
                  >
                    {tab === 0 ? (
                      <MusicPage index={index} playing={playing} mobile={mobile} />
                    ) : (
                      <div className="relative overflow-hidden" style={{ height: Math.round(openWidth * SHOT_RATIO) }}>
                        <Picture
                          slug={tabs[tab].image!}
                          alt={tabs[tab].alt!}
                          sizes="540px"
                          className="absolute inset-x-0 bottom-0 block"
                          imgClassName="block h-auto w-full"
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!open && (
          <button
            type="button"
            aria-expanded={false}
            aria-label="Expand the demo panel"
            className="absolute inset-0 cursor-pointer rounded-[inherit]"
            onClick={() => setOpen(true)}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

function LyricPair({ line, next, index, small }: { line: string; next: string; index: number; small?: boolean }) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={index}
        className="absolute inset-x-3 top-0 font-jp-text"
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className={cn("truncate font-semibold text-[#ffb4ad]", small ? "text-[12px]" : "text-[13.5px]")}>{line}</p>
        <p className={cn("mt-0.5 truncate font-medium text-white/40", small ? "text-[11px]" : "text-[12.5px]")}>{next}</p>
      </motion.div>
    </AnimatePresence>
  );
}

function MusicPage({ index, playing, mobile }: { index: number; playing: boolean; mobile: boolean }) {
  const line = demoSong.lines[index];
  const nextLine = demoSong.lines[(index + 1) % demoSong.lines.length];

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center gap-3.5">
        <Artwork size={mobile ? 48 : 54} />
        <div className="min-w-0 leading-tight">
          <p className="font-jp-text truncate text-[15px] font-bold">{demoSong.title}</p>
          <p className="mt-1 truncate text-[13px] text-white/60">{demoSong.artist}</p>
          <p className="mt-1 truncate text-[13px] font-semibold text-[#ff9a92]">{demoSong.source}</p>
        </div>
      </div>
      <div className="relative mt-3 h-12 text-center">
        <LyricPair line={line.jp} next={nextLine.jp} index={index} small={mobile} />
      </div>
      <SeekBar className="mt-2" />
      <Transport playing={playing} className="mt-1" />
    </div>
  );
}

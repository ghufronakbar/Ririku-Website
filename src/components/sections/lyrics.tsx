"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { demoSong, lyrics, site } from "@/content/site";
import { Artwork, SeekBar, Transport } from "@/components/player";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SplitReveal } from "@/components/ui/split-reveal";
import { lyricClock, useLyricState } from "@/lib/lyric-clock";
import { cn } from "@/lib/cn";

const STRIPES = 9;

/** One of the black bars that open like blinds as the card scrolls in. */
function Stripe({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const scaleY = useTransform(progress, [i * 0.045, 0.55 + i * 0.05], [1, 0]);
  return (
    <motion.div
      className="absolute inset-x-0 origin-top bg-ink"
      style={{ top: `${(i / STRIPES) * 100}%`, height: `${100 / STRIPES + 0.5}%`, scaleY }}
    />
  );
}

function Toggle({ on, onChange, children }: { on: boolean; onChange: (on: boolean) => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={cn(
        "h-8 rounded-full px-3.5 text-[12px] font-medium transition-colors duration-300",
        on ? "bg-paper text-ink" : "bg-white/8 text-paper/70 hover:bg-white/14 hover:text-paper",
      )}
    >
      {children}
    </button>
  );
}

/** A large synced-lyrics view of the demo song. Click a line to jump to it. */
function LyricsPlayer() {
  const { index, playing } = useLyricState();
  const [romaji, setRomaji] = useState(true);
  const [translation, setTranslation] = useState(true);
  const listRef = useRef<HTMLOListElement>(null);
  const y = useSpring(0, { stiffness: 110, damping: 22, mass: 0.8 });

  // Keep the active line in the middle of the window.
  useLayoutEffect(() => {
    const list = listRef.current;
    const line = list?.children[index] as HTMLElement | undefined;
    if (!list || !line) return;
    const viewport = list.parentElement!.clientHeight;
    y.set(viewport / 2 - (line.offsetTop + line.offsetHeight / 2));
  }, [index, romaji, translation, y]);

  return (
    <div className="rounded-[30px] bg-black/80 p-5 ring-1 ring-white/10 backdrop-blur-xl md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <Artwork size={52} />
          <div className="min-w-0 leading-tight">
            <p className="font-jp-text truncate text-[15px] font-bold">{demoSong.title}</p>
            <p className="mt-1 truncate text-[13px] text-white/60">
              {demoSong.artist} · <span className="text-[#ff9a92]">{demoSong.source}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Toggle on={romaji} onChange={setRomaji}>
            {lyrics.toggles.romaji}
          </Toggle>
          <Toggle on={translation} onChange={setTranslation}>
            {lyrics.toggles.translation}
          </Toggle>
        </div>
      </div>

      <div className="relative mt-5 h-[300px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_22%,#000_78%,transparent)] md:h-[340px]">
        <motion.ol ref={listRef} style={{ y }} className="space-y-2">
          {demoSong.lines.map((line, i) => {
            const active = i === index;
            return (
              <li key={line.at}>
                <button
                  type="button"
                  onClick={() => lyricClock.seekLine(i)}
                  className={cn(
                    "font-jp-text w-full rounded-2xl px-3 py-2 text-left transition-[color,filter,opacity] duration-500",
                    active ? "text-paper" : "text-paper/25 blur-[0.6px] hover:text-paper/50 hover:blur-none",
                  )}
                >
                  <span className={cn("block text-[22px] leading-snug font-bold md:text-[28px]", active && "text-[#ffb4ad]")}>{line.jp}</span>
                  {active && romaji && <span className="mt-1 block text-[14px] text-paper/55 italic md:text-[15px]">{line.romaji}</span>}
                  {active && translation && <span className="mt-1 block text-[14px] text-paper/80 md:text-[15px]">{line.en}</span>}
                </button>
              </li>
            );
          })}
        </motion.ol>
      </div>

      <SeekBar className="mt-5" />
      <Transport playing={playing} className="mt-2" />
    </div>
  );
}

/**
 * Lyrics: a full-width colour card that opens behind black blinds as it
 * scrolls in, with the story on the left and a live lyrics player on the right.
 */
export function Lyrics() {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "start 0.15"] });
  const { scrollYProgress: through } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const kanjiY = useTransform(through, [0, 1], ["-12%", reduce ? "-12%" : "12%"]);

  return (
    <section id="lyrics" className="px-3 py-10 md:px-6 md:py-16">
      <div ref={cardRef} className="relative overflow-hidden rounded-[28px] md:rounded-[40px]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(90% 80% at 15% 10%, #e0479a 0%, #c11567 30%, #6d0c2c 62%, #14070c 100%)" }}
        />
        <div aria-hidden className="halftone absolute inset-0 text-white/[0.07]" />
        <motion.span
          aria-hidden
          style={{ y: kanjiY }}
          className="text-outline font-jp pointer-events-none absolute -right-[4vw] bottom-0 text-[34vw] leading-none [--outline:rgb(255_255_255/0.12)]"
        >
          歌詞
        </motion.span>

        <div className="relative grid gap-12 px-5 py-16 md:px-12 md:py-24 lg:grid-cols-12 lg:gap-10 lg:px-16">
          <div className="lg:col-span-6 xl:col-span-5">
            <p className="kicker text-paper/80 before:bg-paper">{lyrics.kicker}</p>
            <SplitReveal lines={lyrics.title} className="display mt-6 text-[clamp(3rem,7vw,7rem)]" />
            <Reveal delay={0.15} className="mt-8 max-w-lg space-y-5 text-[15px] leading-relaxed text-paper/80 md:text-base">
              <p>{lyrics.body}</p>
              <p className="border-l-2 border-paper/30 pl-4 text-paper/70">{lyrics.japanese}</p>
            </Reveal>
            <Reveal delay={0.25} className="mt-9">
              <Button href={site.links.guide} variant="light">
                {lyrics.cta}
              </Button>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={60} className="lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7">
            <LyricsPlayer />
          </Reveal>
        </div>

        {!reduce && (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {Array.from({ length: STRIPES }, (_, i) => (
              <Stripe key={i} i={i} progress={scrollYProgress} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

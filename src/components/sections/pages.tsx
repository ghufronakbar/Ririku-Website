"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { pages, widgets } from "@/content/site";
import { Picture } from "@/components/picture";
import { Reveal } from "@/components/ui/reveal";
import { SplitReveal } from "@/components/ui/split-reveal";

type Strip = (typeof pages.strips)[number];

/**
 * One slice of the character art. Each slice holds the whole picture, shifted
 * by its own position, so the five line up into one image at any gap.
 */
function Slice({ strip, i, count, progress }: { strip: Strip; i: number; count: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const offset = (i % 2 === 0 ? -1 : 1) * (70 + i * 18);
  const y = useTransform(progress, [0, 1], [reduce ? 0 : offset, 0]);

  return (
    <motion.div style={{ y }} className="group relative h-full flex-1 overflow-hidden rounded-[14px] md:rounded-[20px]" tabIndex={0}>
      <div
        className="absolute inset-y-0"
        style={{ width: `calc(${count * 100}% + ${count - 1} * var(--gap))`, left: `calc(${-i} * (100% + var(--gap)))` }}
      >
        <Picture
          slug="character"
          alt=""
          sizes="100vw"
          className="block size-full"
          imgClassName="size-full object-cover object-[50%_30%] transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 p-2.5 md:p-5">
        <p className="font-mono text-[10px] tracking-[0.18em] text-paper/70 md:text-[11px]">0{i + 1}</p>
        <p className="display mt-1 text-[clamp(0.95rem,2.4vw,2.25rem)] max-md:[writing-mode:vertical-rl] max-md:rotate-180">{strip.name}</p>
        <ul className="mt-3 hidden translate-y-3 space-y-1 text-sm text-paper/80 opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:block">
          {strip.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/** A widget card with a soft spotlight that follows the pointer. */
function WidgetCard({ item, i }: { item: (typeof widgets.items)[number]; i: number }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${x}px ${y}px, rgb(254 84 77 / 0.16), transparent 70%)`;

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 5) * 0.05 }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
      }}
      onPointerLeave={() => {
        x.set(-200);
        y.set(-200);
      }}
      className="group relative overflow-hidden rounded-2xl border border-paper/8 bg-ink-2 p-5 transition-colors duration-500 hover:border-coral/40"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />
      <div className="relative flex items-start justify-between gap-2">
        <span className="font-mono text-[11px] text-mute">{String(i + 1).padStart(2, "0")}</span>
        {"tag" in item && item.tag && (
          <span className="rounded-full border border-paper/15 px-2 py-0.5 font-mono text-[9.5px] tracking-[0.12em] text-paper/70 uppercase">{item.tag}</span>
        )}
      </div>
      <p className="relative mt-8 text-lg font-medium tracking-tight">{item.name}</p>
      <p className="relative mt-1 text-[13px] leading-snug text-mute">{item.detail}</p>
    </motion.li>
  );
}

/** Pages of widgets: the default layout as five slices, then every widget. */
export function Pages() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const gap = useTransform(scrollYProgress, [0, 1], [reduce ? 6 : 28, 6]);
  const gapPx = useMotionTemplate`${gap}px`;
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.92, 1]);

  return (
    <section id="widgets" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="kicker">{pages.kicker}</p>
        <SplitReveal lines={[pages.title]} className="display mt-6 text-[clamp(2.8rem,8vw,8rem)]" />
        <Reveal delay={0.15} className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-mute md:text-base">
          {pages.body}
        </Reveal>
      </div>

      <motion.div
        ref={ref}
        style={{ "--gap": gapPx, gap: gapPx, scale } as never}
        className="mx-auto mt-14 flex h-[min(78vh,760px)] max-w-[1500px] md:mt-20"
      >
        {pages.strips.map((strip, i) => (
          <Slice key={strip.name} strip={strip} i={i} count={pages.strips.length} progress={scrollYProgress} />
        ))}
      </motion.div>

      <div className="mx-auto mt-24 max-w-[1500px] md:mt-36">
        <div className="flex flex-col justify-between gap-4 border-b border-paper/10 pb-6 md:flex-row md:items-end">
          <h3 className="display text-[clamp(2rem,4.5vw,4rem)]">{widgets.title}</h3>
          <p className="max-w-sm text-sm leading-relaxed text-mute md:text-right">{widgets.note}</p>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {widgets.items.map((item, i) => (
            <WidgetCard key={item.name} item={item} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

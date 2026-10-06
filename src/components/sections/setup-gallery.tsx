"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { setupImages } from "@/content/site";
import { Picture } from "@/components/picture";
import { fill } from "@/i18n/fill";
import { useI18n } from "@/i18n/provider";

/**
 * Setup, page by page: the section pins to the screen and vertical scrolling
 * slides the eleven Setup screenshots past horizontally.
 */
export function SetupGallery() {
  const { t } = useI18n();
  const setup = t.setup;
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => setDistance(Math.max(0, track.scrollWidth - window.innerWidth)));
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => -v * distance);
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={sectionRef} id="setup" aria-label={t.nav.setup} className="relative" style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-center gap-6 px-5 md:gap-10 md:px-10">
          <div className="w-[82vw] shrink-0 sm:w-[min(34rem,70vw)] md:pr-6">
            <p className="kicker">{setup.kicker}</p>
            <h2 className="display mt-6 text-[clamp(3rem,7.5vw,7.5rem)] lang-id:text-[clamp(2.6rem,5.6vw,5.75rem)] lang-ja:text-[clamp(2.4rem,5.5vw,5.5rem)]">
              {setup.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-7 max-w-sm text-[15px] leading-relaxed text-mute md:text-base">{setup.body}</p>
            <p className="mt-10 flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] text-paper/60 uppercase">
              {setup.scroll}
              <span className="h-px w-16 bg-paper/30" />
              {fill(setup.count, { n: setup.pages.length })}
            </p>
          </div>

          {setup.pages.map((page, i) => (
            <figure key={i} className="group w-[84vw] shrink-0 sm:w-[min(60vw,62vh*1.165,880px)]">
              <div className="relative overflow-hidden rounded-[18px] bg-ink-2 ring-1 ring-paper/8">
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgb(193_21_103/0.22),transparent)]" />
                <Picture
                  slug={setupImages[i]}
                  alt={fill(setup.imageAlt, { name: page.name })}
                  sizes="(min-width: 640px) 60vw, 84vw"
                  className="relative block"
                  imgClassName="h-auto w-full transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="mt-5 grid grid-cols-[3rem_1fr] gap-x-4">
                <span className="font-mono text-[11px] leading-6 text-coral">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-lg font-medium tracking-tight">{page.name}</span>
                  <span className="mt-1 block max-w-md text-sm leading-snug text-mute">{page.body}</span>
                </span>
              </figcaption>
            </figure>
          ))}
          <div aria-hidden className="w-[6vw] shrink-0" />
        </motion.div>

        <div className="absolute inset-x-5 bottom-8 h-px bg-paper/10 md:inset-x-10">
          <motion.div className="h-full origin-left bg-coral" style={{ scaleX: progress }} />
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import { site } from "@/content/site";
import { Spectrum } from "@/components/ui/spectrum";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/cn";

function Word({ children, progress, range }: { children: ReactNode; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

/**
 * The intro paragraph: each chunk (a word, or a phrase in Japanese) lights up
 * as it scrolls past. A "{notch}" chunk becomes a tiny island inline.
 */
export function Statement() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.65"] });
  const chunks = t.statement;

  return (
    <section id="statement" ref={ref} className="relative px-5 pt-[10vh] pb-[16vh] md:px-10 md:pt-[12vh] md:pb-[20vh]">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="kicker">
            {site.name} — {site.kana}
          </p>
        </div>
        <p className="statement text-[clamp(1.9rem,4.4vw,4.6rem)] md:col-span-9 lang-ja:text-[clamp(1.5rem,3.4vw,3.4rem)]">
          {chunks.map((chunk, i) => {
            const range: [number, number] = [i / chunks.length, (i + 1) / chunks.length];
            return (
              <Word key={i} progress={scrollYProgress} range={range}>
                {chunk.trim() === "{notch}" ? (
                  <>
                    {/* A tiny notch island, inline with the words. */}
                    <span aria-hidden className="mx-[0.15em] inline-flex h-[0.78em] w-[2.6em] translate-y-[0.06em] items-center justify-between rounded-full bg-black px-[0.14em] align-baseline ring-1 ring-paper/10">
                      {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized file */}
                      <img src="/media/artwork-96.webp" alt="" className="h-[0.56em] w-[0.56em] rounded-full" />
                      <Spectrum className="mr-[0.12em] h-[0.3em] gap-[0.06em] text-coral [&>span]:w-[0.06em]" />
                    </span>
                    {chunk.endsWith(" ") && " "}
                  </>
                ) : (
                  <span className={cn(chunk.includes(site.kana) && "font-jp text-[0.82em] tracking-normal text-coral")}>{chunk}</span>
                )}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
}

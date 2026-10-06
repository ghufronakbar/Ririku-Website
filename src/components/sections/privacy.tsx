"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { privacy } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";

/** An outlined line that fills in, left to right, as you scroll. */
function FillLine({ text, i, count, progress }: { text: string; i: number; count: number; progress: MotionValue<number> }) {
  const start = i / count;
  const fill = useTransform(progress, [start, start + 1 / count], ["inset(-25% 100% -25% 0)", "inset(-25% 0% -25% 0)"]);

  return (
    <span className="relative block">
      <span className="text-outline block [--outline:rgb(244_240_234/0.25)]">{text}</span>
      <motion.span aria-hidden className="absolute inset-0 block text-paper" style={{ clipPath: fill }}>
        {text}
      </motion.span>
    </span>
  );
}

/** Privacy: three short promises that fill in on scroll, then the details. */
export function Privacy() {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  return (
    <section id="privacy" className="px-5 py-24 md:px-10 md:py-36">
      <p className="kicker">{privacy.kicker}</p>
      <h2 ref={ref} className="display mt-8 text-[clamp(3.4rem,12.5vw,13rem)] lowercase">
        <span className="sr-only">{privacy.words.join(" ")}</span>
        <span aria-hidden>
          {privacy.words.map((word, i) => (
            <FillLine key={word} text={word} i={i} count={privacy.words.length} progress={scrollYProgress} />
          ))}
        </span>
      </h2>

      <ul className="mt-20 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {privacy.facts.map((fact, i) => (
          <li key={fact.title} className="border-t border-paper/12 pt-6">
            <Reveal delay={(i % 3) * 0.08} y={20}>
              <span className="font-mono text-[11px] text-coral">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-xl font-medium tracking-tight">{fact.title}</h3>
              <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-mute">{fact.body}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

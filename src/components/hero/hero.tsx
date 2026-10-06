"use client";

import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { site } from "@/content/site";
import { HeroArt } from "@/components/hero/hero-art";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/github-icon";
import { Reveal } from "@/components/ui/reveal";
import { SplitReveal } from "@/components/ui/split-reveal";
import { useI18n } from "@/i18n/provider";
import { useIntroReady } from "@/lib/intro";

/**
 * Full-bleed moving art with the headline bottom-left. As you scroll away it
 * shrinks into a rounded card, like a video settling into the page.
 */
export function Hero() {
  const { t } = useI18n();
  const hero = t.hero;
  const ref = useRef<HTMLElement>(null);
  const ready = useIntroReady();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.88]);
  const radius = useTransform(scrollYProgress, [0, 0.4], [0, reduce ? 0 : 40]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-28%"]);
  const kanaY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "40%"]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[600px]">
      <motion.div style={{ scale, borderRadius: radius }} className="absolute inset-0 origin-top overflow-hidden bg-ink">
        <HeroArt alt={hero.artAlt} />

        {/* Legibility: darken the bottom and, on wide screens, the left. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-ink/70 to-transparent md:block" />

        <motion.span
          aria-hidden
          style={{ y: kanaY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1.6, delay: 0.6 }}
          className="font-jp text-outline pointer-events-none absolute top-[12%] left-[2.5vw] hidden text-[9vw] leading-none [--outline:rgb(254_84_77/0.5)] md:block [@media(max-height:820px)]:hidden"
        >
          {site.kana}
        </motion.span>

        <motion.div style={{ y: contentY }} className="absolute inset-x-0 bottom-0 px-5 pb-7 md:px-10 md:pb-10">
          <Reveal show={ready} delay={0.15} y={16}>
            <p className="kicker text-paper/70">{hero.eyebrow}</p>
          </Reveal>
          <SplitReveal
            as="h1"
            lines={hero.title}
            show={ready}
            delay={0.2}
            className="display mt-4 text-[clamp(3.3rem,11.5vw,13rem)] md:mt-5 lang-ja:text-[clamp(2.5rem,7.8vw,9rem)]"
          />
          <div className="mt-7 flex flex-col gap-8 md:mt-9 md:flex-row md:items-end md:justify-between">
            <Reveal show={ready} delay={0.55} className="max-w-[30rem] lang-ja:max-w-[34rem]">
              <p className="text-[15px] leading-relaxed text-paper/75 md:text-base">{hero.body}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button href={site.links.download} size="lg">
                  {hero.download}
                </Button>
                <Button href={site.links.repo} variant="ghost" size="lg" icon={<GithubIcon className="size-4" />}>
                  {hero.github}
                </Button>
              </div>
            </Reveal>
            <Reveal show={ready} delay={0.7} className="hidden items-end gap-10 md:flex">
              <ul className="space-y-1 text-right font-mono text-[11px] tracking-[0.18em] text-paper/60 uppercase">
                <li>v{site.version}</li>
                {hero.meta.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href="#statement" className="group flex flex-col items-center gap-3 text-paper/70 hover:text-paper" aria-label={hero.scrollLabel}>
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase [writing-mode:vertical-rl]">{hero.scroll}</span>
                <span className="relative h-14 w-px overflow-hidden bg-paper/20">
                  <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_1.8s_var(--ease-in-out-quart)_infinite] bg-coral" />
                </span>
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-1" />
              </a>
            </Reveal>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

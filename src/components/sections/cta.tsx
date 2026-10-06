"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { site } from "@/content/site";
import { Picture, type MediaSlug } from "@/components/picture";
import { Artwork } from "@/components/player";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/github-icon";
import { Reveal } from "@/components/ui/reveal";
import { Spectrum } from "@/components/ui/spectrum";
import { SplitReveal } from "@/components/ui/split-reveal";
import { useI18n } from "@/i18n/provider";

const cards: { slug: MediaSlug; rotate: number; x: string; y: number; bg: string; pad: string }[] = [
  { slug: "panel-system", rotate: -16, x: "-104%", y: 70, bg: "#fe544d", pad: "px-4 pt-10" },
  { slug: "character", rotate: -7, x: "-54%", y: 18, bg: "#17181e", pad: "" },
  { slug: "panel-music", rotate: 2, x: "0%", y: 0, bg: "#c11567", pad: "px-5 pt-12" },
  { slug: "island", rotate: 9, x: "54%", y: 26, bg: "#b4b9f0", pad: "px-6 pt-16" },
  { slug: "panel-tray", rotate: 17, x: "104%", y: 80, bg: "#d30a1c", pad: "px-4 pt-10" },
];

function Card({ card, i, progress }: { card: (typeof cards)[number]; i: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const y = useTransform(progress, [0, 1], [reduce ? card.y : 260 + i * 30, card.y]);
  const rotate = useTransform(progress, [0, 1], [reduce ? card.rotate : card.rotate * 2.2, card.rotate]);

  return (
    <motion.div
      className="absolute bottom-0 left-1/2 w-[38vw] max-w-[340px] min-w-[150px] -translate-x-1/2"
      style={{ x: card.x, y, rotate, zIndex: i === 2 ? 3 : i === 1 || i === 3 ? 2 : 1 }}
      whileHover={{ y: card.y - 24, transition: { type: "spring", stiffness: 300, damping: 22 } }}
    >
      <div
        className={`flex aspect-[4/5] items-start justify-center overflow-hidden rounded-[20px] shadow-[0_40px_80px_-20px_rgb(0_0_0/0.8)] ${card.pad}`}
        style={{ background: card.bg }}
      >
        <Picture
          slug={card.slug}
          alt=""
          sizes="340px"
          className={card.slug === "character" ? "block size-full" : "block w-full"}
          imgClassName={card.slug === "character" ? "size-full object-cover" : "h-auto w-full drop-shadow-[0_20px_30px_rgb(0_0_0/0.45)]"}
        />
      </div>
    </motion.div>
  );
}

/** The last ask: the icon, one line, two buttons, and a fan of cards rising. */
export function Cta() {
  const { t } = useI18n();
  const cta = t.cta;
  const fanRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: fanRef, offset: ["start end", "end end"] });

  return (
    <section className="relative overflow-hidden pt-28 text-center md:pt-40">
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(60%_60%_at_50%_100%,rgb(193_21_103/0.35),transparent)]" />
      <div className="relative px-5">
        <Reveal className="flex flex-col items-center gap-4">
          <div className="relative">
            <div aria-hidden className="absolute -inset-6 rounded-full bg-coral/30 blur-2xl" />
            <Artwork size={88} className="relative ring-1 ring-paper/15" />
          </div>
          <Spectrum bars={5} className="h-4 text-coral" />
        </Reveal>
        <SplitReveal lines={cta.title} className="display mt-8 text-[clamp(3.4rem,11vw,11rem)] lang-ja:text-[clamp(2.5rem,8vw,8.5rem)]" />
        <Reveal delay={0.2} className="mx-auto mt-7 max-w-md text-[15px] leading-relaxed text-mute md:text-base">
          {cta.body}
        </Reveal>
        <Reveal delay={0.3} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button href={site.links.download} size="lg">
            {cta.primary}
          </Button>
          <Button href={site.links.repo} variant="ghost" size="lg" icon={<GithubIcon className="size-4" />}>
            {cta.secondary}
          </Button>
        </Reveal>
      </div>

      <div ref={fanRef} aria-hidden className="relative mx-auto mt-16 h-[min(52vw,440px)] max-w-6xl md:mt-24">
        {cards.map((card, i) => (
          <Card key={card.slug} card={card} i={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

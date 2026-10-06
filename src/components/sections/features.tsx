"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { featureImages } from "@/content/site";
import { Picture, type MediaSlug } from "@/components/picture";
import { SplitReveal } from "@/components/ui/split-reveal";
import { Reveal } from "@/components/ui/reveal";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/cn";

const gradients = [
  "radial-gradient(120% 90% at 20% 0%, #ff7a6e 0%, #fe544d 35%, #b10d2c 100%)",
  "radial-gradient(120% 90% at 80% 0%, #e0479a 0%, #c11567 40%, #3a0a2a 100%)",
  "radial-gradient(120% 90% at 30% 0%, #c9cdfa 0%, #7f86d8 40%, #20223f 100%)",
  "radial-gradient(120% 90% at 70% 0%, #ff4058 0%, #d30a1c 40%, #2a0508 100%)",
  "radial-gradient(120% 90% at 20% 10%, #ffa08f 0%, #f45752 30%, #c11567 75%, #4a0b2c 100%)",
  "radial-gradient(120% 90% at 60% 0%, #3b3e4f 0%, #1d212b 50%, #0b0c10 100%)",
];


function Shot({ image, title, active, wide }: { image: MediaSlug; title: string; active: boolean; wide: number }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 transition-transform duration-[900ms] ease-out-expo"
      style={{ width: wide, transform: `translate(-50%, -50%) scale(${active ? 1 : 0.86})` }}
    >
      <Picture
        slug={image}
        alt={title}
        sizes={`${wide}px`}
        className="block"
        imgClassName="h-auto w-full drop-shadow-[0_30px_50px_rgb(0_0_0/0.55)]"
      />
    </div>
  );
}

/**
 * A row of cards that widen on hover, like a reel of clips: one screenshot of
 * the panel per card, on its own colour. On phones it becomes a swipeable row.
 */
export function Features() {
  const { t } = useI18n();
  const features = t.features;
  const [active, setActive] = useState(0);

  return (
    <section id="features" className="relative px-5 py-20 md:px-10 md:py-28">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="kicker">{features.kicker}</p>
          <SplitReveal lines={[features.title]} className="display mt-5 text-[clamp(2.8rem,7.5vw,7.5rem)] lang-ja:text-[clamp(2.4rem,6vw,6rem)]" />
        </div>
        <Reveal className="max-w-xs text-[15px] leading-relaxed text-mute md:text-right" delay={0.2}>
          {features.intro}
        </Reveal>
      </div>

      <div className="mt-12 hidden h-[min(70vh,660px)] gap-3 md:flex" role="list">
        {features.cards.map((card, i) => (
          <motion.article
            key={i}
            role="listitem"
            tabIndex={0}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
            className="group flex min-w-0 basis-0 cursor-default flex-col outline-none transition-[flex-grow] duration-[900ms] ease-out-expo"
            style={{ flexGrow: active === i ? 3.4 : 1 }}
          >
            <div className="relative flex-1 overflow-hidden rounded-[22px] ring-paper/40 group-focus-visible:ring-2" style={{ background: gradients[i] }}>
              <div aria-hidden className="halftone absolute inset-0 text-white/[0.09]" />
              <Shot image={featureImages[i]} title={card.title} active={active === i} wide={featureImages[i] === "island" ? 420 : 560} />
              <span className="absolute top-4 left-4 font-mono text-[11px] tracking-[0.18em] text-white/80">0{i + 1}</span>
            </div>
            <div className="h-[88px] pt-4">
              <h3 className="truncate text-lg font-medium tracking-tight">{card.title}</h3>
              <p
                className={cn(
                  "mt-1 max-w-sm text-sm leading-snug text-mute transition-opacity duration-500",
                  active === i ? "opacity-100 delay-200" : "opacity-0",
                )}
              >
                {card.body}
              </p>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:hidden" data-lenis-prevent-horizontal>
        {features.cards.map((card, i) => (
          <article key={i} className="w-[82vw] max-w-sm shrink-0 snap-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px]" style={{ background: gradients[i] }}>
              <div aria-hidden className="halftone absolute inset-0 text-white/[0.09]" />
              <Shot image={featureImages[i]} title={card.title} active wide={featureImages[i] === "island" ? 280 : 300} />
              <span className="absolute top-4 left-4 font-mono text-[11px] tracking-[0.18em] text-white/80">0{i + 1}</span>
            </div>
            <h3 className="mt-4 text-lg font-medium tracking-tight">{card.title}</h3>
            <p className="mt-1 text-sm leading-snug text-mute">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

"use client";

import { ArrowUp } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { footer, site } from "@/content/site";

const letters = site.name.toLowerCase().split("");

/** Links, the small print, and a giant wordmark sinking behind stripes. */
export function Footer() {
  // Watch the wrapper: the letters start clipped by their mask, which an
  // IntersectionObserver on the letters themselves would never report as visible.
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wordmarkRef, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <footer className="relative overflow-hidden border-t border-paper/10 pt-16 md:pt-24">
      <div className="grid gap-12 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized file */}
            <img src="/media/artwork-96.webp" alt="" width={40} height={40} className="size-10 rounded-[11px]" />
            <span className="display text-3xl lowercase">{site.name}</span>
            <span className="font-jp-text text-sm font-bold text-coral">{site.kana}</span>
          </div>
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-mute">Music, lyrics, and handy widgets in your Mac&apos;s notch.</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <h2 className="font-mono text-[11px] tracking-[0.18em] text-mute uppercase">{column.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 text-[15px] text-paper/85 transition-colors hover:text-coral"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-16 flex flex-col gap-4 border-t border-paper/10 px-5 py-6 text-[12px] text-mute md:flex-row md:items-center md:justify-between md:px-10">
        <p>
          © 2026{" "}
          <a href={site.author.github} target="_blank" rel="noopener noreferrer" className="text-paper/80 hover:text-coral">
            {site.author.name}
          </a>{" "}
          ·{" "}
          <a href={site.links.license} target="_blank" rel="noopener noreferrer" className="hover:text-coral">
            MIT License
          </a>
        </p>
        <p className="max-w-xl md:text-center">{footer.legal}</p>
        <a href="#top" className="group inline-flex items-center gap-2 text-paper/80 hover:text-coral">
          Back to top
          <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
        </a>
      </div>

      <div ref={wordmarkRef} aria-hidden className="relative -mt-[1vw] select-none">
        <p className="display flex justify-center text-[30vw] leading-[0.74] tracking-[-0.05em] text-ink-4">
          {letters.map((letter, i) => (
            <span key={i} className="inline-block overflow-hidden pt-[0.06em]">
              <motion.span
                className="inline-block"
                initial={{ y: "100%" }}
                animate={inView ? { y: "18%" } : undefined}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[repeating-linear-gradient(to_bottom,var(--color-ink)_0_5px,transparent_5px_11px)]" />
      </div>
    </footer>
  );
}

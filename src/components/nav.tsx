"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { useLenis } from "@/components/smooth-scroll";
import { GithubIcon } from "@/components/ui/github-icon";
import { useIntroReady } from "@/lib/intro";
import { cn } from "@/lib/cn";

function Logo() {
  return (
    <a href="#top" className="group flex items-center gap-2.5" aria-label={`${site.name}, back to top`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized file */}
      <img src="/media/artwork-96.webp" alt="" width={32} height={32} className="size-8 rounded-[9px] transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg]" />
      <span className="display text-[22px] leading-none tracking-[-0.03em] lowercase max-[400px]:hidden">{site.name}</span>
    </a>
  );
}

/**
 * The top bar: logo on the left, links and Download on the right, and the
 * notch island in the middle (rendered separately). It slides away while you
 * scroll down and comes back when you scroll up.
 */
export function Nav() {
  const ready = useIntroReady();
  const lenis = useLenis();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(y > 160 && y > previous);
    setSolid(y > 40);
  });

  useEffect(() => {
    if (!menuOpen) return;
    lenis?.stop();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, lenis]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: ready && (!hidden || menuOpen) ? 0 : -100, opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: ready && !solid ? 0.7 : 0 }}
      >
        <div
          className={cn(
            "absolute inset-0 -bottom-6 bg-gradient-to-b from-ink/80 to-transparent transition-opacity duration-500",
            solid ? "opacity-100" : "opacity-0",
          )}
        />
        <nav className="relative flex h-16 items-center justify-between px-4 md:h-[72px] md:px-8" aria-label="Main">
          <Logo />
          <div className="flex items-center gap-1">
            <ul className="mr-3 hidden items-center min-[1440px]:flex">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="group relative block px-3 py-2 text-[13px] text-paper/75 transition-colors hover:text-paper">
                    {item.label}
                    <span className="absolute inset-x-3 bottom-1 h-px origin-right scale-x-0 bg-coral transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={site.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ririku on GitHub"
              className="hidden size-10 place-items-center rounded-full text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper sm:grid"
            >
              <GithubIcon className="size-[18px]" />
            </a>
            <a
              href={site.links.download}
              target="_blank"
              rel="noopener noreferrer"
              className="group hidden h-10 items-center gap-2 rounded-full bg-paper pr-1.5 pl-4 text-[13px] font-medium text-ink transition-colors duration-500 hover:bg-coral sm:flex"
            >
              Download
              <span className="grid size-7 place-items-center rounded-full bg-ink/10 transition-transform duration-500 ease-out-expo group-hover:rotate-45">
                <ArrowUpRight className="size-3.5" strokeWidth={2.4} />
              </span>
            </a>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="grid size-10 place-items-center rounded-full bg-paper/10 text-paper backdrop-blur min-[1440px]:hidden"
            >
              <Menu className="size-[18px]" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            onClose={() => setMenuOpen(false)}
            onNavigate={(href) => {
              setMenuOpen(false);
              // Lenis is paused while the menu is open, so force the jump.
              if (lenis) lenis.scrollTo(href, { force: true, offset: 0 });
              else document.querySelector(href)?.scrollIntoView();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function MobileMenu({ onClose, onNavigate }: { onClose: () => void; onNavigate: (href: string) => void }) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[70] flex flex-col bg-ink px-5 pt-5 pb-8"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.2em] text-mute uppercase">Menu</span>
        <button type="button" onClick={onClose} aria-label="Close menu" autoFocus className="grid size-10 place-items-center rounded-full bg-paper/10">
          <X className="size-[18px]" />
        </button>
      </div>
      <ul className="mt-auto">
        {nav.map((item, i) => (
          <li key={item.href} className="overflow-hidden border-b border-paper/10">
            <motion.a
              href={item.href}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(item.href);
              }}
              className="display flex items-baseline justify-between py-3 text-[clamp(2.75rem,13vw,5rem)] lowercase"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.06 }}
            >
              {item.label}
              <span className="font-mono text-xs tracking-normal text-mute">0{i + 1}</span>
            </motion.a>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex gap-3">
        <a href={site.links.download} target="_blank" rel="noopener noreferrer" className="flex h-12 flex-1 items-center justify-center rounded-full bg-coral font-medium text-ink">
          Download for macOS
        </a>
        <a href={site.links.repo} target="_blank" rel="noopener noreferrer" aria-label="Ririku on GitHub" className="grid size-12 place-items-center rounded-full border border-paper/20">
          <GithubIcon className="size-5" />
        </a>
      </div>
    </motion.div>
  );
}

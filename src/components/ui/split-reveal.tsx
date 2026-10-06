"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ElementType } from "react";
import { cn } from "@/lib/cn";

type SplitRevealProps = {
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Reveal when this turns true instead of when scrolled into view. */
  show?: boolean;
};

/** Each line slides up from behind a mask, one after another. */
export function SplitReveal({ lines, as: Tag = "h2", className, lineClassName, delay = 0, show }: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const visible = show ?? inView;

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={line} className={cn("block overflow-hidden pb-[0.1em] -mb-[0.1em]", lineClassName)}>
          <motion.span
            className="reveal block will-change-transform"
            initial={{ y: "115%", rotate: 3 }}
            animate={visible ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

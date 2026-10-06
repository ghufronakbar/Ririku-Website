import { cn } from "@/lib/cn";

const delays = ["-0.1s", "-0.55s", "-0.3s", "-0.75s", "-0.2s", "-0.45s"];

/** The island's little spectrum: bars that bounce while music plays. */
export function Spectrum({ playing = true, bars = 4, className }: { playing?: boolean; bars?: number; className?: string }) {
  return (
    <span aria-hidden className={cn("flex h-4 items-center gap-[3px]", className)}>
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-full w-[3px] origin-center rounded-full bg-current transition-transform duration-300",
            playing ? "animate-spectrum" : "scale-y-[0.25]",
          )}
          style={{ animationDelay: delays[i % delays.length], animationDuration: `${0.7 + (i % 3) * 0.18}s` }}
        />
      ))}
    </span>
  );
}

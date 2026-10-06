"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useCallback, useRef } from "react";
import { demoSong } from "@/content/site";
import { mediaSrc } from "@/components/picture";
import { formatTime, lyricClock, songOffset, useLyricFrame } from "@/lib/lyric-clock";
import { cn } from "@/lib/cn";

// Pieces of the demo player shared by the notch island and the lyrics section.

export function Artwork({ size, className }: { size: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized file
    <img
      src={mediaSrc("artwork", size > 40 ? 192 : 96)}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 rounded-[28%] object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
}

/** Seek bar and times, written straight to the DOM every frame. */
export function SeekBar({ className }: { className?: string }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  const onFrame = useCallback((t: number) => {
    const position = songOffset + t;
    const pct = `${(position / demoSong.duration) * 100}%`;
    if (fillRef.current) fillRef.current.style.width = pct;
    if (knobRef.current) knobRef.current.style.left = pct;
    if (timeRef.current) timeRef.current.textContent = formatTime(position);
  }, []);
  useLyricFrame(onFrame);

  return (
    <div className={className}>
      <div className="relative h-1 rounded-full bg-white/12">
        <div ref={fillRef} className="h-full rounded-full bg-[#ff9a92]/80" />
        <div ref={knobRef} className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/85" />
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-medium text-white/50 tabular-nums">
        <span ref={timeRef}>{formatTime(songOffset)}</span>
        <span>{formatTime(demoSong.duration)}</span>
      </div>
    </div>
  );
}

export function Transport({ playing, className }: { playing: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-10", className)}>
      <button type="button" aria-label="Previous line" onClick={lyricClock.prev} className="grid size-9 place-items-center rounded-full transition-colors hover:bg-white/10">
        <SkipBack className="size-5 fill-current" />
      </button>
      <button
        type="button"
        aria-label={playing ? "Pause the demo song" : "Play the demo song"}
        onClick={lyricClock.toggle}
        className="grid size-10 place-items-center rounded-full transition-colors hover:bg-white/10"
      >
        {playing ? <Pause className="size-6 fill-current" /> : <Play className="size-6 fill-current" />}
      </button>
      <button type="button" aria-label="Next line" onClick={lyricClock.next} className="grid size-9 place-items-center rounded-full transition-colors hover:bg-white/10">
        <SkipForward className="size-5 fill-current" />
      </button>
    </div>
  );
}

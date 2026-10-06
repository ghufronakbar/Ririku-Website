"use client";

import { useEffect, useSyncExternalStore } from "react";
import { demoSong } from "@/content/site";

// One playback clock for the demo song, shared by the notch island and the
// lyrics section so both always show the same line. A single requestAnimationFrame
// loop runs only while something is listening.

const { lines, loop } = demoSong;

let playing = true;
let base = 0;
let startedAt = typeof performance === "undefined" ? 0 : performance.now();

export function lyricIndexAt(time: number) {
  let index = 0;
  for (let i = 0; i < lines.length; i++) if (time >= lines[i].at) index = i;
  return index;
}

function time() {
  const t = playing ? base + (performance.now() - startedAt) / 1000 : base;
  return ((t % loop) + loop) % loop;
}

type Snapshot = { index: number; playing: boolean };
let snapshot: Snapshot = { index: 0, playing };
const stateListeners = new Set<() => void>();
const frameListeners = new Set<(t: number) => void>();
let raf = 0;

function publish() {
  const index = lyricIndexAt(time());
  if (index !== snapshot.index || playing !== snapshot.playing) {
    snapshot = { index, playing };
    stateListeners.forEach((listener) => listener());
  }
}

function tick() {
  publish();
  const t = time();
  frameListeners.forEach((listener) => listener(t));
  raf = requestAnimationFrame(tick);
}

function start() {
  if (!raf) raf = requestAnimationFrame(tick);
}

function stopIfIdle() {
  if (raf && stateListeners.size === 0 && frameListeners.size === 0) {
    cancelAnimationFrame(raf);
    raf = 0;
  }
}

function seek(t: number) {
  base = t;
  startedAt = performance.now();
  publish();
}

export const lyricClock = {
  time,
  toggle() {
    if (playing) {
      base = time();
      playing = false;
    } else {
      startedAt = performance.now();
      playing = true;
    }
    publish();
  },
  next() {
    seek(lines[(lyricIndexAt(time()) + 1) % lines.length].at);
  },
  seekLine(index: number) {
    seek(lines[index].at);
  },
  prev() {
    seek(lines[(lyricIndexAt(time()) - 1 + lines.length) % lines.length].at);
  },
};

function subscribe(listener: () => void) {
  stateListeners.add(listener);
  start();
  return () => {
    stateListeners.delete(listener);
    stopIfIdle();
  };
}

const serverSnapshot: Snapshot = { index: 0, playing: true };

/** The active line and whether the song is playing; re-renders on change only. */
export function useLyricState() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => serverSnapshot,
  );
}

/** Calls `onFrame` with the song time every frame, for DOM writes like seek bars. */
export function useLyricFrame(onFrame: (t: number) => void) {
  useEffect(() => {
    frameListeners.add(onFrame);
    start();
    return () => {
      frameListeners.delete(onFrame);
      stopIfIdle();
    };
  }, [onFrame]);
}

/** The demo song's position shown on seek bars, in seconds, offset into the track. */
export const songOffset = 62;

export function formatTime(seconds: number) {
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
